class Side {
  divs = [];
  lines = [];
  inserts = [];

  constructor(_side){
    this.side = _side;
  }

  insertLines(parsedLines){
    this.lines.push(...parsedLines);
  }

  insertDummyLine(count){
    for(let i = 0; i < count; i++){
      const line = {...Line.default};
      line.index = this.lines.length;
      line.side = this.lines.at(-1).side;
      line.startSec = this.lines.at(-1).endSec;
      line.endSec = this.lines.at(-1).endSec;
      line.isDummy = true;
      line.disabled = true;

      this.lines.push(line);
    }
  }

  // insertNewLine(idx) {
  //   const line = {...Line.default};
  //   line.side = this.side;
  //   line.startSec = this.lines[idx].endSec;
  //   line.endSec = this.lines[idx].endSec;
  //   line.isDummy = true;
  //   line.disabled = true;

  //   this.lines.splice(idx + 1, 0, line);

  //   const oppositeSide = Sides.getOppositeSide(this);
  //   const oppositeLine = {...Line.default};
  //   oppositeLine.index = oppositeSide.lines.length;
  //   oppositeLine.side = oppositeSide.side;
  //   oppositeLine.startSec = oppositeSide.lines.at(-1).endSec;
  //   oppositeLine.endSec = oppositeSide.lines.at(-1).endSec;
  //   oppositeLine.isDummy = true;
  //   oppositeLine.disabled = true;

  //   oppositeSide.lines.push(oppositeLine);

  //   this.removeDependentDummyLine();
  //   this.resetLineIndex();
  // }

  // removeDependentDummyLine(){
  //   const oppositeSide = Sides.getOppositeSide(this);
  //   if(!this.lines.at(-1).isDummy || !oppositeSide.lines.at(-1).isDummy) return;
  //   this.lines.pop();
  //   oppositeSide.lines.pop();
  // }

  // resetLineIndex(){
  //   this.lines.forEach( (line, i) => line.index = i );
  // }

  setLineText(editingText, idx){
    const textSpan = this.divs[idx].querySelector("textarea");
    const line = this.lines[idx];

    console.log(editingText);
    if(line.text === editingText){
      line.editedText = null;
      
      textSpan.value = line.text;
      textSpan.classList.remove("edited");
    }else{
      line.editedText = editingText;
      
      textSpan.value = editingText;
      textSpan.classList.add("edited");
    }

    Render.syncRowHeights();
  }

  clearDivs(){
    this.divs.length = 0;
  }

  // clearInterts(){
  //   this.inserts.length = 0;
  // }

  clearLines(){
    this.lines.length = 0;
  }
}