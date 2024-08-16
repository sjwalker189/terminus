import {
  AnyOption,
  Command,
  CommandHandler,
  CommandOption,
  Input,
  OptionType,
  PrimitiveToType,
} from "./types";

class PendingCommand<Name extends string, Opts extends object> {
  protected meta: {
    description: string;
    options: AnyOption[];
  } = {
    description: "",
    options: [],
  };

  constructor(public name: Name) {
    if (name.startsWith("-")) {
      throw new Error("Command names may not start with dashes");
    }
  }

  addDescription(description: string) {
    this.meta.description = description;
    return this;
  }

  addOption<N extends string, T extends OptionType>(option: {
    name: N;
    type: T;
    default: PrimitiveToType<T>;
    description: string;
  }): PendingCommand<Name, Opts & CommandOption<N, T>> {
    // @ts-ignore
    this.meta.options.push(option);
    // @ts-ignore
    return this;
  }

  handler<Fn extends CommandHandler<Input<Opts>>>(
    fn: Fn,
  ): Command<Input<Opts>> {
    const name = this.name;
    const { description, options } = this.meta;
    return {
      name,
      description,
      options,
      run: fn,
    };
  }
}

export function defineCommand<N extends string>(name: N) {
  return new PendingCommand(name);
}
