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
        0{return "���J�n"}
        1{return "���s��"}
        2{return "����"}
        3{return "�ꕔ�G���["}
        4{return "�G���["}
        5{return "�V�X�e���⃆�[�U�ɂ�钆�~"}
    }
}

function releaseComObj{
    logger "COM�I�u�W�F�N�g�̉���J�n"
    foreach($variable in (Get-Variable)){
        if(@("$", "^", "null", "StackTrace", "foreach") -contains $variable.Name){continue}
        if($variable.Value.GetType().Name -ne "__ComObject"){continue}

        [System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($variable.Value) | Out-Null
        logger "������ꂽCOM�I�u�W�F�N�g: $($variable.Name)"
    
        $variable.Value=$null
    }
    logger "COM�I�u�W�F�N�g�̉���I��"
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
    
        $strForReboot="�Ȃ�"
        foreach($programTitle in $needsRebootPrograms){
            if($entry.Title -ne $programTitle){continue}
            $needsReboot=$true
            $strForReboot="����"
            break
        }
    
    
        if($entry.ResultCode -ne 2){
            if($installedPrograms -contains $entry.Title){continue}
            if($notInstalledProgramNames -notcontains $entry.Title){continue}
        }
        if($entry.ResultCode -eq 1){$isInstallInProgress = $true}
        logger "�C���X�g�[���|$(resultCodeToMessage $entry.ResultCode)(�ċN���K�v$strForReboot) | ���t�|$(Get-Date $entry.Date -Format "yyyy-MM-dd_HH:mm:dd"): $($entry.Title)"
    }
    
    if($isInstallInProgress){
        logger "�_�E�����[�h�������̓C���X�g�[���i�s���̃v���O��������"
    }else{
        logger "�_�E�����[�h�������̓C���X�g�[���i�s���̃v���O�����Ȃ�"
    }
    
    if($needsReboot){
        logger "�ċN�����K�v�ȃv���O��������"
    }else{
        logger "�ċN�����K�v�ȃv���O�����Ȃ�"
    }
    
    if($isInstallInProgress -and $needsReboot){
        logger "�_�E�����[�h�������̓C���X�g�[���i�s���̂��߁A�ċN��������"
    }elseif(-not $isInstallInProgress -and $needsReboot){
        logger "�ċN���J�n"
    }else{
        logger "WindowsUpdate����"
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
            logger "�_�E�����[�h�|$(resultCodeToMessage $downloadResult.ResultCode): $($collection.Item($i).Title)"
        }
    }else{
        logger "�_�E�����[�h����v���O�����Ȃ�"
    }
}else{
    logger "�C���X�g�[������v���O�����Ȃ�"
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

            $strForReboot="�Ȃ�"
            if($installResult.RebootRequired){
                $strForReboot="����"
                $needsRebootPrograms+=$collection.Item($i).Title
            }
            logger "�C���X�g�[���|$(resultCodeToMessage $installResult.ResultCode)(�ċN���K�v$strForReboot): $($collection.Item($i).Title)"
        }
    }else{
        logger "�C���X�g�[������v���O�����Ȃ�"
    }
}else{
    logger "�C���X�g�[������v���O�����Ȃ�"
}

recordHistory $searcher

# Release COM Object
releaseComObj

logger "end"