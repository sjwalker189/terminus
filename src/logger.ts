import process from "node:process";
import { format } from "node:util";

export const logger = new (class Logger {
  stdout(msg: string, ...args: any[]) {
    process.stdout.write(format(msg, ...args) + "\n");
  }
  stderr(msg: string, ...args: any[]) {
    process.stderr.write(format(msg, ...args) + "\n");
  }
  print(msg: string, ...args: any[]) {
    process.stdout.write(format(msg, ...args));
  }
  println(msg: string, ...args: any[]) {
    process.stdout.write(format(msg, ...args) + "\n");
  }
  eprint(msg: string, ...args: any[]) {
    process.stderr.write(format(msg, ...args));
  }
  eprintln(msg: string, ...args: any[]) {
    process.stderr.write(format(msg, ...args) + "\n");
  }
})();
