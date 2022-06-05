<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['idm'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "UPDATE model_hotspot
                        SET status='prediction paused'
                        WHERE status='finish' AND mid=$1 AND user_id=$2";
            $params = array($_GET['idm'], $_SESSION['uid']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            pg_free_result($result);
            pg_close($dbconn);
        }
    }
    else {
        exit();
    }
?>
