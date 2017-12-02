<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 10:08:01 
* Descripcion : TipoSemestreController.php
* ---------------------------------------
*/ 
 
namespace Maestro\Controllers;

use \Vendor\Controller;
use \Maestro\Filters\TipoSemestreFilter;

class TipoSemestreController extends \Maestro\Models\TipoSemestreModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use TipoSemestreFilter {
        TipoSemestreFilter::__construct as private __fConstruct;
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

    public function findTipoSemestre() {
        echo json_encode($this->consulta());
    }   
    
    public function getTipoSemestre() {
        return $this->consulta(2,2);
    }  
}