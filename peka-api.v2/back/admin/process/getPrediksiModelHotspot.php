<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] == 'admin') {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT otid as id, file_name as nama, get_time as time, status as status
                        FROM output WHERE status!='deleted' ORDER BY get_time DESC LIMIT 50";
            $rows = array();
            $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
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
