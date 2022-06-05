<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ( !empty( $_FILES ) && isset($_POST['nof']) && isset($_POST['fyear']) && isset($_POST['fperiod']) ) {
            $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
            $feature_dir = '/dmz/upload';
            $udir = $feature_dir . DIRECTORY_SEPARATOR . $_POST['nof'];
            $ydir = $udir . DIRECTORY_SEPARATOR . $_POST['fyear'];
            if (!is_dir($ydir)) {
                mkdir($ydir, 0777, true);
            }
            $target_dir = $ydir . DIRECTORY_SEPARATOR . $_POST['fyear'] . '_' . $_POST['fperiod'] . '_' . $_POST['nof'] . '.tif';
            if ( ! is_writeable ( $ydir ) ) {
                echo 'directory not writeable';
            }
            if (move_uploaded_file( $tempPath, $target_dir )) {
                $answer = array( 'answer' => 'File transfer completed' );
                $json = json_encode( $answer );
                echo $json;
            }
            else {
                echo 'something wrong';
            }
        } 
        else {
            echo 'No files';
        }
    }
    else {
        exit();
    }
?>