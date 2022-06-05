<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] == 'management') {
            if (isset($_GET['idel'])) {
                $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());
                $query = "UPDATE input_type
                            SET status='deleted'
                            WHERE idi=$1;";
                $params = array($_GET['idel']);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                pg_free_result($result);
                pg_close($dbconn);
            }
        }
    }
    else {
        exit();
    }
?>