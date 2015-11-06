<?php
header('Content-Type: application/json');
?>
<?php
	require_once __DIR__.'/../includes/config_names.php';
	require_once __DIR__.'/../includes/config.php';
	require_once __DIR__.'/../admin/includes/managers/tap_manager.php';

	$tapManager = new TapManager();

if (isset($_GET['beerId'])) {
  echo "yeah - beerId is here";
  $tapManager->Associate($_POST['beerId'],$_POST['tapNumber']);   
  echo "{\"message\":\"success\"}";
}
else if (isset($_GET['tapNum'])) {
  echo "yeah - tapNum is here";
  $tapManager->Disassociate($_POST['tapNum']); 
  echo "{\"message\":\"success\"}";
}
else {
	// Connect to the database
	db();

	// Setup array for all the beers that will be contained in the list
	$beers = array();
	
	
	
	$config = array();
	$sql = "SELECT * FROM config";
	$qry = mysql_query($sql);
	while($c = mysql_fetch_array($qry)){
		$config[$c['configName']] = $c['configValue'];
	}
	
	$sql =  "SELECT * FROM vwGetActiveTaps";
	$qry = mysql_query($sql);
	while($b = mysql_fetch_array($qry))
	{
		$beeritem = array(
			"id" => $b['id'],
			"beerId" => $b['beerId'],
			"beername" => $b['name'],
			"style" => $b['style'],
			"notes" => $b['notes'],
			"og" => $b['ogAct'],
			"fg" => $b['fgAct'],
			"srm" => $b['srmAct'],
			"ibu" => $b['ibuAct'],
			"startAmount" => $b['startAmount'],
			"amountPoured" => $b['amountPoured'],
			"remainAmount" => $b['remainAmount'],
			"tapNumber" => $b['tapNumber'],
			"srmRgb" => $b['srmRgb']
		);
		$beers[$b['tapNumber']] = $beeritem;
	}
	
	$numberOfTaps = $tapManager->GetTapNumber();
?>
[<?php for($i = 1; $i <= $numberOfTaps; $i++) {
?>
{"tapNum":<?php echo $i ?>,
 "beer": {<?php if (isset($beers[$i])) {
     $beer = $beers[$i];
     echo "\"id\": {$beer['id']},";
     echo "\"beerId\": {$beer['beerId']},";
     echo "\"name\": \"{$beer['beername']}\",";
     echo "\"style\": \"{$beer['style']}\",";
     echo "\"ibu\": \"{$beer['ibu']}\",";
     echo "\"og\": \"{$beer['og']}\",";
     echo "\"fg\": \"{$beer['fg']}\",";
     echo "\"srm\": \"{$beer['srm']}\",";
     echo "\"notes\": \"{$beer['notes']}\",";
     echo "\"srmRgb\": \"{$beer['srmRgb']}\"}";
  }
  else {
    echo "}";// end beer
  }
  echo "}"; // end row
  if ($i < $numberOfTaps) { 
    echo ",";
  } 
 } // end for
 echo "]"; // end doc
} // end else
?>

