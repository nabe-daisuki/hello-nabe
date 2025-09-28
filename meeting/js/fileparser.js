class FileParser {
  static parse(File, Side){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        const lines = e.target.result
          .split('\n')
          .map( (line, i) => this.parseLine(line, i, Side.side))
          .filter(Boolean);
        
        Side.insertLines(lines);
        resolve();
      };
      reader.onerror = e => reject(e);
      reader.readAsText(File);
    });   
  }

  //
  // 行記述解析かつステータス登録
  //
  static parseLine(preline, i, side) {
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
  }
}