<?php 
require_once __DIR__.'/../functions.php';
require_once __DIR__.'/../managers/beerStyle_manager.php';

class BeerUtils  
{  
  public function __construct() {}

  public function beerXmlToArray($beerXmlFile) {
          $xml = file_get_contents($beerXmlFile, false);
          
          $beerStyleManager = new BeerStyleManager();

          $beerXMLDoc = new SimpleXMLElement($xml);
          $styleName = $beerXMLDoc->RECIPE->STYLE->NAME;
          $beerStyle = $beerStyleManager->getByName($styleName);
          $beerStyleId = null;
          if (isset($beerStyle)) {
            $beerStyleId = $beerStyle->get_id();
          }
          $ary = array(
            "name" => $beerXMLDoc->RECIPE->NAME,
            "beerStyleId" => $beerStyleId,
            "notes" => $beerXMLDoc->RECIPE->TASTE_NOTES,
            "ogAct" => $beerXMLDoc->RECIPE->OG,
            "fgAct" => $beerXMLDoc->RECIPE->FG,
            "srmEst" => explode(" ", $beerXMLDoc->RECIPE->EST_COLOR)[0],
            "ibuAct" => explode(" ", $beerXMLDoc->RECIPE->IBU)[0]
          );

          return $ary;
  }
}
