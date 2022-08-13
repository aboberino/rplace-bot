import { EmbedBuilder } from "discord.js"
import { Color } from "../typings/enums/Color"


export function getErrorEmbed(message: string) {
    return new EmbedBuilder()
        .setColor(Color.RED)
        .setAuthor({ name: 'Error', iconURL: 'https://puu.sh/Jg17I/04708dee1d.gif' })
        .setDescription(message)
}