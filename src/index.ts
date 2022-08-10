
require("dotenv").config();
import { GatewayIntentBits } from "discord.js";
import { ExtendedClient } from "./structures/Client";

export const client = new ExtendedClient({intents: [GatewayIntentBits.Guilds]})
// export const client = new ExtendedClient();

client.start();