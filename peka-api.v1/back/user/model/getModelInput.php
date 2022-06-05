<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['modid'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT it.type_name
                        FROM
                            (
                                SELECT model_name, train_years, ml_properties, unnest(input_feature) AS features
                                FROM model_hotspot
                                WHERE mid = $1
                            ) mh
                        INNER JOIN
                        input_type it ON mh.features = it.idi;";
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