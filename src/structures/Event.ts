import { ExtendedClient } from './Client';
import { ClientEvents } from "discord.js";

export class Event<Key extends keyof ClientEvents> {
    constructor(
        public event: Key,
        public run: (...args: ClientEvents[Key]) => any
    ) { }
}