<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 10:08:01 
* Descripcion : TipoSemestreModel.php
* ---------------------------------------
*/ 
 
namespace Maestro\Models;

class TipoSemestreModel extends \Vendor\DataBase {

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
        $query = "CALL sp_app_semestre_tipo_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
        $query = "CALL sp_app_semestre_tipo_mantenimiento (:flag,:key,:nombre,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_pkTipoSemestre,
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

    public function consulta($flag = '', $tipo_get = 1) {
        if (!empty($flag)) {
            $this->_form->_flag = $flag;
        }
        
        $query = "CALL sp_app_semestre_tipo_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
        
        if ($tipo_get == 1) {
            return $this->getRow($query, $parms);
        } else {
            return $this->getRows($query, $parms);
        }
        
    }
        
}