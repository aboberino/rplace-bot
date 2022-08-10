import { Board } from './../place/Board';
import { Event } from "../structures/Event";
import { client as extendedClient } from '../index'

export default new Event('ready', (client) => {
    console.log('Bot is online!')
    // fetch all boards locally to put them in cache
})