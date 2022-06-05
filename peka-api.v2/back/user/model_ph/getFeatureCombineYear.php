<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['inpid']) && isset($_GET['countid'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT xyear AS name FROM input WHERE type_id = ANY($1) GROUP BY xyear HAVING COUNT(DISTINCT type_id) = $2;";
            $params = array($_GET['inpid'], $_GET['countid']);
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