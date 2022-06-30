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

$out = '';
foreach (explode('.', $q) as $i) {
    $i = trim($i);
    if(strlen($i) == 0) continue;
    $i = urlencode($i);
    $url = "https://translate.google.com/m?hl=en&sl=$sl&tl=$tl&ie=UTF-8&prev=_m&q=$i";
    $str = file_get_contents($url);
    preg_match_all('/<div class="result-container">(.*?)<\/div>/s', $str, $matches);
    $out .= $matches[1][0] . ' ';
}

echo htmlspecialchars_decode($out, ENT_QUOTES);
