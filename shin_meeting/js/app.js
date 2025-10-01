const isTest = true;

const header = document.getElementById("header");

const comparisonContainer = document.getElementById("comparison-container");

const lPanel = document.getElementById('left-panel');
// const rPanel = document.getElementById('right-panel');
const audio = document.getElementById("audio");
const volumeSlider = document.getElementById("volume-slider");
const volumeLabel = document.getElementById("volume-label");

const audioFileInput = document.getElementById("audio-file-input");
const audioFileName = document.getElementById("audio-file-name");
const autoScrollCheckbox = document.getElementById('auto-scroll');
// const greenHatchingLeftBtn = document.getElementById("green-hatching-left-btn");
// const greenHatchingRightBtn = document.getElementById("green-hatching-right-btn");

let isWindowBlur = false;

const checkGreenHatch = document.getElementById("checked-green-hatch");
const checkedShow = document.getElementById("checked-show");
const checkedHide = document.getElementById("checked-hide");

const saveBtn = document.getElementById("save-btn");
const namedSaveBtn = document.getElementById("named-save-btn");

const exportGreen = document.getElementById('export-green');

const reloadFileInput = document.getElementById('reload-file-input');

const textFileInput = document.getElementById("text-file-input");
const textFileNames = document.getElementById("text-file-names");

const menuContainer = document.getElementById('menu');

const audioInfo = {
  fileName: "",
  bytes: "",
  KB: 0,
  MB: 0,
  length: ""
}

function setComparisonContainerH(){
  comparisonContainer.style.height = `calc(100vh - ${header.offsetHeight}px)`;
}

const lSide = new Side("left");
// const rSide = new Side("right");

window.onload= () =>{
  setComparisonContainerH();

  TextInput.init();
  AudioInput.init();
  Hatching.init();
  Effect.init();
  Scroll.init();
  Save.init();
  Load.init();
  Export.init();
  AudioController.init();
  
  ContextMenu.set();
}

window.onresize = () => {
  setComparisonContainerH();
  Render.syncRowHeights();
};

window.addEventListener("focus", () => {
  isWindowBlur = false;
  setTimeout(() => {
    document.getElementById("inactive-overlay").style.display = "none";
    if(AudioInput.isPlaying) audio.play();
  },500);
});

window.addEventListener("blur", () => {
  if(isTest) return;
  isWindowBlur = true;
  document.getElementById("inactive-overlay").style.display = "flex";
  if(!audio.paused) audio.pause();
});

document.addEventListener('click', function() {
  menuContainer.style.display = 'none';
  TextSpan.initSelection();
});
