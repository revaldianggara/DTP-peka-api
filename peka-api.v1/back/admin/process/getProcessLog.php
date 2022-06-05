<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['logid']) && isset($_GET['ofs'])) {
            $tab_array = array(
                "1" => "perolehan_data",
                "2" => "preprocess",
                "3" => "input",
                "4" => "output",
                "5" => "prediksi_devegetasi",
                "6" => "webgis"
            );
            $tab2use = $tab_array[strval($_GET['logid'])];
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT file_name as name, status, get_time as time FROM ".$tab2use."
                        WHERE status!='deleted' ORDER BY get_time DESC LIMIT 30 OFFSET $1";
            $rows = array($_GET['ofs']);
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