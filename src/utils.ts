import { parseArgs } from "node:util";
import { AnyOption, Command, Input, Primitive, PrimitiveToType } from "./types";

const primitives: Array<Primitive> = ["boolean", "number", "string"];

export function isPrimitiveLabel(type: unknown): type is Primitive {
  // @ts-ignore
  return primitives.includes(type);
}

export function isPrimitive(type: unknown): type is Primitive {
  // @ts-ignore
  return primitives.includes(typeof type);
}

export function isCommandOption(type: unknown): type is AnyOption {
  return (
    typeof type === "object" &&
    // @ts-ignore
    typeof type.name === "string" &&
    // @ts-ignore
    typeof type.description === "string" &&
    // @ts-ignore
    typeof type.type === "string" &&
    // @ts-ignore
    isPrimitive(type.default)
  );
}

export function isCommand(type: unknown): type is Command<Input<object>> {
  return (
    typeof type === "object" &&
    // @ts-ignore
    typeof type.name === "string" &&
    // @ts-ignore
    typeof type.description === "string" &&
    // @ts-ignore
    typeof type.run === "function" &&
    // @ts-ignore
    Array.isArray(type.options) &&
    // @ts-ignore
    type.options.every(isCommandOption)
  );
}

export function parseOptionValue(
  option: AnyOption,
  value?: string | boolean,
): PrimitiveToType<Primitive> {
  if (value === undefined) {
    return option.default;
  }

  if (option.type === "number") {
    return Number(value);
  }

  if (option.type === "boolean") {
    if (typeof value === "boolean") {
      return value;
    }
    return value === "true" || value === "1";
  }

  return value;
}

export function parseRawCommandArgs(
  cmd: Command<any>,
  argList: string[],
): [
  Record<string, PrimitiveToType<Primitive>>,
  Record<string, PrimitiveToType<Primitive>>,
] {
  // Build up the command parse options
  const parseOptions = cmd.options.reduce(
    (opts, option) => {
      opts[option.name] = {
        // Only stirng and boolean can be parsed by parseArgs()
        type: option.type.replace("number", "string"),
      };
      return opts;
    },
    {} as Record<string, any>,
  );

  // Add global options to inherit
  parseOptions.json = { type: "boolean" };
  parseOptions.help = { type: "boolean" };
  parseOptions.silent = { type: "boolean" };
  parseOptions["no-interactions"] = { type: "boolean" };

  // Parse the command args
  const cmdArgs = parseArgs({
    args: argList,
    options: parseOptions,
    allowPositionals: true,
  });

  // Format parsed arguments and apply defaults
  const opts: Record<string, PrimitiveToType<Primitive>> = {};
  for (const opt of cmd.options) {
    // @ts-ignore
    opts[opt.name] = parseOptionValue(opt, cmdArgs.values[opt.name]);
  }

  const args = {};

  return [opts, args];
}
