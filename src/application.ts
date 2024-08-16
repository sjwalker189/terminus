import chalk from "chalk";
import { PrintOutput, SilentOutput, JsonOutput } from "./output";
import { Command, Input, Output, Result } from "./types";
import { InputReader } from "./input";
import { logger } from "./logger";
import { parseRawCommandArgs } from "./utils";

const { yellow, green, gray } = chalk;

export class Application {
  protected interactive = true;
  protected running = false;
  protected output: Output;
  protected args: string[] = [];
  protected commands: Array<Command<Input<any>>> = [];

  constructor(
    protected name: string,
    protected version: string = "0.1.0",
  ) {
    this.interactive = process.argv.includes("--no-interactions") === false;
    if (process.argv.includes("--silent")) {
      this.output = new SilentOutput();
    } else if (process.argv.includes("--json")) {
      this.output = new JsonOutput();
    } else {
      this.output = new PrintOutput();
    }
  }

  public isInteractive() {
    return this.interactive;
  }

  public addCommand(cmd: Command<Input<any>> | Array<Command<Input<any>>>) {
    if (this.running) {
      this.die("Cannot add commands at runtime");
    }

    if (Array.isArray(cmd)) {
      this.commands.push(...cmd);
    } else {
      this.commands.push(cmd);
    }

    return this;
  }

  public async run() {
    this.lock();
    this.attachListeners();

    const rawArgs = process.argv.slice(2, process.argv.length);

    if (rawArgs[0] === "--help" || rawArgs[0] === "help") {
      this.printHelp();
      process.exit(0);
    }

    if (rawArgs[0]?.startsWith("-")) {
      return this.die(
        "Invalid command. Try --help to see a list of available commands",
      );
    }

    const [commandName, ...args] = rawArgs;

    try {
      const cmd = this.getCommandByName(commandName);
      if (args.includes("--help")) {
        this.printCommandHelp(cmd);
        process.exit(0);
      }

      const input = new InputReader(this, ...parseRawCommandArgs(cmd, args));
      const output = this.output;

      // Run the command
      const result = await cmd.run(input, output);
      switch (result) {
        case Result.FAILED:
          process.exit(1);
        case Result.SUCCESS:
          process.exit(0);
        default:
          process.exit(0);
      }
    } catch (error: any) {
      this.die(error.toString());
    }
  }

  private getCommandByName(name: string): Command<any> {
    if (!this.commands.length) {
      this.die("No commands have been added");
    }

    const resolvedCommands = new Map<string, Command<Input<object>>>();
    for (const cmd of this.commands) {
      if (resolvedCommands.has(cmd.name)) {
        this.output.warn(`Overwriting existing command "${cmd.name}"`);
      }
      resolvedCommands.set(cmd.name, cmd);
    }

    const cmd = resolvedCommands.get(name);
    if (!cmd) {
      if (name) {
        this.die(
          `"${name}" is not a registered command. Try --help to see a list of available commands`,
        );
      } else {
        this.die(`No command provided`);
      }
    }

    return cmd as Command<any>;
  }

  private lock() {
    this.running = true;
  }

  public die(msg?: string) {
    if (msg) {
      this.output?.error(msg);
    }
    process.exit(1);
  }

  private printHelpSection(heading: string, options: Array<[string, string]>) {
    const longestName = options.reduce(
      (len, [first]) => Math.max(len, first.length),
      0,
    );

    if (heading.length) {
      logger.println(yellow(heading));
    }

    for (const [first, second] of options) {
      logger.print("  ");
      logger.print(green(first));
      logger.print(" ".repeat(longestName - first.length));
      logger.print("\t");
      logger.print(second);
      logger.print("\n");
    }
  }

  // This is fugly. I'm sorry
  private printHelp() {
    // Application summary
    logger.println("");
    logger.println(`${this.name} ${gray("v" + this.version)}`);
    logger.println("");
    logger.println(yellow("Usage:"));
    logger.println("  command [arguments] [--options]");
    logger.println("");

    this.printHelpSection("Options:", [
      [
        "--help",
        `Display the help for a given command. When no command is given display the help for the ${green("list")} command`,
      ],
      ["--silent", `Do not output any messages`],
      [
        "--json",
        `Output messages in JSON format. This is ignored if --silent is provided.`,
      ],
      ["--no-interactions", "Do not ask any interactive questions"],
    ]);
    logger.println("");

    // Commands
    logger.println(yellow("Available commands:"));

    const groups = this.commands.reduce((groups, cmd) => {
      let group = cmd.name.includes(":")
        ? cmd.name.slice(0, cmd.name.indexOf(":"))
        : "";
      if (groups.has(group)) {
        groups.get(group)!.push([cmd.name, cmd.description]);
      } else {
        groups.set(group, [[cmd.name, cmd.description]]);
      }
      return groups;
    }, new Map<string, Array<[string, string]>>());

    this.printHelpSection("", groups.get("") ?? []);

    groups.delete("");
    for (const [group, cmds] of Array.from(groups.entries()) ?? []) {
      logger.println("");
      this.printHelpSection(group, cmds);
    }

    logger.println("");
  }

  private printCommandHelp(cmd: Command<any>) {
    logger.println("");
    logger.println(yellow("Description:"));
    logger.println(` ${cmd.description}`);
    logger.println("");

    logger.println(yellow("Usage:"));
    logger.println(` ${cmd.name} [options] [--] [<(TODO)argument_name>]`);
    logger.println("");

    // if (cmd.arguments?.length) {
    //   logger.println(yellow("Arguments:"));
    //   logger.println(` ${cmd.name} [options] [--] [<(TODO)argument_name>]`);
    //   logger.println("");
    // }

    this.printHelpSection("Options:", [
      ...(cmd.options.map((opt) => {
        return [
          `--${opt.name}`,
          `${opt.description} [${gray(opt.type)}] [${yellow("Default: " + opt.default)}]`,
        ];
      }) as [string, string][]),
      [
        "--help",
        `Display the help for a given command. When no command is given display the help for the ${green("list")} command`,
      ],
      ["--silent", `Do not output any messages`],
      [
        "--json",
        `Output messages in JSON format. This is ignored if --silent is provided.`,
      ],
      ["--no-interactions", "Do not ask any interactive questions"],
    ]);

    logger.println("");
  }

  private attachListeners() {
    process.on("SIGINT", () => {
      process.exit(0);
    });
  }
}
