<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 10:08:24 
* Descripcion : SemestreController.php
* ---------------------------------------
*/ 
 
namespace Maestro\Controllers;

use \Vendor\Controller;
use \Maestro\Filters\SemestreFilter;

class SemestreController extends \Maestro\Models\SemestreModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use SemestreFilter {
        SemestreFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->__fConstruct();  /* se ejecuta el constructor del FILTER */
        $this->import(["Maestro" => "TipoSemestre"]);
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

    public function findSemestre() {
        echo json_encode($this->consulta());
    }   
    public function getTipo() {
        
        echo json_encode(Obj()->Maestro->TipoSemestreController->getTipoSemestre());
    } 
}