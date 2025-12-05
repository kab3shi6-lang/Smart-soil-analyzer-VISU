# PowerShell script to read and display files
$baseDir = "c:\Users\Akena\OneDrive\Desktop\smart_soil_website"
$files = @("bridge.js", "advanced-v5.html", "app-advanced.js")

foreach ($file in $files) {
    $filePath = Join-Path $baseDir $file
    Write-Host ("=" * 100)
    Write-Host "FILE: $file"
    Write-Host ("=" * 100)
    Write-Host ""
    
    if (Test-Path $filePath) {
        Get-Content $filePath
    } else {
        Write-Host "FILE NOT FOUND: $filePath"
    }
    
    Write-Host ""
    Write-Host ("=" * 100)
    Write-Host ""
}
