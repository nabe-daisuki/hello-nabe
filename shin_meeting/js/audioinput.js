class AudioInput {
  static isPlaying = false;

  static init() {
    audioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if(!file){
        alert("音声ファイルを開けませんでした。");
        return;
      }

      let bytes = file.size;
      audioInfo.bytes = bytes.toLocaleString();
      audioInfo.KB = (bytes / 1024).toFixed(2);
      audioInfo.MB = (bytes / 1024 / 1024).toFixed(2);

      audioInfo.fileName = file.name;
      audioFileName.textContent = audioInfo.fileName;

      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.load();
      audio.volume = 0.1;

      volumeSlider.value = 10;
    });

    audio.addEventListener("play", () => {
      this.isPlaying = true;
    });

    audio.addEventListener("pause", () => {
      if(isWindowBlur)return;
      this.isPlaying = false;
    });

    audio.ontimeupdate = () => {
      if(Scroll.isAuto){
        const curTime = audio.currentTime;
        const lIdx = lSide.lines.findIndex(l => this.isPlayingLine(curTime, l));
        // const rIdx = rSide.lines.findIndex(l => this.isPlayingLine(curTime, l));

        // if(lIdx >= 0 && rIdx >= 0){
        //   if(lIdx > rIdx) Scroll.scrollToLine(rSide, rIdx);
        //   else Scroll.scrollToLine(lSide, lIdx);
        // }
        Scroll.scrollToLine(lSide, lIdx);
      }
      this.showPlayLine();
    }

    audio.addEventListener("loadedmetadata", () => {
      let totalSeconds = Math.floor(audio.duration);
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const formattedTime = `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      audioInfo.length = formattedTime;
    });

    audio.addEventListener("focus", () => audio.blur());
  }

  static isPlayingLine(time, line){
    return time >= line.startSec && time < line.endSec && !line.disabled
  }

  static showPlayLine() {
    const curTime = audio.currentTime;
    for(let i = 0; i < lSide.lines.length; i++){
      const lLine = lSide.lines[i];
      if(this.isPlayingLine(curTime, lLine)) Hatching.yellow(lSide.divs[i]);
      else  Hatching.remove(lSide, i, true);

      // const rLine = rSide.lines[i];
      // if(this.isPlayingLine(curTime, rLine)) Hatching.yellow(rSide.divs[i]);
      // else Hatching.remove(rSide, i, true);
    }
  }
}