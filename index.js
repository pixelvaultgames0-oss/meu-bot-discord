require("dotenv").config();
const { 
    Client, 
    GatewayIntentBits, 
    Partials,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

// Quando o bot ligar
client.once("ready", () => {
    console.log(`🤖 Bot online como ${client.user.tag}`);
});

// Comando para criar o painel de ticket
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!ticket")) return;
    if (!message.member.permissions.has("Administrator")) return;

    const embed = new EmbedBuilder()
        .setColor("#5e17eb")
        .setTitle("📩 Suporte - Abrir Ticket")
        .setDescription("Clique no botão abaixo para abrir um ticket com nossa equipe.")
        .setFooter({ text: "Painel de Tickets" });

    const botao = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("abrirTicket")
            .setLabel("🎫 Abrir Ticket")
            .setStyle(ButtonStyle.Primary)
    );

    await message.channel.send({ embeds: [embed], components: [botao] });
});

// Quando clicarem no botão
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "abrirTicket") {
        const canal = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ["ViewChannel"]
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel", "SendMessages"]
                }
            ]
        });

        await canal.send(`🎫 Ticket aberto por <@${interaction.user.id}>`);
        await interaction.reply({ content: "Ticket criado!", ephemeral: true });
    }
});

client.login(process.env.TOKEN);
