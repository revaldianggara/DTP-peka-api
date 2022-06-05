<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] == 'verifikator') {
            if(isset($_GET['coord']) && isset($_GET['info']) && isset($_GET['action'])) {
                date_default_timezone_set("Asia/Jakarta");
                $created_time = date("Y-m-d H:i:s");
                $coord = str_replace(',','','POINT('.$_GET['coord'].')');
                $dbconn = pg_connect("host=127.0.0.1 dbname=webgis user=aifire password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());

                $query = "INSERT INTO rekomendasi
                            (coord, keterangan, penanganan, epoch_time)
                            VALUES
                            (ST_GeomFromText($1), $2, $3, $4);";
                $params = array($coord, $_GET['info'], $_GET['action'], $created_time);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                pg_free_result($result);
                pg_close($dbconn);
            }
        }
    }
?>
