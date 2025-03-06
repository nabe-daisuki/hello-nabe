
# �R���s���[�^���̎擾
Write-Host "�R���s���[�^���F$env:COMPUTERNAME"

# �h���C�����̎擾
Write-Host "�h���C�����F$((Get-WmiObject -Class Win32_ComputerSystem).Domain)"

# �v�����^�[���̎擾
$printers = Get-WmiObject -Class Win32_Printer

$defaultPrinterName="�Ȃ�"
foreach ($printer in $printers) {
    if ($printer.Default){$defaultPrinterName=$printer.Name}
    if ($printer.PortName -match 'IP_') {
        Write-Host "�v�����^IP�F$($printer.PortName) / �h���C�o���F$($printer.DriverName)"
    }
}

Write-Host "����̃v�����^�[�F$defaultPrinterName"

# �����[�g�ڑ��̗L��/����
Write-Host "�����[�g�ڑ��F" -NoNewLine
$regKey = Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections
if($regKey.fDenyTSConnections -eq 1){
    Write-Host "����"
}else{
    Write-Host "�L��"
}

# NLA�̗L��/����
Write-Host "�R���s���[�^�̐ڑ��Ƀl�b�g���[�N���x���F�؂̎g�p�����߂�(����)�F" -NoNewLine
$regKey = Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name UserAuthentication
if($regKey.UserAuthentication -eq 1){
    Write-Host "�L��"
}else{
    Write-Host "����"
}

# �����Đ��̗L��/����
# Write-Host "�����Đ��F" -NoNewLine
# try{
#     $regKey = Get-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\AutoplayHandlers" -Name DisableAutoplay
#     if($regKey.DisableAutoplay){
#         Write-Host "����"
#     }else{
#         Write-Host "�L��"
#     }
# }catch{
#     Write-Host "�L��"
# }

# �X�N���[���Z�[�o�[�i�ĊJ���Ƀ��O�I����ʂɖ߂�j
Write-Host "�ĊJ���Ƀ��O�I����ʂɖ߂�F" -NoNewLine
$regKey = Get-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name ScreenSaverIsSecure
if($regKey.ScreenSaverIsSecure -eq 1){
    Write-Host "�L��"
}else{
    Write-Host "����"
}

# NTP�T�[�o�[�̎擾
Write-Host "NTP�T�[�o�[�F" -NoNewLine
$regKey = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\W32Time\Parameters" -Name NtpServer
Write-Host ($regKey.NtpServer -split ",")[0]






