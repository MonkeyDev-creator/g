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
    new SlashCommandBuilder()
      .setName('list-orders')
      .setDescription('List all current orders')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('update-status')
      .setDescription('Update the status of an order')
      .addIntegerOption(option => 
        option.setName('id')
          .setDescription('The ID of the order')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('status')
          .setDescription('The new status')
          .setRequired(true)
          .addChoices(
            { name: 'Pending', value: 'Pending' },
            { name: 'In Progress', value: 'In Progress' },
            { name: 'Making', value: 'Making' },
            { name: 'Ready', value: 'Ready' },
            { name: 'Completed', value: 'Completed' },
            { name: 'Cancelled', value: 'Cancelled' }
          ))
      .toJSON(),
    new SlashCommandBuilder()
      .setName('delete-order')
      .setDescription('Delete an order')
      .addIntegerOption(option => 
        option.setName('id')
          .setDescription('The ID of the order to delete')
          .setRequired(true))
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
      const isAdmin = (interaction.member?.permissions as any).has(BigInt(8)); // Administrator permission bit
      
      if (interaction.commandName === 'setup-gfx') {
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

        await interaction.reply({ content: "Setting up ordering menu...", flags: [4096] });
        const channel = interaction.channel;
        if (channel && 'send' in channel) {
          await (channel as any).send({ embeds: [embed], components: [row] });
        }
      } else if (interaction.commandName === 'list-orders') {
        if (!isAdmin) {
          await interaction.reply({ content: "Unauthorized.", flags: [4096] });
          return;
        }

        const allOrders = await storage.getOrders();
        if (allOrders.length === 0) {
          await interaction.reply({ content: "No orders found.", flags: [4096] });
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle("📋 Current Orders")
          .setColor("#FF6B00")
          .setDescription(allOrders.map(o => `**#${o.id}** - ${o.gfxType} (${o.status})`).join('\n').slice(0, 4096));

        await interaction.reply({ embeds: [embed], flags: [4096] });
      } else if (interaction.commandName === 'update-status') {
        if (!isAdmin) {
          await interaction.reply({ content: "Unauthorized.", flags: [4096] });
          return;
        }

        const id = interaction.options.getInteger('id', true);
        const status = interaction.options.getString('status', true);

        const updated = await storage.updateOrderStatus(id, status);
        if (updated) {
          await interaction.reply({ content: `✅ Order #${id} updated to ${status}.`, flags: [4096] });
        } else {
          await interaction.reply({ content: `❌ Order #${id} not found.`, flags: [4096] });
        }
      } else if (interaction.commandName === 'delete-order') {
        if (!isAdmin) {
          await interaction.reply({ content: "Unauthorized.", flags: [4096] });
          return;
        }

        const id = interaction.options.getInteger('id', true);
        const success = await storage.deleteOrder(id);
        if (success) {
          await interaction.reply({ content: `✅ Order #${id} deleted.`, flags: [4096] });
        } else {
          await interaction.reply({ content: `❌ Order #${id} not found.`, flags: [4096] });
        }
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
            flags: [4096], // Ephemeral flag
          });
        } catch (error) {
          console.error("Error creating order from Discord:", error);
          await interaction.reply({
            content: "❌ There was an error processing your order. Please try again later.",
            flags: [4096], // Ephemeral flag
          });
        }
      }
    }
  });

  client.login(token);
}
