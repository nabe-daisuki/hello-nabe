# �t�@�C����: generate-video-html.ps1

# ����t�H���_�i���݂̃f�B���N�g���j
$videoDir = Join-Path (Get-Location) "video"
$outputFile = "output.html"

# .mp4 �t�@�C�����擾���A�����ŕ��ׂ�
$videos = Get-ChildItem -Path $videoDir -Filter *.mp4 | Sort-Object Name

# �w�b�_�[�����N����
$navLinks = ""
$videoBlocks = ""

$index = 1
foreach ($video in $videos) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($video.Name)
    $id = "video$index"
    $title = $baseName

    # �i�r�Q�[�V���������N
    $navLinks += "    <a href=""#$id"">$title</a>`n"

    # ����u���b�N�iposter�͏ȗ��j
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

# ���ʂ��t�@�C���o��
$htmlContent = @"
<header>
  <nav>
$navLinks  </nav>
</header>

<main class="grid">
$videoBlocks</main>
"@

Set-Content -Path $outputFile -Value $htmlContent -Encoding UTF8
Write-Host "? HTML������ $outputFile �ɏo�͂��܂���"
