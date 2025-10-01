class Export {
  static init(){
    exportGreen.onclick = () => this.exportGreenText();
    exportGreen.addEventListener("focus", () => exportGreen.blur());
  }

  static exportGreenText() {
    const output = [];

    for(let i=0; i<lSide.lines.length; i++){
      const lLine = lSide.lines[i];
      // const rLine = rSide.lines[i];

      // if(lLine.color === "g" && rLine.color === "g") {
      //   Hatching.remove(lSide, i)
      //   Hatching.remove(rSide, i)
      //   Hatching.red(lSide, i);
      //   Hatching.red(rSide, i);

      //   alert(`「行${i+1}」が両方緑です。どちらかを緑にしてください。`);
      //   alert("両方緑の行がありました。出力は中断されました。");
      //   Scroll.scrollToLine(lSide, i);
      //   return;
      // }else if(lLine.color === "g"){
      if(lLine.color === "g"){
        output.push(this.formatLine(lLine));
      // }else if(rLine.color === "g"){
      //   output.push(this.formatLine(rLine));
      }
    }

    console.log(output.join('\n'));

    if(output.length === 0){
      alert("出力対象の行はありません。");
      return;
    }

    Save.save("green-line_文字起こし整理結果(時間あり).txt", output.join('\n'));
    
    const timeless = output.map(line => {
      let match = line.match(/(\[\d{2}:\d{2}:\d{2} -> \d{2}:\d{2}:\d{2}\]) (.*)/);
      return match ? match[2] : line;
    });
    Save.save("green-line_文字起こし整理結果(時間なし).txt", timeless.join('\n'));
  }

  static formatLine(line){
    return `[${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}] ${line.editedText || line.text}`;
  }
}