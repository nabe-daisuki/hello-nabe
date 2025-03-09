
$updateSession = New-Object -com Microsoft.update.Session
$updateSearcher = $UpdateSession.CreateUpdateSearcher()
$updateResult = $updateSearcher.Search("IsInstalled=0")

If ($updateResult.Updates.Count -ne 0){
    $updateDownloader = $UpdateSession.CreateUpdateDownloader()
    $updatesToDownload= $updateResult.Updates | Where-Object { $_.Type -eq 1 -and $_.IsDownloaded -eq $false }
    if($updatesToDownload.Count -ne 0){
        for($i=0;$i -lt $updatesToDownload.Count;$i++){
        Write-Host "downloading..."
            $updateDownloader.Updates=$updatesToDownload[$i]
            $updatesToDownload[$i].Title
        }
        
        # $updateDownloader.Download()
    }
}
Else{
    Write-Host "no download"
}

# $updateSession=New-Object -ComObject Microsoft.Update.Session
# $updateSearcher=$updateSession.CreateUpdateSearcher()

# $searchResult=$updateSearcher.Search("IsInstalled=0")

# $updatesToDownload = $searchResult.Updates | Where-Object { $_.Type -eq 1 -and $_.IsDownloaded -eq $false }
# $updatesToDownload | %{$_.Title}
# $updateDownloader=$updateSession.CreateUpdateDownloader()
# $updateDownloader.Updates=$updatesToDownload.Updates
# Write-Host "更新プログラムのダウンロードを開始…"

# $updateDownloader.Download()

Write-Host "downloaded"

# [System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($updateDownloader) | Out-Null
# [System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($searchResult) | Out-Null
# [System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($updateSearcher) | Out-Null
# [System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($updateSession) | Out-Null

# $updateDownloader=$null
# $searchResult=$null
# $updateSearcher=$null
# $updateSession=$null

[GC]::Collect()
[GC]::WaitForPendingFinalizers()