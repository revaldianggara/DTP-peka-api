<?php
    ob_start('ob_gzhandler');
    session_start();
        if (isset($_GET['year'])) {
             // prediksi hotspot
             $dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
             or die('Could not connect: ' . pg_last_error());
             $query = "SELECT start_date::timestamp AS nvm,
             period_id AS tid,
             split_part(period_id, '_', 2)::int as periode,
             COUNT (period_id) as count
             FROM prediksi_devegetasi
             WHERE extract(year FROM start_date)=$1 AND split_part(period_id, '_', 1)::int = $1
             GROUP BY start_date, period_id ORDER BY start_date ASC;";
             $params = array($_GET['year']);
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
