$file = "c:\Nam4\ThayPhuoc\CK\event-booking-frontend\src\App.jsx"
$lines = Get-Content $file
# Keep lines 1-649 (0-indexed: 0..648) and lines 894 onwards (0-indexed: 893..)
$newlines = $lines[0..648] + $lines[893..($lines.Length-1)]
$newlines | Set-Content $file -Encoding UTF8
Write-Host "Done! Total lines: $($newlines.Length)"
