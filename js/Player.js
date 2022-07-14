class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.ranking = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;
  }

  getCarsAtEnd(){
    var carsAtEndRef = database.ref("carsAtEnd");
    carsAtEndRef.on("value", (data) =>{
      this.ranking = data.val()
    });
  }

  updateCarsAtEnd(ranking){
    var databaseRef = database.ref("/");
    databaseRef.update({
      carsAtEnd: ranking
    })
  }

  getPlayersCount(){
    var playersCountRef = database.ref("playersCount");
    playersCountRef.on("value", (data) =>{
      playersCount = data.val()
    });
  }

  updatePlayersCount(count){
    var databaseRef = database.ref("/");
    databaseRef.update({
      playersCount: count
    })
  }

  addPlayer(){
    var playerIndex = "players/player" + this.index;
    if (this.index === 1) {
      this.positionX = width/2 - 100
    } else {
      this.positionX = width/2 + 100
    }

    var playerIndexRef = database.ref(playerIndex);
    playerIndexRef.set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      ranking: this.ranking,
      score: this.score,
      life: this.life
    })
  }

  getPlayersInfo(){
    var playersRef = database.ref("players");
    playersRef.on("value", (data) =>{
      allPlayers = data.val()
    });
  }

  getDistance(){
    var playerIndex = "players/player" + this.index;
    var playerIndexRef = database.ref(playerIndex);
    playerIndexRef.on("value", (data)=>{
      var info = data.val()
      this.positionX = info.positionX
      this.positionY = info.positionY
    });
  }

  updatePlayer(){
    var playerIndex = "players/player" + this.index;
    var playerIndexRef = database.ref(playerIndex);
    playerIndexRef.update({
      positionX: this.positionX,
      positionY: this.positionY,
      ranking: this.ranking,
      score: this.score,
      live: this.life
    })
  }

}