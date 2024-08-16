import { Application, defineCommand, Result } from "../src";

const ping = defineCommand("ping")
  .addDescription("Return a pong message")
  .handler(async (input, output) => {
    output.println("pong");
    return Result.SUCCESS;
  });

const migrate = defineCommand("db:migrate")
  .addDescription("Migrate the database")
  .handler(async (input, output) => {
    output.warn("Migration started");
    output.info("Migration completed");
    return Result.SUCCESS;
  });

const seed = defineCommand("db:seed")
  .addDescription("Seed the database")
  .handler(async (input, output) => {
    output.warn("Migration started");
    output.info("Migration completed");
    return Result.SUCCESS;
  });

new Application("Example", "1.0.0")
  .addCommand(ping)
  .addCommand(migrate)
  .addCommand(seed)
  .run();
