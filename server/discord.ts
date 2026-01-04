import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, REST, Routes, SlashCommandBuilder } from "discord.js";
import { storage } from "./storage";

export async function setupDiscordBot() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.log("No DISCORD_BOT_TOKEN found, skipping bot setup");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const commands = [
    new SlashCommandBuilder()
      .setName('setup-gfx')
      .setDescription('Set up the GFX ordering message in the current channel')
      .toJSON(),
  ];

  const rest = new REST({ version: '10' }).setToken(token);

  client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(
        Routes.applicationCommands(client.user!.id),
        { body: commands },
      );
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'setup-gfx') {
        const isAdmin = (interaction.member?.permissions as any).has(BigInt(8)); // Administrator permission bit
        if (!isAdmin) {
          await interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle("🎨 Monkey Studio GFX Ordering")
          .setDescription("Click the button below to place your GFX order! Our team will review it shortly.")
          .setColor("#FF6B00")
          .setThumbnail(client.user?.displayAvatarURL() || null);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("open_order_modal")
            .setLabel("Place Order")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🛒")
        );

        await interaction.reply({ content: "Setting up ordering menu...", ephemeral: true });
        await interaction.channel?.send({ embeds: [embed], components: [row] });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === "open_order_modal") {
        const modal = new ModalBuilder()
          .setCustomId("gfx_order_modal")
          .setTitle("Place GFX Order");

        const emailInput = new TextInputBuilder()
          .setCustomId("email")
          .setLabel("Your Email Address")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("you@example.com")
          .setRequired(true);

        const robloxInput = new TextInputBuilder()
          .setCustomId("roblox_user")
          .setLabel("Roblox Username")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Username")
          .setRequired(true);

        const gfxTypeInput = new TextInputBuilder()
          .setCustomId("gfx_type")
          .setLabel("GFX Type (Thumbnail, Icon, etc.)")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("e.g. Thumbnail")
          .setRequired(true);

        const detailsInput = new TextInputBuilder()
          .setCustomId("details")
          .setLabel("Order Details")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Describe your request...")
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(emailInput),
          new ActionRowBuilder<TextInputBuilder>().addComponents(robloxInput),
          new ActionRowBuilder<TextInputBuilder>().addComponents(gfxTypeInput),
          new ActionRowBuilder<TextInputBuilder>().addComponents(detailsInput)
        );

        await interaction.showModal(modal);
      }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      if (interaction.customId === "gfx_order_modal") {
        const email = interaction.fields.getTextInputValue("email");
        const robloxUser = interaction.fields.getTextInputValue("roblox_user");
        const gfxType = interaction.fields.getTextInputValue("gfx_type");
        const details = interaction.fields.getTextInputValue("details");

        try {
          await storage.createOrder({
            email,
            discordUser: interaction.user.tag,
            robloxUser,
            gfxType,
            details,
            imageUrl: null,
          });

          await interaction.reply({
            content: "✅ Your order has been placed! You can track it on our website using your email.",
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error creating order from Discord:", error);
          await interaction.reply({
            content: "❌ There was an error processing your order. Please try again later.",
            ephemeral: true,
          });
        }
      }
    }
  });

  client.login(token);
}
