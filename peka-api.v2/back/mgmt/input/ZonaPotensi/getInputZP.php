<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['inpft']) && isset($_GET['period']) && isset($_GET['locid']) && isset($_GET['val'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=zonapotensiapi_db user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "INSERT INTO input_feature
                            (period, type_id, loc_id, value)
                            (SELECT ped, $1, $2, $3 FROM periods WHERE period_name=$4)
                        ON CONFLICT DO NOTHING";
            $params = array($_GET['inpft'], $_GET['locid'], $_GET['val'], $_GET['period']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            pg_free_result($result);
            pg_close($dbconn);
        }
    }
    else {
        exit();
    }
?>
