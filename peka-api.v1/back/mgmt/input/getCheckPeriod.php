<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['inname']) && isset($_GET['year'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT input.xperiod as name FROM input
                        LEFT JOIN input_type ON input.type_id=input_type.idi
                        WHERE input_type.type_name=$1 AND input.xyear=$2 ORDER BY input.xperiod ASC";
            $params = array($_GET['inname'], $_GET['year']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            $rows = array();
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $rows[] = $line;
            }
            echo json_encode($rows);
            pg_free_result($result);
            pg_close($dbconn);
        }
        else {
            exit();
        }
    }
    else {
        exit();
    }
?>