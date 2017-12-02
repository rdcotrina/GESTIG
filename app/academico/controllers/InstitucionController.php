<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        22-08-2017 18:08:28 
* Descripcion : InstitucionController.php
* ---------------------------------------
*/ 
 
namespace Academico\Controllers;

use \Vendor\Controller;
use \Academico\Filters\InstitucionFilter;

class InstitucionController extends \Academico\Models\InstitucionModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use InstitucionFilter {
        InstitucionFilter::__construct as private __fConstruct;
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

    public function findInstitucion() {
        echo json_encode($this->consulta());
    }   
    
    public function getListInstitucion() {
        return $this->consulta(2,2);
    } 
}