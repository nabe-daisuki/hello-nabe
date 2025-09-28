class InvalidBtn {
  static create(Side, div, idx){
    const line = Side.lines[idx];
    
    const elem = document.createElement("span");
    elem.className = "invalid-button";
    if(line.isDummy) {
      elem.textContent = "×解除不可";
      elem.classList.add("disabled");
    }else{
      elem.textContent = '×';
    }

    elem.onclick = e => {
      if(line.isDummy) return;
      line.disabled = !line.disabled;
      if(line.disabled){
        e.target.textContent = "×解除";
        Hatching.remove(Side, idx);
        Effecter.disable(Side, idx);
        div.classList.add("disabled");
        line.disabled = true;
        line.color = null;
      }else{
        e.target.textContent = "×";
        Effecter.enable(Side, idx);
        div.classList.remove("disabled");
        line.disabled = false;
      }
      Render.syncRowHeights();
    }

    return elem;
  }
}