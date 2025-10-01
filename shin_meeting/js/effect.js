class Effect {
  static init(){
    checkedShow.onclick = () => this.show();

    checkedHide.onclick = () => this.hide();
  }

  static hide(){
    for(let i = 0; i < lSide.lines.length; i++){
      const lCheck = lSide.divs[i].querySelector("input");
      // const rCheck = rSide.divs[i].querySelector("input");

      if(lCheck.checked){
        lSide.divs[i].querySelector(".timestamp").style.display = "none";
        lSide.divs[i].querySelector(".FlexTextarea").style.display = "none";
        // rSide.divs[i].querySelector(".timestamp").style.display = "none";
        // rSide.divs[i].querySelector(".FlexTextarea").style.display = "none";
        
        // lSide.inserts[i].style.display = "none";
        // rSide.inserts[i].style.display = "none";

        lCheck.checked = false;
        // rCheck.checked = false;

        lSide.lines[i].hided = true;
        // rSide.lines[i].hided = true;
      }
      // if(lCheck.checked && rCheck.checked
      //   || lCheck.checked && rSide.lines[i].isDummy 
      //   || rCheck.checked && lSide.lines[i].isDummy){
      //   lSide.divs[i].querySelector(".timestamp").style.display = "none";
      //   lSide.divs[i].querySelector(".FlexTextarea").style.display = "none";
      //   rSide.divs[i].querySelector(".timestamp").style.display = "none";
      //   rSide.divs[i].querySelector(".FlexTextarea").style.display = "none";
        
      //   lSide.inserts[i].style.display = "none";
      //   rSide.inserts[i].style.display = "none";

      //   lCheck.checked = false;
      //   rCheck.checked = false;

      //   lSide.lines[i].hided = true;
      //   rSide.lines[i].hided = true;
      // }

      Render.syncRowHeights();
    }

    const restLCheck = lSide.divs.find(l => l.querySelector("input").checked);
    if(!restLCheck) document.getElementById("left-all-effecter").checked = false;

    // const restRCheck = rSide.divs.find(l => l.querySelector("input").checked);
    // if(!restRCheck) document.getElementById("right-all-effecter").checked = false;
  }

  static show(){
    for(let i = 0; i < lSide.lines.length; i++){
      const lCheck = lSide.divs[i].querySelector("input");
      // const rCheck = rSide.divs[i].querySelector("input");

      if(lCheck.checked){
        lSide.divs[i].querySelector(".timestamp").style.display = "block";
        lSide.divs[i].querySelector(".FlexTextarea").style.display = "block";
        // rSide.divs[i].querySelector(".timestamp").style.display = "block";
        // rSide.divs[i].querySelector(".FlexTextarea").style.display = "block";

        // lSide.inserts[i].style.display = "flex";
        // rSide.inserts[i].style.display = "flex";

        lCheck.checked = false;
        // rCheck.checked = false;

        lSide.lines[i].hided = false;
        // rSide.lines[i].hided = false;
      }
      // if(lCheck.checked && rCheck.checked
      //   || lCheck.checked && rSide.lines[i].isDummy 
      //   || rCheck.checked && lSide.lines[i].isDummy){
      //   lSide.divs[i].querySelector(".timestamp").style.display = "block";
      //   lSide.divs[i].querySelector(".FlexTextarea").style.display = "block";
      //   rSide.divs[i].querySelector(".timestamp").style.display = "block";
      //   rSide.divs[i].querySelector(".FlexTextarea").style.display = "block";

      //   lSide.inserts[i].style.display = "flex";
      //   rSide.inserts[i].style.display = "flex";

      //   lCheck.checked = false;
      //   rCheck.checked = false;

      //   lSide.lines[i].hided = false;
      //   rSide.lines[i].hided = false;
      // }

      Render.syncRowHeights();
    }

    const restLCheck = lSide.divs.find(l => l.querySelector("input").checked);
    if(!restLCheck) document.getElementById("left-all-effecter").checked = false;
    // const restRCheck = rSide.divs.find(l => l.querySelector("input").checked);
    // if(!restRCheck) document.getElementById("right-all-effecter").checked = false;
  }
}