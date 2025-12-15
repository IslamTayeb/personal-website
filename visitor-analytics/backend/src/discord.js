import { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { statements } from './db.js';
import { getCountryFlag, formatDuration } from './utils.js';

let client;
let channelId;

export async function initDiscordBot() {
  const token = process.env.DISCORD_BOT_TOKEN;
  channelId = process.env.DISCORD_CHANNEL_ID;

  if (!token || !channelId) {
    console.warn('Discord bot token or channel ID not configured. Discord integration disabled.');
    return null;
  }

  client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.once('ready', async () => {
    console.log(`Discord bot logged in as ${client.user.tag}`);
    await registerCommands();
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    await handleCommand(interaction);
  });

  await client.login(token);
  return client;
}

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('stats')
      .setDescription('Get visitor statistics')
      .addStringOption(option =>
        option.setName('period')
          .setDescription('Time period')
          .setRequired(true)
          .addChoices(
            { name: 'Today', value: 'today' },
            { name: 'This Week', value: 'week' },
            { name: 'Top Pages', value: 'top-pages' },
            { name: 'Top Locations', value: 'top-locations' },
            { name: 'Top Referrers', value: 'top-referrers' }
          )
      ),

    new SlashCommandBuilder()
      .setName('visitors')
      .setDescription('Get recent visitors')
      .addIntegerOption(option =>
        option.setName('count')
          .setDescription('Number of recent visitors to show')
          .setMinValue(1)
          .setMaxValue(25)
      ),

    new SlashCommandBuilder()
      .setName('lookup')
      .setDescription('Look up visitor details')
      .addStringOption(option =>
        option.setName('identifier')
          .setDescription('IP address or visitor ID')
          .setRequired(true)
      )
  ].map(command => command.toJSON());

  const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

  try {
    console.log('Registering Discord slash commands...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Discord commands registered successfully');
  } catch (error) {
    console.error('Error registering Discord commands:', error);
  }
}

async function handleCommand(interaction) {
  try {
    if (interaction.commandName === 'stats') {
      const period = interaction.options.getString('period');
      await handleStatsCommand(interaction, period);
    } else if (interaction.commandName === 'visitors') {
      const count = interaction.options.getInteger('count') || 10;
      await handleVisitorsCommand(interaction, count);
    } else if (interaction.commandName === 'lookup') {
      const identifier = interaction.options.getString('identifier');
      await handleLookupCommand(interaction, identifier);
    }
  } catch (error) {
    console.error('Error handling Discord command:', error);
    await interaction.reply({ content: 'An error occurred while processing your command.', ephemeral: true });
  }
}

async function handleStatsCommand(interaction, period) {
  await interaction.deferReply();

  let embed;

  if (period === 'today') {
    const stats = statements.getStatsToday.get();
    embed = new EmbedBuilder()
      .setTitle('📊 Today\'s Statistics')
      .setColor(0x5865F2)
      .addFields(
        { name: 'Unique Visitors', value: stats.unique_visitors?.toString() || '0', inline: true },
        { name: 'Total Sessions', value: stats.total_sessions?.toString() || '0', inline: true },
        { name: 'New Visitors', value: stats.new_visitors?.toString() || '0', inline: true },
        { name: 'Avg. Time Spent', value: formatDuration(stats.avg_time_spent), inline: true }
      )
      .setTimestamp();

  } else if (period === 'week') {
    const stats = statements.getStatsWeek.get();
    embed = new EmbedBuilder()
      .setTitle('📊 This Week\'s Statistics')
      .setColor(0x5865F2)
      .addFields(
        { name: 'Unique Visitors', value: stats.unique_visitors?.toString() || '0', inline: true },
        { name: 'Total Sessions', value: stats.total_sessions?.toString() || '0', inline: true },
        { name: 'New Visitors', value: stats.new_visitors?.toString() || '0', inline: true },
        { name: 'Avg. Time Spent', value: formatDuration(stats.avg_time_spent), inline: true }
      )
      .setTimestamp();

  } else if (period === 'top-pages') {
    const pages = statements.getTopPages.all(10);
    const pageList = pages.map((p, i) =>
      `${i + 1}. **${p.page_title || 'Untitled'}**\n   ${p.page_url}\n   ${p.visits} visits • ${formatDuration(p.avg_time_spent)} avg`
    ).join('\n\n') || 'No data available';

    embed = new EmbedBuilder()
      .setTitle('📄 Top Pages (Last 7 Days)')
      .setDescription(pageList)
      .setColor(0x57F287);

  } else if (period === 'top-locations') {
    const locations = statements.getTopLocations.all(10);
    const locationList = locations.map((l, i) =>
      `${i + 1}. ${getCountryFlag(l.country_code)} **${l.city}, ${l.country}** - ${l.visits} visits`
    ).join('\n') || 'No data available';

    embed = new EmbedBuilder()
      .setTitle('🌍 Top Locations (Last 7 Days)')
      .setDescription(locationList)
      .setColor(0xFEE75C);

  } else if (period === 'top-referrers') {
    const referrers = statements.getTopReferrers.all(10);
    const referrerList = referrers.map((r, i) =>
      `${i + 1}. **${r.source}** - ${r.visits} visits`
    ).join('\n') || 'No data available';

    embed = new EmbedBuilder()
      .setTitle('🔗 Top Referrers (Last 7 Days)')
      .setDescription(referrerList)
      .setColor(0xEB459E);
  }

  await interaction.editReply({ embeds: [embed] });
}

async function handleVisitorsCommand(interaction, count) {
  await interaction.deferReply();

  const visitors = statements.getRecentVisitors.all(count);

  if (visitors.length === 0) {
    await interaction.editReply({ content: 'No recent visitors found.' });
    return;
  }

  const visitorList = visitors.map((v, i) => {
    const flag = getCountryFlag(v.country_code);
    const location = v.city ? `${v.city}, ${v.country}` : v.country;
    return `${i + 1}. ${flag} **${location}** - ${v.browser} on ${v.os}\n   ${v.page_url}\n   <t:${Math.floor(new Date(v.created_at).getTime() / 1000)}:R>`;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setTitle(`👥 Last ${visitors.length} Visitors`)
    .setDescription(visitorList)
    .setColor(0x5865F2)
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function handleLookupCommand(interaction, identifier) {
  await interaction.deferReply();

  let visitors;
  if (identifier.match(/^\d+$/)) {
    // Numeric ID
    visitors = statements.lookupById.all(parseInt(identifier));
  } else {
    // IP address
    visitors = statements.lookupByIp.all(identifier);
  }

  if (visitors.length === 0) {
    await interaction.editReply({ content: 'No visitor found with that identifier.' });
    return;
  }

  const visitor = visitors[0];
  const flag = getCountryFlag(visitor.country_code);
  const location = visitor.city ? `${flag} ${visitor.city}, ${visitor.region}, ${visitor.country}` : `${flag} ${visitor.country}`;

  const embed = new EmbedBuilder()
    .setTitle(`🔍 Visitor Details (ID: ${visitor.id})`)
    .setColor(0x5865F2)
    .addFields(
      { name: 'Location', value: location, inline: true },
      { name: 'ISP', value: visitor.isp || 'Unknown', inline: true },
      { name: 'VPN/Proxy', value: visitor.is_vpn ? '⚠️ Yes' : '✅ No', inline: true },
      { name: 'Browser', value: `${visitor.browser} ${visitor.browser_version}`, inline: true },
      { name: 'OS', value: `${visitor.os} ${visitor.os_version}`, inline: true },
      { name: 'Device', value: visitor.device_type || 'Unknown', inline: true },
      { name: 'Language', value: visitor.language || 'Unknown', inline: true },
      { name: 'Timezone', value: visitor.timezone || 'Unknown', inline: true },
      { name: 'Referrer', value: visitor.referrer || 'Direct', inline: false },
      { name: 'First Visit', value: `<t:${Math.floor(new Date(visitor.created_at).getTime() / 1000)}:F>`, inline: false }
    );

  if (visitor.page_url) {
    embed.addFields({ name: 'Last Page', value: visitor.page_url, inline: false });
  }

  if (visitor.utm_source) {
    const utmInfo = [
      visitor.utm_source && `Source: ${visitor.utm_source}`,
      visitor.utm_medium && `Medium: ${visitor.utm_medium}`,
      visitor.utm_campaign && `Campaign: ${visitor.utm_campaign}`
    ].filter(Boolean).join('\n');

    if (utmInfo) {
      embed.addFields({ name: 'UTM Parameters', value: utmInfo, inline: false });
    }
  }

  embed.setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

export async function sendVisitorNotification(visitorData, sessionData, geoData) {
  if (!client || !channelId) return;

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;

    const flag = getCountryFlag(geoData?.country_code);
    const location = geoData?.city
      ? `${flag} ${geoData.city}, ${geoData.region}, ${geoData.country}`
      : `${flag} ${geoData?.country || 'Unknown'}`;

    const embed = new EmbedBuilder()
      .setTitle('🔔 New Visitor')
      .setColor(sessionData.is_new_visitor ? 0x57F287 : 0x5865F2)
      .addFields(
        { name: 'Location', value: location, inline: true },
        { name: 'ISP', value: geoData?.isp || 'Unknown', inline: true },
        { name: 'Status', value: sessionData.is_new_visitor ? '🆕 New Visitor' : '🔄 Returning', inline: true },
        { name: 'Page', value: `[${sessionData.page_title || 'Untitled'}](${sessionData.page_url})`, inline: false },
        { name: 'Browser', value: `${sessionData.browser} on ${sessionData.os}`, inline: true },
        { name: 'Device', value: sessionData.device_type || 'Unknown', inline: true },
        { name: 'Referrer', value: visitorData.referrer || 'Direct', inline: false }
      )
      .setTimestamp()
      .setFooter({ text: `Visitor ID: ${visitorData.visitor_id}` });

    if (geoData?.is_vpn) {
      embed.addFields({ name: '⚠️ VPN/Proxy', value: 'Detected', inline: true });
    }

    if (visitorData.utm_source) {
      const utmInfo = [
        visitorData.utm_source && `Source: ${visitorData.utm_source}`,
        visitorData.utm_medium && `Medium: ${visitorData.utm_medium}`,
        visitorData.utm_campaign && `Campaign: ${visitorData.utm_campaign}`
      ].filter(Boolean).join(' • ');

      if (utmInfo) {
        embed.addFields({ name: '🎯 Campaign', value: utmInfo, inline: false });
      }
    }

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
