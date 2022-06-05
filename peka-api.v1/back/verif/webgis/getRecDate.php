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
	
	$query = "SELECT DISTINCT epoch_time::timestamp AS nve, to_char(epoch_time, 'DD Mon YYYY HH:MI:SS') AS psd, rid AS id FROM rekomendasi ORDER BY epoch_time DESC LIMIT 10 OFFSET $1";
		
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
