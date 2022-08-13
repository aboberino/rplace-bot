import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "Bot ping",
    run: async ({ interaction }) => {
        const ping = Date.now() - interaction.createdTimestamp + " ms";
        interaction.followUp("Your ping is `" + `${ping}` + "`");
    }
});