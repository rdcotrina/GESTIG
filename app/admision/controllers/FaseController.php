<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        18-08-2017 23:08:48 
* Descripcion : FaseController.php
* ---------------------------------------
*/ 
 
namespace Admision\Controllers;

use \Vendor\Controller;
use \Admision\Filters\FaseFilter;

class FaseController extends \Admision\Models\FaseModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use FaseFilter {
        FaseFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->__fConstruct();  /* se ejecuta el constructor del FILTER */
    }

    public function index() {
        
    }

    public function getGrid() {
        echo json_encode($this->grid());
    }
    
    public function postMantenimiento() {
        if ($this->isValidate()) {
            $data = $this->mantenimiento();
        } else {
            $data = $this->valida()->messages();
        }

        echo json_encode($data);
    }

    public function delete() {
        echo json_encode($this->mantenimiento());
    }

    public function findFase() {
        echo json_encode($this->consulta());
    }   
    public function getFases() {
        return $this->consulta(2,2);
    } 
}