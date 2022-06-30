<?php
header('Access-Control-Allow-Origin: *');

$q = $_GET['q'] ;
$tl = $_GET['tl'] ;
$sl = $_GET['sl'] ;

$q = urlencode($q);

$url = "https://translate.google.com/m?hl=en&sl=$sl&tl=$tl&ie=UTF-8&prev=_m&q=$q" ;

$str = file_get_contents($url);

preg_match_all('/<div class="result-container">(.*?)<\/div>/s', $str, $matches);
$out = $matches[1][0];
echo $out;
