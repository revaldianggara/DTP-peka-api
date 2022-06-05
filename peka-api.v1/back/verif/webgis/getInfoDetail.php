<?php
	ob_start('ob_gzhandler');
	// Connecting, selecting database

	if (isset($_GET['fid']) && isset($_GET['type'])) {
		if (is_numeric($_GET['fid'])){
			$hsid = $_GET['fid'];
			$type_used = $_GET['type'];
		}
		else { exit(); }
    }
    else { exit(); }
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
		or die('Could not connect: ' . pg_last_error());

	$tab_used = 'prediksi_hotspot';
	$id_used = 'hid';
	if ($type_used == 'HS') {
		$tab_used = 'real_hotspot';
		$id_used = 'hid';
    }
    elseif ($type_used == 'Veg') {
		$tab_used = 'prediksi_devegetasi';
		$id_used = 'hid';
	}
	elseif ($type_used == 'rec') {
		$tab_used = 'rekomendasi';
		$id_used = 'rid';
    }

	// Performing SQL query
	$query = "SELECT ".$id_used." AS id, REPLACE(REPLACE(REPLACE(ST_AsText(coord, 5), 'POINT(', ''), ' ', ', '), ')', '')  AS coord, start_date::date AS datestr, end_date::date AS datestp, probability AS conf
			FROM ".$tab_used."
			WHERE ".$id_used." = $1;";
	if ($type_used == 'rec') {
		$query = "SELECT ".$id_used." AS id, REPLACE(REPLACE(REPLACE(ST_AsText(coord, 5), 'POINT(', ''), ' ', ', '), ')', '')  AS coord, epoch_time AS datestr, keterangan AS info, penanganan AS act
			FROM ".$tab_used."
			WHERE ".$id_used." = $1;";
	}
	$params = array($hsid);
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		echo json_encode($line);
	}
	
	pg_free_result($result);
	pg_close($dbconn);
?>
