<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 17:08:01 
* Descripcion : ParametroModel.php
* ---------------------------------------
*/ 
 
namespace Maestro\Models;

class ParametroModel extends \Vendor\DataBase {

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
        
        $this->_usurio = Obj()->Vendor->Session->get('sys_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('sys_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('sys_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('sys_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('sys_hostName');
    }

    public function mantenimiento() {
        $query = "CALL sp_app_parametro_mantenimiento (:flag,:key,:nombre,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_pkParametro,
            ':nombre' => @$this->_form->txt_descripcion,
            ':activo' => @($this->_form->chk_activo) ? $this->_form->chk_activo : 0,
            ':usuario' => $this->_usurio,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
    }

    public function consulta($all = '') {
        $query = "CALL sp_app_parametro_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
        if($all == 1){
            return $this->getRows($query, $parms);
        }else{
            return $this->getRow($query, $parms);
        }
    }
        
}