const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
let { gameStatus } = require('../../models/GameStatus.js');
let { Player, Roles } = require('../../models/Player.js');
module.exports = {
    data: {
        name: 'getusers',
        description: 'Get users in the voice channel',
    },
    async execute(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;
    
        if (!voiceChannel) {
            interaction.reply({content: 'You are not in a voice channel.', ephemeral: true });
            //gamePhase = false;
        } else if (gameStatus.getGamePhase()){
            interaction.reply({content: 'A game has already started!', ephemeral: true });
        } else {
            
            gameStatus.changeGamePhase();
            gameStatus.increaseRoundNumber();
            let playerRoles = voiceChannel.members.map(member => new Player(member)).filter(member => !member.user.bot);

            let numUsers = playerRoles.length;
            console.log("Players number: " + numUsers)

            //scelta e assegnazione del numero di Chosen Ones e Undercovers
            //ToDo: creare una funzione chiamata assignRoleToUsers(numUser)
            if (numUsers <= 5) {
                const randomIndex = Math.floor(Math.random() * numUsers);
                playerRoles[randomIndex].setRole(Roles.ChosenOne);
            } else {
                const numUserChosen = Math.floor(numUsers / 7) * 2;
                const numUserUndercover = Math.floor(numUsers / 7);
                for (let i = 0; i <= numUserChosen + numUserUndercover; i++) {
                  let randomIndex = Math.floor(Math.random() * numUsers);
                  if(!playerRoles[randomIndex].role && i <= numUserChosen) {
                    playerRoles[randomIndex].setRole(Roles.ChosenOne);
                  } else if(!playerRoles[randomIndex].role){
                    playerRoles[randomIndex].setRole(Roles.Undercover);
                  } else i--;
                }
            }

            //comunicazione dei ruoli ai giocatori
            playerRoles.forEach((player) => {
                if (player.getRole() == Roles.ChosenOne) {
                    //player.user.send('Hello from the bot! You are the Chosen One.');
                    console.log(player.user.displayName+ " is a Chosen One");
                } else if (player.getRole() == Roles.Undercover){
                    //player.user.send('Hello from the bot! You are an Undercover.');
                    console.log(player.user.displayName+ " is an Undercover");   
                } else {
                    //player.user.send('Hello from the bot! You are a Simple Player');
                    console.log(player.user.displayName+ " is a Simple Player");
                }
            });
            
            console.log("Players:" + playerRoles.toString())

        const buttonPlayersStart = new ActionRowBuilder().addComponents(
          playerRoles.map(player => new ButtonBuilder()
                .setCustomId(player.user.id)
                .setEmoji('🕵️')
                .setLabel(player.user.displayName)
                .setStyle('Primary')
            ))
    
            
        const buttonMenu = new ActionRowBuilder().addComponents(buttonPlayersStart.components.slice(0, 5)); // Mostra solo i primi 5 pulsanti
    
          interaction.reply({ content: `Messages sent to all users in the voice channel. Round number: ${gameStatus.getRoundNumber()}. Vote who you think is the Chosen One:`,
          components: [buttonMenu]
        })

        gameStatus.setPlayerRoles(playerRoles);
      }
  },
}