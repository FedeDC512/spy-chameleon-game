const Roles = {
    Player: 0,
    ChosenOne: 1,
    Undercover: 2
  }

class Player{
    constructor(user) {
      this.user = user;
      this.role = 0;
      this.hasVoted = false, 
      this.votesRecived = 0 
    }

    getUser(){
      return this.user
    }

    setRole(role) {
      this.role = role;
    }

    getRole() {
        return this.role;
      }

    toString(){
      return " " + this.user.displayName + " (" + this.getRoleName(this.getRole()) +")"
    }

    getRoleName(value) {
      return Object.keys(Roles).find(key => Roles[key] === value);
  }

    setHasVoted(){
      this.hasVoted = true
      return this.user.displayName + " has voted!"
    }

    getHasVoted(){
      return this.hasVoted
    }

    voteThisPlayer(){
      this.votesRecived++
    }
    getVotesRecived(){
      return this.votesRecived
    }
    resetVotes(){
      this.hasVoted = false;
      this.votesRecived = 0;
    }
}

module.exports = {
    Roles,
    Player
  };