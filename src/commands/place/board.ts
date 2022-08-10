import { ApplicationCommandOptionType } from "discord.js"
import { Command } from "../../structures/Command"
import { client } from '../../index'
import { prismaClient } from "../../utils/prismaClient"
import { Board } from "../../place/Board"
import { Color } from "../../typings/enums/Color"

export default new Command({
    name: "board",
    description: "Show the board",
    run: async ({ interaction }) => {

        try {
            const guildId = interaction.guild.id

            // get guild board from cache
            let board: Board | null = client.boards.get(guildId)

            if (!board) {
                console.log('board is not in cache, retrieving from db')

                // get from db
                const dbBoard = await prismaClient.guildBoard.findFirst({ where: { guildId } })

                if (!dbBoard) throw new Error('There is no active board for this guild 😢')

                // get latest board pixels values from dbBoard
                const boardPixel = dbBoard.boardPixel.split(',').map(color => color as Color)

                board = new Board({ nbCols: dbBoard.size, boardPixel })

                client.boards.set(interaction.guild.id, board)
            }

            // get latest board values
            board.drawCanvas()

            // get board png file 
            const attachment = await board.generateAttachmentBuilder('board.png')
            interaction.followUp({ files: [attachment] });
        } catch (error) {
            console.log(error)
            interaction.followUp(error.message)
        }

    }
})