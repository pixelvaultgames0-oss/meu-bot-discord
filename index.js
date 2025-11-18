require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Bot online como ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (message.content === "!ping") {
        message.reply("Pong!");
    }
});

client.login(process.env.TOKEN);
require("dotenv").config();
const { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

// Quando o bot ligar
client.once("ready", () => {
    console.log(`Bot iniciado como ${client.user.tag}`);
});

// Comando para enviar o painel de ticket
client.on("messageCreate", async (message) => {
    if (message.content === "!painelticket") {

        const embed = new EmbedBuilder()
            .setTitle("🎫 Suporte • Pixel Vault")
            .setDescription("Clique no botão abaixo para abrir um ticket com a equipe.\n\n**Use apenas se precisar de ajuda real.**")
            .setColor("#5e17eb");

        const botao = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("abrir_ticket")
                .setLabel("📩 Abrir Ticket")
                .setStyle(ButtonStyle.Primary)
        );

        await message.channel.send({ embeds: [embed], components: [botao] });
        message.reply("Painel enviado!");
    }
});

// Criar ticket ao clicar
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "abrir_ticket") {

        const canal = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0, // Canal de texto
            parent: "1440192068403200092",
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                },
                {
                    id: "ID_DO_CARGO_STAFF", // Coloque o cargo da sua staff
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                }
            ]
        });

        await canal.send({
            content: `${interaction.user}`,
            embeds: [
                new EmbedBuilder()
                    .setTitle("🎫 Ticket Aberto")
                    .setDescription("Explique sua dúvida que a equipe irá te atender em alguns instantes.")
                    .setColor("#5e17eb")
            ]
        });

        await interaction.reply({ content: `Ticket criado com sucesso: ${canal}`, ephemeral: true });
    }
});

client.login(process.env.TOKEN);
