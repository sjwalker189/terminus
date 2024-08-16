import fs from "node:fs/promises";
import path from "node:path";

try {
  await fs.rm(path.resolve(import.meta.dirname, "../dist"), {
    recursive: true,
  });
} catch (e) {
  if (e?.code !== "ENOENT") {
    console.error(e);
  }
}
