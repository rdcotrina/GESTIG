<?php

namespace System\Models;

class MenuModel extends \Vendor\DataBase {

    protected $_form;
    
    private $_usurio;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();

        $this->_usurio = Obj()->Vendor->Session->get('sys_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('sys_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('sys_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('sys_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('sys_hostName');
    }

    protected function mantenimiento() {
        
        $query = "CALL sp_mnu_mantenimiento (:flag,:key,:parent,:nmenu,:alias,:js,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_pkMenu,
            ':parent' => @$this->_form->_parent,
            ':nmenu' =>  @$this->_form->txt_descripcion,
            ':alias' => @$this->_form->txt_alias,
            ':js' => @$this->_form->txt_ajax,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usurio,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
       
        return $this->getRow($query, $parms);   /* devuelve un registro */
    }
    
    public function consulta(){
        $query = "CALL sp_mnu_consulta (:flag,:param); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':param' =>  @$this->_form->_param
        ];
        return $this->getRow($query, $parms); 
    }
    
    protected function ordenar() {
        
        $query = "CALL sp_mnu_ordenar (:ordenElements,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':ordenElements' => $this->_form->_ordenElements,
            ':usuario' => $this->_usurio,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
       
        return $this->getRow($query, $parms);   /* devuelve un registro */
    }

}
