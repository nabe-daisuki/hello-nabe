class KeyBorad {
  static hasShift = false;
}


document.addEventListener("keydown", e => {
  if(e.shiftKey){
    KeyBorad.hasShift = true;
  }


  if(e.ctrlKey){
    switch(e.key){
      case '6':
        console.log("ctrl+6");
        audio.currentTime = Math.max(0, audio.currentTime + 2);
        e.preventDefault();
        break;
      case '3':
        console.log("ctrl+3");
        audio.currentTime = Math.max(0, audio.currentTime - 3);
        e.preventDefault();
        break;
      case '2':
        console.log("ctrl+2");
        audio.playbackRate = 1.3;
        e.preventDefault();
        break;
      case '1':
        console.log("ctrl+1");
        audio.playbackRate = 1.0; // 元の速度に戻す
        e.preventDefault();
        break;
    }
  }

  switch(e.key){
    case "F12":
      if(!namedSaveBtn.disabled) Save.namedSave();
      e.preventDefault();
      break;
    case "Alt":
      e.preventDefault();
      if(audio.paused) audio.play();
      else audio.pause();
      break;
    default:
      break;
  }

  // Ctrl+Shift+S
  if (e.key === 'S' && e.ctrlKey && e.shiftKey) {
    if(!namedSaveBtn.disabled) Save.namedSave();
    e.preventDefault();
    return;
  }
  
  // Ctrl+S
  if (e.key.toLowerCase() === 's' && e.ctrlKey && !e.shiftKey) {
    if(!saveBtn.disabled) Save.defaultSave();
    e.preventDefault();
    return;
  }
  
});

document.addEventListener("keyup", e => {
  if(e.shiftKey){
    KeyBorad.hasShift = false;
  }
});