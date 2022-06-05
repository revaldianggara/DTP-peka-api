<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['nm'])) {
            $mldata = json_decode($_GET['nm']);
            if (isset($mldata->name) && isset($mldata->InputFeatures) && isset($mldata->YearsFeatures) && isset($mldata->outputts) && isset($mldata->mlid)) {
                $date = date('Y-m-d H:i:s');
                $dbconn = pg_connect("host=127.0.0.1 dbname=back_process user=aifire password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());
                $query = "INSERT INTO model_hotspot (model_name, fpath, ml_type, ml_properties, input_feature, output_feature, train_years, status, user_id, get_time, forward_steps)
                            VALUES ($1, $2, $3, $4, $5, (SELECT idi FROM input_type WHERE type_name = $6), $7, $8, $9, $10, $11);";
                $params = array($mldata->name, "None", $mldata->mlid, $mldata->mlprop, $mldata->InputFeatures, 'HOTSPOT', $mldata->YearsFeatures, 'waiting', $_SESSION['uid'], $date, $mldata->outputts);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                pg_free_result($result);
                pg_close($dbconn);
            }
            else {
                exit();
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