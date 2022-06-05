<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['inpid']) && isset($_GET['locid']) && isset($_GET['ofs'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=zonapotensiapi_db user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT REPLACE(periods.period_name, '_', ' ') AS period, periods.start_date AS startdate, periods.stop_date AS stopdate, input_feature.value AS value FROM input_feature 
                        INNER JOIN periods ON periods.ped=input_feature.period
                        WHERE input_feature.type_id=$1 AND input_feature.loc_id=$2 ORDER BY periods.start_date DESC LIMIT 30 OFFSET $3;";
            $params = array($_GET['inpid'], $_GET['locid'], $_GET['ofs']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            $rows = array();
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $rows[] = $line;
            }
            echo json_encode($rows);
            pg_free_result($result);
            pg_close($dbconn);
        }
    }
    else {
        exit();
    }
?>