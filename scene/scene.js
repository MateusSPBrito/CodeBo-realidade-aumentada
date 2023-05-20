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
  // "walk",
  // "walk",
  "newStack",
  // "walk",
  // "walk",
  // "walk",
  // "rotateRight",
  // "walk",
  // "walk",
  // "rotateLeft",
  // "walk",
  // 'walk',
  'boxStack',
  'boxStack',
  'robotStack',
  
];

class CodeBo {
  constructor() {
    this.positionX = 0;
    this.positionZ = 0;
    this.positionY = 0;
    this.direction = "right";
    this.idPosition = 0;
    this.intervalGame;
    this.stacks = []
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
      case "newStack":
        this.createStack();
        break;
      case "boxStack":
        this.stackUp(false);
        break;
      case "robotStack":
        this.stackUp(true);
        break;
      default:
        return;
    }
  }

  walk() {
    const nextPosition = this.checkNextPosition();
    if (!nextPosition) {
      //erro
      clearInterval(this.intervalGame);
      setTimeout(() => {
        this.setStartingPosition();
      }, 1000);
      return;
    }
    this.idPosition++;

    this.positionX = nextPosition.x;
    this.positionY = nextPosition.y;
    this.positionZ = nextPosition.z;

    entity.setAttribute(
      "position",
      `${this.positionX} ${this.positionZ} ${this.positionY}`
    );
  }

  checkNextPosition() {
    let nextPosition = {
      stack: false,
      x: this.positionX,
      y: this.positionY,
      z: this.positionZ,
    };
    if (this.direction == "right") nextPosition.x++;
    else if (this.direction == "left") nextPosition.x--;
    else if (this.direction == "top") nextPosition.y--;
    else if (this.direction == "bottom") nextPosition.y++;
    
    for(let i = 0; i < this.stacks.length; i++){
      if(this.stacks[i].x == nextPosition.x && Math.abs(this.stacks[i].y) == Math.abs(nextPosition.y)){
        nextPosition.stack = this.stacks[i]
      }
    }
    for (let i = 0; i < fases[faseId].data.length; i++) {
      const coord = fases[faseId].data[i];
      if (coord.x == nextPosition.x && coord.y == Math.abs(nextPosition.y))
        return nextPosition;
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

  createStack() {
    const nextPosition = this.checkNextPosition();
    if (!nextPosition) {
      //erro
      clearInterval(this.intervalGame);
      setTimeout(() => {
        this.setStartingPosition();
      }, 1000);
      return;
    }
    nextPosition.size = 0;
    nextPosition.id = this.stacks.length;
    const newStack = document.createElement("a-box");
    newStack.setAttribute("color", "#838383");
    newStack.setAttribute(
      "position",
      `${nextPosition.x} ${nextPosition.z - 0.5} ${nextPosition.y}`
    );
    newStack.setAttribute("height", 0.01)
    marker.appendChild(newStack);
    delete nextPosition.stack
    this.stacks.push(nextPosition)
  }
  
  stackUp(robot){
    const nextPosition = this.checkNextPosition();
    if (!nextPosition || !nextPosition.stack) {
      //erro
      clearInterval(this.intervalGame);
      setTimeout(() => {
        this.setStartingPosition();
      }, 1000);
      return;
    }
    const stackId = nextPosition.stack.id
    if(robot){
      this.stacks[stackId].size++
      console.log(this.stacks[stackId].z + this.stacks[stackId].size)
      entity.setAttribute(
      "position",
      `${this.stacks[stackId].x} 
      ${this.stacks[stackId].z + this.stacks[stackId].size - 1}
      ${this.stacks[stackId].y}`
    );
    }
    else{
      this.stacks[stackId].size++
      const boxStack = document.createElement("a-box");
      boxStack.setAttribute("color", "#838383");
      boxStack.setAttribute(
      "position",
      `${this.stacks[stackId].x} 
      ${this.stacks[stackId].z + this.stacks[stackId].size - 1}
      ${this.stacks[stackId].y}`
      );
      marker.appendChild(boxStack);
    }
    console.log(this.stacks[stackId])
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
