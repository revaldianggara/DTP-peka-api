<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] == 'admin') {
            if(isset($_GET['user']) && isset($_GET['pass']) && isset($_GET['level'])) {
                date_default_timezone_set("Asia/Jakarta");
                $usrnm = $_GET['user'];
                $pass = $_GET['pass'];
                $levels = array(
                    "1" => "scientist",
                    "3" => "verifikator",
                    "2" => "management",
                );
                $level = $levels[$_GET['level']];
                $paswd = password_hash($pass, PASSWORD_DEFAULT);
                $salt = substr(str_shuffle(MD5(microtime())), 0, 10);
                $status = 1;
                $created_time = date("Y-m-d H:i:s");
                $email = $_GET['email'];
                $dbconn = pg_connect("host=127.0.0.1 dbname=users_db user=aifire password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());

                $query = "INSERT INTO user_fire
                            (user_name, passwd, salt, status, created_time, level, email)
                            VALUES
                            ($1, $2, $3, $4, $5, $6, $7)
                            ON CONFLICT DO NOTHING;";
                $params = array($usrnm, $paswd, $salt, $status, $created_time, $level, $email);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                pg_free_result($result);
                pg_close($dbconn);
            }
        }
    }
?>