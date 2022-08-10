import { prismaClient } from './../../utils/prismaClient';
import { ApplicationCommandOptionType } from "discord.js"
import { Command } from "../../structures/Command"
import { client } from '../../index'
import { Board, BoardOptions } from "../../place/Board"
import { Color } from '../../typings/enums/Color';

export default new Command({
    name: "init",
    description: "Initializes the board",
    userPermissions: ["Administrator", "ManageGuild"],
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "size",
            description: "Choose the number of columns and rows of the board",
            required: true,
            minValue: 2,
            maxValue: 26
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "default-color",
            description: "Choose default pixel board",
            required: true,
            choices: [{ name: 'White board', value: Color.WHITE }, { name: 'Empty board', value: Color.EMPTY }, { name: 'Random pixel board', value: Color.RANDOM }]
        },
    ],
    run: async ({ interaction }) => {

        try {
            // get board options
            const size = interaction.options.get("size").value as number

            const defaultColor = interaction.options.get("default-color").value as Color
            console.log(defaultColor)

            // check if board exist in DB / cache if true stop command

            // init the board for the current guild
            const board = new Board({ nbCols: size, defaultColor: defaultColor === Color.RANDOM ? null : defaultColor })

            // convert boardPixel to string to store in db
            const boardPixelConverted = board.boardPixel.map(row => row).join(',')

            // save board to db
            const createdGuildBoard = await prismaClient.guildBoard.create({
                data: {
                    guildId: interaction.guild.id,
                    boardPixel: boardPixelConverted,
                    size
                }
            })

            // set DB guildboard id to board
            board.guildBoardId = createdGuildBoard.id
            client.boards.set(interaction.guild.id, board)
            interaction.followUp(`${size}x${size} Board has been initialized 🚀`)
        } catch (error) {
            console.log(error)
            interaction.followUp(error.message)
        }

    }
})