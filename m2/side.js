class Side {
  divs = [];
  lines = [];

  insertDummyLine(count){
    for(let i = 0; i < count; i++){
      const line = {...Line.default};
      line.index = this.lines.length;
      line.side = this.lines.at(-1).side;
      line.startSec = this.lines.at(-1).endSec;
      line.endSec = this.lines.at(-1).endSec;

      this.lines.push(line);
    }
  }

  clearDivs(){
    this.divs.length = 0;
  }
}