class Load {
  static init(){
    reloadFileInput.addEventListener("change", this.load);
  }

  static load(e){

    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = e => {
      const lLines = [];
      // const rLines = [];

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
          if(lineInfo.side === "left") lLines.push(lineInfo);
          // else rLines.push(lineInfo);

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
            lineInfo.startSec = +sh*3600 + +sm*60 + +ss;
            lineInfo.endSec = +eh*3600 + +em*60 + +es;
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
            lineInfo.hided = line === "true" ? true : false;
            break;
          case 8:
            lineInfo.checked = line === "true" ? true : false;
            break;
          case 9:
            lineInfo.isDummy = line === "true" ? true : false;
            break;
        }
        stateNum+=1; 
      });

      // if(!lLines.length || !rLines.length) return;
      if(!lLines.length) return;
      lPanel.innerHTML = "";
      // rPanel.innerHTML = "";
      // textFileNames.innerHTML = `①－<br>②－`;
      textFileNames.innerHTML = `－`;
      
      const lFile = new TextFile({
        data: null,
        name: "－",
        side: "left"
      });
      // const rFile = new TextFile({
      //   data: null,
      //   name: "－",
      //   side: "right"
      // });

      lSide.clearLines();
      // rSide.clearLines();

      lSide.insertLines(lLines);
      // rSide.insertLines(rLines);

      // Render.render(lFile, rFile);
      Render.render(lFile);

      Save.enable();

      if(noAudio){
        alert("前回保存時に読み込まれた会議音声はありませんでした。");
      }else{
        text.push("を前回保存時読み込んでいます。");
        alert(text.join("\n"));
      }
    };
    reader.readAsText(file);
  }
}