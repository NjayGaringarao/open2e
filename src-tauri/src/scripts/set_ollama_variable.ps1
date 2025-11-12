
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

# Setting up variable
$ollamaProcesses = Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like "Ollama" -or $_.ProcessName -like "ollama*"
}
foreach ($proc in $ollamaProcesses) {
    try {
        $proc.CloseMainWindow() | Out-Null
        Start-Sleep -Milliseconds 500
        if (!$proc.HasExited) {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            Write-Output "Force-closed Ollama process $($proc.ProcessName) (PID $($proc.Id))"
        }
    }
    catch {
        Write-Output "Error closing process $($proc.ProcessName): $_"
    }
}
[System.Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")

exit 0
