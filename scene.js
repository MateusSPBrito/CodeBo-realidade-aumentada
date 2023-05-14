const marker = document.querySelector("a-marker");
const entity = document.getElementById("codebo");
let faseId = -1;

const fases = [
  {
    fase: 1,
    data: [
      { x: 0, z: 0, y: 2 },
      { x: 1, z: 0, y: 2 },
      { x: 2, z: 0, y: 2 },
      { x: 3, z: 0, y: 2 },
      { x: 3, z: 0, y: 1 },
      { x: 3, z: 0, y: 0 },
      { x: 4, z: 0, y: 0 },
      { x: 5, z: 0, y: 0 },
    ],
  },
];

const commands = [
  "walk",
  "walk",
  "walk",
  "rotateRight",
  "rotateRight",
  "walk",
  "walk",
  "rotateLeft",
  "walk",
  "walk",
];

class CodeBo {
  constructor() {
    this.positionX = 0;
    this.positionZ = 0;
    this.positionY = 0;
    this.direction = "right";
    this.idPosition = 0;
    this.intervalGame;
  }
  setStartingPosition() {
    localStorage.removeItem("play");
    if (faseId == -1) return;
    this.positionX = fases[faseId].data[0].x;
    this.positionZ = fases[faseId].data[0].z;
    this.positionY = -fases[faseId].data[0].y;
    this.direction = "right";
    entity.setAttribute(
      "position",
      `${this.positionX} ${this.positionZ} ${this.positionY}`
    );
    entity.setAttribute("rotation", `0 90 0`);
  }
  
   start() {
    if (faseId == -1) return;
    inGame = true;
    let i = 0;
    this.intervalGame = setInterval(() => {
      this.processCommand(commands[i]);
      console.log("oiiiii");
      i++;
      if (i == commands.length) clearInterval(this.intervalGame);
    }, 1000);
  }

  processCommand(command) {
    switch (command) {
      case "walk":
        this.walk();
        break;
      case "rotateRight":
        this.rotate("right");
        break;
      case "rotateLeft":
        this.rotate("left");
        break;
      default:
        return;
    }
  }

  walk() {
    const correct = this.checkCorrectWalk();
    if (!correct){
      clearInterval(this.intervalGame);
      setTimeout(()=>{this.setStartingPosition()},1000)
      return
    };
    this.idPosition++;
    switch (this.direction) {
      case "right":
        this.positionX++;
        entity.setAttribute(
          "position",
          `${this.positionX} ${this.positionZ} ${this.positionY}`
        );
        break;
      case "left":
        this.positionX--;
        entity.setAttribute(
          "position",
          `${this.positionX} ${this.positionZ} ${this.positionY}`
        );
        break;
      case "top":
        this.positionY--;
        entity.setAttribute(
          "position",
          `${this.positionX} ${this.positionZ} ${this.positionY}`
        );
        break;
      case "bottom":
        this.positionY++;
        entity.setAttribute(
          "position",
          `${this.positionX} ${this.positionZ} ${this.positionY}`
        );
        break;
      default:
        return;
    }
  }

  checkCorrectWalk() {
    let newPosition = {x: this.positionX, y: this.positionY}
    if (this.direction == "right") newPosition.x++
    else if (this.direction == "left")newPosition.x--
    else if (this.direction == "top")newPosition.y--
    else if (this.direction == "bottom")newPosition.y++
    for(let i = 0; i < fases[faseId].data.length; i++){
      const coord = fases[faseId].data[i]
      if(coord.x == newPosition.x && coord.y == Math.abs(newPosition.y)) return true
    }
    return false;
  }

  rotate(rotation) {
    const values = { top: 180, right: 90, bottom: 0, left: 270 };
    if (rotation == "right") {
      entity.setAttribute("rotation", `0 ${values[this.direction] - 90} 0`);
      if (this.direction == "top") this.direction = "right";
      else if (this.direction == "right") this.direction = "bottom";
      else if (this.direction == "bottom") this.direction = "left";
      else if (this.direction == "left") this.direction = "top";
    } else {
      entity.setAttribute("rotation", `0 ${values[this.direction] + 90} 0`);
      if (this.direction == "top") this.direction = "left";
      else if (this.direction == "right") this.direction = "top";
      else if (this.direction == "bottom") this.direction = "right";
      else if (this.direction == "left") this.direction = "bottom";
    }
  }
}

const codeBo = new CodeBo();

let intervalCheckStart;
let inGame = false;

const checkStart = () => {
  localStorage.removeItem("play");
  intervalCheckStart = setInterval(() => {
    if (!inGame && localStorage.getItem("play")) {
      clearInterval(intervalCheckStart);
      codeBo.start();
    }
  }, 100);
};

marker.addEventListener("markerFound", () => {
  faseId = parseInt(marker.classList.value.replace("level-", "")) - 1;
  codeBo.setStartingPosition();
  checkStart();
});

marker.addEventListener("markerLost", () => {
  faseId = -1;
  inGame = false;
  clearInterval(intervalCheckStart);
});