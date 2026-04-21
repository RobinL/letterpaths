import {
  analyzeTracingSections,
  buildHandwritingPath,
  compileFormationAnnotations,
  compileTracingPath,
  lettersByVariantId,
  type CompileFormationAnnotationsOptions,
  type FormationAnnotation
} from "../src/index.ts";

const TARGET_GUIDES = {
  xHeight: 320,
  baseline: 700
} as const;

const JOIN_SPACING = {
  targetBendRate: 16,
  minSidebearingGap: 80,
  bendSearchMinSidebearingGap: -30,
  bendSearchMaxSidebearingGap: 240,
  exitHandleScale: 0.75,
  entryHandleScale: 0.75
} as const;

const TOP_ANNOTATIONS_CURRENT: CompileFormationAnnotationsOptions = {
  directionalDashes: {
    spacing: 96,
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  },
  turningPoints: {
    offset: 13,
    stemLength: 53 * (0.36 / 0.42),
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  },
  startArrows: {
    length: 53,
    minLength: 53 * (0.18 / 0.42),
    offset: 13,
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  },
  drawOrderNumbers: {
    offset: 0
  },
  midpointArrows: {
    density: 320,
    length: 53 * (0.36 / 0.42),
    offset: 13,
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  }
};

const TOP_ANNOTATIONS_VISIBLE_ONLY: CompileFormationAnnotationsOptions = {
  ...TOP_ANNOTATIONS_CURRENT,
  directionalDashes: false
};

const PRACTICE_ANNOTATIONS_CURRENT: CompileFormationAnnotationsOptions = {
  directionalDashes: {
    spacing: 96,
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  },
  turningPoints: {
    offset: 13,
    stemLength: 53 * (0.36 / 0.42),
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  },
  startArrows: {
    length: 53,
    minLength: 53 * (0.18 / 0.42),
    offset: 13,
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  },
  drawOrderNumbers: {
    offset: 0
  },
  midpointArrows: {
    density: 320,
    length: 53 * (0.36 / 0.42),
    offset: 13,
    head: {
      length: 26,
      width: 22,
      tipExtension: 11
    }
  }
};

const PRACTICE_ANNOTATIONS_VISIBLE_ONLY: CompileFormationAnnotationsOptions = {
  directionalDashes: false,
  turningPoints: false,
  startArrows: false,
  drawOrderNumbers: false,
  midpointArrows: false
};

type TimingSummary = {
  avgMs: number;
  minMs: number;
  maxMs: number;
  totalMs: number;
};

type BenchmarkResult<T> = {
  value: T;
  summary: TimingSummary;
};

const formatNumber = (value: number): number => Number(value.toFixed(3));

const summarizeDurations = (durations: number[]): TimingSummary => {
  const totalMs = durations.reduce((sum, duration) => sum + duration, 0);
  return {
    avgMs: formatNumber(totalMs / durations.length),
    minMs: formatNumber(Math.min(...durations)),
    maxMs: formatNumber(Math.max(...durations)),
    totalMs: formatNumber(totalMs)
  };
};

const benchmark = <T>(iterations: number, fn: () => T): BenchmarkResult<T> => {
  let value = fn();
  const durations: number[] = [];

  for (let index = 0; index < iterations; index += 1) {
    const startedAt = performance.now();
    value = fn();
    durations.push(performance.now() - startedAt);
  }

  return {
    value,
    summary: summarizeDurations(durations)
  };
};

const countCurves = (
  path: ReturnType<typeof buildHandwritingPath>
): number => path.strokes.reduce((sum, stroke) => sum + stroke.curves.length, 0);

const familyOptions: Record<
  FormationAnnotation["kind"],
  (typeof TOP_ANNOTATIONS_CURRENT) & { sections: ReturnType<typeof analyzeTracingSections>["sections"] }
> = {
  "directional-dash": {
    sections: [],
    directionalDashes: TOP_ANNOTATIONS_CURRENT.directionalDashes,
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: false
  },
  "turning-point": {
    sections: [],
    directionalDashes: false,
    turningPoints: TOP_ANNOTATIONS_CURRENT.turningPoints,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: false
  },
  "start-arrow": {
    sections: [],
    directionalDashes: false,
    turningPoints: false,
    startArrows: TOP_ANNOTATIONS_CURRENT.startArrows,
    drawOrderNumbers: false,
    midpointArrows: false
  },
  "draw-order-number": {
    sections: [],
    directionalDashes: false,
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: TOP_ANNOTATIONS_CURRENT.drawOrderNumbers,
    midpointArrows: false
  },
  "midpoint-arrow": {
    sections: [],
    directionalDashes: false,
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: TOP_ANNOTATIONS_CURRENT.midpointArrows
  }
};

const buildWorksheetScenario = (
  text: string,
  topOptions: CompileFormationAnnotationsOptions,
  practiceOptions: CompileFormationAnnotationsOptions,
  reusePreparedPath: boolean
) => {
  const buildOptions = {
    style: "cursive" as const,
    targetGuides: TARGET_GUIDES,
    joinSpacing: JOIN_SPACING,
    letters: lettersByVariantId,
    keepInitialLeadIn: true,
    keepFinalLeadOut: true
  };

  const hasEnabledAnnotationWork = (options: CompileFormationAnnotationsOptions): boolean =>
    options.directionalDashes !== false ||
    options.turningPoints !== false ||
    options.startArrows !== false ||
    options.drawOrderNumbers !== false ||
    options.midpointArrows !== false;

  if (reusePreparedPath) {
    const layout = buildHandwritingPath(text, buildOptions);
    const preparedPath = compileTracingPath(layout);
    return {
      topAnnotationCount: hasEnabledAnnotationWork(topOptions)
        ? compileFormationAnnotations(preparedPath, topOptions).length
        : 0,
      practiceAnnotationCount: hasEnabledAnnotationWork(practiceOptions)
        ? compileFormationAnnotations(preparedPath, practiceOptions).length
        : 0
    };
  }

  const topLayout = buildHandwritingPath(text, buildOptions);
  const practiceLayout = buildHandwritingPath(text, buildOptions);
  const topPreparedPath = compileTracingPath(topLayout);
  const practicePreparedPath = compileTracingPath(practiceLayout);
  return {
    topAnnotationCount: hasEnabledAnnotationWork(topOptions)
      ? compileFormationAnnotations(topPreparedPath, topOptions).length
      : 0,
    practiceAnnotationCount: hasEnabledAnnotationWork(practiceOptions)
      ? compileFormationAnnotations(practicePreparedPath, practiceOptions).length
      : 0
  };
};

const text = process.argv[2] ?? "zephyr";
const iterationsArg = Number.parseInt(process.argv[3] ?? "40", 10);
const iterations = Number.isFinite(iterationsArg) && iterationsArg > 0 ? iterationsArg : 40;

const buildOptions = {
  style: "cursive" as const,
  targetGuides: TARGET_GUIDES,
  joinSpacing: JOIN_SPACING,
  letters: lettersByVariantId,
  keepInitialLeadIn: true,
  keepFinalLeadOut: true
};

const pathBenchmark = benchmark(iterations, () => buildHandwritingPath(text, buildOptions));
const preparedBenchmark = benchmark(iterations, () => compileTracingPath(pathBenchmark.value));
const sectionBenchmark = benchmark(iterations, () => analyzeTracingSections(preparedBenchmark.value));

const familyBenchmarks = Object.fromEntries(
  (Object.keys(familyOptions) as FormationAnnotation["kind"][]).map((kind) => {
    const benchmarkResult = benchmark(iterations, () =>
      compileFormationAnnotations(preparedBenchmark.value, {
        ...familyOptions[kind],
        sections: sectionBenchmark.value.sections
      })
    );

    return [
      kind,
      {
        count: benchmarkResult.value.length,
        timing: benchmarkResult.summary
      }
    ];
  })
);

const topCurrentBenchmark = benchmark(iterations, () =>
  compileFormationAnnotations(preparedBenchmark.value, TOP_ANNOTATIONS_CURRENT)
);
const topVisibleOnlyBenchmark = benchmark(iterations, () =>
  compileFormationAnnotations(preparedBenchmark.value, TOP_ANNOTATIONS_VISIBLE_ONLY)
);
const practiceCurrentBenchmark = benchmark(iterations, () =>
  compileFormationAnnotations(preparedBenchmark.value, PRACTICE_ANNOTATIONS_CURRENT)
);
const practiceVisibleOnlyBenchmark = benchmark(iterations, () =>
  compileFormationAnnotations(preparedBenchmark.value, PRACTICE_ANNOTATIONS_VISIBLE_ONLY)
);

const worksheetCurrentBenchmark = benchmark(iterations, () =>
  buildWorksheetScenario(text, TOP_ANNOTATIONS_CURRENT, PRACTICE_ANNOTATIONS_CURRENT, false)
);
const worksheetVisibleOnlyBenchmark = benchmark(iterations, () =>
  buildWorksheetScenario(
    text,
    TOP_ANNOTATIONS_VISIBLE_ONLY,
    PRACTICE_ANNOTATIONS_VISIBLE_ONLY,
    false
  )
);
const worksheetReuseSharedPathBenchmark = benchmark(iterations, () =>
  buildWorksheetScenario(
    text,
    TOP_ANNOTATIONS_VISIBLE_ONLY,
    PRACTICE_ANNOTATIONS_VISIBLE_ONLY,
    true
  )
);

const output = {
  text,
  iterations,
  path: {
    strokes: pathBenchmark.value.strokes.length,
    curves: countCurves(pathBenchmark.value),
    joins: pathBenchmark.value.joinMetrics?.length ?? 0
  },
  timings: {
    buildHandwritingPath: pathBenchmark.summary,
    compileTracingPath: preparedBenchmark.summary,
    analyzeTracingSections: sectionBenchmark.summary,
    annotationFamilies: familyBenchmarks,
    topAnnotations: {
      currentAllFamilies: {
        count: topCurrentBenchmark.value.length,
        timing: topCurrentBenchmark.summary
      },
      visibleOnly: {
        count: topVisibleOnlyBenchmark.value.length,
        timing: topVisibleOnlyBenchmark.summary
      }
    },
    practiceAnnotations: {
      currentAllFamilies: {
        count: practiceCurrentBenchmark.value.length,
        timing: practiceCurrentBenchmark.summary
      },
      visibleOnly: {
        count: practiceVisibleOnlyBenchmark.value.length,
        timing: practiceVisibleOnlyBenchmark.summary
      }
    },
    worksheetScenarios: {
      current: {
        counts: worksheetCurrentBenchmark.value,
        timing: worksheetCurrentBenchmark.summary
      },
      visibleOnly: {
        counts: worksheetVisibleOnlyBenchmark.value,
        timing: worksheetVisibleOnlyBenchmark.summary
      },
      reuseSharedPathVisibleOnly: {
        counts: worksheetReuseSharedPathBenchmark.value,
        timing: worksheetReuseSharedPathBenchmark.summary
      }
    }
  }
};

console.log(JSON.stringify(output, null, 2));
