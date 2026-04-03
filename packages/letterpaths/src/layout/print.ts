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
    keepLeadIn: false,
    keepEntry: false,
    keepExit: false,
    keepLeadOut: false,
    additionalSpacing: printLetterSpacing
  });
}
