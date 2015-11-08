<?php
header('Content-Type: application/json');
?>
<?php
	require_once __DIR__.'/../includes/config_names.php';
	require_once __DIR__.'/../includes/config.php';

	// Connect to the database
	db();
	
	$sql =  "SELECT * FROM srmRgb";
	$qry = mysql_query($sql);
        echo "[";
	while($row = mysql_fetch_array($qry))
	{
		echo "{\"srm\": " . $row['srm'] . ",";
                echo " \"rgb\": \"" . $row['rgb'] . "\"},";
	}
	echo "{\"srm\": 200,\"rgb\": \"0,0,0\"}";
        echo "]";
?>
