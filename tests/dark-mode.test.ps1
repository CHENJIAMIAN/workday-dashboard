param(
  [string]$HtmlPath = (Join-Path $PSScriptRoot "..\countdown.html")
)

$ErrorActionPreference = "Stop"
$html = Get-Content -Path $HtmlPath -Raw -Encoding UTF8

$checks = @(
  @{
    Name = "renders an accessible theme toggle"
    Pattern = 'id="themeToggle"[\s\S]*aria-pressed='
  },
  @{
    Name = "defines dark theme tokens"
    Pattern = '\[data-theme="dark"\][\s\S]*--bg-top:[\s\S]*--card:[\s\S]*--text:'
  },
  @{
    Name = "stores theme preference"
    Pattern = 'THEME_STORAGE_KEY[\s\S]*localStorage\.setItem\(THEME_STORAGE_KEY'
  },
  @{
    Name = "loads saved or system dark preference"
    Pattern = 'prefers-color-scheme:\s*dark[\s\S]*localStorage\.getItem\(THEME_STORAGE_KEY'
  }
)

$failed = @()
foreach ($check in $checks) {
  if ($html -notmatch $check.Pattern) {
    $failed += $check.Name
  }
}

if ($failed.Count -gt 0) {
  Write-Error ("Dark mode checks failed: " + ($failed -join "; "))
}

Write-Output "Dark mode checks passed."
