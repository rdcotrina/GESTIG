<?php

namespace System\Models;

class InitModel extends \Vendor\DataBase {

    protected $_form;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post(['txtUser', 'txtClave'])->decrypt;
    }

    public function login($flag = '', $user = '', $pass = '') {

        if (empty($flag)) {
            $flag = $this->_form->_flag;
            $user = $this->_form->txtUser;
            $pass = $this->_form->txtClave;
        }

        $query = "CALL sp_sysLogin (:flag,:usuario,:clave) ; ";
        $parms = [
            ':flag' => $flag,
            ':usuario' => $user,
            ':clave' => $pass.APP_PASS_KEY
        ];
       
        if ($flag == 1) { 
            return $this->getRow($query, $parms);   /* devuelve un registro */
        } else {
            return $this->getRows($query, $parms);  /* devuelve varios registros */
        }
    }

    protected function theme_option_user2() {
        $opcion = $this->_form->valor;

        $query = "CALL sp_sys_theme_mantenimiento (:flag,:opcion,:usuario) ; ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':opcion' => ($opcion == 'true' ? '1' : ($opcion == 'false' ? '0' : $opcion)),
            ':usuario' => Obj()->Vendor->Session->get('sys_idUsuario')
        ];

        # print_r($parms);
        return $this->getRow($query, $parms);   /* devuelve un registro */
    }
    
    protected function consulta($flag='') {

        if(!empty($flag)){
            $this->_form->_flag = $flag;
        }
        
        $query = "CALL sp_sys_consultas (:flag,:criterio) ; ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];

        return $this->getRows($query, $parms);   /* devuelve un registro */
    }
    
    protected function languageMantenimiento() {
        $query = "CALL sp_sys_language_mantenimiento (:flag,:language,:idUsuario); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':language' => @$this->_form->_language,
            ':idUsuario' => Obj()->Vendor->Session->get('sys_idUsuario')
        ];
        return $this->getRow($query, $parms);   /* devuelve un registro */
    }

}
