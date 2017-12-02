<?php

namespace System\Controllers;

use \Vendor\Controller;

class AppController extends \System\Models\AppModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
    }

    public function index() {
        echo "sss";
    }

    public function getLista() {
        $respuesta = [];
        $flags = explode(',', $this->_form->flags);
      
        foreach ($flags as $rs) {

            array_push($respuesta, [$rs => $this->consulta($rs)]);
        }
        echo json_encode($respuesta);
    }

}
