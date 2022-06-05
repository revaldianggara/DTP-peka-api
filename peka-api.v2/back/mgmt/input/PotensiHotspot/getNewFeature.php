<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['nof'])) {
            // $feature_dir = 'D:\\tmp\\cobup';
            $feature_dir = '/dmz/upload';
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "INSERT INTO input_type (type_name, author, status)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (type_name) DO NOTHING";
            $params = array($_GET['nof'], $_SESSION['uid'], 'active');
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            pg_free_result($result);
            pg_close($dbconn);
            $udir = $feature_dir . DIRECTORY_SEPARATOR . $_GET['nof'];
            if (!is_dir($udir)) {
                mkdir($udir, 0777, true);
            }
        }
        else {
            exit();
        }
    }
    else {
        exit();
    }
?>
