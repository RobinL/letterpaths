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
    keepLeadIn: true,
    keepEntry: true,
    keepExit: true,
    keepLeadOut: true,
    additionalSpacing: printLetterSpacing
  }, "print");
}
