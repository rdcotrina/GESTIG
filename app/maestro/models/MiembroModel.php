<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        07-11-2017 16:11:30 
* Descripcion : MiembroModel.php
* ---------------------------------------
*/ 
 
namespace Maestro\Models;

class MiembroModel extends \Vendor\DataBase {

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
        $query = "CALL sp_app_persona_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
        $query = "CALL sp_app_persona_mantenimiento ("
                . ":flag,"
                . ":key,"
                . ":apellidoPaterno,"
                . ":apellidoMaterno,"
                . ":primerNombre,"
                . ":segundoNombre,"
                . ":fechaNacimiento,"
                . ":sexo,"
                . ":dni,"
                . ":tipomiembro,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname"
            . "); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_pkMiembro,
            ':apellidoPaterno' => @$this->_form->txt_apellido_paterno,
            ':apellidoMaterno' => @$this->_form->txt_apellido_materno,
            ':primerNombre' => @$this->_form->txt_primer_nombre,
            ':segundoNombre' => @$this->_form->txt_segundo_nombre,
            ':fechaNacimiento' => (@$this->_form->txt_fecha_nace)?Obj()->Vendor->Tools->dateFormatServer(@$this->_form->txt_fecha_nace):'',
            ':sexo' => @$this->_form->rd_sexo,
            ':dni' => @$this->_form->txt_dni,
            ':tipomiembro' => @$this->_form->lst_tipomiembro,
            ':usuario' => $this->_usurio,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
    }

    public function consulta() {
        $query = "CALL sp_app_persona_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
        return $this->getRow($query, $parms);
    }
        
}