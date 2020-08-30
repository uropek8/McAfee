<?php

$method = $_SERVER['REQUEST_METHOD'];

//Script Foreach
$c = true;
if ( $method === 'POST' ) {

	$site = trim($_POST["site"]);
	$admin  = trim($_POST["admin"]);
	$from = trim($_POST["from"]);

	foreach ( $_POST as $key => $value ) {
		if ( $value != "" && $key != "site" && $key != "admin" && $key != "from" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
		}
	}
} else if ( $method === 'GET' ) {

	$site = trim($_GET["site"]);
	$admin  = trim($_GET["admin"]);
	$from = trim($_GET["from"]);

	foreach ( $_GET as $key => $value ) {
		if ( $value != "" && $key != "site" && $key != "admin" && $key != "from" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
		}
	}
}

$message = "<table style='width: 100%;'>$message</table>";

function adopt($text) {
	return '=?UTF-8?B?'.Base64_encode($text).'?=';
}

$headers = "MIME-Version: 1.0" . PHP_EOL .
"Content-Type: text/html; charset=utf-8" . PHP_EOL .
'From: '.adopt($site).' <'.$admin.'>' . PHP_EOL .
'Reply-To: '.$admin.'' . PHP_EOL;

mail($admin, adopt($from), $message, $headers );