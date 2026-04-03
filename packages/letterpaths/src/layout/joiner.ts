import type { WritingPath } from "../types";
import { joinCursiveWord } from "./cursive";
import { buildPreCursiveWord } from "./pre-cursive";
import { buildPrintWord } from "./print";
import type { BuildHandwritingOptions } from "./shared";

export {
  cursiveLetterSpacing,
  defaultJoinSpacingOptions,
  listAvailableLetters,
  preCursiveLetterSpacing,
  printLetterSpacing,
  type BuildHandwritingOptions,
  type JoinCursiveOptions,
  type JoinSpacingOptions
} from "./shared";

export { joinCursiveWord } from "./cursive";
export { buildPreCursiveWord } from "./pre-cursive";
export { buildPrintWord } from "./print";

export function buildHandwritingPath(
  text: string,
  options: BuildHandwritingOptions = {}
): WritingPath {
  const style = options.style ?? "cursive";
  if (style === "print") {
    return buildPrintWord(text, options);
  }
  if (style === "pre-cursive") {
    return buildPreCursiveWord(text, options);
  }
  return joinCursiveWord(text, options);
}
