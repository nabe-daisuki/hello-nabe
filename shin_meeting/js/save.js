class Save {
  static init(){
    saveBtn.onclick = () => this.defaultSave();
    saveBtn.addEventListener("focus", () => saveBtn.blur());

    namedSaveBtn.onclick = () => this.namedSave();
    namedSaveBtn.addEventListener("focus", () => namedSaveBtn.blur());
  }

  static enable(){
    saveBtn.classList.remove("btn-disabled");
    saveBtn.disabled = false;
    namedSaveBtn.classList.remove("btn-disabled");
    namedSaveBtn.disabled = false;
  }

  static defaultSave(){
    let answer = confirm("現状を保存しますか？");
    if(!answer)return;  

    this.save(this.getTimestampFileName(), this.stateToText());
  }

  static getTimestampFileName() {
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

  static save(fileName, content){
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  static stateToText(){
    let text = "";
    lSide.lines.forEach(line => {
      text += `${line.index}
${line.side}
[${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}]
${line.text}
$$$$$
${line.editedText}
#####
${line.disabled}
${line.color}
${line.hided}
${line.checked}
${line.isDummy}
@@@@@
`;
    });
//     rSide.lines.forEach(line => {
//       text += `${line.index}
// ${line.side}
// [${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}]
// ${line.text}
// $$$$$
// ${line.editedText}
// #####
// ${line.disabled}
// ${line.color}
// ${line.hided}
// ${line.checked}
// ${line.isDummy}
// @@@@@
// `;
//     });
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

  static namedSave(){
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

    this.save(fileName, this.stateToText());
  }
}