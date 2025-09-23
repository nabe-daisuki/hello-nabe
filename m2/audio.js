class Audio {
  constructor(_Selection, _Hatching) {
    this.selection = _Selection;
    this.hatching = _Hatching;
    this.lSide = this.selection.lSide;
    this.rSide = this.selection.rSide;
  }

  highlightPlayingLine(curTime) {
    const leftIdx = this.lSide.lines
      .findIndex(x => curTime >= x.startSec && curTime < x.endSec && !x.disabled );
    const rightIdx = this.rSide.lines
      .findIndex(x => curTime >= x.startSec && curTime < x.endSec && !x.disabled );
    leftPanel.querySelectorAll('.line').forEach((div, i) => {
      const line = leftLines[i];
      if(line && time >= line.startTime && time < line.endTime){
        div.classList.add("yellow-hatch");
      } else {
        div.classList.remove("yellow-hatch");
      }
    });

    rightPanel.querySelectorAll('.line').forEach((div, i) => {
      const line = rightLines[i];
      if(line && time >= line.startTime && time < line.endTime){
        div.classList.add("yellow-hatch");
      } else {
        div.classList.remove("yellow-hatch");
      }
    });
  }
}