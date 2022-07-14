class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/title.png", "nome do jogo");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementsPosition(){
    this.input.position(width/2-110, height/2-80);
    this.playButton.position(width/2-90, height/2-20);
    this.titleImg.position(120,160);
    this.greeting.position(width/2-300, height/2-100);
  }

  setElementsStyle(){
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.titleImg.class("gameTitle");
    this.greeting.class("greeting");
  }

  handleMousePressed(){
    this.playButton.mousePressed(() => {
      this.input.hide()
      this.playButton.hide()
      
      let message = `Olááá, ${this.input.value()}! </br>Espere até o outro jogador entrar`
      this.greeting.html(message)

      playersCount = playersCount + 1;
      player.name = this.input.value();
      player.index = playersCount;
      player.addPlayer();
      player.updatePlayersCount(playersCount);
      player.getDistance();
    });
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }

}