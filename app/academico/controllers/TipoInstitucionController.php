<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        21-08-2017 13:08:18 
* Descripcion : TipoInstitucionController.php
* ---------------------------------------
*/ 
 
namespace Academico\Controllers;

use \Vendor\Controller;
use \Academico\Filters\TipoInstitucionFilter;

class TipoInstitucionController extends \Academico\Models\TipoInstitucionModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use TipoInstitucionFilter {
        TipoInstitucionFilter::__construct as private __fConstruct;
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

    public function findTipoInstitucion() {
        echo json_encode($this->consulta());
    }   
    
}