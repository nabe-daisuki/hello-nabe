class Selection {
  static idx = 0;
  static side = "left";
  static preIdx = 0;
  static preSide = "left";
  
  static isSelectionPulledOnce = false;

  static setSides(_Sides){
    this.Sides = _Sides;
  }

  //
  // 赤線表示
  //
  static highlight(div){
    div.classList.add("selected");
  }

  static unhighlight(div){
    div.classList.remove("selected");
  }

  //
  // 行は見えるか
  //
  static isInViewport(div) {
    const rect = div.getBoundingClientRect();
    const panelRect = comparisonContainer.getBoundingClientRect();
    const panelHeaderHeight = PanelHeader.getHeight();
    return (
      rect.top > panelRect.top + panelHeaderHeight &&
      rect.bottom < panelRect.bottom
    );
  }

  //
  // 赤線表示先の整理
  //
  static calcSelectionParam(div){
    if(this.isInViewport(div)) return;
    this.isSelectionPulledOnce = true;
    this.idx = Scroll.autoIdx;
  }

  //
  // 赤線表示の再配置
  //
  static relocateHighlight(Side, idx){
    this.side = Side.side;
    this.idx = idx;

    const div = Side.divs[idx];
    // const oppositeSide = Sides.getOppositeSide(Side);
    this.calcSelectionParam(div);

    // if(this.preSide === Side.side) this.unhighlight(Side.divs[this.preIdx]);
    // else this.unhighlight(oppositeSide.divs[this.preIdx]);
    this.unhighlight(Side.divs[this.preIdx]);

    this.highlight(Side.divs[this.idx]);

    this.preIdx = this.idx;
    this.preSide = this.side;
  }
}