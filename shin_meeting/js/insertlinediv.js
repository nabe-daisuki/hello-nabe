class InsertLineDiv{
  static heightWithMargin = 0;

  static getHeightWithMargin(){
    return this.heightWithMargin;
  }

  static setHeightWithMargin(val){
    this.heightWithMargin = val;
  }

  static create(Side, idx) {
    const div = document.createElement('div');
    div.className = 'insert-line';
    if(Side.lines[idx].hided) div.style.display = "none";

    div.onclick = () => {
      Side.insertNewLine(idx);
      Render.rerender();
      Scroll.scrollToLine(Side, idx);
    }

    // 青線
    const line = document.createElement('div');
    line.className = 'green-line';
    div.appendChild(line);

    // 〇ボタン
    const button = document.createElement('button');
    button.className = 'insert-button';
    button.textContent = '＋';
    button.setAttribute("tabindex", "-1");
    
    div.appendChild(button);

    return div;
  }
}