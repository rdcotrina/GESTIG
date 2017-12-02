<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 10:08:09 
* Descripcion : EstadoCivilController.php
* ---------------------------------------
*/ 
 
namespace Maestro\Controllers;

use \Vendor\Controller;
use \Maestro\Filters\EstadoCivilFilter;

class EstadoCivilController extends \Maestro\Models\EstadoCivilModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use EstadoCivilFilter {
        EstadoCivilFilter::__construct as private __fConstruct;
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

    public function findEstadoCivil() {
        echo json_encode($this->consulta());
    }   
    
}