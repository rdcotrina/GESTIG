<?php

namespace System\Controllers;

use \Vendor\Controller;
use \System\Filters\BotonFilter;

class BotonController extends \System\Models\BotonModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use BotonFilter {
        BotonFilter::__construct as private __fConstruct;
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
    
    public function findBoton() {
        echo json_encode($this->consulta());
    }
    
}
