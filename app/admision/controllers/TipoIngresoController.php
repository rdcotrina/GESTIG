<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-08-2017 20:08:02 
* Descripcion : TipoIngresoController.php
* ---------------------------------------
*/ 
 
namespace Admision\Controllers;

use \Vendor\Controller;
use \Admision\Filters\TipoIngresoFilter;

class TipoIngresoController extends \Admision\Models\TipoIngresoModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use TipoIngresoFilter {
        TipoIngresoFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->__fConstruct();  /* se ejecuta el constructor del FILTER */
        $this->import(["admision" => "ModalidadAdmision"]);
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

    public function findTipoIngreso() {
        echo json_encode($this->consulta());
    }   

    public function getModalidad() {
        
        echo json_encode(Obj()->Admision->ModalidadAdmisionController->getModalidadAdmision());
    }
    
    public function getListTipoIngreso() {
        return $this->consulta(2,2);
    }  
  
    
}