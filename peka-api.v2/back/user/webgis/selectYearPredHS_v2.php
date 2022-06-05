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

    if (isset($_GET['year'])) {
        $dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
            or die('Could not connect: ' . pg_last_error());
        $query = "SELECT period_id AS tid, 
            split_part(period_id, '_', 2)::int as periode,
            COUNT (period_id) as count
            FROM prediksi_hotspot
            WHERE model = $1 AND extract(year FROM start_date)=$2 AND split_part(period_id, '_', 1)::int = $2
                GROUP BY start_date, period_id ORDER BY start_date ASC;";
        $params = array($mod, $_GET['year']);
        // Performing SQL query
        $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
        while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rows[] = $line;
        }
        echo json_encode($rows);
        pg_free_result($result);
        pg_close($dbconn);
    }else {
        exit();
    }
?>
