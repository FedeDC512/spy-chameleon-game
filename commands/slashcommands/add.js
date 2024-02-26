module.exports = {
    data: {
        name: 'add',
        description: 'Adds two numbers, this command is in its own file',
        options: [
            {
                name: 'num1',
                description: 'The first number',
                type: 10, // Use string 'NUMBER' for NUMBER type
                required: true,
            },
            {
                name: 'num2',
                description: 'The second number',
                type: 10, // Use string 'NUMBER' for NUMBER type
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const num1 = interaction.options.getNumber('num1');
        const num2 = interaction.options.getNumber('num2');
      
        if (isNaN(num1) || isNaN(num2)) {
          await interaction.reply('Please provide valid numbers.');
        } else {
          const result = num1 + num2;
          await interaction.reply(`The result is: ${result}`);
        }
    }
  };
