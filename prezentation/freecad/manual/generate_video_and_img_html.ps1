# PowerShellスクリプト
# 動画(video/*.mp4)を読み込み、HTML(article)を出力する
# img/同名.jpg をアイコンとして利用

$videoDir = "video"
$outputFile = "articles.html"

# 出力を一旦クリア
"" | Out-File $outputFile -Encoding UTF8

# videoフォルダの全mp4を処理
Get-ChildItem -Path $videoDir -Filter *.mp4 | ForEach-Object {
    $baseName = $_.BaseName
    $videoPath = "video/$($baseName).mp4"
    $imgPath   = "img/$($baseName).jpg"

    $article = @"
<article>
  <h3>
    <img src="$imgPath" alt="icon" class="icon">
    $baseName
  </h3>
  <video
    data-src="$videoPath"
    preload="none"
    muted
    playsinline
    controls
  ></video>
</article>
"@

    Add-Content -Path $outputFile -Value $article
}

Write-Host "HTMLを $outputFile に出力しました。"
