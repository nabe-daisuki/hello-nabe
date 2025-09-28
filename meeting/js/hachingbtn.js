
greenHatchingLeftBtn.onclick = () => drawGreenHatch("left");
greenHatchingRightBtn.onclick = () => drawGreenHatch("right");

function drawGreenHatch(side){
  if(!["left", "right"].includes(side)){
    console.error("drawGreenHatch: leftかright以外が第1引数として渡されています。");
    return;
  }

  for(let i = 0; i < leftLines.length; i++){
    const leftLine = leftLines[i];
    const rightLine = rightLines[i];
    const leftDiv = leftDivs[i];
    const rightDiv = rightDivs[i];

    if(side==='left' && !leftLine.disabled){
      if(leftDiv.classList.contains("green-hatch")) continue;
      if(!rightDiv.classList.contains("green-hatch")){
        leftDiv.classList.add("green-hatch");
        leftLine.color = "g";
      }
    }

    if(side==='right' && !rightLine.disabled){
      if(rightDiv.classList.contains("green-hatch")) continue;
      if(!leftDiv.classList.contains("green-hatch")){
        rightDiv.classList.add("green-hatch");
        rightLine.color = "g";
      }
    }
  }
}

