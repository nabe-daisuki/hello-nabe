class PanelHeader {
  static height = 0;
  static getHeight(){
    return this.height;
  }

  static setHeight(val){
    this.height = val;
  }

  static create(textFile){
    const elem = document.createElement("div");
    elem.className = "panel-header";

    const allEffecter = document.createElement("input");
    allEffecter.type = "checkbox";
    allEffecter.style.width = "20px";
    allEffecter.onclick = e => {
      const Side = textFile.side === "left" ? lSide : rSide;
      if(e.target.checked){
        Side.divs.forEach( (l, i) => {
          if(Side.lines[i].disabled) return;
          l.querySelector("input").checked = true
        });
      }else{
        Side.divs.forEach(l => l.querySelector("input").checked = false);
      }
    }

    const fileName = document.createElement("span");
    if(textFile.side === "left"){
      allEffecter.id = "left-all-effecter";
      fileName.textContent = `${textFile.name}`;
    }else{
      allEffecter.id = "right-all-effecter";
      fileName.textContent = `②${textFile.name}`;
    }

    elem.appendChild(allEffecter);
    elem.appendChild(fileName);
    return elem;
  }
}