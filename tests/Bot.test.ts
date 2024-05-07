import { Message } from "discord.js";
import { messageHandler } from "../src/handlers";

describe("muter", () => {
  const message = ({
    channel: {
      send: jest.fn(),
    },
    content: "",
    author: {
      bot: false,
    },
  } as unknown) as Message;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("it should send Hello, World!", async () => {
    message.content = "!hello";
    await messageHandler(message);
    expect(message.channel.send).toHaveBeenCalledWith("Hello, World!");
    expect(message.channel.send).not.toHaveBeenCalledWith("Help Command");
  });
  
});
