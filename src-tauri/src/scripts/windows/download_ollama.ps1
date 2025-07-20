# Check if Ollama is already installed
$ollamaPath = Get-Command "ollama" -ErrorAction SilentlyContinue

if ($ollamaPath) {
    Start-Sleep -Seconds 2
    Write-Output "100"
    exit 0
}

# Setup source url and output file
$url = "https://ollama.com/download/OllamaSetup.exe"
$destination = "$env:TEMP\OllamaSetup.exe"

# Create request and get total file size
$response = Invoke-WebRequest -Uri $url -Method Head
$totalBytes = [int64]$response.Headers["Content-Length"]

# Prepare stream
$req = [System.Net.HttpWebRequest]::Create($url)
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$target = [System.IO.File]::Create($destination)

$buffer = New-Object byte[] 8192
$bytesRead = 0
$totalRead = 0
$lastPercent = -1

do {
    $read = $stream.Read($buffer, 0, $buffer.Length)
    if ($read -gt 0) {
        $target.Write($buffer, 0, $read)
        $totalRead += $read

        $percent = [math]::Floor(($totalRead / $totalBytes) * 100)
        if ($percent -ne $lastPercent) {
            Write-Output "$percent"
            $lastPercent = $percent
        }
    }
} while ($read -gt 0)

$target.Close()
$stream.Close()
