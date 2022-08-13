import { Command } from "../../structures/Command"
import { getInfoEmbed } from "../../utils/embed"

export default new Command({
    name: "ping",
    description: "Bot ping",
    run: async ({ interaction }) => {
        const ping = Date.now() - interaction.createdTimestamp + " ms"
        interaction.followUp({ embeds: [getInfoEmbed("Your ping is `" + `${ping}` + "`")] })
    }
})