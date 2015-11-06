<?php
header('Content-Type: application/json');
?>
<?php
	require_once __DIR__.'/../admin/includes/conn.php';
	require_once __DIR__.'/../admin/includes/managers/tap_manager.php';

	$tapManager = new TapManager();

if (isset($_POST['id'])) {
  $tapManager->UpdateTapInfo($_POST);   
  echo "{\"message\":\"success\"}";
}
?>

