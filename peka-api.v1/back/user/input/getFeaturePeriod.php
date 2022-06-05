<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['inpid']) && isset($_GET['inpyear'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT xperiod as name, status FROM input
                        WHERE type_id=$1 AND xyear=$2  ORDER BY xperiod ASC";
            $params = array($_GET['inpid'], $_GET['inpyear']);
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
