class Scroll {
  static autoIdx = -1;
  static isAuto = false;

  static init(){
    autoScrollCheckbox.onchange = e => {
      this.isAuto = e.target.checked;
      if(this.isAuto) Selection.isSelectionPulledOnce = false;
    }

    // lPanel.onscroll = () => rPanel.scrollTop = lPanel.scrollTop;
    // rPanel.onscroll = () => lPanel.scrollTop = rPanel.scrollTop;
  }

  static scrollToLine(Side, idx) {
    if(idx !== 0) idx--;

    let lineTopHeight = 0;
    for(let i = 0; i < idx; i++){
      // lineTopHeight += Side.divs[i].offsetHeight + InsertLineDiv.getHeightWithMargin();
      lineTopHeight += Side.divs[i].offsetHeight;
    }
    
    lPanel.scrollTop = lineTopHeight;
    // rPanel.scrollTop = lineTopHeight;
    this.autoIdx = idx;
  }
}