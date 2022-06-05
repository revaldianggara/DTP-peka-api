<?php
    ob_start('ob_gzhandler');
    session_start();
        if (isset($_GET['year'])) {
            // devegetasi
            $dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT extract(year FROM start_date) AS year, extract(month FROM start_date) as month,
            COUNT(*) AS count
            FROM prediksi_devegetasi
            WHERE extract(year FROM start_date)=$1
            GROUP BY 1, extract(month FROM start_date);";
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
