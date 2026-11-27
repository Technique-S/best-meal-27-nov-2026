import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { LINE } from "./meal.ts";

// Emit exactly one valid line to /output/entry.txt, with a local read-back.
// A program judged on a single sentence: fail loudly on a bad gate instead of
// writing a line that would be listed invalid and take no prize.
function emit(): void {
  const text = LINE.trim();
  const n = [...text].length;
  if (n < 1 || n > 200) throw new Error(`gate fail: ${n} code points, need 1..200`);
  if (!/\S/.test(text)) throw new Error("gate fail: blank entry");
  if (text.includes("\n") || text.includes("\r")) throw new Error("gate fail: not one line");

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const path = `${outDir}/entry.txt`;
  writeFileSync(path, text, "utf8");

  const back = readFileSync(path, "utf8");
  if (back !== text) throw new Error("read-back mismatch: written text changed on disk");
  console.log(`wrote ${path}: ${n} code points, read-back ok`);
}

emit();
