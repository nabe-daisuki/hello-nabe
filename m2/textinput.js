class TextInput {

  lFile = {
    data: null,
    name: "",
    side: ""
  }
  rFile = {
    data: null,
    name: "",
    side: ""
  }

  constructor(_input, _Render){
    this.input = _input;
    this.input.onchange = e => {
      const files = e.target.files;
      if(files.length != 2){
        alert('2つのファイルを選択してください');
        return;
      }

      this.lFile.data = files[0];
      this.lFile.side = "left";
      this.lFile.name = this.lFile.data.name;
      this.rFile.data = files[1];
      this.rFile.data = "right";
      this.lFile.name = this.lFile.data.name;

      // 左右に割り当て
      this.Render.render(this.lFile, this.rFile);
      // this.handleFile(files[0], 'left');
      // this.handleFile(files[1], 'right');
    }

    this.Render = _Render
  }
}