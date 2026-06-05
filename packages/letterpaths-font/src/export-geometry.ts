/**
 * Export centerline geometry for the Letterpaths font.
 *
 * For every ordered lowercase pair `prev -> next`, this asks letterpaths for
 * the real join curve (prev.exit -> join -> next.entry). The shipped glyph
 * model gives the successor the whole pair-specific join; OpenType `calt`
 * selects the correct incoming form for the real predecessor.
 *
 * Products:
 *   1. build/geometry/diagnostic.json — every a-z x a-z true join, the
 *      crossing of each candidate seam height, and a split-reconstruction check
 *      proving left+right == original on the real curve.
 *   2. build/geometry/glyphs.json — the pair-specific glyph set
 *      (the successor owns the whole true prev->next join, so each
 *      letter L gets one incoming form L.medi<P>/L.fina<P> per predecessor P).
 *
 * Output coordinates are y-UP font units (fontY = BASELINE - svgY), same frame
 * as export_letterpaths.ts.
 *
 * Run: pnpm run export
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildHandwritingPath, type CubicBezier } from "letterpaths";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../build/geometry");

const XHEIGHT = 500;
const BASELINE = 750;
const targetGuides = { xHeight: XHEIGHT, baseline: BASELINE };
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Probes (same scheme as the main exporter): a low-exit and a high-exit
// neutral connector reveal a fragment's true entry/exit without extra ink.
const LOW_PROBE = "n";
const HIGH_PROBE = "o";

// A slightly open spacing works better once joins are stroked into font outlines.
const JOIN_SPACING = { minSidebearingGap: 140 };

// Candidate canonical seam heights to sweep in the diagnostic (font y-up units;
// 0 = baseline, 500 = x-height top). The connecting stroke of a cursive hand
// typically rests around the mid x-height, so the useful band is ~100..350.
const CANDIDATE_HEIGHTS = [0, 50, 100, 150, 175, 200, 225, 250, 275, 300, 350];

// Exit classes (verified empirically in earlier work and in the diagnostic):
//   high  {o,r,v,w} leave near the x-height;
//   mid   {f,q}     leave from their own loop heights;
//   low   everyone else leaves on/just above the baseline.
// The canonical seam height a pair's join is cut at is chosen by the
// PREDECESSOR's exit class. These drive only the split-reconstruction check and
// the per-class seam reporting; the shipped glyph model owns the WHOLE join.
const HIGH_EXIT_LETTERS = ["o", "r", "v", "w"];
const MID_EXIT_LETTERS = ["f", "q"];
const SEAM_LOW = 50;
const SEAM_HIGH = 225;
const SEAM_MID = 50; // f/q joins barely rise; their best low-ish crossing is ~50
const exitClass = (l: string): "low" | "high" | "mid" =>
    HIGH_EXIT_LETTERS.includes(l)
        ? "high"
        : MID_EXIT_LETTERS.includes(l)
            ? "mid"
            : "low";
const seamForClass = (c: "low" | "high" | "mid"): number =>
    c === "high" ? SEAM_HIGH : c === "mid" ? SEAM_MID : SEAM_LOW;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Seg = [number, number, number, number, number, number, number, number];
type Contour = Seg[];
interface GlyphOut {
    name: string;
    unicodes: number[];
    advance: number;
    contours: Contour[];
}
type Pt = { x: number; y: number };

interface FlatCurve {
    p: Pt[]; // 4 control points, fontY (y-up) coords
    seg?: string;
    sIdx: number;
}

// ---------------------------------------------------------------------------
// Cubic-Bezier utilities (standard math; not letterpaths geometry)
// ---------------------------------------------------------------------------
const cubicY = (p: Pt[], t: number): number => {
    const mt = 1 - t;
    return (
        mt * mt * mt * p[0].y +
        3 * mt * mt * t * p[1].y +
        3 * mt * t * t * p[2].y +
        t * t * t * p[3].y
    );
};
const cubicX = (p: Pt[], t: number): number => {
    const mt = 1 - t;
    return (
        mt * mt * mt * p[0].x +
        3 * mt * mt * t * p[1].x +
        3 * mt * t * t * p[2].x +
        t * t * t * p[3].x
    );
};
const cubicPt = (p: Pt[], t: number): Pt => ({ x: cubicX(p, t), y: cubicY(p, t) });

/** Tangent vector at t. */
const cubicDeriv = (p: Pt[], t: number): Pt => {
    const mt = 1 - t;
    const ax = 3 * (p[1].x - p[0].x);
    const bx = 3 * (p[2].x - p[1].x);
    const cx = 3 * (p[3].x - p[2].x);
    const ay = 3 * (p[1].y - p[0].y);
    const by = 3 * (p[2].y - p[1].y);
    const cy = 3 * (p[3].y - p[2].y);
    return {
        x: mt * mt * ax + 2 * mt * t * bx + t * t * cx,
        y: mt * mt * ay + 2 * mt * t * by + t * t * cy,
    };
};

/** Angle of the curve from horizontal at t, in degrees (0 = flat handover). */
const tangentAngleDeg = (p: Pt[], t: number): number => {
    const d = cubicDeriv(p, t);
    return (Math.atan2(Math.abs(d.y), Math.abs(d.x)) * 180) / Math.PI;
};

/** Real roots in [0,1] of a cubic a t^3 + b t^2 + c t + d = 0. */
function cubicRoots(a: number, b: number, c: number, d: number): number[] {
    const EPS = 1e-9;
    const roots: number[] = [];
    if (Math.abs(a) < EPS) {
        // Quadratic b t^2 + c t + d.
        if (Math.abs(b) < EPS) {
            if (Math.abs(c) > EPS) roots.push(-d / c);
        } else {
            const disc = c * c - 4 * b * d;
            if (disc >= 0) {
                const s = Math.sqrt(disc);
                roots.push((-c + s) / (2 * b));
                roots.push((-c - s) / (2 * b));
            }
        }
    } else {
        // Depressed cubic t = u - b/(3a).
        const bn = b / a;
        const cn = c / a;
        const dn = d / a;
        const p = cn - (bn * bn) / 3;
        const q = (2 * bn * bn * bn) / 27 - (bn * cn) / 3 + dn;
        const disc = (q * q) / 4 + (p * p * p) / 27;
        const shift = -bn / 3;
        if (disc > EPS) {
            const s = Math.sqrt(disc);
            const u = Math.cbrt(-q / 2 + s);
            const v = Math.cbrt(-q / 2 - s);
            roots.push(u + v + shift);
        } else if (disc < -EPS) {
            const r = Math.sqrt(-(p * p * p) / 27);
            const phi = Math.acos(Math.min(1, Math.max(-1, -q / 2 / r)));
            const m = 2 * Math.cbrt(r);
            roots.push(m * Math.cos(phi / 3) + shift);
            roots.push(m * Math.cos((phi + 2 * Math.PI) / 3) + shift);
            roots.push(m * Math.cos((phi + 4 * Math.PI) / 3) + shift);
        } else {
            const u = Math.cbrt(-q / 2);
            roots.push(2 * u + shift);
            roots.push(-u + shift);
        }
    }
    const tol = 1e-4;
    return roots
        .filter((t) => t >= -tol && t <= 1 + tol)
        .map((t) => Math.min(1, Math.max(0, t)));
}

interface Crossing {
    t: number;
    x: number;
    angle: number; // degrees from horizontal
    direction: "up" | "down"; // sign of dy/dt at crossing (y-up)
}

/** All points where curve y(t) == Y, sorted by t. */
function yCrossings(p: Pt[], Y: number): Crossing[] {
    const a = -p[0].y + 3 * p[1].y - 3 * p[2].y + p[3].y;
    const b = 3 * p[0].y - 6 * p[1].y + 3 * p[2].y;
    const c = -3 * p[0].y + 3 * p[1].y;
    const d = p[0].y - Y;
    const ts = cubicRoots(a, b, c, d);
    const seen = new Set<string>();
    const out: Crossing[] = [];
    for (const t of ts) {
        const key = t.toFixed(4);
        if (seen.has(key)) continue;
        seen.add(key);
        const dv = cubicDeriv(p, t);
        out.push({
            t,
            x: cubicX(p, t),
            angle: tangentAngleDeg(p, t),
            direction: dv.y >= 0 ? "up" : "down",
        });
    }
    return out.sort((u, v) => u.t - v.t);
}

/** de Casteljau split at t -> [left sub-curve, right sub-curve]. */
function splitAt(p: Pt[], t: number): [Pt[], Pt[]] {
    const lerp = (a: Pt, b: Pt): Pt => ({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
    });
    const ab = lerp(p[0], p[1]);
    const bc = lerp(p[1], p[2]);
    const cd = lerp(p[2], p[3]);
    const abc = lerp(ab, bc);
    const bcd = lerp(bc, cd);
    const abcd = lerp(abc, bcd);
    return [
        [p[0], ab, abc, abcd],
        [abcd, bcd, cd, p[3]],
    ];
}

// ---------------------------------------------------------------------------
// Rendering: flatten a path to fontY curves and locate its join curve(s)
// ---------------------------------------------------------------------------
function flatten(path: ReturnType<typeof buildHandwritingPath>): {
    main: FlatCurve[];
    deferred: { curves: Pt[][]; midX: number }[];
} {
    const main: FlatCurve[] = [];
    const deferred: { curves: Pt[][]; midX: number }[] = [];
    let sId = 0;
    for (const stroke of path.strokes) {
        const curves = stroke.curves as CubicBezier[];
        if (!curves.length) continue;
        const toUp = (q: { x: number; y: number }): Pt => ({
            x: q.x,
            y: BASELINE - q.y,
        });
        if (stroke.deferred) {
            let mn = Infinity;
            let mx = -Infinity;
            const cs = curves.map((c) => {
                const pts = [c.p0, c.p1, c.p2, c.p3].map(toUp);
                for (const q of pts) {
                    if (q.x < mn) mn = q.x;
                    if (q.x > mx) mx = q.x;
                }
                return pts;
            });
            deferred.push({ curves: cs, midX: (mn + mx) / 2 });
        } else {
            const segs = stroke.curveSegments;
            curves.forEach((c, i) => {
                main.push({
                    p: [c.p0, c.p1, c.p2, c.p3].map(toUp),
                    seg: segs?.[i] as string | undefined,
                    sIdx: sId,
                });
            });
            sId += 1;
        }
    }
    return { main, deferred };
}

/** y-up Seg, anchored so anchorX -> x = 0. */
function toSeg(p: Pt[], anchorX: number): Seg {
    return [
        p[0].x - anchorX, p[0].y,
        p[1].x - anchorX, p[1].y,
        p[2].x - anchorX, p[2].y,
        p[3].x - anchorX, p[3].y,
    ];
}

// ---------------------------------------------------------------------------
// Diagnostic: real join curve for every a-z x a-z pair
// ---------------------------------------------------------------------------
interface PairDiag {
    pair: string;
    exitClass: "low" | "high" | "mid";
    join: number[][] | null; // [4][2] fontY control points
    exitY: number | null;
    entryY: number | null;
    heights: Record<
        string,
        {
            crosses: boolean;
            nCross: number;
            // chosen seam crossing (descending into the successor entry)
            x: number | null;
            t: number | null;
            angle: number | null;
        }
    >;
}

/**
 * Render `a + b` and return the (last) join curve in fontY coords, plus the
 * exit point (join p0) and entry point (join p3).
 */
function joinForPair(a: string, b: string): {
    join: Pt[] | null;
    exit: Pt | null;
    entry: Pt | null;
} {
    const path = buildHandwritingPath(a + b, {
        style: "cursive",
        targetGuides,
        joinSpacing: JOIN_SPACING,
        keepInitialLeadIn: false,
        keepFinalLeadOut: false,
    });
    const { main } = flatten(path);
    let last: FlatCurve | null = null;
    for (const c of main) if (c.seg === "join") last = c;
    if (!last) return { join: null, exit: null, entry: null };
    return { join: last.p, exit: last.p[0], entry: last.p[3] };
}

/**
 * Pick the seam crossing for a join at height Y. A cursive join leaves the
 * predecessor's exit, rises over the gap, and descends into the successor's
 * entry. The natural seam is the LAST crossing of Y (the descent into the
 * successor) — the half below it belongs to the successor's approach and is
 * governed by that letter's entry shape, independent of the predecessor.
 * Falls back to the only crossing if there is just one. Returns null if none.
 */
function pickSeam(crossings: Crossing[]): Crossing | null {
    if (!crossings.length) return null;
    const desc = crossings.filter((c) => c.direction === "down");
    if (desc.length) return desc[desc.length - 1];
    return crossings[crossings.length - 1];
}

function buildDiagnostic(): {
    meta: any;
    pairs: PairDiag[];
    summary: any;
} {
    const pairs: PairDiag[] = [];
    // height -> tallies
    const tally: Record<
        string,
        { crossed: number; angles: number[]; xs: number[] }
    > = {};
    for (const h of CANDIDATE_HEIGHTS)
        tally[String(h)] = { crossed: 0, angles: [], xs: [] };

    for (const a of LETTERS) {
        for (const b of LETTERS) {
            const { join, exit, entry } = joinForPair(a, b);
            const heights: PairDiag["heights"] = {};
            for (const h of CANDIDATE_HEIGHTS) {
                if (!join) {
                    heights[String(h)] = {
                        crosses: false,
                        nCross: 0,
                        x: null,
                        t: null,
                        angle: null,
                    };
                    continue;
                }
                const cr = yCrossings(join, h);
                const seam = pickSeam(cr);
                heights[String(h)] = {
                    crosses: cr.length > 0,
                    nCross: cr.length,
                    x: seam ? Math.round(seam.x) : null,
                    t: seam ? +seam.t.toFixed(4) : null,
                    angle: seam ? +seam.angle.toFixed(1) : null,
                };
                if (seam) {
                    tally[String(h)].crossed += 1;
                    tally[String(h)].angles.push(seam.angle);
                    tally[String(h)].xs.push(seam.x);
                }
            }
            pairs.push({
                pair: a + b,
                exitClass: exitClass(a),
                join: join
                    ? join.map((q) => [Math.round(q.x), Math.round(q.y)])
                    : null,
                exitY: exit ? Math.round(exit.y) : null,
                entryY: entry ? Math.round(entry.y) : null,
                heights,
            });
        }
    }

    const total = LETTERS.length * LETTERS.length;
    const summary = CANDIDATE_HEIGHTS.map((h) => {
        const t = tally[String(h)];
        const meanAngle =
            t.angles.length > 0
                ? t.angles.reduce((s, v) => s + v, 0) / t.angles.length
                : null;
        const medAngle =
            t.angles.length > 0
                ? [...t.angles].sort((u, v) => u - v)[
                Math.floor(t.angles.length / 2)
                ]
                : null;
        return {
            height: h,
            crossedPairs: t.crossed,
            crossedFrac: +(t.crossed / total).toFixed(3),
            meanTangentDeg: meanAngle === null ? null : +meanAngle.toFixed(1),
            medianTangentDeg: medAngle === null ? null : +medAngle.toFixed(1),
        };
    });

    return {
        meta: { approach: "pair-specific-diagnostic", candidateHeights: CANDIDATE_HEIGHTS, total },
        pairs,
        summary,
    };
}

// ---------------------------------------------------------------------------
// Split-reconstruction check: split the real join and prove the two
// halves rebuild the original curve exactly. This validates the split
// machinery on true pair-specific joins; the shipped glyph model below does not
// itself split, since the successor owns the whole join.
// ---------------------------------------------------------------------------
function reconstructionCheck(): {
    pairsCrossing: number;
    pairsTotal: number;
    maxReconErr: number;
    noCross: string[];
} {
    let maxErr = 0;
    let crossing = 0;
    let total = 0;
    const noCross: string[] = [];
    for (const a of LETTERS) {
        for (const b of LETTERS) {
            const { join } = joinForPair(a, b);
            if (!join) continue;
            total += 1;
            const Y = seamForClass(exitClass(a));
            const seam = pickSeam(yCrossings(join, Y));
            if (!seam) {
                noCross.push(a + b);
                continue;
            }
            crossing += 1;
            const [left, right] = splitAt(join, seam.t);
            // Sample the original and the concatenated halves; the union must
            // trace the same point set. left covers [0,t]->[0,1]; right [t,1].
            for (let i = 0; i <= 20; i += 1) {
                const u = i / 20;
                const orig = cubicPt(join, seam.t * u);
                const rec = cubicPt(left, u);
                maxErr = Math.max(
                    maxErr,
                    Math.hypot(orig.x - rec.x, orig.y - rec.y)
                );
            }
            for (let i = 0; i <= 20; i += 1) {
                const u = i / 20;
                const orig = cubicPt(join, seam.t + (1 - seam.t) * u);
                const rec = cubicPt(right, u);
                maxErr = Math.max(
                    maxErr,
                    Math.hypot(orig.x - rec.x, orig.y - rec.y)
                );
            }
        }
    }
    return { pairsCrossing: crossing, pairsTotal: total, maxReconErr: maxErr, noCross };
}

// ---------------------------------------------------------------------------
// Glyph model: pair-specific incoming joins.
//
// The successor owns the whole true join. For every letter L and predecessor P
// we render `P + L` and keep the real P->L join anchored at P's exit, so L's
// incoming form carries pair-specific geometry. The predecessor is cut cleanly
// at its own exit. Two adjacent glyphs therefore meet at P's real exit point.
//
// Forms per letter L (cmap default = isolated):
//   L           body                + exit               (isolated)
//   L.init      body                + exit               (word-initial)
//   L.medi      incoming(after n)   + exit   } generic placeholders, always
//   L.fina      incoming(after n)   + exit   }  upgraded by calt (== after-n)
//   L.medi<P>   incoming(after P)   + exit     for every predecessor P != n
//   L.fina<P>   incoming(after P)   + exit     for every predecessor P != n
// where <P> is the predecessor letter upper-cased (o.finaR = o final after r).
//
// This is deliberately exhaustive: 26 predecessor variants per letter.
// ---------------------------------------------------------------------------
const GENERIC_PRED = "n"; // the predecessor the bare .medi/.fina forms represent
const predSuffix = (p: string) => p.toUpperCase(); // r -> "R"

/**
 * Build one pair-specific form of `letter`.
 *   predecessor = null -> word-initial / isolated, with no lead-in flourish;
 *   predecessor = P     -> keep the REAL P->letter join (anchored at P's exit).
 *   trailing  = "exit"    -> medial: cut at the letter's own exit (drop the
 *                            outgoing join; the next glyph owns it);
 *   trailing  = "leadout" -> final form, with no word-final flourish.
 */
function extractPair(
    letter: string,
    predecessor: string | null,
    trailing: "exit" | "leadout"
): { contours: Contour[]; advance: number } {
    const hasPrefix = predecessor !== null;
    const hasSuffix = trailing === "exit";
    const prefix = hasPrefix ? predecessor! : "";
    const suffix = hasSuffix ? LOW_PROBE : "";
    const path = buildHandwritingPath(prefix + letter + suffix, {
        style: "cursive",
        targetGuides,
        joinSpacing: JOIN_SPACING,
        keepInitialLeadIn: false,
        keepFinalLeadOut: false,
    });
    const { main, deferred } = flatten(path);
    const joinIdx: number[] = [];
    main.forEach((c, i) => {
        if (c.seg === "join") joinIdx.push(i);
    });
    const incomingIdx = hasPrefix && joinIdx.length ? joinIdx[0] : -1;
    const outgoingIdx =
        hasSuffix && joinIdx.length ? joinIdx[joinIdx.length - 1] : -1;

    // Left edge: keep the REAL predecessor->letter join; anchor at its p0 (the
    // predecessor's exit). For init/iso, anchor the visible letter at min x.
    let keepLo: number;
    let anchorX: number;
    let leftBoundX: number;
    if (!hasPrefix) {
        keepLo = 0;
        let mn = Infinity;
        for (const fc of main) for (const q of fc.p) if (q.x < mn) mn = q.x;
        anchorX = Number.isFinite(mn) ? mn : 0;
        leftBoundX = anchorX;
    } else {
        keepLo = incomingIdx >= 0 ? incomingIdx : 0;
        anchorX = incomingIdx >= 0 ? main[incomingIdx].p[0].x : 0;
        leftBoundX = anchorX;
    }

    // Right edge: medial cuts at the letter's exit; final keeps the same
    // no-lead-out letter ending.
    let keepHi: number;
    let rightBoundX: number;
    let exitX = Infinity;
    if (trailing === "leadout") {
        keepHi = main.length - 1;
        rightBoundX = Infinity;
    } else {
        keepHi = outgoingIdx >= 0 ? outgoingIdx - 1 : main.length - 1;
        exitX = outgoingIdx >= 0 ? main[outgoingIdx].p[0].x : Infinity;
        rightBoundX = exitX;
    }

    const kept = main.slice(keepLo, keepHi + 1);
    const contours: Contour[] = [];
    let cur: Contour = [];
    let curS = -1;
    for (const fc of kept) {
        if (fc.sIdx !== curS) {
            if (cur.length) contours.push(cur);
            cur = [];
            curS = fc.sIdx;
        }
        cur.push(toSeg(fc.p, anchorX));
    }
    if (cur.length) contours.push(cur);
    for (const d of deferred) {
        if (d.midX < leftBoundX || d.midX > rightBoundX) continue;
        contours.push(d.curves.map((c) => toSeg(c, anchorX)));
    }

    let advance: number;
    if (trailing === "leadout") {
        let mx = -Infinity;
        for (const ct of contours)
            for (const s of ct) mx = Math.max(mx, s[0], s[2], s[4], s[6]);
        advance = Math.round(Number.isFinite(mx) ? mx : 0);
    } else {
        // Some j-medial joins backtrack slightly. Font advance widths are
        // unsigned, so keep the nearest legal advance while preserving contours.
        advance = Math.max(0, Math.round(exitX - anchorX));
    }
    return { contours, advance };
}

function makeGlyphPair(
    name: string,
    letter: string,
    predecessor: string | null,
    trailing: "exit" | "leadout",
    unicodes: number[]
): GlyphOut {
    const { contours, advance } = extractPair(letter, predecessor, trailing);
    return { name, unicodes, advance, contours };
}

function extractStandalonePrint(letter: string): { contours: Contour[]; advance: number } {
    const path = buildHandwritingPath(letter, {
        style: "print",
        targetGuides,
        keepInitialLeadIn: true,
        keepFinalLeadOut: true,
    });
    const { main, deferred } = flatten(path);
    let minX = Infinity;
    let maxX = -Infinity;
    for (const fc of main) {
        for (const q of fc.p) {
            minX = Math.min(minX, q.x);
            maxX = Math.max(maxX, q.x);
        }
    }
    for (const d of deferred) {
        for (const curve of d.curves) {
            for (const q of curve) {
                minX = Math.min(minX, q.x);
                maxX = Math.max(maxX, q.x);
            }
        }
    }
    const anchorX = Number.isFinite(minX) ? minX : 0;
    const contours: Contour[] = [];
    let cur: Contour = [];
    let curS = -1;
    for (const fc of main) {
        if (fc.sIdx !== curS) {
            if (cur.length) contours.push(cur);
            cur = [];
            curS = fc.sIdx;
        }
        cur.push(toSeg(fc.p, anchorX));
    }
    if (cur.length) contours.push(cur);
    for (const d of deferred) {
        contours.push(d.curves.map((c) => toSeg(c, anchorX)));
    }
    const inkWidth = Number.isFinite(maxX) && Number.isFinite(minX) ? maxX - minX : 0;
    return { contours, advance: Math.round(inkWidth + 100) };
}

function makeStandalonePrintGlyph(name: string, unicodes: number[]): GlyphOut {
    const { contours, advance } = extractStandalonePrint(name);
    return { name, unicodes, advance, contours };
}

function round(g: GlyphOut): GlyphOut {
    return {
        ...g,
        contours: g.contours.map((c) =>
            c.map((s) => s.map((v) => Math.round(v)) as Seg)
        ),
    };
}

function buildFontGeometry(): { meta: any; glyphs: GlyphOut[] } {
    const glyphs: GlyphOut[] = [];
    for (const l of UPPERCASE_LETTERS) {
        glyphs.push(round(makeStandalonePrintGlyph(l, [l.codePointAt(0)!])));
    }
    for (const l of LETTERS) {
        const cp = l.codePointAt(0)!;
        // Isolated (cmap default) and word-initial.
        glyphs.push(round(makeGlyphPair(l, l, null, "leadout", [cp])));
        glyphs.push(round(makeGlyphPair(`${l}.init`, l, null, "exit", [])));
        // Generic placeholders == the after-`n` forms; calt always upgrades
        // them to the predecessor-specific form, so they only ever surface
        // after `n` itself.
        glyphs.push(
            round(makeGlyphPair(`${l}.medi`, l, GENERIC_PRED, "exit", []))
        );
        glyphs.push(
            round(makeGlyphPair(`${l}.fina`, l, GENERIC_PRED, "leadout", []))
        );
        // Pair-specific incoming forms: the REAL P->l join, for every P != n.
        for (const p of LETTERS) {
            if (p === GENERIC_PRED) continue;
            const u = predSuffix(p);
            glyphs.push(
                round(makeGlyphPair(`${l}.medi${u}`, l, p, "exit", []))
            );
            glyphs.push(
                round(makeGlyphPair(`${l}.fina${u}`, l, p, "leadout", []))
            );
        }
    }
    return {
        meta: {
            approach: "pair-specific-incoming",
            model: "pair-specific-incoming",
            xHeight: XHEIGHT,
            baseline: BASELINE,
            letters: LETTERS,
            uppercaseLetters: UPPERCASE_LETTERS,
            highExit: HIGH_EXIT_LETTERS,
            midExit: MID_EXIT_LETTERS,
            genericPredecessor: GENERIC_PRED,
            formsPerLetter: 4 + 2 * (LETTERS.length - 1),
        },
        glyphs,
    };
}

// ---------------------------------------------------------------------------
// Main: write the diagnostic, the reconstruction check, and the glyph set.
// ---------------------------------------------------------------------------
function write(name: string, data: unknown) {
    mkdirSync(OUT_DIR, { recursive: true });
    const p = resolve(OUT_DIR, name);
    writeFileSync(p, JSON.stringify(data));
    console.log(`wrote ${p}`);
}

const diag = buildDiagnostic();
write("diagnostic.json", diag);
console.log("\nCanonical-height sweep (Y = font y-up, 0=baseline):");
console.log("  height  crossed/676  frac   meanTan  medTan");
for (const s of diag.summary) {
    console.log(
        `  ${String(s.height).padStart(5)}   ${String(s.crossedPairs).padStart(
            3
        )}/676      ${String(s.crossedFrac).padStart(5)}  ${String(
            s.meanTangentDeg
        ).padStart(6)}  ${String(s.medianTangentDeg).padStart(6)}`
    );
}
console.log("\ndiagnostic complete");

const recon = reconstructionCheck();
console.log(
    `\nSplit-reconstruction (real joins split at per-class seam): ` +
    `${recon.pairsCrossing}/${recon.pairsTotal} pairs cross their seam | ` +
    `max recon error = ${recon.maxReconErr.toFixed(4)} font units`
);
if (recon.noCross.length) {
    console.log(
        `  ${recon.noCross.length} pairs never reach their seam: ` +
        recon.noCross.slice(0, 30).join(" ") +
        (recon.noCross.length > 30 ? " ..." : "")
    );
}

const fontGeometry = buildFontGeometry();
write("glyphs.json", fontGeometry);
console.log(
    `\nPair-specific glyphs: ${fontGeometry.glyphs.length} ` +
    `(${fontGeometry.meta.formsPerLetter} forms x ${LETTERS.length} letters)`
);
console.log("export complete");

export {
    LETTERS,
    XHEIGHT,
    BASELINE,
    targetGuides,
    JOIN_SPACING,
    LOW_PROBE,
    HIGH_PROBE,
    flatten,
    toSeg,
    yCrossings,
    splitAt,
    pickSeam,
    cubicPt,
    joinForPair,
    exitClass,
    seamForClass,
    extractPair,
    buildFontGeometry,
    reconstructionCheck,
    type Pt,
    type Seg,
    type Contour,
    type GlyphOut,
    type FlatCurve,
};
