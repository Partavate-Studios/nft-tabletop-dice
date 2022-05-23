<?php
# Path Schema: /metadata/<TokenName>/<sides>/<fgColorHex>/<bgColorHex>/<fontId>

header('Content-Type: application/json');

include "./colormap.php";

$urlParts = preg_split("#/#", getenv('SCRIPT_NAME'));

if (count($urlParts) < 7 || $urlParts[1] != 'metadata')
{
    $error = ["error" => "Data was missing from the tokenURI."];

    echo json_encode($error, JSON_PRETTY_PRINT);
}
else
{
    $colorLabel = ($colorMap['foregrounds']['#'.$urlParts[4]] . $colorMap['backgrounds']['#'.$urlParts[5]]);
    $fontLabel = ($urlParts[6] == 0) ? 'Occidental' : '8-Bit';

    $metadata = [
        "name" => $urlParts[2],
        "description" => "PolyDice: Dice You Own. Dice You Roll.",
        "external_url" => "https://polydice.app/",
        // /metadata/die.{size}.{background}.{foreground}.{font}.svg
        "image" => "https://polydice.app/metadata/die.$urlParts[3].$urlParts[4].$urlParts[5].$urlParts[6].svg",
        "attributes" => [
            "Sides" => $urlParts[3],
            "Dice Color" => $colorLabel,
            "font" => $fontLabel
        ],
    ];

    echo json_encode($metadata, JSON_PRETTY_PRINT);
}
