# Get not installed Windows Update Programs.
function getNotInstalledPrograms{
    param($searcher)
    return $searcher.Search("IsInstalled=0")
}

function getInstalledPrograms{
    param($searcher)
    return $searcher.Search("IsInstalled=1")
}

# Get the current formatted DateTime.
function getFormattedDateTime{
    return (Get-Date -Format "yyyy/MM/dd_HH:mm:ss")
}

# logger
function logger{
    param([string]$log)
    Write-Host $log
    "$(getFormattedDateTime) | $log" >> "windowsupdate.log"
}

# Convert the ResultCode to a human-readable detail message
function resultCodeToMessage{
    param($resultCode)
    switch($resultCode){
        0{return "未開始"}
        1{return "実行中"}
        2{return "完了"}
        3{return "一部エラー"}
        4{return "エラー"}
        5{return "システムやユーザによる中止"}
    }
}

function releaseComObj{
    logger "COMオブジェクトの解放開始"
    foreach($variable in (Get-Variable)){
        if(@("$", "^", "null", "StackTrace", "foreach") -contains $variable.Name){continue}
        if($variable.Value.GetType().Name -ne "__ComObject"){continue}

        [System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($variable.Value) | Out-Null
        logger "解放されたCOMオブジェクト: $($variable.Name)"
    
        $variable.Value=$null
    }
    logger "COMオブジェクトの解放終了"
}

function recordHistory{
    param($searcher)
    $history = $searcher.QueryHistory(0, 100)
    $firstDay=Get-Date -Year (Get-Date).Year -Month (Get-Date).Month -Day 1
    $installedPrograms=@()

    $notInstalledProgramNames=@()
    $notInstalledPrograms=getNotInstalledPrograms $searcher
    if($notInstalledPrograms.Updates.Count -ne 0){
        foreach($program in $notInstalledPrograms.Updates){
            $notInstalledProgramNames+=$program.Title
        }
    }
    
    $isInstallInProgress=$false
    $needsReboot=$false
    
    foreach($entry in $history){
        if($entry.Date -lt $firstDay){continue}
        if($entry.ResultCode -ne 2){continue}
        $installedPrograms+=$entry.Title
    }
    
    foreach ($entry in $history) {
        if($entry.Date -lt $firstDay){continue}
    
        $strForReboot="なし"
        foreach($programTitle in $needsRebootPrograms){
            if($entry.Title -ne $programTitle){continue}
            $needsReboot=$true
            $strForReboot="あり"
            break
        }
    
    
        if($entry.ResultCode -ne 2){
            if($installedPrograms -contains $entry.Title){continue}
            if($notInstalledProgramNames -notcontains $entry.Title){continue}
        }
        if($entry.ResultCode -eq 1){$isInstallInProgress = $true}
        logger "インストール－$(resultCodeToMessage $entry.ResultCode)(再起動必要$strForReboot) | 日付－$(Get-Date $entry.Date -Format "yyyy-MM-dd_HH:mm:dd"): $($entry.Title)"
    }
    
    if($isInstallInProgress){
        logger "ダウンロードもしくはインストール進行中のプログラムあり"
    }else{
        logger "ダウンロードもしくはインストール進行中のプログラムなし"
    }
    
    if($needsReboot){
        logger "再起動が必要なプログラムあり"
    }else{
        logger "再起動が必要なプログラムなし"
    }
    
    if($isInstallInProgress -and $needsReboot){
        logger "ダウンロードもしくはインストール進行中のため、再起動見送り"
    }elseif(-not $isInstallInProgress -and $needsReboot){
        logger "再起動開始"
    }else{
        logger "WindowsUpdate完了"
    }
}


$session = New-Object -ComObject Microsoft.Update.Session
$collection = New-Object -ComObject Microsoft.Update.UpdateColl

$searcher = $session.CreateUpdateSearcher()
$notInstalledPrograms = getNotInstalledPrograms $searcher

If ($notInstalledPrograms.Updates.Count -ne 0){
    $downloader = $session.CreateUpdateDownloader()

    foreach($program in $notInstalledPrograms.Updates){
        # Skip the iteration if $program is 'Driver' or $program is already downloaded.
        if($program.Type -eq 2 -or $program.IsDownloaded -eq $true){continue}
        
        $collection.Add($program) | Out-Null
        
        logger "downloading... $($program.Title)"
    }

    $downloader.Updates = $collection

    if($downloader.Updates.Count -ne 0){
        $downloadResults = $downloader.Download()
        Get-Member -InputObject $downloadResults
        for($i=0; $i -lt $collection.Count; $i++){
            $downloadResult = $downloadResults.GetUpdateResult($i)
            logger "ダウンロード－$(resultCodeToMessage $downloadResult.ResultCode): $($collection.Item($i).Title)"
        }
    }else{
        logger "ダウンロードするプログラムなし"
    }
}else{
    logger "インストールするプログラムなし"
    recordHistory $searcher
    releaseComObj
    exit
}

$notInstalledPrograms = getNotInstalledPrograms $searcher
$collection.Clear()

$needsRebootPrograms=@()

If ($notInstalledPrograms.Updates.Count -ne 0){
    $installer = $session.CreateUpdateInstaller()

    foreach($program in $notInstalledPrograms.Updates){
        # Skip the iteration if $program is 'Driver' or $program is not downloaded.
        if($program.Type -eq 2 -or $program.IsDownloaded -eq $false){continue}
        $collection.Add($program) | Out-Null
        
        logger "installing... $($program.Title)"
    }

    $installer.Updates = $collection

    if($installer.Updates.Count -ne 0){
        $installResults = $installer.Install()
        Get-Member -InputObject $installResults
        for($i=0; $i -lt $collection.Count; $i++){
            $installResult = $installResults.GetUpdateResult($i)

            $strForReboot="なし"
            if($installResult.RebootRequired){
                $strForReboot="あり"
                $needsRebootPrograms+=$collection.Item($i).Title
            }
            logger "インストール－$(resultCodeToMessage $installResult.ResultCode)(再起動必要$strForReboot): $($collection.Item($i).Title)"
        }
    }else{
        logger "インストールするプログラムなし"
    }
}else{
    logger "インストールするプログラムなし"
}

recordHistory $searcher

# Release COM Object
releaseComObj

logger "end"