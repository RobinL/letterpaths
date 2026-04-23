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
    keepLeadIn: true,
    keepEntry: true,
    keepExit: true,
    keepLeadOut: true,
    additionalSpacing: preCursiveLetterSpacing
  }, "pre-cursive");
}
