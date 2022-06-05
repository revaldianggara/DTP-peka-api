<?php
	ob_start('ob_gzhandler');

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
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
		or die('Could not connect: ' . pg_last_error());
    
    $query = "SELECT period_id AS pid FROM prediksi_hotspot WHERE model=$1 ORDER BY start_date DESC LIMIT 1";
    $params = array($mod);
    $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $pid = $line['pid'];
    }
    pg_free_result($result);

    $query = "SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(feature)
        )
        FROM (
            SELECT jsonb_build_object(
                'type',       'Feature',
                'id',         hid,
                'geometry',   ST_AsGeoJSON(coord)::jsonb,
                'properties', to_jsonb(row) - 'hid' - 'coord'
            ) AS feature
            FROM (SELECT hid,coord,probability AS c,period_id AS pid FROM prediksi_hotspot WHERE period_id = $1 AND model=$2 AND end_date > now() - INTERVAL '16 days') row
        ) features;";
		
	$params = array($pid, $mod);
	
	// Performing SQL query
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		foreach ($line as $gjson) {
			echo $gjson;
		}
	}
	pg_free_result($result);
	pg_close($dbconn);
?>
