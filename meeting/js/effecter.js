class Effecter {
  static preSide = "";
  static preIdx = -1;

  static create(Side, idx){
    const elem = document.createElement("input");
    elem.type = "checkbox";
    elem.style.width = "20px";
    elem.style.cursor = "pointer";
    elem.addEventListener("focus", e => e.target.blur());
    if(Side.lines[idx].disabled) elem.disabled = true;
    if(Side.lines[idx].checked) elem.checked = true;

    elem.onclick = e => {
      if(e.target.checked){
        Side.lines[idx].checked = true;
        if(!KeyBorad.hasShift){ 
          Effecter.preSide = Side.side;
          Effecter.preIdx = idx;
          document.getElementById(`${Side.side}-all-effecter`).checked = true;
          return;
        }
        if(Effecter.preSide !== Side.side || Effecter.preSide === "" ){
          document.getElementById(`${Side.side}-all-effecter`).checked = true;
        }else{
          const minIdx = Math.min(Effecter.preIdx, idx);
          const maxIdx = Math.max(Effecter.preIdx, idx);

          for(let i = minIdx; i < maxIdx; i++){
            Side.divs[i].querySelector("input").checked = true;
          }
        }
        Effecter.preSide = Side.side;
        Effecter.preIdx = idx;
      }else{
        const checkedDiv = Side.divs.find(l => l.querySelector("input").checked);
        Effecter.preSide = "";
        Effecter.preIdx = -1;
        Side.lines[idx].checked = false;
        if(checkedDiv) return;
        document.getElementById(`${Side.side}-all-effecter`).checked = false;
      }
    }
    return elem;
  }

  static check(Side, idx){
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.disabled = true;
  }

  static enable(Side, idx){
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.disabled = false;
  }

  static disable(Side, idx){
    this.uncheck(Side, idx);
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.disabled = true;
  }

  static uncheck(Side, idx){
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.checked = false;
  }
}