# PowerShell�X�N���v�g
# ����(video/*.mp4)��ǂݍ��݁AHTML(article)���o�͂���
# img/����.jpg ���A�C�R���Ƃ��ė��p

$videoDir = "video"
$outputFile = "articles.html"

# �o�͂���U�N���A
"" | Out-File $outputFile -Encoding UTF8

# video�t�H���_�̑Smp4������
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

Write-Host "HTML�� $outputFile �ɏo�͂��܂����B"
