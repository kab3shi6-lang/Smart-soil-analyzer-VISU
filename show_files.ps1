$files = @(
    'c:\Users\Akena\OneDrive\Desktop\smart_soil_website\bridge.js',
    'c:\Users\Akena\OneDrive\Desktop\smart_soil_website\package.json',
    'c:\Users\Akena\OneDrive\Desktop\smart_soil_website\bluetooth-test.js',
    'c:\Users\Akena\OneDrive\Desktop\smart_soil_website\advanced-v5.html'
)

foreach ($file in $files) {
    Write-Host "===== FILE: $file =====" -ForegroundColor Green
    if (Test-Path $file) {
        Get-Content $file
    } else {
        Write-Host "FILE NOT FOUND"
    }
    Write-Host ""
}
