// Tutorial: https://www.youtube.com/watch?v=qRMVNtIF73c&ab_channel=WornOffKeys
//avvia con nodemon

const { Client, Collection, GatewayIntentBits, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const axios = require('axios');
require("dotenv/config")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates, // Aggiungi l'intent VoiceStates
    ],
});

//Creo una collezione per contenere i comandi e caricali dalla cartella commands
const fs = require('fs');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Carico gli slash command dalla cartella slashcommands
const slashCommandFiles = fs.readdirSync('./commands/slashcommands').filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
  const command = require(`./commands/slashcommands/${file}`);
  client.commands.set(command.data.name, command);
}

// Carica il modulo per la gestione dei pulsanti
const buttonHandler = require('./commands/votesButtonHandler');
buttonHandler(client);

/*
let gamePhase = false;
let chosenOneCount = 1; // Inizialmente 1 chosen one
let undercoverCount = 0;
let roundNumber = 0;
const chosenOnes = [];
const undercovers = [];
const allPlayers = [];

let votes = {};
let playersVoting = [];
*/



// when the bot starts up
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log("Bot is ready!")

  //rimossi myGuildId e guildId, messi su .env (non so se il codice qui sotto funziona)
  const myGuildId = process.env.myGuildId
  const guildId = process.env.guildId


  const guild = client.guilds.cache.get(guildId)
  let commands

  if (guild){
    commands = guild.commands
  }
  else{
    commands = client.application?.commands
  }

});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  //const {commandName, options} = interaction

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});


/*
client.on('interactionCreate', (interaction) => {
  if (!interaction.isButton()) return;

  const playerVotingId = interaction.user.id;

  if (!playersVoting.includes(playerVotingId) && gamePhase) {
      playersVoting.push(playerVotingId);
      console.log("playersVoting: "+playersVoting);

      const vote = interaction.customId;
      votes[vote] = (votes[vote] || 0) + 1;

      interaction.reply({ content: `You voted for: ${allPlayers.find(user => user.id === vote).displayName}`, ephemeral: true });

      if (playersVoting.length === allPlayers.length) {
          
        let mostVotedPlayer;

          let maxVotes = 0;

          for (const vote in votes) {
              if (votes[vote] > maxVotes) {
                  mostVotedPlayer = vote;
                  maxVotes = votes[vote];
              }
          }
          let mostVotedPlayerName = allPlayers.find(user => user.id === mostVotedPlayer).displayName;
          let messaggioFinale = `During round ${roundNumber}, the most voted player is: ${mostVotedPlayerName} with ${maxVotes} votes!`;
          roundNumber++;
          console.log("Start round "+ roundNumber)
          console.log("mostVotedPlayer: "+mostVotedPlayer)

          if (chosenOnes.find(user => user.id === mostVotedPlayer)) {
            chosenOneCount--;
            if (chosenOneCount < 1) {
              messaggioFinale += `\n${mostVotedPlayerName} was the last Chosen One. There are no chosen ones remaining! You won in ${roundNumber - 1} round(s)!`;
              gamePhase = false;
              console.log("End Game!")
            } else {
              messaggioFinale += `\n${mostVotedPlayerName} is a Chosen One! ${chosenOneCount} chosen one(s) remaining. Round number: `+ roundNumber;
            }
              // Rimuovi l'utente dalla lista dei chosen one
              chosenOnes.splice(chosenOnes.findIndex(user => user.id === mostVotedPlayer), 1);
              allPlayers.splice(allPlayers.findIndex(user => user.id === mostVotedPlayer), 1);
          } else {
              messaggioFinale += `\n${mostVotedPlayerName} is not a Chosen One! ${chosenOneCount} chosen one(s) remaining.`;
              // Rimuovi l'utente dalla lista dei players
              allPlayers.splice(allPlayers.findIndex(user => user.id === mostVotedPlayer), 1);
          }
          console.log("Chosen One Remaining: "+ chosenOneCount)

          setTimeout(() => {
            // Questa parte di codice verrà eseguita dopo il ritardo
          if (chosenOneCount === 0){
            interaction.channel.send(messaggioFinale);
            return;
          } else {
            //aggiornare buttonRow
            const buttonPlayers = new ActionRowBuilder().addComponents(
            allPlayers.map(player => new ButtonBuilder()
                  .setCustomId(player.id)
                  .setEmoji('🕵️')
                  .setLabel(player.displaylName)
                  .setStyle('Primary')
              ))
          const buttonMenu = new ActionRowBuilder().addComponents(buttonPlayers.components.slice(0, 5)); // Mostra solo i primi 5 pulsanti
            
            interaction.channel.send({content: messaggioFinale,
                                          components: [buttonMenu],
                                          ephemeral: true,});
          }

          // Resetta i voti e gli utenti playersVoting per la prossima votazione
          votes = {};
          playersVoting = [];

          }, 2000);
      }
  } else if (gamePhase === false){
    interaction.reply({ content: `No game has started, do you want to start a game?`,
                        ephemeral: true });
  } else {
      interaction.reply({ content: "You have already voted! Wait for the results.", ephemeral: true });
  }
});*/


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!randomword') {
    try {
      /*const response = await axios.get('https://api.api-ninjas.com/v1/randomword', {
        //params: { type: 'noun' },
        headers: { 'X-Api-Key': process.env.APINinjaKey },
      });*/
      const response = await axios.get('https://random-word-api.vercel.app/api?words=1');
      
      console.log("randomWord: "+response.data)
      const randomWord = response.data;
  
      const responseSynonym = await axios.get(`https://api.api-ninjas.com/v1/thesaurus?word=${randomWord}`, {
        headers: { 'X-Api-Key': process.env.APINinjaKey },
      });

      console.log('synonyms: '+responseSynonym.data.synonyms[0])
      const synonym = responseSynonym.data.synonyms[0]; // Prende il primo sinonimo dall'array dei sinonimi
  
      message.channel.send(`The random word is: ${randomWord}`);
      message.channel.send(`A synonym for it is: ${synonym}`);
    } catch (error) {
      console.error('Error retrieving random word:', error);
    }
  }
});

client.login(process.env.TOKEN)
