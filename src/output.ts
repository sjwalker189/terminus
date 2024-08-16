import { format } from "node:util";
import chalk from "chalk";
import { Output } from "./types";
import { logger } from "./logger";

export class PrintOutput implements Output {
  info(message: string, ...args: any[]) {
    logger.stdout(chalk.green(message), ...args);
  }

  warn(message: string, ...args: any[]) {
    logger.stdout(chalk.yellow(message), ...args);
  }

  error(message: string, ...args: any[]) {
    logger.stderr(chalk.red(message), ...args);
  }

  println(message: string, ...args: any[]) {
    logger.stdout(message, ...args);
  }

  json(data: any) {
    logger.stdout(JSON.stringify(data, null, 2));
  }

  newline(count = 1) {
    logger.stdout("\n".repeat(count));
  }
}

export class SilentOutput implements Output {
  println(_: string) {
    //
  }

  info(_: string) {
    //
  }

  warn(_: string) {
    //
  }

  error(_: string) {
    //
  }

  line(_: string) {
    //
  }

  json(_: any) {
    //
  }

  newline(_ = 1) {
    //
  }
}

export class JsonOutput implements Output {
  info(message: string, ...args: any[]) {
    logger.stdout(
      JSON.stringify({ type: "info", message: format(message, ...args) }),
    );
  }

  warn(message: string, ...args: any[]) {
    logger.stdout(
      JSON.stringify({ type: "warn", message: format(message, ...args) }),
    );
  }

  error(message: string, ...args: any[]) {
    logger.stderr(
      JSON.stringify({ type: "error", message: format(message, ...args) }),
    );
  }

  println(message: string, ...args: any[]) {
    logger.stdout(
      JSON.stringify({ type: "line", message: format(message, ...args) }),
    );
  }

  json(data: any) {
    logger.stdout(JSON.stringify({ type: "json", data }));
  }

  newline(count = 1) {
    logger.stdout(JSON.stringify({ type: "newline", count }));
  }
}
