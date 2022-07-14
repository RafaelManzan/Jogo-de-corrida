let backgroundImage;
let database;
let form, player, game;
let playersCount, gameState, allPlayers;
let car1, car1Img, car2, car2Img, track, cars = [];
let fuels, coins, obstacles, blast;
let fuelImg, coinImg;
let lifeImg, obstacle1, obstacle2;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  lifeImg = loadImage("./assets/life.png");
  obstacle1 = loadImage("./assets/obstacle1.png");
  obstacle2 = loadImage("./assets/obstacle2.png");
  fuelImg = loadImage("./assets/fuel.png");
  coinImg = loadImage("./assets/goldCoin.png");
  car1Img = loadAnimation("./assets/car1.png");
  car2Img = loadAnimation("./assets/car2.png");
  track = loadImage("./assets/track.jpeg");
  blast = loadAnimation("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  database = firebase.database();

  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);

  if(playersCount === 2){
    game.updateState(1);
  }
  if(gameState === 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}