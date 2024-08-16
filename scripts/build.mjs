import { build } from "esbuild";

await build({
  entryPoints: ["src/**/*.ts"],
  bundle: false,
  outdir: "dist",
  format: "cjs",
});

// Build ES Module version
// await build({
//   entryPoints: ["src/**/*.ts"],
//   bundle: true,
//   outdir: "dist/esm",
//   format: "esm",
//   plugins: [
//     {
//       name: "add-import-extensions",
//       setup(build) {
//         build.onResolve({ filter: /.*/ }, args => {
//           if (args.importer && args.path.startsWith("./")) {
//             return { path: args.path + ".js", external: true };
//           } else {
//             return { path: args.path, external: true };
//           }
//         });
//       },
//     },
//   ],
// })
//   .catch(() => process.exit(1))
//   .then(() => console.log("done"));
