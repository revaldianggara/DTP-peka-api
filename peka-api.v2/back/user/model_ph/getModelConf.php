<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['modid'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT model_hotspot.mid as id, model_hotspot.model_name as name, model_hotspot.train_years as years, model_hotspot.ml_properties as prop, model_hotspot.forward_steps as outputts, ml_type.ml_name as mltype FROM model_hotspot
                        INNER JOIN ml_type
                        ON model_hotspot.ml_type = ml_type.mlid
                        WHERE mid=$1";
            $params = array($_GET['modid']);
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