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

$q = urlencode($q);

$url = "https://translate.google.com/m?hl=en&sl=$sl&tl=$tl&ie=UTF-8&prev=_m&q=$q";

$str = file_get_contents($url);

preg_match_all('/<div class="result-container">(.*?)<\/div>/s', $str, $matches);
$out = $matches[1][0];
echo htmlspecialchars_decode($out, ENT_QUOTES);
