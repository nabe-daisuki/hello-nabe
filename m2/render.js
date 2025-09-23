class Render {
  leftDivs = [];
  rightDivs = [];

  leftLines = [];
  rightLines = [];

  constructor(_Audio, _Scroll){
    this.audio = _Audio;
    this.scroll = _Scroll;
    this.lSide = _LSide;
    this.rSide = _RSide;
  }

  //
  // 行記述解析かつステータス登録
  //
  parseLine(preline, i, side) {
    const match = preline.match(/\[(\d+):(\d+):(\d+) -> (\d+):(\d+):(\d+)\] (.*)/);
    if (!match) return null;
    const [, sh, sm, ss, eh, em, es, text] = match;
    const line = {...Line.default};
    line.index = i;
    line.side = side;
    line.startSec = +sh*3600 + +sm*60 + +ss;
    line.endSec = +eh*3600 + +em*60 + +es;
    line.text = text;
    return line;
    // return {
    //   index: i,
    //   side,
    //   startTime: +sh*3600 + +sm*60 + +ss,
    //   endTime: +eh*3600 + +em*60 + +es,
    //   text,
    //   editedText: null,
    //   disabled: false,
    //   color: null,
    //   isDammy: false
    // };
  }

  parseFile(file){
    const reader = new FileReader();

    reader.onload = e => {
      const lines = e.target.result
        .split('\n')
        .map( (line, i) => this.parseLine(line, i, file.side))
        .filter(Boolean);
      if(file.side === "left") this.lSide.lines = lines;
      else this.rSide.lines = lines;

      // if(!leftLines.length || !rightLines.length) return;
      // leftPanel.innerHTML = "";
      // rightPanel.innerHTML = "";
      // document.getElementById("text-file-names").innerHTML = `①${leftFileName}<br>②${rightFileName}`;
      // render();
      // document.getElementById("save-btn").classList.remove("btn-disabled");
      // document.getElementById("save-btn").disabled = false;
      // document.getElementById("named-save-btn").classList.remove("btn-disabled");
      // document.getElementById("named-save-btn").disabled = false;
    };
    reader.readAsText(file);
  }

  createPanelHeader(file){
    const panelHeader = document.createElement("div");
    panelHeader.className = "panel-header";
    if(file.side === "left") panelHeader.textContent = `①${file.name}`;
    else panelHeader.textContent = `②${file.name}`;

    return panelHeader;
  }

  createDiv(line, index, side) {
    const div = document.createElement('div');
    div.className = "line";
    if(line.disabled) div.classList.add("disabled");
    if(line.color === "g") div.classList.add("green-hatch");
    if(line.color === "r") div.classList.add("red-hatch");

    // タイムスタンプ
    const ts = new TimeStamp(this.audio, this.scroll, this.line);
    // const ts = document.createElement('span');
    // ts.className = 'timestamp';
    // ts.textContent = `[${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}]`;
    // ts.onclick = () => {
    //   .relocateHighlight();
    //   audio.currentTime = line.startTime;
    //   scrollToLine(index);
    // }

    // テキスト(起こされた文字)
    const textSpan = document.createElement('textarea');
    textSpan.className = 'text FlexTextarea__textarea';
    textSpan.textContent = line.editedText || line.text;
    if(line.editedText) textSpan.classList.add("edited");

    const textSpanDummy = document.createElement("div");
    textSpanDummy.className = "FlexTextarea__dummy";
    textSpanDummy.setAttribute("aria-hidden", "true");

    const textSpanBody = document.createElement("div");
    textSpanBody.className = "FlexTextarea";

    // テキストの右クリックイベント
    textSpan.oncontextmenu = (e) => {
      e.preventDefault();
      if(line.disabled) return;

      const div = textSpan.parentElement.parentElement;
      const idx = index;
      const leftDiv = leftDivs[idx];
      const rightDiv = rightDivs[idx];

      // 赤ハッチなら、右クリックした側を緑、反対はハッチ削除
      if(div.classList.contains("red-hatch")){
        div.classList.remove("red-hatch");
        div.classList.add("green-hatch");
        const line = (div === leftDiv) ? leftLines[idx] : rightLines[idx];
        line.color = "g";

        const otherDiv = (div === leftDiv) ? rightDiv : leftDiv;
        otherDiv.classList.remove("red-hatch");
        const otherLine = (div === leftDiv) ? rightLines[idx] : leftLines[idx];
        otherLine.color = "r";
        return;
      }

      // 通常の緑ハッチトグル
      div.classList.toggle("green-hatch");

      if(div.classList.contains("green-hatch")) line.color = "g";
      else line.color = null;
    }

    // テキストのダブルクリックイベント
    // textSpan.ondblclick = () => {
    //   const line = side === "left" ? leftLines[index] : rightLines[index];

    //   selectedRow = index;
    //   selectedSide = side;
    //   highlightSelectedDiv();
    //   openEditModal(line);
    // }

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

    div.appendChild(ts);
    textSpanBody.appendChild(textSpanDummy);
    textSpanBody.appendChild(textSpan);
    div.appendChild(textSpanBody);
    div.appendChild(invalidButton);
    
    document.querySelectorAll('.FlexTextarea').forEach(flexTextarea);

    return div;
  }

  render(lFile, rFile) {
    this.parseFile(lFile);
    this.parseFile(rFile);

    const lLinesLen = this.lSide.lines.length;
    const rLinesLen = this.rSide.lines.length;
    if(!lLinesLen || !rLinesLen){
      alert("ファイルの読み込みに失敗しました。");
      return;
    }

    if(lLinesLen !== rLinesLen){
      const diffCount = Math.abs(lLinesLen - rLinesLen)
      if(lLinesLen > rLinesLen) this.rSide.lines.insertDummy(diffCount);
      else this.lSide.lines.insertDummy(diffCount);
    }

    const flag = document.createDocumentFragment();

    const leftPanelHeader = this.createPanelHeader(lFile);
    flag.appendChild(leftPanelHeader);
    const rightPanelHeader = this.createPanelHeader(rFile);
    flag.appendChild(rightPanelHeader);

    this.lSide.clearDivs();
    this.rSide.clearDivs();

    // パネルヘッダー(ファイル名)の挿入
    // const leftPanelHeader = document.createElement("div");
    // leftPanelHeader.classList.add("panel-header");
    // leftPanelHeader.textContent = `①${leftFileName}`;
    // leftPanel.appendChild(leftPanelHeader);

    // const rightPanelHeader = document.createElement("div");
    // rightPanelHeader.classList.add("panel-header");
    // rightPanelHeader.textContent = `②${rightFileName}`;
    // rightPanel.appendChild(rightPanelHeader);

    // leftDivs = [];
    // rightDivs = [];

    const maxLen = Math.max(lLinesLen, rLinesLen);

    for (let i = 0; i < maxLen; i++) {
      const leftLine = leftLines[i] || { text:'', disabled:true };
      const rightLine = rightLines[i] || { text:'', disabled:true };

      const leftDiv = createLineDiv(leftLine, i, "left");
      const rightDiv = createLineDiv(rightLine, i, "right");

      leftPanel.appendChild(leftDiv);
      rightPanel.appendChild(rightDiv);

      const leftInsertDiv = createInsertLineDiv(i, "left");
      leftPanel.appendChild(leftInsertDiv);
      const rightInsertDiv = createInsertLineDiv(i, "right");
      rightPanel.appendChild(rightInsertDiv);

      leftDivs.push(leftDiv);
      rightDivs.push(rightDiv);
    }

    syncRowHeights();
    highlightPlayingLine();
  }
}