import { CommandInteractionOptionResolver, Guild, GuildMember, PermissionsBitField } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.followUp("You have used a non existent command");

        const member = interaction.member as GuildMember;
        if (command.userPermissions && !member.permissions.has(command.userPermissions)) return interaction.followUp("You don't have permissions to use this command");

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
});