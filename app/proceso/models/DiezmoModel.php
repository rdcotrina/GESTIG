<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-11-2017 10:11:28 
* Descripcion : DiezmoModel.php
* ---------------------------------------
*/ 
 
namespace Proceso\Models;

class DiezmoModel extends \Vendor\DataBase {

    protected $_form;   
    protected $_formR; 
    private $_pFilterCols;
    private $_usurio;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_formR = Obj()->Vendor->Request->allForm()->request();
        
        $this->_pFilterCols    =   @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)),ENT_QUOTES);

        $this->_usurio = Obj()->Vendor->Session->get('sys_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('sys_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('sys_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('sys_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('sys_hostName');
    }

    public function grid(){
        $query = "CALL sp_ig_diezmo_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
                
    public function mantenimiento() {
        $query = "CALL sp_ig_diezmo_mantenimiento (:flag,:key,:pkPersona,:importe,:tipoMoneda,:fecha,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => @$this->_form->_flag,
            ':key' => @$this->_form->_pkDiezmo,
            ':pkPersona' => @$this->_form->_pkPersona,
            ':importe' => @$this->_form->txt_importe,
            ':tipoMoneda' => @$this->_form->lst_tipomoneda,
            ':fecha' => Obj()->Vendor->Tools->dateFormatServer(@$this->_form->txt_fecha),
            ':usuario' => $this->_usurio,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
    }

    public function consulta() {
        $query = "CALL sp_ig_diezmo_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => @$this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
        return $this->getRow($query, $parms);
    }
    
    public function consultaAll() {
        $query = "CALL sp_ig_diezmo_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => @$this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
        return $this->getRows($query, $parms);
    }
        
}