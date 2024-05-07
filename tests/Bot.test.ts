import { CommandInteraction } from "discord.js";
import { execute } from "../src/commands/ping";

describe("ping", () => {
  const commandInteraction = ({
    reply: jest.fn(),
    channel: {
      send: jest.fn()
    },
  } as unknown) as CommandInteraction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("it should send pong", async () => {
    await execute(commandInteraction);
    expect(commandInteraction.reply).toHaveBeenCalledTimes(1);
    expect(commandInteraction.reply).toHaveBeenCalledWith({ content: "pong" });
    expect(commandInteraction.reply).not.toHaveBeenCalledWith({ content: "some bad response" });
  });
});
