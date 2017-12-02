<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        14-08-2017 23:08:32 
* Descripcion : TipoDocumentoController.php
* ---------------------------------------
*/ 
 
namespace Maestro\Controllers;

use \Vendor\Controller;
use \Maestro\Filters\TipoDocumentoFilter;

class TipoDocumentoController extends \Maestro\Models\TipoDocumentoModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use TipoDocumentoFilter {
        TipoDocumentoFilter::__construct as private __fConstruct;
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

    public function findTipoDocumento() {
        echo json_encode($this->consulta());
    }   
    
}