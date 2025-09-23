// メニュー定義（階層あり）
const menuData = [
  { text: "Action 1" },
  { separator: true }, // セパレーター
  { 
    text: "Action 2",
    sub: [ "Sub 2-1", "Sub 2-2", "Sub 2-3" ]
  },
  { text: "Action 3" }
];

const menuContainer = document.getElementById('menu');

function createMenuItem(item) {
  // セパレーターの場合
  if (item.separator) {
    const sep = document.createElement('div');
    sep.className = 'separator';
    menuContainer.appendChild(sep);
    return;
  }

  const div = document.createElement('div');
  div.className = 'menu-row';

  // 親項目
  const mainItem = document.createElement('div');
  mainItem.textContent = item.text;
  mainItem.className = 'menu-item';
  mainItem.onclick = () => console.log('Selected:', item.text);
  div.appendChild(mainItem);

  // サブメニューがある場合
  if (item.sub) {
    const subContainer = document.createElement('div');
    subContainer.className = 'sub-menu';

    item.sub.forEach(subText => {
      const subDiv = document.createElement('div');
      subDiv.textContent = subText;
      subDiv.className = 'menu-item';
      subDiv.onclick = (e) => {
        e.stopPropagation();
        console.log('Selected Sub:', subText);
      };
      subContainer.appendChild(subDiv);
    });

    div.appendChild(subContainer);

    // 親の高さをサブメニューに合わせる
    const subHeight = item.sub.length * 24; // 1項目24px想定
    mainItem.style.height = subHeight + 'px';
  }

  menuContainer.appendChild(div);
}

// メニュー生成
menuData.forEach(createMenuItem);
