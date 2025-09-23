class Selection {
  idx = 0;
  side = "left";
  preIdx = 0;
  preSide = "left";
  
  isSelectionPulledOnce = false;

  constructor(_LSide, _RSide){
    this.lSide = _LSide;
    this.rSide = _RSide;
  }

  //
  // 赤線表示
  //
  highlight(div){
    div.classList.add("selected");
  }

  unhighlight(div){
    div.classList.remove("selected");
  }

  //
  // 行は見えるか
  //
  isInViewport(div) {
    const rect = div.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const panelHeaderHeight = document.querySelector(".panel-header").offsetHeight;
    return (
      rect.top > panelRect.top + panelHeaderHeight &&
      rect.bottom < panelRect.bottom
    );
  }

  //
  // 赤線表示先の整理
  //
  calcSelectionParam(div){
    if(this.isInViewport(div)) return;
    this.isSelectionPulledOnce = true;
    this.idx = AutoScroll.idx;
  }

  //
  // 赤線表示の再配置
  //
  relocateHighlight(div){
    this.calcSelectionParam(div);

    if(this.preSide === "left") this.unhighlight(lDivs[this.preIdx]);
    else this.unhighlight(rDivs[this.preIdx]);

    if(this.side === "left") this.highlight(lDivs[this.idx]);
    else this.highlight(rDivs[this.idx]);

    this.preIdx = this.idx;
    this.preSide = this.side;
  }
}