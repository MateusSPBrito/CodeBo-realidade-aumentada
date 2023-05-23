const marker = document.querySelector("a-marker");
const entity = document.getElementById("codebo");
let faseId = -1;

const commands = [
  'walk',
  'walk',
  "walk",
  "rotateRight",
  "walk",
  "walk",
  "rotateLeft",
  "newStack",
  'boxStack',
  'robotStack',
  'unstack',
];

const codeBo = new CodeBo(marker, entity);

let intervalCheckStart;
let inGame = false;

const checkStart = () => {
  localStorage.removeItem("play");
  intervalCheckStart = setInterval(() => {
    if (!inGame && localStorage.getItem("play")) {
      clearInterval(intervalCheckStart);
      codeBo.start(commands);
    }
  }, 100);
};

marker.addEventListener("markerFound", () => {
  faseId = parseInt(marker.classList.value.replace("level-", "")) - 1;
  codeBo.setStartingPosition(faseId);
  checkStart();
});

marker.addEventListener("markerLost", () => {
  faseId = -1;
  inGame = false;
  clearInterval(intervalCheckStart);
});