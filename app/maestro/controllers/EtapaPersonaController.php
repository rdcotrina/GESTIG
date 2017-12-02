<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        23-11-2017 11:11:10 
* Descripcion : EtapaPersonaController.php
* ---------------------------------------
*/ 
 
namespace Maestro\Controllers;

use \Vendor\Controller;
use \Maestro\Filters\EtapaPersonaFilter;

class EtapaPersonaController extends \Maestro\Models\EtapaPersonaModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use EtapaPersonaFilter {
        EtapaPersonaFilter::__construct as private __fConstruct;
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

    public function findEtapaPersona() {
        echo json_encode($this->consulta());
    }   
    
}