<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        // if (isset($_GET['locstr'])) {
        //     $tofind = '%'.$_GET['locstr'].'%';
            $dbconn = pg_connect("host=127.0.0.1 dbname=zonapotensiapi_db user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT kid as id, nama_kabupaten as nama, nama_provinsi as provinsi FROM kabupaten";
            // $query = "SELECT nama_kabupaten as nama FROM kabupaten";
            // $params = array($tofind);
            $rows = array();
            $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $rows[] = $line;
            }
            echo json_encode($rows);
            pg_free_result($result);
            pg_close($dbconn);
        // }
    }
    else {
        exit();
    }
?>