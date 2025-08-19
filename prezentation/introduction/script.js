// 動画を順次読み込む
function loadVideosSequentially() {
  const videos = document.querySelectorAll('video[data-src]');
  let index = 0;

  function loadNext() {
    if (index >= videos.length) return;

    const video = videos[index];
    const src = video.getAttribute('data-src');
    if (src) {
      video.src = src;
      video.load();
    }

    index++;
    setTimeout(loadNext, 800); // 0.8秒間隔で次を読み込む（調整可）
  }

  loadNext();
}

// 再生時に全画面化
function setupFullscreenOnPlay() {
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
          console.warn("全画面化に失敗:", err);
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadVideosSequentially();
  setupFullscreenOnPlay();
});
