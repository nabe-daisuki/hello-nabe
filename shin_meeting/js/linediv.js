class LineDiv {
  static create(Side, idx){
    const line = Side.lines[idx];
    const div = document.createElement('div');
    div.className = "line";
    if(line.disabled) div.classList.add("disabled");
    if(line.color === "g") div.classList.add("green-hatch");
    if(line.color === "r") div.classList.add("red-hatch");
    div.oncontextmenu = e => {
      Hatching.green(Side, idx);
      e.preventDefault();
    }

    const effecter = Effecter.create(Side, idx, line.disabled);

    const ts = TimeStamp.create(Side, idx);

    const textSpan = TextSpan.create(Side, idx);

    const invalidBtn = InvalidBtn.create(Side, div, idx);

    div.appendChild(effecter);
    div.appendChild(ts);
    div.appendChild(textSpan);
    div.appendChild(invalidBtn);

    return div;
  }
}