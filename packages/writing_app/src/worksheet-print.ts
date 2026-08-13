const SVG_PRINT_PRIMITIVE_SELECTOR =
  "path, polygon, polyline, line, rect, circle, ellipse, text";

export const DEFAULT_VECTOR_PRINT_COMPLEXITY_LIMIT = 10_000;

/**
 * Estimate how many vector primitives the print engine needs to paint.
 *
 * SVG definitions only exist once in the DOM, but every <use> paints another
 * copy. Accounting for those copies catches worksheets that look modest in
 * the inspector but expand into very large printer/PDF jobs.
 */
export const estimateWorksheetVectorPrintComplexity = (worksheetPage: Element): number =>
  Array.from(worksheetPage.querySelectorAll<SVGSVGElement>("svg")).reduce(
    (worksheetTotal, svg) => {
      const primitiveCount = svg.querySelectorAll(SVG_PRINT_PRIMITIVE_SELECTOR).length;
      const definitionPrimitiveCount = Array.from(svg.querySelectorAll("defs")).reduce(
        (definitionTotal, definition) =>
          definitionTotal + definition.querySelectorAll(SVG_PRINT_PRIMITIVE_SELECTOR).length,
        0
      );
      const useCount = svg.querySelectorAll("use").length;
      const paintedDefinitionCount =
        definitionPrimitiveCount * Math.max(1, useCount);

      return (
        worksheetTotal +
        Math.max(0, primitiveCount - definitionPrimitiveCount) +
        paintedDefinitionCount
      );
    },
    0
  );

export const shouldRasterizeWorksheetForPrint = (
  worksheetPage: Element,
  complexityLimit = DEFAULT_VECTOR_PRINT_COMPLEXITY_LIMIT
): boolean => estimateWorksheetVectorPrintComplexity(worksheetPage) > complexityLimit;
