<?php

namespace System\Controllers;

use \Vendor\Controller;
use \System\Filters\MenuFilter;

class MenuController extends \System\Models\MenuModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use MenuFilter {
        MenuFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->__fConstruct();  /* se ejecuta el constructor del FILTER */
    }

    public function index() {
        
    }

    public function postMantenimiento() {
        if ($this->isValidate()) {
            $data = $this->mantenimiento();
        } else {
            $data = $this->valida()->messages();
        }

        echo json_encode($data);
    }

    public function getData() {
        /*$data = Obj()->Vendor->Tools->encriptArray([
            "data" => $this->queryRows(['module'=>2,'flag'=>1]),
            "fields" => ["id_menu"]
        ]);*/

        echo json_encode($this->queryRows(['module'=>2,'flag'=>1]));
    }
    
    public function findMenu() {
        echo json_encode($this->consulta());
    }
    
    public function postDelete() {
        echo json_encode($this->mantenimiento());
    }
    
    public function postOrdenar() {
        echo json_encode($this->ordenar());
    }

}
