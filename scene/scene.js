const marker = document.querySelector("a-marker");
const entity = document.getElementById("codebo");
let faseId = -1;

const codeBo = new CodeBo(marker, entity);

let intervalCheckStart;
let inGame = false;

const checkStart = () => {
  intervalCheckStart = setInterval(() => {
    const commands = JSON.parse(localStorage.getItem("commands"))
    console.log(faseId,commands)
    if (commands && faseId != -1) {
      clearInterval(intervalCheckStart);
      codeBo.start(commands);
      console.log('dentro')
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
  codeBo.lostMarker()
});