# Check if Ollama is already installed
$ollamaPath = Get-Command "ollama" -ErrorAction SilentlyContinue

if ($ollamaPath) {
    Start-Sleep -Seconds 2
    Write-Output "100"
    exit 0
}

# Run the installer from %TEMP%
Start-Process "$env:TEMP\OllamaSetup.exe" -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NOCANCEL"

Write-Output "Waiting for installer to finish..."
Wait-Process -Name "OllamaSetup"

Start-Sleep -Seconds 3

# Automatically close Welcome Window
$processesToKill = @("ollama", "ollama app")
foreach ($name in $processesToKill) {
    Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Output "Closing process: $($_.Name)"
        Stop-Process -Id $_.Id -Force
    }
}

Write-Output "Installation and cleanup complete."
