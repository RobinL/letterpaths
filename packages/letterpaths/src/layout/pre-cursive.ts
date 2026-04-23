import type { WritingPath } from "../types";
import {
  buildStandaloneWord,
  preCursiveLetterSpacing,
  type JoinCursiveOptions
} from "./shared";

export function buildPreCursiveWord(
  text: string,
  options: JoinCursiveOptions = {}
): WritingPath {
  return buildStandaloneWord(text, options, {
    keepLeadIn: options.keepInitialLeadIn ?? true,
    keepEntry: true,
    keepExit: true,
    keepLeadOut: options.keepFinalLeadOut ?? true,
    additionalSpacing: preCursiveLetterSpacing
  }, "pre-cursive");
}
