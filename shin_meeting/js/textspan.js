class TextSpan {
  static selectionStr = {
    start: -1,
    end: -1
  }

  static create(Side, idx){
    const line = Side.lines[idx];

    const textSpanBody = this.createElem("div", "FlexTextarea");
    if(Side.lines[idx].hided) textSpanBody.style.display = "none";

    const textSpanDummy = this.createElem("div", "text FlexTextarea__dummy");
    const textSpan = this.createElem("textarea", "text FlexTextarea__textarea");
    textSpan.textContent = line.editedText || line.text;
    textSpan.oninput = e => {
      textSpanDummy.textContent = e.target.value + '\u200b';
    }
    if(line.editedText) textSpan.classList.add("edited");

    textSpan.oncontextmenu = e => {
      const elem = e.target;
      if(elem.selectionStart === elem.selectionEnd) return;

      TextSpan.selectionStr.start = elem.selectionStart;
      TextSpan.selectionStr.end = elem.selectionEnd;

      console.log(TextSpan.selectionStr.start);
      console.log(TextSpan.selectionStr.end);
      
      if(TextSpan.selectionStr.start === -1) return;

      const textSpan = e.target;
      const prefix = textSpan.value.slice(0, TextSpan.selectionStr.start);
      const surfix = textSpan.value.slice(TextSpan.selectionStr.end)
      const replacedText = prefix + surfix;
      textSpan.textContent = replacedText;

      Side.setLineText(replacedText, idx);

      TextSpan.initSelection();

      e.stopPropagation();
      e.preventDefault();
    }
    textSpan.addEventListener("focusin", () => {
      Selection.relocateHighlight(Side, idx);
    });
    textSpan.addEventListener("focusout", e => {
      Side.setLineText(e.target.value, idx);
    });
    textSpan.addEventListener('mousedown', e => {
      // ミドルクリック
      if (e.button !== 1) return;

      const elem = e.target;
      if(elem.selectionStart === 0 && elem.selectionEnd === 0) return;

      TextSpan.selectionStr.start = elem.selectionStart;
      TextSpan.selectionStr.end = elem.selectionEnd;
      
      if(TextSpan.selectionStr.start === -1) return;
      e.preventDefault();

      ContextMenu.show(e.clientX, e.clientY);
    });

    textSpanBody.appendChild(textSpanDummy);
    textSpanBody.appendChild(textSpan);

    return textSpanBody;
  }

  static createElem(tagName, className){
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
  }

  static initSelection(){
    this.selectionStr.start = -1;
    this.selectionStr.end = -1;
  }
}
