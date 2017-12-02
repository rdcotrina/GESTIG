<?php

/*
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        17-08-2017 11:08:15 
 * Descripcion : UsuarioController.php
 * ---------------------------------------
 */

namespace System\Controllers;

use \Vendor\Controller;
use \System\Filters\UsuarioFilter;

class UsuarioController extends \System\Models\UsuarioModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use UsuarioFilter {
        UsuarioFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->__fConstruct();  /* se ejecuta el constructor del FILTER */
        $this->import(["system" => "Rol"]);
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

    public function findUsuario() {
        echo json_encode($this->consulta());
    }

    public function getRol() {
        echo json_encode(Obj()->System->RolController->getRoles());
    }

    public function getPersona() {
       
        $this->_form->_flag = 2;
        $this->_form->_criterio=$this->_form->_paramSearch;
        
        echo json_encode($this->consulta());
    }

}
