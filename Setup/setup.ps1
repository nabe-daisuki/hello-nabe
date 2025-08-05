Write-Host "■ システム情報確認 ----------------"
Write-Host "PC名: $env:COMPUTERNAME"
Write-Host "ドメイン: $((Get-WmiObject Win32_ComputerSystem).Domain)"

Write-Host "■ IP/DNS情報 ----------------"
$adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "Loopback*"}
foreach ($adapter in $adapters) {
    Write-Host "IP: $($adapter.IPAddress) / Prefix: $($adapter.PrefixLength)"
}
Get-DnsClientServerAddress | ForEach-Object {
    Write-Host "DNS: $($_.InterfaceAlias) => $($_.ServerAddresses -join ', ')"
}
Write-Host "NTP: $(w32tm /query /status | Select-String "Source")"

Write-Host "■ 設定変更 ----------------"
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoDriveTypeAutoRun" -Value 255
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Windows" -Name "LegacyDefaultPrinterMode" -Value 1
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "ScreenSaveActive" -Value "1"
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "ScreenSaveTimeOut" -Value "900"
powercfg -h off
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl" -Name "AutoReboot" -Value 0
Set-NetFirewallRule -DisplayGroup "ネットワーク探索" -Enabled False
Set-NetFirewallRule -DisplayGroup "ファイルとプリンターの共有" -Enabled False
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "TaskbarAl" -Value 0

# Bluetooth とスタートピンは別途記載済み
$btDevices = Get-PnpDevice | Where-Object { $_.FriendlyName -like "*Bluetooth*" -and $_.Status -eq "OK" }
foreach ($device in $btDevices) {
    $instanceId = $device.InstanceId
    # 手動でレジストリ書き換えが必要になる可能性あり
    Write-Host "Bluetooth電源管理の無効化は手動またはDriverレベルでの制御が必要: $instanceId"
}

$rdp = "$env:SystemRoot\System32\mstsc.exe"
$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Remote Desktop Connection.lnk"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($ShortcutPath)
$shortcut.TargetPath = $rdp
$shortcut.Save()

