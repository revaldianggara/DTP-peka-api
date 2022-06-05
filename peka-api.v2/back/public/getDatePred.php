<?php
	ob_start('ob_gzhandler');

	if (isset($_GET['offnum']) && isset($_GET['modid'])) {
		$pgofst = $_GET['offnum'];
		$mod = $_GET['modid'];
    }
    else {
    	exit();
	}
	
	if ($mod == 0) {
		$dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
			or die('Could not connect: ' . pg_last_error());
			$query = "SELECT mid FROM model_hotspot WHERE level=$1";
			$params = array('default');
			$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
			while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
				$mod = $line['mid'];
			}
			pg_free_result($result);
			pg_close($dbconn);
	}
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
		or die('Could not connect: ' . pg_last_error());
	
	$query = "SELECT DISTINCT start_date::timestamp AS nvm, end_date::timestamp AS nve, period_id AS tid, to_char(start_date, 'DD Mon YYYY') AS psd, to_char(end_date, 'DD Mon YYYY') AS ped FROM prediksi_hotspot WHERE model=$2 ORDER BY start_date DESC LIMIT 1 OFFSET $1";
		
	$params = array($pgofst, $mod);
	
	// Performing SQL query
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
	$rows = array();
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		$rows[] = $line;
	}
	echo json_encode($rows);
	pg_free_result($result);
	pg_close($dbconn);
?>
