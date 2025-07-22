Write-Output "Start pulling"

# Explicitly wait for ollama pull and force exit
& ollama pull phi4-mini

Write-Output "Pull complete"

# Exit manually to ensure process terminates
$processesToKill = @("ollama", "ollama app")
foreach ($name in $processesToKill) {
    Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Output "Closing process: $($_.Name)"
        Stop-Process -Id $_.Id -Force
    }
}
