module.exports = {
    data: {
      name: 'ping',
      description: 'Replies with pong this command is in its own file',
    },
    async execute(interaction) {
      await interaction.reply({
        content:'pong',
        ephemeral: true,
      })
    },
  };