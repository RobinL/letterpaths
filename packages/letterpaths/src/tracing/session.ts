import type { Point } from "../types";
import type { PreparedTracingPath } from "./compiler";

export type TracingStatus = "idle" | "tracing" | "await_pen_up" | "complete";

export type TracingState = {
  status: TracingStatus;
  /** Current position of the cursor on the path */
  cursorPoint: Point;
  /** Current tangent angle (normalized vector) for arrow rotation */
  cursorTangent: Point;
  /** Which strokes are fully completed */
  completedStrokes: number[];
  /** Index of the stroke currently being traced */
  activeStrokeIndex: number;
  /** Progress (0-1) along the active stroke */
  activeStrokeProgress: number;
  /** Is the user currently dragging? */
  isPenDown: boolean;
};

export type TracingSessionOptions = {
  /** Max pixels pointer can be from cursor to start dragging (default: 60) */
  startTolerance?: number;
  /** Max pixels pointer can be from best sample to advance (leash radius, default: 70) */
  hitTolerance?: number;
  /** Max samples to search ahead during update (default: 50) */
  maxAdvanceSamples?: number;
  /** Bias factor to prevent teleporting (default: 0.4) */
  advanceBias?: number;
};

export class TracingSession {
  private readonly path: PreparedTracingPath;
  private readonly startTolerance: number;
  private readonly hitTolerance: number;
  private readonly maxAdvanceSamples: number;
  private readonly advanceBias: number;

  private state: TracingState;
  private currentSampleIndex: number;

  constructor(path: PreparedTracingPath, opts: TracingSessionOptions = {}) {
    this.path = path;
    this.startTolerance = opts.startTolerance ?? 60;
    this.hitTolerance = opts.hitTolerance ?? 70;
    this.maxAdvanceSamples = opts.maxAdvanceSamples ?? 50;
    this.advanceBias = opts.advanceBias ?? 0.4;

    this.currentSampleIndex = 0;
    this.state = this.buildInitialState();
  }

  private buildInitialState(): TracingState {
    const firstStroke = this.path.strokes[0];
    const firstSample = firstStroke?.samples[0];

    return {
      status: "idle",
      cursorPoint: firstSample ? { x: firstSample.x, y: firstSample.y } : { x: 0, y: 0 },
      cursorTangent: firstSample?.tangent ?? { x: 1, y: 0 },
      completedStrokes: [],
      activeStrokeIndex: 0,
      activeStrokeProgress: 0,
      isPenDown: false
    };
  }

  getState(): TracingState {
    return { ...this.state };
  }

  getPath(): PreparedTracingPath {
    return this.path;
  }

  /**
   * Called on pointerdown. Returns true if the drag was successfully started.
   */
  beginAt(point: Point): boolean {
    const { status, cursorPoint } = this.state;

    // Can only begin if idle or awaiting pen up
    if (status !== "idle" && status !== "await_pen_up") {
      return false;
    }

    // Check if pointer is close enough to cursor
    const distance = Math.hypot(point.x - cursorPoint.x, point.y - cursorPoint.y);

    if (distance > this.startTolerance) {
      return false;
    }

    // Handle dots - auto-complete immediately
    const activeStroke = this.path.strokes[this.state.activeStrokeIndex];
    if (activeStroke?.isDot) {
      this.completeCurrentStroke();
      return true;
    }

    this.state = {
      ...this.state,
      status: "tracing",
      isPenDown: true
    };

    return true;
  }

  /**
   * Called on pointermove. Advances the cursor along the path toward the pointer.
   */
  update(pointer: Point): void {
    if (this.state.status !== "tracing") {
      return;
    }

    const activeStroke = this.path.strokes[this.state.activeStrokeIndex];
    if (!activeStroke) {
      return;
    }

    const samples = activeStroke.samples;
    const currentIdx = this.currentSampleIndex;

    // Define search window
    const maxIdx = Math.min(currentIdx + this.maxAdvanceSamples, samples.length - 1);

    // Find best sample in window using cost function
    let bestIdx = currentIdx;
    let bestCost = Infinity;
    let bestDist = Infinity;

    for (let i = currentIdx; i <= maxIdx; i++) {
      const sample = samples[i];
      if (!sample) continue;

      const distToPointer = Math.hypot(pointer.x - sample.x, pointer.y - sample.y);
      const advancePenalty = (i - currentIdx) * this.advanceBias;
      const cost = distToPointer + advancePenalty;

      if (cost < bestCost) {
        bestCost = cost;
        bestDist = distToPointer;
        bestIdx = i;
      }
    }

    // Only advance if the best sample is within hit tolerance (leash radius)
    if (bestDist > this.hitTolerance) {
      return;
    }

    // Update cursor position
    const bestSample = samples[bestIdx];
    if (bestSample) {
      this.currentSampleIndex = bestIdx;
      this.state = {
        ...this.state,
        cursorPoint: { x: bestSample.x, y: bestSample.y },
        cursorTangent: bestSample.tangent,
        activeStrokeProgress: activeStroke.totalLength > 0
          ? bestSample.distanceAlongStroke / activeStroke.totalLength
          : 1
      };
    }

    // Check if we reached the end of the stroke
    if (bestIdx >= samples.length - 1) {
      this.completeCurrentStroke();
    }
  }

  /**
   * Called on pointerup.
   */
  end(): void {
    // If we're mid-trace, transition back to idle so user can resume
    // If we're in await_pen_up or complete, leave status unchanged
    const newStatus = this.state.status === "tracing" ? "idle" : this.state.status;

    this.state = {
      ...this.state,
      status: newStatus,
      isPenDown: false
    };
  }

  /**
   * Reset the session to initial state.
   */
  reset(): void {
    this.currentSampleIndex = 0;
    this.state = this.buildInitialState();
  }

  private completeCurrentStroke(): void {
    const completedStrokes = [...this.state.completedStrokes, this.state.activeStrokeIndex];
    const nextStrokeIndex = this.state.activeStrokeIndex + 1;

    // Check if all strokes are complete
    if (nextStrokeIndex >= this.path.strokes.length) {
      this.state = {
        ...this.state,
        status: "complete",
        completedStrokes,
        activeStrokeProgress: 1,
        isPenDown: false
      };
      return;
    }

    // Move to next stroke
    const nextStroke = this.path.strokes[nextStrokeIndex];
    const nextSample = nextStroke?.samples[0];

    this.currentSampleIndex = 0;
    this.state = {
      ...this.state,
      status: "await_pen_up",
      completedStrokes,
      activeStrokeIndex: nextStrokeIndex,
      activeStrokeProgress: 0,
      cursorPoint: nextSample ? { x: nextSample.x, y: nextSample.y } : this.state.cursorPoint,
      cursorTangent: nextSample?.tangent ?? this.state.cursorTangent,
      isPenDown: false
    };
  }
}
