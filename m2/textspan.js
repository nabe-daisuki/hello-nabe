class TextSpan {
  constructor(_Hatching, _line, _side, _idx){
    this.hatching = _Hatching;
    this.line = _line;
    this.side = _side;
    this.idx = _idx;
    this.elem = createElem("div", "FlexTextarea");
    const textSpanDummy = createElem("div", "text FlexTextarea__dummy");
    const textSpan = createElem("textarea", "text FlexTextarea__textarea")
    textSpan.textContent = this.line.editedText || this.line.text;
    if(this.line.editedText) textSpan.classList.add("edited");

    textSpan.oncontextmenu = this.contextmenuEvent;
  }

  createElem(tagName, className){
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
  }

  contextmenuEvent(){
    this.hatching.green(e.target, this.side, this.idx);
    e.preventDefault();
  }
}


    // 無効化ボタン
    const invalidButton = document.createElement("span");
    invalidButton.className = "invalid-button";
    invalidButton.textContent = '×';
    invalidButton.onclick = (e) => {
      line.disabled = !line.disabled;
      if(line.disabled){
        e.target.textContent = "×解除";
        if(e.target.parentElement.classList.contains("red-hatch")){
          const div = e.target.parentElement;
          div.parentElement.classList.remove("red-hatch");

          const otherDiv = (div === leftDivs[index]) ? rightDivs[index] : leftDivs[index];
          otherDiv.classList.remove("red-hatch");
          otherDiv.classList.add("green-hatch");
          const otherLine = (div === leftDivs[index]) ? rightLines[index] : leftLines[index];
          otherLine.color = "g";
        }

        div.classList.remove("green-hatch");
        div.classList.add("disabled");
        line.color = null;
      }else{
        e.target.textContent = "×";
        e.target.parentElement.classList.remove("disabled");
      }
      syncRowHeights();
    };