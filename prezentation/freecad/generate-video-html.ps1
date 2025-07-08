# ファイル名: generate-video-html.ps1

# 動画フォルダ（現在のディレクトリ）
$videoDir = Join-Path (Get-Location) "video"
$outputFile = "output.html"

# .mp4 ファイルを取得し、昇順で並べる
$videos = Get-ChildItem -Path $videoDir -Filter *.mp4 | Sort-Object Name

# ヘッダーリンク生成
$navLinks = ""
$videoBlocks = ""

$index = 1
foreach ($video in $videos) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($video.Name)
    $id = "video$index"
    $title = $baseName

    # ナビゲーションリンク
    $navLinks += "    <a href=""#$id"">$title</a>`n"

    # 動画ブロック（posterは省略可）
    $videoBlocks += @"
  <div class="tile" id="$id">
    <h2>$title</h2>
    <video 
      data-src="./video/$($video.Name)"
      muted
      loop
      controls
      preload="none"
    ></video>
  </div>

"@

    $index++
}

# 結果をファイル出力
$htmlContent = @"
<header>
  <nav>
$navLinks  </nav>
</header>

<main class="grid">
$videoBlocks</main>
"@

Set-Content -Path $outputFile -Value $htmlContent -Encoding UTF8
Write-Host "? HTML部分を $outputFile に出力しました"
