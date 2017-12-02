<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        17-08-2017 18:08:48 
* Descripcion : RolController.php
* ---------------------------------------
*/ 
 
namespace System\Controllers;

use \Vendor\Controller;
use \System\Filters\RolFilter;

class RolController extends \System\Models\RolModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use RolFilter {
        RolFilter::__construct as private __fConstruct;
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
    
    public function postMantenimientoOpcion() {
        echo json_encode($this->mantenimientoOpcion());
    }
    
    public function postMantenimientoOpcionRol() {
        echo json_encode($this->mantenimientoOpcionRol());
    }
    

    public function delete() {
        echo json_encode($this->mantenimiento());
    }

    public function findRol() {
        echo json_encode($this->consulta());
    }   
    
    public function getRoles() {
        return $this->consulta($this->_form->_flag,2);
    }  
    
    public function getRolesJSON() {
        echo json_encode($this->consulta($this->_form->_flag,2));
    }
    
    public function getEvents() {
        echo json_encode($this->consulta($this->_form->_flag,2));
    }
}