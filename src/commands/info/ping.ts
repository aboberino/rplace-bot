import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "replies with pong",
    userPermissions: ["Administrator"],
    run: async ({ interaction }) => {
        interaction.followUp("Pong3");
    }
});