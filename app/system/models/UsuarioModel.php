<?php

/*
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        17-08-2017 11:08:15 
 * Descripcion : UsuarioModel.php
 * ---------------------------------------
 */

namespace System\Models;

class UsuarioModel extends \Vendor\DataBase {

    protected $_form;
    private $_pFilterCols;
    private $_usurio;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);

        $this->_usurio = Obj()->Vendor->Session->get('sys_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('sys_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('sys_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('sys_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('sys_hostName');
    }

    public function grid() {
        $query = "CALL sp_app_usuario_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }

    public function mantenimiento() {

        if ($this->_form->_flag == '1' || $this->_form->_flag == '2') {

            $roles = implode(',', @$this->_form->chk_rol);
        } else {
            $roles = '';
        }

        #  echo $roles;         
        $query = "CALL sp_app_usuario_mantenimiento (:flag,:key,:persona,:user,:pass,:rol,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_pkUsuario,
            ':persona' => @$this->_form->persona,
            ':user' => @$this->_form->txt_user,
            ':pass' => @($this->_form->txt_pass) ? $this->_form->txt_pass . APP_PASS_KEY : '',
            ':rol' => $roles,
            ':activo' => @($this->_form->chk_activo) ? $this->_form->chk_activo : 0,
            ':usuario' => $this->_usurio,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
         # print_r($this->_form);
        return $this->getRow($query, $parms);
    }

    public function consulta() {



        $query = "CALL sp_app_usuario_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];

        #print_r($parms);
        if ($this->_form->_flag == 2) {
            return $this->getRows($query, $parms);
        } else {
            return $this->getRow($query, $parms);
        }
    }

}
