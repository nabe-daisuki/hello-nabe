class TextInput {
  static init(){
    textFileInput.onchange = async(e) => {
      const files = e.target.files;
      if(files.length != 1){
        alert('1つのテキストファイルを選択してください');
        return;
      }

      const lFile = new TextFile({
        data: files[0],
        name: files[0].name,
        side: "left"
      });

      // const rFile = new TextFile({
      //   data: files[1],
      //   name: files[1].name,
      //   side: "right"
      // });

      await FileParser.parse(lFile.data, lSide);
      // await FileParser.parse(rFile.data, rSide);
      
      // const lLinesLen = lSide.lines.length;
      // const rLinesLen = rSide.lines.length;
      // if(!lLinesLen || !rLinesLen){
      //   alert("ファイルの読み込みに失敗しました。");
      //   return;
      // }

      // if(lLinesLen !== rLinesLen){
      //   const diffCount = Math.abs(lLinesLen - rLinesLen)
      //   if(lLinesLen > rLinesLen) rSide.insertDummyLine(diffCount);
      //   else lSide.insertDummyLine(diffCount);
      // }

      // textFileNames.innerHTML = `①${lFile.name}<br>②${rFile.name}`;
      textFileNames.innerHTML = lFile.name;

      // Render.render(lFile, rFile);
      Render.render(lFile);
      Save.enable();
    }
  }
}