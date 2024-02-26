class GameStatus{
    constructor(playerRoles) {
        this.gamePhase = false;
        this.roundNumber = 0;
        this.playerRoles = playerRoles;
    }

    setPlayerRoles(playerRoles){
        this.playerRoles = playerRoles;
    }
    getPlayerRoles(){
        return this.playerRoles;
    }
    resetAllVotes(){
        this.playerRoles = this.playerRoles.forEach(player => player.resetVotes());
    }
    changeGamePhase(){
        this.gamePhase = !this.gamePhase;
        console.log("Game Phase set to: "+ this.gamePhase);
    }
    getGamePhase(){
        return this.gamePhase;
    }
    increaseRoundNumber(){
        this.roundNumber++;
        console.log("Round Number: "+ this.roundNumber);
    }
    getRoundNumber(){
        return this.roundNumber;
    }

}

const gameStatus = new GameStatus();

module.exports = {
    gameStatus
  };