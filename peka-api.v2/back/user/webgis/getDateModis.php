<?php
	ob_start('ob_gzhandler');

	if (isset($_GET['offnum'])) {
		$pgofst = $_GET['offnum'];
    }
    else {
    	exit();
    }
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
		or die('Could not connect: ' . pg_last_error());
	
	$query = "SELECT name, dir_name as ur FROM modis_rgb ORDER BY period_id DESC LIMIT 10 OFFSET $1";
	
	$params = array($pgofst);
	
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
