const btns = [
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_new.png?v=1684875531011', command: 'newStack'},
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_block_push.png?v=1684875533343', command: 'boxStack'},
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_character_push.png?v=1684875533679', command: 'robotStack'},
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_pop.png?v=1684875531362', command: 'unstack'},
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_forward.png?v=1684875603575', command: 'walk'},
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_left.png?v=1684875532237', command: 'rotateLeft'},
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_right.png?v=1684875532935', command: 'rotateRight'},
  {img: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_play.png?v=1684875532564', command: 'play'}
]

const iptImgs = {
  newStack: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_new_mini.png?v=1684953104772',
  boxStack: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_block_push_mini.png?v=1684953105440',
  robotStack: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_character_push_mini.png?v=1684953105112',
  unstack: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_stack_pop_mini.png?v=1684953104405',
  walk: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_forward_mini.png?v=1684953104039',
  rotateLeft: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_left_mini.png?v=1684953103691',
  rotateRight: 'https://cdn.glitch.global/f1b6a269-6e6a-4759-8e69-14c7e827fa7f/button_right_mini.png?v=1684953103335',
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