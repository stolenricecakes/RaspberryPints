<?php
header('Content-Type: application/json');
?>
<?php
	require_once __DIR__.'/../admin/includes/conn.php';
	require_once __DIR__.'/../admin/includes/managers/tap_manager.php';

	$tapManager = new TapManager();

if (isset($_GET['beerId'])) {
  $tapManager->Associate($_GET['beerId'],$_GET['tapNumber']);   
  echo "{\"message\":\"success\"}";
}
else if (isset($_GET['tapNum'])) {
  $tapManager->Disassociate($_GET['tapNum']); 
  echo "{\"message\":\"success\"}";
}
?>

