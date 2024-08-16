export interface Input<
  Opts extends Record<string, any> = Record<string, any>,
  Args extends Record<string, any> = Record<string, any>,
> {
  /**
   * Get the value of a command option
   */
  option<K extends keyof Opts>(name: K): Opts[K];
  /**
   * Get the value of a command option
   */
  hasOption<K extends keyof Opts>(name: K): boolean;
  /**
   * Check if the user set a command option
   */
  ask(question: string, defautValue: string): Promise<string>;
  /**
   * Prompt the user to confirm a choice.
   */
  confirm(question: string, defautValue: boolean): Promise<boolean>;

  /**
   * Prompt the user to pick an option
   */
  selectOne(
    question: string,
    options: Array<{ name: string; value: string }>,
    defautValue: string,
  ): Promise<string>;

  /**
   * Prompt the user to pick a set of options
   */
  selectOne(
    question: string,
    options: Array<{ name: string; value: string }>,
    defautValue: string,
  ): Promise<string>;
}

export interface Output {
  /**
   *  Write an informational message to stdout
   */
  info(message: string, ...args: any[]): void;
  /**
   *  Write a warning message to stdout
   */
  warn(message: string, ...args: any[]): void;
  /**
   *  Write an error message to stdout
   */
  error(message: string, ...args: any[]): void;
  /**
   *  Write a message to stdout
   */
  println(message: string, ...args: any[]): void;
  /**
   * Write a blank line to stdout
   */
  newline(count?: number): void;
  /**
   * Write JSON data to stdout
   */
  json(data: any): void;
}

/**
 * Types that can be parsed from stdin
 */
export type Primitive = "string" | "number" | "boolean";

/**
 * Map primitive type labels to their real types in typescript
 */
export type PrimitiveToType<T extends Primitive = never> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : T extends "boolean"
      ? boolean
      : never;

/**
 * Allowed primitive types for command arguments
 */
export type ArgumentType = Primitive;

/**
 * Allowed primitive types for command options
 */
export type OptionType = Primitive;

/**
 * Command option meta data
 */
export type AnyOption = {
  name: string;
  description: string;
  type: Primitive;
  default: PrimitiveToType<Primitive>;
};

/**
 * Command option utility to typecast type labels to their real types
 */
export type CommandOption<
  N extends string = string,
  T extends OptionType = "string",
> = {
  [key in N]: PrimitiveToType<T>;
};

export type CommandHandler<I> = (input: I, output: Output) => Promise<Result>;

export type Command<I> = {
  name: string;
  description: string;
  options: Array<AnyOption>;
  run: CommandHandler<I>;
};

export enum Result {
  SUCCESS = 0,
  FAILED = 1,
}
