const btns = [
  {img: './assets/imgs/button_stack_new.png', command: 'newStack'},
  {img: './assets/imgs/button_stack_block_push.png', command: 'boxStack'},
  {img: './assets/imgs/button_stack_character_push.png', command: 'robotStack'},
  {img: './assets/imgs/button_stack_pop.png', command: 'unstack'},
  {img: './assets/imgs/button_forward.png', command: 'walk'},
  {img: './assets/imgs/button_left.png', command: 'rotateLeft'},
  {img: './assets/imgs/button_right.png', command: 'rotateRight'},
  {img: './assets/imgs/button_play.png', command: 'play'}
]

const iptImgs = {
  newStack: './assets/imgs/button_stack_new_mini.png',
  boxStack: './assets/imgs/button_stack_block_push_mini.png',
  robotStack: './assets/imgs/button_stack_character_push_mini.png',
  unstack: './assets/imgs/button_stack_pop_mini.png',
  walk: './assets/imgs/button_forward_mini.png',
  rotateLeft: './assets/imgs/button_left_mini.png',
  rotateRight: './assets/imgs/button_right_mini.png',
}

const commands = []

const generateBtns = () =>{
  for(let i = 0; i < btns.length; i++){
    let btn = document.createElement('button');
    btn.setAttribute('class', 'btn-command')
    btn.style.backgroundImage=`url(${btns[i].img})`
    if(btns[i].command == 'play') btn.addEventListener("click", ()=>{start()});
    else btn.addEventListener("click", ()=> {addCommand(btns[i].command)});
    document.getElementById('commands-btns').appendChild(btn)
  }
}

const generateIpts = () =>{
  for(let i = 0; i < 16; i++){
    let ipt = document.createElement('div');
    ipt.setAttribute('class', `ipt-command`)
    ipt.setAttribute('id', `i${i}`)
    ipt.addEventListener("click", ()=>{removeCommand(i)});
    document.getElementById('commands-inputs').appendChild(ipt)
  }
}

const addCommand = (command) => {
  if(commands.length >= 16) return
  commands.push(command)
  document.getElementById(`i${commands.length - 1}`).style.backgroundImage=`url(${iptImgs[command]})`
}

const removeCommand = (index) => {
  if(index >= commands.length) return
  commands.splice(index, 1)
  for(let i = index; i < commands.length; i++){
    document.getElementById(`i${i}`).style.backgroundImage=`url(${iptImgs[commands[i]]})`
  }
  document.getElementById(`i${commands.length}`).style.backgroundImage=`none`
}

const start = () => {
  localStorage.setItem("commands", `${JSON. stringify(commands)}`);
  document.getElementById('commands-container').style.display = 'none'
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', './scene/scene.html')
  document.querySelector('body').appendChild(iframe)
}

const clearStorage = () => {localStorage.clear();}
clearStorage()

generateBtns()
generateIpts()