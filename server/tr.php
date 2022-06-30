<?php
header('Access-Control-Allow-Origin: *');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $q = $_POST['q'];
    $tl = $_POST['tl'];
    $sl = $_POST['sl'];
} else {
    $q = $_GET['q'];
    $tl = $_GET['tl'];
    $sl = $_GET['sl'];
}

function tr($q, $sl, $tl)
{
    $q = urlencode($q);
    $url = "https://translate.google.com/m?hl=en&sl=$sl&tl=$tl&ie=UTF-8&prev=_m&q=$q";
    $str = file_get_contents($url);
    preg_match_all('/<div class="result-container">(.*?)<\/div>/s', $str, $matches);
    return $matches[1][0];
}

$out = '';
$ex = explode("\n", $q);
foreach ($ex as $line) {
    $line = trim($line);
    if (strlen($line) == 0) {
        $out .= "\n";
        continue;
    }

    if (strlen($line) > 70) {
        foreach (explode('.', $line) as $p) {
            $p = trim($p);
            $out .= tr($line, $sl, $tl) . ' ';
        }
    } else {
        $out .= tr($line, $sl, $tl);
    }
    if(count($ex) > 1) $out .= "\n";
}

echo htmlspecialchars_decode($out, ENT_QUOTES);
