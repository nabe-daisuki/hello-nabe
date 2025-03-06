
# コンピュータ名の取得
Write-Host "コンピュータ名：$env:COMPUTERNAME"

# ドメイン名の取得
Write-Host "ドメイン名：$((Get-WmiObject -Class Win32_ComputerSystem).Domain)"

# プリンター情報の取得
$printers = Get-WmiObject -Class Win32_Printer

$defaultPrinterName="なし"
foreach ($printer in $printers) {
    if ($printer.Default){$defaultPrinterName=$printer.Name}
    if ($printer.PortName -match 'IP_') {
        Write-Host "プリンタIP：$($printer.PortName) / ドライバ名：$($printer.DriverName)"
    }
}

Write-Host "既定のプリンター：$defaultPrinterName"

# リモート接続の有効/無効
Write-Host "リモート接続：" -NoNewLine
$regKey = Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections
if($regKey.fDenyTSConnections -eq 1){
    Write-Host "無効"
}else{
    Write-Host "有効"
}

# NLAの有効/無効
Write-Host "コンピュータの接続にネットワークレベル認証の使用を求める(推奨)：" -NoNewLine
$regKey = Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name UserAuthentication
if($regKey.UserAuthentication -eq 1){
    Write-Host "有効"
}else{
    Write-Host "無効"
}

# 自動再生の有効/無効
# Write-Host "自動再生：" -NoNewLine
# try{
#     $regKey = Get-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\AutoplayHandlers" -Name DisableAutoplay
#     if($regKey.DisableAutoplay){
#         Write-Host "無効"
#     }else{
#         Write-Host "有効"
#     }
# }catch{
#     Write-Host "有効"
# }

# スクリーンセーバー（再開時にログオン画面に戻る）
Write-Host "再開時にログオン画面に戻る：" -NoNewLine
$regKey = Get-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name ScreenSaverIsSecure
if($regKey.ScreenSaverIsSecure -eq 1){
    Write-Host "有効"
}else{
    Write-Host "無効"
}

# NTPサーバーの取得
Write-Host "NTPサーバー：" -NoNewLine
$regKey = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\W32Time\Parameters" -Name NtpServer
Write-Host ($regKey.NtpServer -split ",")[0]






