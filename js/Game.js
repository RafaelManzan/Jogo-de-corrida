class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leadeBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.isMoving = false;
    this.isLeftKeyActive = false;
    this.isBlast = false;
  }

  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", (data) =>{
      gameState = data.val()
    });
  }

  updateState(state){
    var databaseRef = database.ref("/");
    databaseRef.update({
      gameState: state
    });
  }

  start() {
    form = new Form();
    form.display();

    player = new Player();
    player.getPlayersCount();

    car1 = createSprite(width/2-50, height-100);
    car1.addAnimation("car1Img",car1Img);
    car1.addAnimation("blast",blast);
    car1.scale = 0.07;

    car2 = createSprite(width/2+100, height-100);
    car2.addAnimation("car2Img",car2Img);
    car2.addAnimation("blast",blast);
    car2.scale = 0.07;

    cars = [car1, car2];

    let obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2 },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1 },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1 },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2 },
      { x: width / 2, y: height - 2800, image: obstacle2 },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1 },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2 },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2 },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1 },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2 },
      { x: width / 2, y: height - 5300, image: obstacle1 },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2 }
    ];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();
    
    this.addSprites(fuels,4,fuelImg,0.02);
    this.addSprites(coins,18,coinImg,0.09);
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1,0.04,obstaclesPositions);
  }

  play(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reniciar jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100);
    
    this.leadeBoardTitle.html("Placar");
    this.leadeBoardTitle.class("resetText");
    this.leadeBoardTitle.position(width/3-60,40);
    
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);
    
    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,130);

    this.handleResetButton();

    player.getPlayersInfo();

    player.getCarsAtEnd();

    if(allPlayers !== undefined){
      image(track, 0, -height*5, width, height*6);

      this.showLeaderBoard();
      this.showLife();
      this.showFuelBar();

      let index = 0;
      for (const key in allPlayers) {
        index = index+ 1;
        let x = allPlayers[key].positionX;
        let y = height - allPlayers[key].positionY;
        
        let currentLife = allPlayers[key].life;
        if(currentLife <= 0){
          cars[index - 1].changeAnimation("blast");
          cars[index - 1].scale = 0.3
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);

          this.handleFuel(index);
          this.handleCoins(index);
          this.handleObstacle(index);
          this.handleCollision(index);

          if(player.life <= 0){
            this.isBlast = true;
            this.isMoving = false;
          }

          //camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }

      if(this.isMoving){
        player.positionY += 5;
        player.updatePlayer();
      }
      this.playerControls();

      const finishLine = 6*height-100;
      if(player.positionY > finishLine){
        gameState = 2;
        player.ranking += 1;
        player.updateCarsAtEnd(player.ranking);
        player.updatePlayer();
        this.showRanking();
            }
      drawSprites();
    }
  }

  showLife(){
    push();
    image(lifeImg,width/2-130,height-player.positionY-200,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-200,185,20);
    fill("#f50057");
    rect(width/2-100,height-player.positionY-200,player.life,20);
    noStroke();
    pop();
  }

  showFuelBar(){
    push();
    image(fuelImg,width/2-130,height-player.positionY-100,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-100,185,20);
    fill("#ffc400");
    rect(width/2-100,height-player.positionY-100,player.fuel,20);
    noStroke();
    pop();
  }

  handleFuel(index){
    cars[index-1].overlap(fuels, (collector, collected) =>{
      player.fuel = 215
      collected.remove()
    });

    if(player.fuel > 0 && this.isMoving){
      player.fuel -= 1;
    }

    if(player.fuel <= 0){
      gameState = 2;
      this.gameOver();
    }
  }

  handleCoins(index){
    cars[index-1].overlap(coins, (collector, collected) =>{
      player.score += 21
      player.updatePlayer()
      collected.remove()
    });
  }

  handleObstacle(index){
    if(cars[index - 1].collide(obstacles)){
      if(this.isLeftKeyActive){
        player.positionX += 100;
      }else{
        player.positionX -= 100;
      }

      if(player.life > 0){
        player.life -= 185/4
      }
      player.updatePlayer();
    }
  }

  handleCollision(index){
    if(index === 1){
      if(cars[index - 1].collide(cars[1])){
        if(this.isLeftKeyActive){
          player.positionX += 100;
        }else{
          player.positionX -= 100;
        }

        if(player.life > 0){
          player.life -= 185/4;
        }

        player.updatePlayer();
      }
    }

    if(index === 2){
      if(cars[index - 1].collide(cars[0])){
        if(this.isLeftKeyActive){
          player.positionX += 100;
        }else{
          player.positionX -= 100;
        }

        if(player.life > 0){
          player.life -= 185/4;
        }

        player.updatePlayer();
      }
    }
  }

  playerControls(){
    if(!this.isBlast){
      if(keyIsDown(UP_ARROW)){
        this.isMoving = true;
        player.positionY += 10;
        player.updatePlayer();
      }
  
      if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50){
        this.isLeftKeyActive = true;
        player.positionX -= 5;
        player.updatePlayer();
      }
  
      if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300){
        this.isLeftKeyActive = true;
        player.positionX += 5;
        player.updatePlayer();
      }
    }
  }

  handleResetButton(){
    this.resetButton.mousePressed(() =>{
      database.ref("/").set({
        playersCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });

      window.location.reload();
    })
  }

  showLeaderBoard(){
    var leader1;
    var leader2;
    var players = Object.values(allPlayers);

    if((players[0].ranking === 0 && players[1].ranking === 0) || players[0].ranking === 1){
      leader1 = players[0].ranking + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader2 = players[1].ranking + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }

    if(players[1].ranking === 1){
      leader1 = players[1].ranking + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
      leader2 = players[0].ranking + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  addSprites(spriteGroup,numberOfSprites,spriteImg,scale,positions = []){
    for(var i = 0; i < numberOfSprites; i++){
      var x,y;
      if(positions.length > 0){
        x = positions [i].x;
        y = positions [i].y;
        spriteImg = positions [i].image;
      }else{
        x = random(width/2+150,width/2-150);
        y = random(-height*4.5,height-400);
      }

      var sprite = createSprite(x,y);
      sprite.addImage(spriteImg);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  showRanking(){
    swal({
      title: `INCRIVEL! ${"\n"} ${player.ranking}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSise: "100x100",
      confirmButtonText:"OK"
    })
  }

  gameOver(){
    swal({
      title: "Fim de jogo",
      text: "Ops voce perdeu a corrida!",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSise: "100x100",
      confirmButtonText:"Obrigado por jogar!"
    })
  }
}
