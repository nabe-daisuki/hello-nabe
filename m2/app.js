const isTest = true;

const panel = document.getElementById("comparison-container");

const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');
const audio = document.getElementById('audio');
const autoScrollCheckbox = document.getElementById('auto-scroll');
const greenHatchingLeftBtn = document.getElementById("green-hatching-left-btn");
const greenHatchingRightBtn = document.getElementById("green-hatching-right-btn");

const textFileInput = document.getElementById("text-file-input");



let leftLines = [];
let rightLines = [];
let leftDivs = [];
let rightDivs = [];

let leftFileName = '';
let rightFileName = '';

let editing = {
  index: -1,
  side: ''
}

let autoScrollRow = 0;
let isSelectionPulledOnce = false;
let selectedRow = 0;
let selectedSide = 'left';
let isEditing = false;

let audioInfo = {
  fileName: "",
  bytes: "",
  KB: 0,
  MB: 0,
  length: ""
}

let isEditClosed = true;

const selectionStr = {
  start: 0,
  end  : 0
}

// const lSide = new Side();
// const rSide = new Side();
// const hatching = new Hatching(lSide, rSide);
// const selection = new Selection(lSide, rSide);
// const scroll = new Scroll(lSide, rSide);
// const audio = new Audio(selection);
// const render = new Render(audio, scroll);
// const textInput = new TextInput(textFileInput, render);


//
// テキスト読込処理
//
document.getElementById('text-file-input').addEventListener('change', e => {
  const files = e.target.files;
  if(files.length != 2){
    alert('2つのファイルを選択してください');
    return;
  }
  // 左右に割り当て
  handleFile(files[0], 'left');
  handleFile(files[1], 'right');
});


//
// ファイル読み込み
//
function handleFile(file, side) {
  const reader = new FileReader();
  reader.onload = e => {
    const lines = e.target.result.split('\n').map( (line, i) => parseLine(line, i, side)).filter(Boolean);
    if(side === 'left') {
      leftLines = lines;
      leftFileName = file.name;
    } else {
      rightLines = lines;
      rightFileName = file.name;
    }
    if(!leftLines.length || !rightLines.length) return;
    leftPanel.innerHTML = "";
    rightPanel.innerHTML = "";
    document.getElementById("text-file-names").innerHTML = `①${leftFileName}<br>②${rightFileName}`;
    render();
    document.getElementById("save-btn").classList.remove("btn-disabled");
    document.getElementById("save-btn").disabled = false;
    document.getElementById("named-save-btn").classList.remove("btn-disabled");
    document.getElementById("named-save-btn").disabled = false;
  };
  reader.readAsText(file);
}

//
// 行記述解析かつステータス登録
//
function parseLine(line, i, side) {
  const match = line.match(/\[(\d+):(\d+):(\d+) -> (\d+):(\d+):(\d+)\] (.*)/);
  if (!match) return null;
  const [, sh, sm, ss, eh, em, es, text] = match;
  return {
    index: i,
    side: side,
    startTime: +sh*3600 + +sm*60 + +ss,
    endTime: +eh*3600 + +em*60 + +es,
    text,
    editedText: null,
    disabled: false,
    color: null,
    isDammy: false
  };
}

//
// 行レンダリング
//
function render() {
  // パネルヘッダー(ファイル名)の挿入
  const leftPanelHeader = document.createElement("div");
  leftPanelHeader.classList.add("panel-header");
  leftPanelHeader.textContent = `①${leftFileName}`;
  leftPanel.appendChild(leftPanelHeader);

  const rightPanelHeader = document.createElement("div");
  rightPanelHeader.classList.add("panel-header");
  rightPanelHeader.textContent = `②${rightFileName}`;
  rightPanel.appendChild(rightPanelHeader);


  leftDivs = [];
  rightDivs = [];
  const maxLen = Math.max(leftLines.length, rightLines.length);
  
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

  console.log(leftLines);
}

//
// 行挿入Div生成
//
function createInsertLineDiv(index, side) {
  const div = document.createElement('div');
  div.className = 'insert-line';

  // 青線
  const line = document.createElement('div');
  line.className = 'blue-line';
  div.appendChild(line);

  // 〇ボタン
  const button = document.createElement('button');
  button.className = 'insert-button';
  button.textContent = '＋';
  button.setAttribute("tabindex", "-1");
  button.onclick = () => {
    insertNewLine(index, side);
  }
  div.appendChild(button);

  return div;
}

function insertNewLine(index, side) {
  let newLineBase = {
    text: '',
    editedText: '',
    color: null,
    disabled: true,
    isDammy: true
  }
  let leftNewLine, rightNewLine;

  if(side === 'left'){
    leftNewLine = {
      side: "left",
      startTime: leftLines[index].endTime,
      endTime: leftLines[index].endTime,
      ...newLineBase
    }
    leftLines.splice(index + 1, 0, leftNewLine);

    rightNewLine = {
      side: "right",
      startTime: rightLines[rightLines.length-1].endTime,
      endTime: rightLines[rightLines.length-1].endTime,
      ...newLineBase
    }
    rightLines.push(rightNewLine);
  } else {
    rightNewLine = {
      side: "right",
      startTime: rightLines[index].endTime,
      endTime: rightLines[index].endTime,
      ...newLineBase
    }
    rightLines.splice(index + 1, 0, rightNewLine);
    
    leftNewLine = {
      side: "left",
      startTime: leftLines[leftLines.length-1].endTime,
      endTime: leftLines[leftLines.length-1].endTime,
      ...newLineBase
    }
    leftLines.push(leftNewLine);
  }

  removeDependentDammyLine();
  resetIndex();
  rerender();
}

function removeDependentDammyLine(){
  const lineCount = leftLines.length;
  if(!leftLines[lineCount-1].isDammy || !rightLines[lineCount-1].isDammy) return;
  leftLines.pop();
  rightLines.pop();
}

function resetIndex(){
  leftLines.forEach( (line, i) => line.index = i );
  rightLines.forEach( (line, i) => line.index = i );
}

function rerender(){
  leftPanel.innerHTML = '';
  rightPanel.innerHTML = '';

  // パネルヘッダー(ファイル名)の挿入
  const leftPanelHeader = document.createElement("div");
  leftPanelHeader.classList.add("panel-header");
  leftPanelHeader.textContent = `①${leftFileName}`;
  leftPanel.appendChild(leftPanelHeader);

  const rightPanelHeader = document.createElement("div");
  rightPanelHeader.classList.add("panel-header");
  rightPanelHeader.textContent = `②${rightFileName}`;
  rightPanel.appendChild(rightPanelHeader);

  leftDivs = [];
  rightDivs = [];

  for(i = 0;i < leftLines.length;i++){
    const leftLine = leftLines[i];
    const rightLine = rightLines[i];

    const leftLineDiv = createLineDiv(leftLine, i, "left");
    const rightLineDiv = createLineDiv(rightLine, i, "right");

    leftPanel.appendChild(leftLineDiv);
    rightPanel.appendChild(rightLineDiv);

    const leftInsertDiv = createInsertLineDiv(i, "left");
    const rightInsertDiv = createInsertLineDiv(i, "right");
    leftPanel.appendChild(leftInsertDiv);
    rightPanel.appendChild(rightInsertDiv);
    
    leftDivs.push(leftLineDiv);
    rightDivs.push(rightLineDiv);
  }

  syncRowHeights();
  highlightPlayingLine();

  console.log(leftLines);
}


//
// 行Div生成
//
function createLineDiv(line, index, side) {
  const div = document.createElement('div');
  div.className = 'line';
  if(line.disabled) div.classList.add("disabled");
  if(line.color === "g") div.classList.add("green-hatch");
  if(line.color === "r") div.classList.add("red-hatch");

  // タイムスタンプ
  const ts = document.createElement('span');
  ts.className = 'timestamp';
  ts.textContent = `[${formatTime(line.startTime)} -> ${formatTime(line.endTime)}]`;
  ts.onclick = () => {
    selectedRow = index;
    selectedSide = side;
    highlightSelectedDiv();
    audio.currentTime = line.startTime;
    scrollToLine(index);
  }

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

//
// 時間フォーマット
//
function formatTime(sec){
  const h = String(Math.floor(sec/3600)).padStart(2,'0');
  const m = String(Math.floor(sec%3600/60)).padStart(2,'0');
  const s = String(Math.floor(sec%60)).padStart(2,'0');
  return `${h}:${m}:${s}`;
}

//
// 左右の高さを合わせる
//
function syncRowHeights() {
  const leftRows = leftPanel.querySelectorAll('.line');
  const rightRows = rightPanel.querySelectorAll('.line');

  for(let i=0; i<Math.max(leftRows.length, rightRows.length); i++){
    const leftRow = leftRows[i];
    const rightRow = rightRows[i];
    if(!leftRow || !rightRow) continue;
    
    leftRow.style.height = "auto";
    rightRow.style.height = "auto";

    const maxHeight = Math.max(leftRow.offsetHeight, rightRow.offsetHeight);
    leftRow.style.height = maxHeight + 'px';
    rightRow.style.height = maxHeight + 'px';
  }
}

//
// 音声に合わせ行ハイライト
//
function highlightPlayingLine() {
  const time = audio.currentTime;
  leftPanel.querySelectorAll('.line').forEach((div, i) => {
    const line = leftLines[i];
    if(line && time >= line.startTime && time < line.endTime){
      div.classList.add("yellow-hatch");
    } else {
      div.classList.remove("yellow-hatch");
    }
  });

  rightPanel.querySelectorAll('.line').forEach((div, i) => {
    const line = rightLines[i];
    if(line && time >= line.startTime && time < line.endTime){
      div.classList.add("yellow-hatch");
    } else {
      div.classList.remove("yellow-hatch");
    }
  });
}

//
// 左右スクロール同期(操作)
//
leftPanel.addEventListener('scroll', ()=>{ rightPanel.scrollTop = leftPanel.scrollTop; });
rightPanel.addEventListener('scroll', ()=>{ leftPanel.scrollTop = rightPanel.scrollTop; });

//
// 音声連動スクロール
//
audio.ontimeupdate = () => {
  if(autoScrollCheckbox.checked){
    const leftLinesidx = leftLines.findIndex(l => audio.currentTime >= l.startTime && audio.currentTime < l.endTime && !l.isDammy);
    const rightLinesidx = rightLines.findIndex(l => audio.currentTime >= l.startTime && audio.currentTime < l.endTime && !l.isDammy);
    if(leftLinesidx >= 0 && rightLinesidx >= 0){
      if(leftLinesidx > rightLinesidx) scrollToLine(rightLinesidx);
      else scrollToLine(leftLinesidx);
    }
  }
  highlightPlayingLine();
}

//
// 左右スクロール同期(プログラム)
//
function scrollToLine(index){
  const insertLineMargin = 4;
  const insertLineHeight = document.querySelector(".insert-line").offsetHeight + insertLineMargin;
  let lineTopHeight = 0;
  for(i = 0; i < index; i++){
    lineTopHeight += leftDivs[i].offsetHeight + insertLineHeight;
  }
  
  leftPanel.scrollTop = lineTopHeight;
  rightPanel.scrollTop = lineTopHeight;
  autoScrollRow = index;
}

//
// ウィンドウリサイズイベント
//
window.addEventListener('resize', () => {
  setComparisonContainerH();
  syncRowHeights();
});

//
// 緑ハッチ出力処理
//
document.getElementById('exportGreen').onclick = () => {
  exportHighlightedText();
};

//
// 緑ハッチ出力
//
function exportHighlightedText() {
  const output = [];

  for(let i=0; i<leftLines.length; i++){
    const leftDiv = leftDivs[i];
    const rightDiv = rightDivs[i];
    const leftLine = leftLines[i];
    const rightLine = rightLines[i];

    if(leftLine.disabled && rightLine.disabled) continue;

    const leftGreen = leftDiv.classList.contains("green-hatch");
    const rightGreen = rightDiv.classList.contains("green-hatch");

    // 両方緑の場合 → 出力中断
    if(leftGreen && rightGreen){
      leftDiv.classList.remove("green-hatch");
      rightDiv.classList.remove("green-hatch");
      leftDiv.classList.add("red-hatch");
      rightDiv.classList.add("red-hatch");
      leftLine.color = "r";
      rightLine.color = "r";

      alert(`「行${i+1}」が両方緑です。どちらかを緑にしてください。`);
      alert("両方緑の行がありました。出力は中断されました。");
      return;
    }

    // どちらか緑なら出力
    if(leftGreen) output.push(formatLine(leftLine));
    if(rightGreen) output.push(formatLine(rightLine));
  }

  // 全行出力（コンソールやファイル保存など）
  console.log(output.join('\n'));

  if(output.length === 0){
    alert("出力対象の行はありません。");
    return;
  }

  save("green-line_文字起こし整理結果.txt", output.join('\n'));
}

//
// 書式維持用
//
function formatLine(line){
  return `[${formatTime(line.startTime)} -> ${formatTime(line.endTime)}] ${line.editedText || line.text}`;
}

//
// 状態保存処理
//
document.getElementById("save-btn").onclick = () => {
  defaultSave();
}

function defaultSave(){
  let answer = confirm("現状を保存しますか？");
  if(!answer)return;  

  save(getTimestampFileName(), stateToText());
}

function getTimestampFileName() {
    const now = new Date();
    
    // ゼロ埋め用関数
    const pad = (n) => n.toString().padStart(2, '0');

    const yyyy = now.getFullYear();
    const MM = pad(now.getMonth() + 1); // 月は0始まり
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    return `${yyyy}${MM}${dd}-${hh}${mm}${ss}_文字起こし比較.txt`;
}

function save(fileName, content){
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
}

function stateToText(){
  let text = "";
  leftLines.forEach(line => {
    text += `${line.index}
${line.side}
[${formatTime(line.startTime)} -> ${formatTime(line.endTime)}]
${line.text}
$$$$$
${line.editedText}
#####
${line.disabled}
${line.color}
${line.isDammy}
@@@@@
`;
  });
  rightLines.forEach(line => {
    text += `${line.index}
${line.side}
[${formatTime(line.startTime)} -> ${formatTime(line.endTime)}]
${line.text}
$$$$$
${line.editedText}
#####
${line.disabled}
${line.color}
${line.isDammy}
@@@@@
`;
  });
  text += "%%%%%\n";

  if(audioInfo.fileName === ""){
    text += "no audio\n";
  }else{
    text += `${audioInfo.fileName}
${audioInfo.length}
${audioInfo.bytes}
${audioInfo.KB}
${audioInfo.MB}
`;
  }
  text += "&&&&&";

  return text;
}

//
// 名前を付けて保存
//
document.getElementById("named-save-btn").onclick = () => {
  namedSave();
}

function namedSave(){
  let answer = confirm("現状を名前を付けて保存しますか？");
  if(!answer)return;

  let fileName = "";
  while(true){
    fileName = prompt("ファイル名を入力ください。（前後の空白・改行及びタブ禁止）");

    fileName = fileName.trim();
    if(fileName !== null && fileName !== ""){
      const invalidChars = /[\t\r\n]/;
      if(invalidChars.test(fileName)){
        alert("ファイル名として利用できません。改行やタブが含まれています。");
      }else{
        break;
      }
    }
  }

  save(fileName, stateToText());
}

//
// 保存データ読込処理
//
document.getElementById('reload-file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  
  const reader = new FileReader();
  reader.onload = e => {
    leftLines = [];
    rightLines = [];

    let stateNum = 0;
    let lineInfo = {};
    let text = [];
    let editedText = [];
    let hasEnteredAudioBlock = false;
    let noAudio = false;
    let isFileEnd = false;
    e.target.result.split('\n').forEach( line => {
      if(isFileEnd) return;
      
      if(line === "&&&&&"){
        isFileEnd = true;
        return;
      }
        
      if(hasEnteredAudioBlock){
        switch(stateNum){
          case 0:
            noAudio = line === "no audio"; 
            text.push(`ファイル名：${line}`);
            break;
          case 1:
            text.push(`長さ：${line}`);
            break;
          case 2:
            text.push(`データサイズ：${line} B`);
            break;
          case 3:
            text.push(`→　${line} KB`);
            break;
          case 4:
            text.push(`→　${line} MB`);
            break;
        }
        stateNum+=1;
        return;
      }

      if(line === "%%%%%"){
        hasEnteredAudioBlock = true;
        return;
      }

      if(line === "@@@@@"){
        if(lineInfo.side === "left") leftLines.push(lineInfo);
        else rightLines.push(lineInfo);
      console.log(lineInfo);

        stateNum = 0;
        lineInfo = {};
        text = [];
        editedText = [];
        return;
      }

      switch(stateNum){
        case 0:
          lineInfo.index = line;
          break;
        case 1:
          lineInfo.side = line;
          break;
        case 2:
          const match = line.match(/\[(\d+):(\d+):(\d+) -> (\d+):(\d+):(\d+)\]/);
          const [, sh, sm, ss, eh, em, es] = match;
          lineInfo.startTime = +sh*3600 + +sm*60 + +ss;
          lineInfo.endTime = +eh*3600 + +em*60 + +es;
          break;
        case 3:
          if(line != "$$$$$"){
            text.push(line);
            return;
          }
          lineInfo.text = text.join("\n");
          break;
        case 4:
          if(line != "#####"){
            editedText.push(line);
            return;
          }
          lineInfo.editedText = editedText[0] === "null" ? null : editedText.join("\n");
          break;
        case 5:
          lineInfo.disabled = line === "true" ? true : false;
          break;
        case 6:
          lineInfo.color = line === "null" ? null : line;
          break;
        case 7:
          lineInfo.isDammy = line === "true" ? true : false;
          break;
      }
      stateNum+=1; 
    });

    leftFileName = "ー";
    rightFileName = "ー";

    if(!leftLines.length || !rightLines.length) return;
    leftPanel.innerHTML = "";
    rightPanel.innerHTML = "";
    document.getElementById("text-file-names").innerHTML = `①${leftFileName}<br>②${rightFileName}`;
    render();

    console.log(leftLines);

    document.getElementById("save-btn").classList.remove("btn-disabled");
    document.getElementById("save-btn").disabled = false;
    document.getElementById("named-save-btn").classList.remove("btn-disabled");
    document.getElementById("named-save-btn").disabled = false;

    if(noAudio){
      alert("前回保存時に読み込まれた会議音声はありませんでした。");
    }else{
      text.push("を前回保存時読み込んでいます。");
      alert(text.join("\n"));
    }
  };
  reader.readAsText(file);
});

//
// キーボード操作
//
document.addEventListener('keydown', (e)=>{
  if(e.ctrlKey){
    switch(e.key){
      case '6':
        audio.currentTime = Math.max(0, audio.currentTime + 2);
        e.preventDefault();
        break;
      case '3':
        audio.currentTime = Math.max(0, audio.currentTime - 3);
        e.preventDefault();
        break;
      case '2':
        audio.playbackRate = 1.3;
        e.preventDefault();
        break;
      case '1':
        audio.playbackRate = 1.0; // 元の速度に戻す
        e.preventDefault();
        break;
    }
  }

  
  // const isEditing = document.getElementById("edit-overlay").style.display === "flex";

  // if(isEditing || !isEditClosed) return;

  console.log(isEditing);
  const maxRow = Math.max(leftLines.length, rightLines.length) - 1;
  switch(e.key){
    case 'ArrowUp':
      if(isEditing)return;
      if(selectedRow>0) selectedRow--;
      highlightSelectedDiv();
      e.preventDefault();
      break;
    case 'ArrowDown':
      if(isEditing)return;
      if(selectedRow<maxRow) selectedRow++;
      highlightSelectedDiv();
      e.preventDefault();
      break;
    case 'ArrowLeft':
      if(isEditing)return;
      selectedSide = 'left';
      highlightSelectedDiv();
      e.preventDefault();
      break;
    case 'ArrowRight':
      if(isEditing)return;
      selectedSide = 'right';
      highlightSelectedDiv();
      e.preventDefault();
      break;
    case 'Enter':
      if(e.shiftKey){
        const line = (selectedSide==='left') ? leftLines[selectedRow] : rightLines[selectedRow];
        if(line) audio.currentTime = line.startTime;
        e.preventDefault();
        break;
      }      
      // const line = selectedSide === "left" ? leftLines[selectedRow] : rightLines[selectedRow];
      // openEditModal(line);
      // e.preventDefault();
      break;
    case 'F12':
      if(!document.getElementById("named-save-btn").disabled) namedSave();
      e.preventDefault();
      break;
    default:
      break;
  }

  // Ctrl+Shift+S
  if (e.key === 'S' && e.ctrlKey && e.shiftKey) {
    if(!document.getElementById("named-save-btn").disabled) namedSave();
    e.preventDefault();
    return;
  }
  
  // Ctrl+S
  if (e.key.toLowerCase() === 's' && e.ctrlKey && !e.shiftKey) {
    if(!document.getElementById("save-btn").disabled) defaultSave();
    e.preventDefault();
    return;
  }
  
  if(e.code === 'Space'){
    if(e.shiftKey){
      e.preventDefault();
      if(audio.paused) audio.play();
      else audio.pause();
      return;
    }
  }
});

//
// 選択行の赤線表示
//
function highlightSelectedDiv(){
  console.log(selectedRow);
  console.log(selectedSide);
  if(!isInViewport(leftDivs[selectedRow]) && !isSelectionPulledOnce){
    isSelectionPulledOnce = true;
    selectedRow = autoScrollRow;
    if(selectedSide === "left"){
      leftDivs.forEach((div,i)=>{
        if(i===selectedRow && selectedSide==='left') div.style.border='1px solid red';
        else div.style.border='1px solid rgba(255, 255, 255, 1)';
      });
      rightDivs.forEach((div,i)=>div.style.border='1px solid rgba(255, 255, 255, 1)');
    }else{
      rightDivs.forEach((div,i)=>{
        if(i===selectedRow && selectedSide==='right') div.style.border='1px solid red';
        else div.style.border='1px solid rgba(255, 255, 255, 1)';
      });
      leftDivs.forEach((div,i)=>div.style.border='1px solid rgba(255, 255, 255, 1)');
    }
  }else{
    if(!isInViewport(leftDivs[selectedRow]) && autoScrollCheckbox.checked) autoScrollCheckbox.checked = false;
    leftDivs.forEach((div,i)=>{
      if(i===selectedRow && selectedSide==='left') div.style.border='1px solid red';
      else div.style.border='1px solid rgba(255, 255, 255, 1)';
    });
    rightDivs.forEach((div,i)=>{
      if(i===selectedRow && selectedSide==='right') div.style.border='1px solid red';
      else div.style.border='1px solid rgba(255, 255, 255, 1)';
    });
  }

  if(autoScrollCheckbox.checked) return;
  const rect = leftDivs[selectedRow].getBoundingClientRect();
  const panelRect = document.getElementById("comparison-container").getBoundingClientRect();
  const panelHeight = document.getElementById("comparison-container").offsetHeight;
  
  // panelの中心から上下[range]pxほどに選択行を想定
  const range = 200;
  const viewableAreaTop = panelRect.bottom - ( panelHeight / 2 ) - range;
  const viewableAreaBottom = panelRect.bottom - ( panelHeight / 2 ) + range;

  if(rect.top > viewableAreaTop && rect.bottom < viewableAreaBottom) return;

  let scrollDiff = 0;
  if(rect.top < viewableAreaTop) scrollDiff = -leftDivs[selectedRow].offsetHeight * 2;
  else scrollDiff = leftDivs[selectedRow].offsetHeight * 2;

  leftPanel.scrollTop = leftPanel.scrollTop + scrollDiff;
  rightPanel.scrollTop = rightPanel.scrollTop + scrollDiff;
}

function isInViewport(line) {
  const rect = line.getBoundingClientRect();
  const panelRect = document.getElementById("comparison-container").getBoundingClientRect();
  const panelHeaderHeight = document.querySelector(".panel-header").offsetHeight;
  return (
    rect.top > panelRect.top + panelHeaderHeight &&
    rect.bottom < panelRect.bottom
  );
}

//
// テキスト編集ウィンドウの表示
//
// function openEditModal(line){
//   if(line.disabled) return;

//   const textarea = document.getElementsByTagName("textarea")[0];

//   editing.index = line.index;
//   editing.side = line.side;

//   textarea.value = line.editedText || line.text;
//   document.getElementById("edit-overlay").style.display = "flex";
//   isEditClosed = false;
//   textarea.focus();
// }

function setComparisonContainerH(){
  const header = document.getElementById("header");
  const comparisonContainer = document.getElementById("comparison-container");
  comparisonContainer.style.height = `calc(100vh - ${header.offsetHeight}px)`;
}

function setAudioEvent(){
  const audio = document.getElementById('audio');
  
  document.getElementById('audio-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;

    let bytes = file.size;
    audioInfo.bytes = bytes.toLocaleString();
    audioInfo.KB = (bytes / 1024).toFixed(2);
    audioInfo.MB = (bytes / 1024 / 1024).toFixed(2);

    audioInfo.fileName = file.name;
    document.getElementById("audio-file-name").textContent = audioInfo.fileName;

    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
    audio.volume = 0.1;
  });
}

function setLineText(editedText){
  const idx = editing.index
  const side = editing.side;
  const line = side === "left" ? leftLines[idx] : rightLines[idx];
  const div = side === "left" ? leftDivs[idx] : rightDivs[idx];
  const textSpan = div.querySelector(".text");

  if(line.text === editedText){
    line.editedText = null;
    
    textSpan.textContent = line.text;
    textSpan.classList.remove("edited");
  }else{
    line.editedText = editedText
    
    textSpan.textContent = editedText;
    textSpan.classList.add("edited");
    syncRowHeights();
  }

  editing.index = -1;
  editing.side = "";

  syncRowHeights();
}

function setEditToolEvent(){
  const textarea = document.getElementsByTagName("textarea")[0];
  const editOKButton = document.getElementById("edit-ok-button");
  const editCancelButton = document.getElementById("edit-cancel-button");

  textarea.onkeydown = (e) => {
    if(e.key==='Enter'){
      if(e.shiftKey){
        e.preventDefault();
        document.getElementById("edit-ok-button").click();
        setTimeout( () => {
          isEditClosed = true;
        },500);
      }
    }
  }

  editOKButton.onclick = () => {
    document.getElementById("edit-overlay").style.display = "none";
    setLineText(document.getElementsByTagName("textarea")[0].value);
  }

  editCancelButton.onclick = () => {
    document.getElementById("edit-overlay").style.display = "none";
  }
}

audio.addEventListener('loadedmetadata', () => {
  let totalSeconds = Math.floor(audio.duration);
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  audioInfo.length = formattedTime;
});

window.onload= () =>{
  setComparisonContainerH();
  setAudioEvent(); 
  setEditToolEvent();
}

window.addEventListener("focus", () => {
  document.getElementById("inactive-overlay").style.display = "none";
});

audio.addEventListener("focus", () => {
  audio.blur();
});

autoScrollCheckbox.addEventListener("change", e => {
    if(e.target.checked) isSelectionPulledOnce = false;
});

document.getElementById("green-hatching-left-btn").addEventListener("focus", () =>{
  document.getElementById("green-hatching-left-btn").blur();
});
document.getElementById("green-hatching-right-btn").addEventListener("focus", () =>{
  document.getElementById("green-hatching-right-btn").blur();
});
document.getElementById("save-btn").addEventListener("focus", () =>{
  document.getElementById("save-btn").blur();
});
document.getElementById("named-save-btn").addEventListener("focus", () =>{
  document.getElementById("named-save-btn").blur();
});
document.getElementById("exportGreen").addEventListener("focus", () =>{
  document.getElementById("exportGreen").blur();
});


window.addEventListener("blur", () => {
  if(isTest) return;
  document.getElementById("inactive-overlay").style.display = "flex";
  if(!audio.paused) audio.pause();
});


function getSelectionOffset(element) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preRange = document.createRange();
    preRange.selectNodeContents(element);
    preRange.setEnd(range.startContainer, range.startOffset);

    const startOffset = preRange.toString().length; // 文中の開始位置
    const endOffset = startOffset + range.toString().length; // 終了位置

    return { startOffset, endOffset };
}

document.addEventListener('mousedown', function(e) {
  if (e.button !== 1) return;
  e.preventDefault();

  const textarea = document.activeElement;
  selectionStr.start = textarea.selectionStart;
  selectionStr.end = textarea.selectionEnd;
  const selectedText = textarea.value.slice(selectionStr.start, selectionStr.end);

  const offset = 20; // クリック位置からの距離
  menuContainer.style.display = 'block';

  // 一度左上0,0に置いてサイズ取得
  menuContainer.style.left = '0px';
  menuContainer.style.top = '0px';
  const rect = menuContainer.getBoundingClientRect();

  let posX = e.clientX + offset;
  let posY = e.clientY + offset;

  // 横方向：右端を超える場合は左に表示
  if (posX + rect.width > window.innerWidth) {
    posX = e.clientX - rect.width - offset;
    if (posX < 0) posX = 0; // 左端は最低0
  }

  // 縦方向：下端を超える場合は上に表示
  if (posY + rect.height > window.innerHeight) {
    posY = e.clientY - rect.height - offset;
    if (posY < 0) posY = 0; // 上端は最低0
  }

  menuContainer.style.left = posX + 'px';
  menuContainer.style.top = posY + 'px';
});

document.addEventListener('click', function() {
  menu.style.display = 'none';
});

function replaceSelectedStr(elem){
  console.log(elem);
  let textSpan = selectedSide === "left"
    ? leftDivs[selectedRow].querySelector(".text")
    : rightDivs[selectedRow].querySelector(".text");
  const replacedText = textSpan.value.substring(0, selectionStr.start)
    + elem.textContent
    + textSpan.textContent.substring(selectionStr.end);
  textSpan.textContent = replacedText;

  editing.side = selectedSide;
  editing.index = selectedRow;
  setLineText(replacedText);
}

document.addEventListener("focusin", () => {
  if(document.activeElement.tagName == "TEXTAREA"){
    isEditing = true;

    const selectedDiv = document.activeElement.parentElement.parentElement;
    selectedSide = leftDivs.findIndex(div => div === selectedDiv) == -1
      ? "right"
      : "left";
    selectedRow = selectedSide === "left"
      ? leftDivs.findIndex(div => div === selectedDiv)
      : rightDivs.findIndex(div => div === selectedDiv);
    highlightSelectedDiv();
  }
});

document.addEventListener("focusout", (e) => {
  if(e.target.tagName !== "TEXTAREA") return;
  isEditing = false;
  editing.side = selectedSide;
  editing.index = selectedRow;
  setLineText(e.target.value);
  syncRowHeights();
});

function flexTextarea(el) {
  const dummy = el.querySelector('.FlexTextarea__dummy')
  el.querySelector('.FlexTextarea__textarea').addEventListener('input', e => {
    dummy.textContent = e.target.value + '\u200b';
  })
}