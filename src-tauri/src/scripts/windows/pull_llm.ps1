# Add at the top
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

Write-Output "Start pulling"

# Run ollama pull with hidden window
Start-Process -FilePath "ollama" -ArgumentList "pull", "phi4-mini" -WindowStyle Hidden -Wait

Write-Output "Pull complete"

# Exit manually to ensure process terminates
$processesToKill = @("ollama", "ollama app")
foreach ($name in $processesToKill) {
    Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Output "Closing process: $($_.Name)"
        Stop-Process -Id $_.Id -Force
    }
}
