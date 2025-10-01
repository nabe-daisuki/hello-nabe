class ContextMenu {
  static offset = 20;

  static set(){
    MenuData.get().forEach(this.createMenuItem);
  }

  static createMenuItem(item) {
    // セパレーターの場合
    if (item.separator) {
      const sep = document.createElement("div");
      sep.className = "separator";
      menuContainer.appendChild(sep);
      return;
    }

    const div = document.createElement("div");
    div.className = "menu-row";

    // 親項目
    const mainItem = document.createElement("div");
    mainItem.textContent = item.text;
    mainItem.className = "menu-item";
    mainItem.onclick = e => {
      ContextMenu.replaceSelectionStr(item.text);
      menuContainer.style.display = "none";
    }
    div.appendChild(mainItem);

    // サブメニューがある場合
    if (item.sub) {
      const subContainer = document.createElement("div");
      subContainer.className = "sub-menu";

      item.sub.forEach(subText => {
        const subDiv = document.createElement("div");
        subDiv.textContent = subText;
        subDiv.className = "menu-item";
        subDiv.onclick = () => {
          ContextMenu.replaceSelectionStr(subText);
          menuContainer.style.display = "none";
        };
        subContainer.appendChild(subDiv);
      });

      div.appendChild(subContainer);

      // 親の高さをサブメニューに合わせる
      const subHeight = item.sub.length * 24; // 1項目24px想定
      mainItem.style.height = subHeight + "px";
    }

    menuContainer.appendChild(div);
  }

  static show(x, y){
    menuContainer.style.display = "block";

    menuContainer.style.left = "0px";
    menuContainer.style.top = "0px";
    const rect = menuContainer.getBoundingClientRect();

    let posX = x + this.offset;
    let posY = y + this.offset;

    if (posX + rect.width > window.innerWidth) {
      posX = x - rect.width - this.offset;
      if (posX < 0) posX = 0;
    }

    if (posY + rect.height > window.innerHeight) {
      posY = y - rect.height - this.offset;
      if (posY < 0) posY = 0;
    }

    menuContainer.style.left = posX + "px";
    menuContainer.style.top = posY + "px";
  }

  static replaceSelectionStr(destStr){
    const Side = Selection.side === "left" ? lSide : rSide;
    const idx = Selection.idx;
    const textSpan = Side.divs[idx].querySelector("textarea");
    const replacedText = textSpan.value.substring(0, TextSpan.selectionStr.start)
      + destStr
      + textSpan.textContent.substring(TextSpan.selectionStr.end);
    textSpan.textContent = replacedText;

    Side.setLineText(replacedText, idx);

    TextSpan.initSelection();
  }
}
