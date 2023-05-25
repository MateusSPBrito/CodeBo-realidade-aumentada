class CodeBo {
  constructor(marker, entity) {
    this.marker = marker;
    this.entity = entity;
    this.faseId = -1;
    this.positionX = 0;
    this.positionZ = 0;
    this.positionY = 0;
    this.direction = "right";
    this.stacks = [];
    this.currentStack = -1;
    this.intervalGame;
  }
  
  setStartingPosition(faseId) {
    this.visible = true;
    this.faseId = faseId;
    localStorage.removeItem("play");
    if (this.faseId == -1) return;
    this.positionX = fases[this.faseId].data[0].x;
    this.positionZ = fases[this.faseId].data[0].z;
    this.positionY = -fases[this.faseId].data[0].y;
    this.direction = "right";
    this.entity.setAttribute(
      "position",
      `${this.positionX} ${this.positionZ} ${this.positionY}`
    );
    this.entity.setAttribute("rotation", `0 90 0`)
  }

   start(commands) {
    if (this.faseId == -1) return;
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
      case 'unstack':
        this.unstack();
        break;
      default:
        return;
    }
  }

  walk() {
    const nextPosition = this.checkNextPosition();
    if (!nextPosition || nextPosition.stack || this.currentStack != -1) {
      this.erro("walk");
      return;
    }
    const actualPosition = { x: this.positionX, y: this.positionY, z: this.positionZ }
    this.animation(this.entity, "position", actualPosition, nextPosition);

    this.positionX = nextPosition.x;
    this.positionY = nextPosition.y;
    this.positionZ = nextPosition.z;
  }

  rotate(rotation) {
    const values = { top: 180, right: 90, bottom: 0, left: 270 };
    if (rotation == "right") {
      this.animation(this.entity, "rotation", {x: 0, y: 0, z:values[this.direction]}, {x: 0, y: 0, z:values[this.direction] - 90})
      
      if (this.direction == "top") this.direction = "right";
      else if (this.direction == "right") this.direction = "bottom";
      else if (this.direction == "bottom") this.direction = "left";
      else if (this.direction == "left") this.direction = "top";
    } else {
      this.animation(this.entity, "rotation", {x: 0, y: 0, z:values[this.direction]}, {x: 0, y: 0, z:values[this.direction] + 90})
      
      if (this.direction == "top") this.direction = "left";
      else if (this.direction == "right") this.direction = "top";
      else if (this.direction == "bottom") this.direction = "right";
      else if (this.direction == "left") this.direction = "bottom";
    }
  }

  createStack() {
    const nextPosition = this.checkNextPosition();
    if (!nextPosition) {
      this.erro("creatStack");
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
    newStack.setAttribute("height", 0.01);
    this.marker.appendChild(newStack);
    delete nextPosition.stack;
    this.stacks.push(nextPosition);
  }

  stackUp(robot) {
    const nextPosition = this.checkNextPosition();
    if (!nextPosition || !nextPosition.stack) {
      this.erro("stackUp");
      return;
    }
    const stackId = nextPosition.stack.id;
    this.stacks[stackId].size++;
    
    const newPosition = `${this.stacks[stackId].x} ${this.stacks[stackId].z + this.stacks[stackId].size - 1} ${this.stacks[stackId].y}`
    if (robot) {
      this.entity.setAttribute("position", newPosition);
      this.positionX = this.stacks[stackId].x;
      this.positionZ = this.stacks[stackId].z + this.stacks[stackId].size - 1;
      this.positionY = this.stacks[stackId].y;
      this.currentStack = stackId
    }
    else {
      const boxStack = document.createElement("a-box");
      boxStack.setAttribute("color", "#838383");
      boxStack.setAttribute("position", newPosition);
      boxStack.setAttribute("class", `stack${stackId}id${this.stacks[stackId].size}`);
      this.marker.appendChild(boxStack);
    }
  }
  
  unstack(){
    const nextPosition = this.checkNextPosition();
    if (!nextPosition) {
      this.erro("unstack1");
      return;
    }
    if(this.currentStack != -1){ //desempilha codebo
      const stack = this.stacks[this.currentStack]
      if(nextPosition.z + 1 != stack.z + stack.size) { //nivel da pilha diferente do nivel do terreno
        this.erro('unstack2')
        return
      }
      const actualPosition = { x: this.positionX, y: this.positionY, z: this.positionZ }
      this.animation(this.entity, "position", actualPosition, nextPosition);
      this.positionX = nextPosition.x;
      this.positionY = nextPosition.y;
      this.positionZ = nextPosition.z;
      this.stacks[this.currentStack].size--
      this.currentStack = -1;
    } 
    else { //desempilha bloco
      if(!nextPosition.stack){
        this.erro('unstack3')
        return
      }
      const stackId = nextPosition.stack.id;
      const box = document.querySelector(`.stack${stackId}id${this.stacks[stackId].size}`)
      box.remove()
      this.stacks[stackId].size--
    }
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

    for (let i = 0; i < this.stacks.length; i++) {
      //percorre para ver se a proxima posição é uma pilha
      if (
        this.stacks[i].x == nextPosition.x &&
        Math.abs(this.stacks[i].y) == Math.abs(nextPosition.y)
      )
        nextPosition.stack = this.stacks[i];
    }
    for (let i = 0; i < fases[this.faseId].data.length; i++) {
      //percorre para ver se a proxima posição é valida
      const coord = fases[this.faseId].data[i];
      if (coord.x == nextPosition.x && coord.y == Math.abs(nextPosition.y) && coord.z == nextPosition.z)
        return nextPosition;
    }
    return false; // proxima posição invalida
  }

  animation(element, attribute, actualValue, endValue) {
    const somaX = (endValue.x - actualValue.x)/50;
    const somaY = (endValue.y - actualValue.y)/50
    const somaZ = (endValue.z - actualValue.z)/50
    let i = 0;
    
    let animationInterval = setInterval(() => {
      actualValue.x = actualValue.x + somaX
      actualValue.y = actualValue.y + somaY
      actualValue.z = actualValue.z + somaZ
      element.setAttribute(attribute, `${actualValue.x} ${actualValue.z} ${actualValue.y}`)
      i++;
      if (i == 50) clearInterval(animationInterval);
    }, 10);
  }

  erro(message) {
    console.log(message);
    clearInterval(this.intervalGame);
    setTimeout(() => {
      this.setStartingPosition(this.faseId);
    }, 1000);
  }
  
  lostMarker(){
    clearInterval(this.intervalGame);
    this.stacks = [];
    this.currentStack = -1;
  }
}