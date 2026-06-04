import type { WritingPath } from "../types";
import {
  buildStandaloneWord,
  printLetterSpacing,
  type JoinCursiveOptions
} from "./shared";

export function buildPrintWord(
  text: string,
  options: JoinCursiveOptions = {}
): WritingPath {
  return buildStandaloneWord(text, options, {
    keepLeadIn: options.keepInitialLeadIn ?? true,
    keepEntry: options.keepInitialLeadIn ?? true,
    keepExit: options.keepFinalLeadOut ?? true,
    keepLeadOut: options.keepFinalLeadOut ?? true,
    additionalSpacing: printLetterSpacing
  }, "print");
}
