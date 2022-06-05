<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=zonapotensiapi_db user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT feature_id.nama_feature, kabupaten.nama_kabupaten, periods.period_name, periods.start_date, periods.stop_date, value
            FROM input_feature
            INNER JOIN feature_id ON input_feature.type_id = feature_id.fid
            INNER JOIN kabupaten ON input_feature.loc_id = kabupaten.kid
            INNER JOIN periods ON input_feature.period = periods.ped 
			ORDER BY input_feature.period DESC LIMIT 100000;";
            $rows = array();
            $headers = ['nama_feature','nama_kabupaten','period_name','start_date','stop_date','value'];
            $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
            $fp = fopen('php://output', 'w');
            if ($fp && $result) {
                header('Content-Type: text/csv');
                header('Content-Disposition: attachment; filename="data_input.csv"');
                header('Pragma: no-cache');
                header('Expires: 0');
                fputcsv($fp, $headers);
                while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                    fputcsv($fp, array_values($line));
                }
            }
            fclose($fp);
            pg_free_result($result);
            pg_close($dbconn);
    }
    else {
        exit();
    }
?>