class AudioController {
  static init(){
    volumeSlider.addEventListener("input", e => {
      const value = e.target.value;
      volumeLabel.textContent = value + "%";
      this.updateSliderBackground();
    });
    this.updateSliderBackground();
  }
  
  static updateSliderBackground() {
    const value = volumeSlider.value;
    volumeSlider.style.setProperty("--value", value + "%");
    audio.volume = value * 0.01;
  }
}