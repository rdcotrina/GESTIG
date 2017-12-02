<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-08-2017 22:08:55 
* Descripcion : OperacionModel.php
* ---------------------------------------
*/ 
 
namespace Admision\Models;

class OperacionModel extends \Vendor\DataBase {

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
        
        $this->_pFilterCols    =   @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)),ENT_QUOTES);

        $this->_usurio = Obj()->Vendor->Session->get('sys_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('sys_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('sys_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('sys_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('sys_hostName');
    }

    public function grid(){
        $query = "CALL sp_adm_calificacion_operacion_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query,$parms);
       
        return $data;
    }

    public function consulta() {
        $query = "CALL sp_adm_calificacion_operacion_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
        return $this->getRow($query, $parms);
    }
        
}