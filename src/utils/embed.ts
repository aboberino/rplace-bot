import { EmbedBuilder } from "discord.js"
import { Color } from "../typings/enums/Color"


export function getErrorEmbed(message: string) {
    return new EmbedBuilder()
        .setColor(Color.RED)
        .setAuthor({ name: 'Error', iconURL: 'https://puu.sh/Jg1jc/218270ef3f.gif' })
        .setDescription(message)
}

export function getInfoEmbed(message: string) {
    return new EmbedBuilder()
        .setColor(Color.BLUE)
        .setDescription(message)
}