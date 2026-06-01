param(
  [string]$HtmlPath = (Join-Path $PSScriptRoot "..\countdown.html")
)

$ErrorActionPreference = "Stop"
$html = Get-Content -Path $HtmlPath -Raw -Encoding UTF8

$checks = @(
  @{
    Name = "binds unassigned drag handlers once during initialization"
    Pattern = 'function bindUnassignedDropZone\(\)[\s\S]*addEventListener\("dragover"[\s\S]*bindUnassignedDropZone\(\);[\s\S]*setInterval\(updateView, 1000\)'
  },
  @{
    Name = "does not rebuild heavy dot and zone DOM every second"
    Pattern = 'let lastRenderedTimeBlockState[\s\S]*function updateTimeBlockViewsIfNeeded\([\s\S]*renderDots[\s\S]*renderUnassignedDots[\s\S]*renderZones'
  },
  @{
    Name = "renders Google Drive file picker without HTML string concatenation"
    Pattern = 'function showFilePickerModal\(files, accessToken\)[\s\S]*document\.createElement\("div"\)[\s\S]*nameEl\.textContent = f\.name'
  },
  @{
    Name = "labels countdown and zone inputs"
    Pattern = '<label for="countdownNameInput"[\s\S]*<label for="countdownDateInput"[\s\S]*<label for="zoneNameInput"'
  },
  @{
    Name = "groups countdown items with their add controls"
    Pattern = '<section class="section-card countdown-card"[\s\S]*<div class="countdown-days-header">[\s\S]*<div class="countdown-days-section">[\s\S]*id="countdownDaysList"'
  },
  @{
    Name = "uses categorized section cards instead of one mixed card"
    Pattern = '<main class="dashboard-shell">[\s\S]*<section class="section-card countdown-card"[\s\S]*<section class="section-card personal-card"[\s\S]*<section class="section-card today-card"[\s\S]*<section class="section-card workday-card"[\s\S]*<section class="section-card zone-card"[\s\S]*<section class="section-card data-card"'
  },
  @{
    Name = "makes section cards draggable with stable serialized ids"
    Pattern = 'data-card-id="countdown" draggable="true"[\s\S]*data-card-id="personal" draggable="true"[\s\S]*data-card-id="today" draggable="true"[\s\S]*data-card-id="workday" draggable="true"[\s\S]*data-card-id="zones" draggable="true"[\s\S]*data-card-id="data" draggable="true"'
  },
  @{
    Name = "persists and restores card order"
    Pattern = 'CARD_ORDER_STORAGE_KEY[\s\S]*function loadCardOrder\(\)[\s\S]*function saveCardOrder\([\s\S]*function applyCardOrder\([\s\S]*function bindCardDragging\(\)'
  },
  @{
    Name = "serializes card order in import and export data"
    Pattern = 'cardOrder: getCurrentCardOrder\(\)[\s\S]*if \(Array\.isArray\(data\.cardOrder\)\)[\s\S]*saveCardOrder\(data\.cardOrder\)'
  },
  @{
    Name = "shows 35 and 45 age milestones with equivalent dates inline"
    Pattern = 'id="yearsLeft35Label"[\s\S]*距离35岁还剩 --年（相当于 --年--月--日）[\s\S]*id="yearsLeft45Label"[\s\S]*距离45岁还剩 --年（相当于 --年--月--日）[\s\S]*function formatYearsLeftLabel\(targetAge, birthDate, now\)'
  },
  @{
    Name = "uses a semantic image role for the clock widget"
    Pattern = 'class="clock-widget" role="img" aria-label="当前真实时间时钟"'
  }
)

$failed = @()
foreach ($check in $checks) {
  if ($html -notmatch $check.Pattern) {
    $failed += $check.Name
  }
}

$duplicateSelectors = @(
  ".countdown-item",
  ".countdown-item-name",
  ".countdown-item-days",
  ".countdown-item-days.past",
  ".countdown-item-date",
  ".delete-countdown-btn"
)

foreach ($selector in $duplicateSelectors) {
  $escapedSelector = [regex]::Escape($selector)
  $count = ([regex]::Matches($html, "(?m)^\s*$escapedSelector\s*\{")).Count
  if ($count -ne 1) {
    $failed += "$selector selector should be defined once, found $count"
  }
}

if ($html -match 'fileListHTML\s*\+=') {
  $failed += "Google Drive file list should not be assembled with string concatenation"
}

if ($html -match '<main class="card">') {
  $failed += "outer layout should not be a card when section cards are used"
}

if ($failed.Count -gt 0) {
  Write-Error ("Quality checks failed: " + ($failed -join "; "))
}

Write-Output "Quality checks passed."
