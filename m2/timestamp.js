class TimeStamp {
  constructor(_Audio, _Scroll, _line) {
    this.Audio = _Audio;
    this.Scroll = _Scroll;
    this.Selection = _Audio.selection;
    this.line = _line;
    this.elem = document.createElement("span");
    this.elem.className = "timestamp";
    this.elem.textContent = `[${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}]`;
    this.elem.onclick = () => {
      this.Selection.relocateHighlight(this.line);
      this.Audio.curTime = this.line.startSec;
      this.Scroll.scrollToLine(this.line);
    }
  }
}