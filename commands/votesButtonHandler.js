const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
let { gameStatus } = require('../models/GameStatus.js');

module.exports = (client) => {
    client.on('interactionCreate', (interaction) => {
      if (!interaction.isButton()) return;
 
      //gameStatus.changeGamePhase();
 
      const playerVotingId = interaction.user.id;

  if (!gameStatus.getPlayerRoles().find(player => player.getUser().id === playerVotingId).getHasVoted() && gameStatus.getGamePhase()) {
      gameStatus.getPlayerRoles().find(player => player.getUser().id === playerVotingId).setHasVoted();
      gameStatus.getPlayerRoles().find(player => player.getUser().id === interaction.customId).voteThisPlayer();
      console.log(gameStatus.getPlayerRoles().find(player => player.getUser().id === playerVotingId).getUser().displayName + ' has voted for ' + gameStatus.getPlayerRoles().find(player => player.getUser().id === interaction.customId).getUser().displayName);

      interaction.reply({ content: `You voted for: ${gameStatus.getPlayerRoles().find(player => player.getUser().id === interaction.customId).getUser().displayName}`, ephemeral: true });

      //if (gameStatus.getPlayerRoles().every(player => player.getHasVoted())) {
      if (gameStatus.getPlayerRoles().find(player => player.user.displayName === "FedeDC").getHasVoted()) {
        interaction.message.edit({ content: "All players have voted for this round! Counting the votes...", components: [] })

        const maxVotes = gameStatus.getPlayerRoles().reduce((max, player) => {
          return Math.max(max, player.getVotesRecived());
        }, gameStatus.getPlayerRoles()[0].getVotesRecived());

        console.log('The most voted person(s) received ' + maxVotes + ' votes');

        // Trovare gli utenti con il punteggio massimo
        const usersWithMaxVotes = gameStatus.getPlayerRoles().filter(player => player.getVotesRecived() === maxVotes);
        console.log('The most voted player are: ' + usersWithMaxVotes.map( player => player.getUser().displayName));

        let finalMessage = `During round ${gameStatus.getRoundNumber()}, the most voted Player(s) is/are ${usersWithMaxVotes.map( player => player.getUser().displayName)} with ${maxVotes} votes!`;

        usersWithMaxVotes.forEach((investigated) => {
          if(gameStatus.getPlayerRoles().find(player => player === investigated).getRole() === 1){
            if(gameStatus.getPlayerRoles().filter(player => player === investigated).length === 1){
              finalMessage += `\n${investigated.user.displayName} was the last Chosen One!`;
              gameStatus.changeGamePhase();
              console.log("End Game!")
            } else {
              finalMessage += `\n${investigated.user.displayName} was a Chosen One!`;
            };
          } else if(gameStatus.getPlayerRoles().find(player => player === investigated).getRole() === 2){
            finalMessage += `\n${investigated.user.displayName} was an Undercover!`;
          } else if(gameStatus.getPlayerRoles().find(player => player === investigated).getRole() === 0){
            finalMessage += `\n${investigated.user.displayName} was a Simple Player.`;
          } else {
            finalMessage += `\nSomething went wrong with the votes: ${investigated.user.displayName}`;
          }
          //gameStatus.setPlayerRoles(gameStatus.getPlayerRoles().filter(player => player != usersWithMaxVotes.includes(player)));
          gameStatus.setPlayerRoles(gameStatus.getPlayerRoles().filter(player => player.getVotesRecived() != maxVotes));
        });

        let chosenOnesRemaining = gameStatus.getPlayerRoles().filter(player => player.getRole() === 1) ? gameStatus.getPlayerRoles().filter(player => player.getRole() === 1).length : 0;
        let undercoversRemaining = gameStatus.getPlayerRoles().filter(player => player.getRole() === 2) ? gameStatus.getPlayerRoles().filter(player => player.getRole() === 2).length : 0;
        console.log(`Chosen Ones remaining (${chosenOnesRemaining}):` + gameStatus.getPlayerRoles().filter(player => player.getRole() === 1).map( player => player.toString()));
        console.log(`Undercovers remaining (${undercoversRemaining}):` + gameStatus.getPlayerRoles().filter(player => player.getRole() === 2).map( player => player.toString()));
        console.log(`Players remaining:` + gameStatus.getPlayerRoles().filter(player => player.getRole() === 0).map( player => player.toString()));

        finalMessage += `\nThere are ${chosenOnesRemaining} Chosen One(s) remaining and ${undercoversRemaining} Undercover(s) remaining.`;

          //setTimeout(() => {
            // Questa parte di codice verrà eseguita dopo il ritardo
            if (chosenOnesRemaining === 0){
              finalMessage +=  "\nCongratulations! The Players won the game!";
              interaction.message.edit(finalMessage);
            } else {
              interaction.message.edit(finalMessage);
              console.log("New Players: " + gameStatus.getPlayerRoles().map( player => player.toString()))

              //aggiornare buttonRow
              const buttonPlayersStart = new ActionRowBuilder().addComponents(
                gameStatus.getPlayerRoles().map(player => new ButtonBuilder()
                .setCustomId(player.getUser().id)
                .setEmoji('🕵️')
                .setLabel(player.getUser().displayName)
                .setStyle('Primary')
              ))

              gameStatus.increaseRoundNumber();
              const buttonMenu = new ActionRowBuilder().addComponents(buttonPlayersStart.components.slice(0, 5)); // Mostra solo i primi 5 pulsanti
              interaction.channel.send({ content: `Messages sent to all users in the voice channel. Round number: ${gameStatus.getRoundNumber()}. Vote who you think is the Chosen One:`,
              components: [buttonMenu] });
            }
          //}, 2000);
          // Resetta i voti e gli utenti playersVoting per la prossima votazione
          gameStatus.resetAllVotes();
      }
  } else if (!gameStatus.getGamePhase()){
    interaction.reply({ content: `No game has started, do you want to start a game?`, ephemeral: true });
  } else {
      interaction.reply({ content: "You have already voted! Wait for the results.", ephemeral: true });
  }
    });
  };