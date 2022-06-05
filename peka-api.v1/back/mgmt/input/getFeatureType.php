<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] == 'management') {
            $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT idi, type_name AS name, bounding_box AS bb, status, 
                            CASE WHEN status='default' THEN 'no'
                                ELSE 'yes'
                            END as own
                        FROM input_type
                        WHERE status!='deleted'";
            $params = array();
            $rows = array();
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
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