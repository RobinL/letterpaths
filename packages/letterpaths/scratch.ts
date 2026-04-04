import { buildHandwritingPath } from "./src/index";
// or from "letterpaths" if this package already resolves to itself correctly

const path = buildHandwritingPath("cat", {
    style: "cursive",
    targetGuides: {
        xHeight: 360,
        baseline: 720,
    },
});

debugger;

console.log(path.strokes.length);