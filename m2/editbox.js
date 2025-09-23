class EditBox {
    constructor(elem){
        this.inputArea = document.createElement("div");
        this.hiddenInput = document.createElement("input");
        this.box = elem;

        this.box.appendChild(this.inputArea);
        this.box.appendChild(this.hiddenInput);
        console.log("a");
    }
}