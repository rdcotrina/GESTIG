<?php

/*
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        09-11-2017 10:11:28 
 * Descripcion : DiezmoController.php
 * ---------------------------------------
 */

namespace Android\Controllers;

use \Vendor\Controller;

class AndroidController extends \Android\Models\AndroidModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->import(["system" => "Init"]);
    }

    public function index() {
        
    }

    public function postLogin($user, $pass) {
        $data = Obj()->System->InitController->login(1, $user, $pass);
        if (count($data) > 1) {
            $rs = [
                'success' => 1,
                'message' => 'Ingreso correcto.',
                'nameUser' => $data['nombre_completo'],
                'idUser' => $data['id_usuario']
            ];
        } else {
            $rs = [
                'success' => 0,
                'message' => 'Error de ususario o contraseña'
            ];
        }
        echo json_encode($rs);
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

    public function getPersonas($ig) {
        $this->_form->_flag = 3;
        $this->_form->_criterio = $ig;
        
        $rs = [
            'success'=>1,
            'data' =>$this->consultaAll()
        ];
        echo json_encode($rs);
    }
    
}
