import confirm from "@inquirer/confirm";
import { input, select } from "@inquirer/prompts";
import { Application } from "./application";
import { Input, Primitive, PrimitiveToType } from "./types";

export class InputReader<T extends Record<string, any> = Record<string, any>>
  implements Input<T, T>
{
  constructor(
    protected app: Application,
    protected options: Record<string, PrimitiveToType<Primitive>>,
    protected args: Record<string, PrimitiveToType<Primitive>>,
  ) {}

  option<K extends keyof T>(name: K): T[K] {
    // @ts-ignore
    return this.options[name];
  }

  hasOption<K extends keyof T>(name: K): boolean {
    return name in this.options;
  }

  async confirm(question: string, defaultValue: boolean): Promise<boolean> {
    if (this.app.isInteractive()) {
      try {
        return await confirm({
          message: question,
          default: defaultValue,
        });
      } catch (error: any) {
        this.app.die(error.toString());
      }
    }

    return defaultValue;
  }

  async ask(question: string, defautValue: string): Promise<string> {
    if (this.app.isInteractive()) {
      try {
        return await input({
          message: question,
          default: defautValue,
        });
      } catch (error: any) {
        this.app.die(error.toString());
      }
    }

    return defautValue;
  }

  async selectOne(
    question: string,
    options: Array<{ name: string; value: string }> = [],
    defautValue: string,
  ): Promise<string> {
    if (this.app.isInteractive()) {
      try {
        return await select({
          message: question,
          choices: options,
          default: defautValue,
        });
      } catch (error: any) {
        this.app.die(error.toString());
      }
    }

    return defautValue;
  }

  async selectMany(
    question: string,
    options: { name: string; value: string }[] = [],
    defautValue: string,
  ): Promise<string> {
    if (this.app.isInteractive()) {
      try {
        return await select({
          message: question,
          choices: options,
          default: defautValue,
        });
      } catch (error: any) {
        this.app.die(error.toString());
      }
    }

    return defautValue;
  }
}
