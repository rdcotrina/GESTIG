<?php

/*
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        14-08-2017 23:08:46 
 * Descripcion : InscripcionModel.php
 * ---------------------------------------
 */

namespace Admision\Models;

class InscripcionModel extends \Vendor\DataBase {

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
        $query = "CALL sp_adm_postulante_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
        print_r($this->_form);
        $query = "CALL sp_adm_postulante_mantenimiento (:flag,:key,:persona,:tipodocumento,:numerodocumento,:primernombre"
. ",:segundonombre,:apellidopaterno,:apellidomaterno,:fechanacimiento,:estadocivil,:telefonofijo"
. ",:telefonomovil,:correopersonal,:correocorporativo,:paisrecidencia,:ubigeorecidencia,:tipovia,:tipozona,:direccion,:paisnacimiento,:ubigeonacimiento " 
. ",:tipoprograma,:semestre,:sede,:fase,:modalidadadmision,:programaestudio,:segundaopcion,:modalidadestudio" 
. ",:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_pkInscripcion,
            ':persona' => @$this->_form->_persona,
            ':tipodocumento' => @$this->_form->lst_tipodocumento,
            ':numerodocumento' => @$this->_form->txt_numerodocumento,
            ':primernombre' => @$this->_form->txt_primernombre,
            ':segundonombre' => @$this->_form->txt_segundonombre,
            ':apellidopaterno' => @$this->_form->txt_apellidopaterno,
            ':apellidomaterno' => @$this->_form->txt_apellidomaterno,
            ':fechanacimiento' => @$this->_form->txt_fechanacimiento,
            ':estadocivil' => @$this->_form->lst_estadocivil, 
            ':sexo' => @$this->_form->rdo_sexo,
            ':telefonofijo' => @$this->_form->txt_telefonofijo,
            ':telefonomovil' => @$this->_form->txt_telefonomovil,
            ':correopersonal' => @$this->_form->txt_correopersonal,
            ':correocorporativo' => @$this->_form->txt_correocorporativo,
            ':paisrecidencia' => @$this->_form->lst_paisrecidencia,
            ':ubigeorecidencia' => @$this->_form->lst_ubigeorecidencia,
            ':tipovia' => @$this->_form->lst_tipovia,
            ':tipozona' => @$this->_form->lst_tipozona,
            ':direccion' => @$this->_form->txt_direccion,
            ':paisnacimiento' => @$this->_form->lst_paisnacimiento,
            ':ubigeonacimiento' => @$this->_form->lst_ubigeonacimiento,
            ':tipoprograma' => @$this->_form->lst_programa,
            ':semestre' => @$this->_form->lst_semestre,
            ':sede' => @$this->_form->lst_sede,
            ':fase' => @$this->_form->lst_fase,
            ':modalidadadmision' => @$this->_form->lst_modalidadadmision,
            ':programaestudio' => @$this->_form->lst_programaestudio,
            ':segundaopcion' => @$this->_form->lst_segundaopcion,
            ':modalidadestudio' => @$this->_form->lst_modalidadestudio,       
            ':usuario' => $this->_usurio,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
    }

    public function consulta3() {
        $query = "CALL sp_adm_postulante_consultar (:flag,:criterio); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
        return $this->getRow($query, $parms);
    }

    public function consulta($flag = '', $tipo_get = 1) {
        if (!empty($flag)) {
            $this->_form->_flag = $flag;
        }
        $query = "CALL sp_adm_postulante_consultar (:flag,:criterio); ";
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
