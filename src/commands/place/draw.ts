import { ApplicationCommandOptionType } from "discord.js"
import { Command } from "../../structures/Command"
import { client } from '../../index'
import { Board } from "../../place/Board"
import { palette, enumObject, capitalize, alphabet } from "../../utils/utils"
import { Color } from "../../typings/enums/Color"
import { prismaClient } from "../../utils/prismaClient"
import { GuildBoard, prisma } from "@prisma/client"
import { getErrorEmbed } from "../../utils/embed"

export default new Command({
    name: "draw",
    description: "Draw a pixel on the board",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "x",
            description: "Choose where to draw the pixel on X axis (Letters)",
            required: true,
            minLength: 1,
            maxLength: 1,
        },
        {
            type: ApplicationCommandOptionType.Number,
            name: "y",
            description: "Choose where to draw the pixel on Y axis (Numbers)",
            required: true,
            minValue: 1,
            maxValue: 26,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "color",
            description: "Choose the color of the pixel (in #hex format, ex: #0392cf)",
            required: true,
            choices: Object.entries(enumObject(Color)).map(a => ({ name: `${capitalize(a[0].toLocaleLowerCase())} - ${a[1]}`, value: a[1] }))
        },
    ],
    run: async ({ interaction }) => {

        try {
            const x = (interaction.options.get("x")?.value as string).toUpperCase()
            const y = interaction.options.get("y")?.value as number
            const color = interaction.options.get("color")?.value as Color

            if (!alphabet.includes(x.toUpperCase())) throw new Error(`${x} is not a valid letter`)

            // check if a string is a color hex value
            // const isHex = (str: string | Color) => /^#[0-9a-f]{6}$/i.test(str)
            // if (!isHex(color)) {
            //     throw new Error("Color is not a valid hex value")
            // }

            // check if user can draw on the board
            const userTile = await prismaClient.userTile.findFirst({
                where: { userId: interaction.member.id },
                orderBy: { createdAt: 'desc' }
            })

            if (userTile) {

                console.log(userTile)

                const lastTile = new Date(userTile.createdAt).getTime()
                const now = Date.now()

                const cooldownAmount = 1000 * 60 * 5 // 5 mins

                console.log(lastTile)
                console.log(now)

                // user in cooldown
                if (cooldownAmount > now - lastTile) {
                    throw new Error(`You can't draw anymore, you can draw again in ${((cooldownAmount - (now - lastTile)) / 1000).toFixed()} seconds`)
                }
            }

            const guildId = interaction.guild.id

            // retrieve board from cache
            let board: Board | null = client.boards.get(guildId)

            let dbBoard: GuildBoard | null = null

            if (!board) {
                console.log('board is not in cache, retrieving from db')

                // get from db
                dbBoard = await prismaClient.guildBoard.findFirst({ where: { guildId } })

                if (!dbBoard) throw new Error('No board in db for guildId = ' + guildId)

                // get latest board pixels values from dbBoard
                const boardPixel = dbBoard.boardPixel.split(',').map(color => color as Color)

                board = new Board({ nbCols: dbBoard.size, boardPixel })

                client.boards.set(interaction.guild.id, board)
            }

            // draw the pixel
            await board.draw(x, y, color as Color, interaction.member.id, guildId)

            // save the board to db
            await prismaClient.guildBoard.update({
                where: { guildId },
                data: { boardPixel: board.boardPixel.map(row => row).join(',') }
            })

            // generate attachment
            const attachment = await board.generateAttachmentBuilder('board.png')
            interaction.followUp({ files: [attachment] });
        } catch (error) {
            console.log(error)
            interaction.followUp({ embeds: [getErrorEmbed(error.message)] })
        }

    }
})