class Hatching {
  constructor(_lSide, _rSide) {
    this.lSide = _lSide;
    this.rSide = _rSide;
  }

  remove(div = null, side, idx){
    if(!div){
      div = side === "left"
        ? this.lSide.divs[idx]
        : this.rSide.divs[idx];
    }
    div.classList.remove("red-hatch");
    div.classList.remove("green-hatch");
    if(side === "left") this.lSide.lines[idx].color = null;
    else this.lSide.lines[idx].color = null;
  }

  green(div, side, idx){
    let line = side === "left"
      ? this.lSide.lines[idx]
      : this.rSide.lines[idx];
      
    if(line.disabled) return;

    if(div.classList.contains("red-hatch")){
      if(side === "left") this.remove(undefined, "right", idx);
      else this.remove(undefined, "left", idx);
      this.remove(div, side, idx);
    }
    
    if(div.classList.contains("green-hatch")){
      this.remove(div, side, idx);
    }else{
      div.classList.add("green-hatch");
      if(side === "left") this.lSide.lines[idx].color = "g";
      else this.lSide.lines[idx].color = "g";
    }
  }

  red(div, side, idx){
    if(div.classList.contains("green-hatch")) this.remove(div, side, idx);

    div.classList.add("red-hatch");
    if(side === "left") this.lSide.lines[idx].color = "r";
    else this.lSide.lines[idx].color = "r";
  }

  yellow(div){
    div.classList.add("yellow-hatch");
  }
}