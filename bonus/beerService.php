<?php
header('Content-Type: application/json');
?>
<?php
        require_once __DIR__.'/../admin/includes/conn.php';
	require_once __DIR__.'/../admin/includes/managers/beer_manager.php';
	require_once __DIR__.'/../admin/includes/managers/tap_manager.php';
	
        $beerManager = new BeerManager();
        $tapManager = new TapManager();
	
if (isset($_POST['beerId'])) {
    $tapManager->Associate($_POST['beerId'],$_POST['tapNum']);  
    echo "{\"message\":\"success\"}";
}
else if (isset($_GET['id'])) {
    //$beer = $beerManager->GetById($_GET['id']);
    $beer = $beerManager->GetBeerAndTapInfoByBeerId($_GET['id']);
    echo $beer->toBetterJsonWithBeerId();
}
else {
    $beers = $beerManager->GetAllByCreate();
    $numBeers = count($beers);
    $idx = 0;
    echo "[";
    foreach ($beers as $beer) {
      echo $beer->toBetterJson();       
      if ($idx++ < $numBeers - 1) {
         echo ",";
      }
    }
    echo "]";
}
?>
