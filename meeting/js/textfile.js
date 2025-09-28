class TextFile {
  static defaults = {
    data: null,
    name: "",
    side: ""
  }
  constructor( options = {} ){
    const settings = {...TextFile.defaults, ...options};

    this.data = settings.data;
    this.name = settings.name;
    this.side = settings.side;
  }
}