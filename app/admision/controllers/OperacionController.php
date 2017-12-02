<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-08-2017 22:08:55 
* Descripcion : OperacionController.php
* ---------------------------------------
*/ 
 
namespace Admision\Controllers;

use \Vendor\Controller;
use \Admision\Filters\OperacionFilter;

class OperacionController extends \Admision\Models\OperacionModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use OperacionFilter {
        OperacionFilter::__construct as private __fConstruct;
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

    public function findOperacion() {
        echo json_encode($this->consulta());
    }   
    
}