import { Command } from "../../structures/Command"
import { client } from '../../index'
import { prismaClient } from "../../utils/prismaClient"
import { Board } from "../../place/Board"
import { getErrorEmbed, getInfoEmbed } from "../../utils/embed"

export default new Command({
    name: "delete",
    description: "Delete the board",
    userPermissions: ["Administrator"],
    run: async ({ interaction }) => {

        try {
            const guildId = interaction.guild.id

            // get guild board from cache
            let board: Board | null = client.boards.get(guildId)

            if (board) client.boards.delete(guildId)

            const dbBoard = await prismaClient.guildBoard.findFirst({ where: { guildId } })

            if (!dbBoard) return interaction.followUp({ embeds: [getErrorEmbed('There is no board to delete 🤮')] })

            await prismaClient.guildBoard.deleteMany({ where: { guildId } })
            interaction.followUp({ embeds: [getInfoEmbed('Board deleted with success 🚮')] })


        } catch (error) {
            console.log(error)
            interaction.followUp({ embeds: [getErrorEmbed(error.message)] })
        }

    }
})