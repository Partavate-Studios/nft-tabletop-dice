<?php 
// Expected URL Schema:
// /metadata/die.{size}.{foreground}.{background}.{font}.svg
//
// Development testing:
// php -S localhost:8000 die.svg.php

$pattern = "#/metadata/[\w]+\.(?P<sides>[\d]+)\.(?P<fgColor>[[:xdigit:]]{6})\.(?P<bgColor>[[:xdigit:]]{6})\.(?P<font>[\d]+)\.svg#";
$matches = array();

preg_match($pattern, $_SERVER["REQUEST_URI"], $matches);

// BUGFIX: There are currently only 2 fonts (0, 1), so we'll modulo the NFT font ids out of range.
$FONT_COUNT = 2;
if ((int) $matches['font'] > $FONT_COUNT - 1) {
  $matches['font'] = (int) $matches['font'] % ($FONT_COUNT);
}

// Generate a default image if the params are invalid. Hence the default fallback values
$sides = $matches['sides'] ?? 10;
$foregroundColor = $matches['fgColor'] ?? '66CC66';
$backgroundColor = $matches['bgColor'] ?? '8b10d0';
$font = $matches['font'] ?? 1;

// --- BODY OUTPUT ---

header('Content-type: image/svg+xml');
// Validators (vscode) and some PHP servers choke on "short tags"
$version='<?xml version="1.0" encoding="UTF-8"?>' ;
echo $version;

// Print the appropriate Die, as SVG
switch ($sides) {
  case '6':
    include "dynamic-svg/d6.svg.php";
    break;
  case '20':
    include "dynamic-svg/d20.svg.php";
    break;
  default:
    include "dynamic-svg/invalid.svg.php";
    break;
}