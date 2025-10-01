class Hatching {
  static Sides;

  static init(){
    checkGreenHatch.onclick = () => {
      for(let i = 0; i < lSide.lines.length; i++){
        const lCheck = lSide.divs[i].querySelector("input");
        // const rCheck = rSide.divs[i].querySelector("input");

        if(lCheck.checked){
          Hatching.remove(lSide, i);
          Hatching.green(lSide, i);
          Effecter.uncheck(lSide, i);
        }
        // if(rCheck.checked){
        //   Hatching.remove(rSide, i);
        //   Hatching.green(rSide, i);
        //   Effecter.uncheck(rSide, i);
        // }
      }
      document.getElementById("left-all-effecter").checked = false;
      // document.getElementById("right-all-effecter").checked = false;
    }
  }

  static setSides(_Sides){
    this.Sides = _Sides;
  }

  static remove(Side, idx, isYellow = false){
    const div = Side.divs[idx];
    if(!isYellow){
      div.classList.remove("red-hatch");
      div.classList.remove("green-hatch");
      Side.lines[idx].color = null;
    }else{
      div.classList.remove("yellow-hatch");
    }
  }

  static green(Side, idx){
    const div = Side.divs[idx];
    const line = Side.lines[idx];
      
    if(line.disabled) return;

    if(div.classList.contains("red-hatch")){
      // this.remove(Sides.getOppositeSide(Side), idx);
      this.remove(Side, idx);
    }
    
    if(div.classList.contains("green-hatch")){
      this.remove(Side, idx);
    }else{
      div.classList.add("green-hatch");
      Side.lines[idx].color = "g";
    }
  }

  static red(Side, idx){
    const div = Side.divs[idx];
    if(div.classList.contains("green-hatch")) this.remove(Side, idx);

    div.classList.add("red-hatch");
    Side.lines[idx].color = "r";
  }

  static yellow(div){
    div.classList.add("yellow-hatch");
  }
}