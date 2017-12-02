<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-11-2017 10:11:28 
* Descripcion : DiezmoController.php
* ---------------------------------------
*/ 
 
namespace Proceso\Controllers;

use \Vendor\Controller;
use \Proceso\Filters\DiezmoFilter;

class DiezmoController extends \Proceso\Models\DiezmoModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use DiezmoFilter {
        DiezmoFilter::__construct as private __fConstruct;
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

    public function getPersona() {
        $this->_form->_flag = 1;
        $this->_form->_criterio = $this->_formR->term;
        echo json_encode($this->consultaAll());
    }   
    
}