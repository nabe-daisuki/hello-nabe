class TimeStamp {
  static create(Side, idx) {
    const line = Side.lines[idx];
    const elem = document.createElement("span");
    elem.className = "timestamp";
    elem.textContent = `[${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}]`;
    if(Side.lines[idx].hided) elem.style.display = "none";
    
    elem.onclick = () => {
      Selection.relocateHighlight(Side, idx);
      audio.currentTime = line.startSec;
      if(!Scroll.isAuto) Scroll.scrollToLine(Side, idx);
    }
    return elem;
  }
}