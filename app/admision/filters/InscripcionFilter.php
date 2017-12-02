<?php

/*
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        14-08-2017 23:08:46 
 * Descripcion : InscripcionFilter.php
 * ---------------------------------------
 */

namespace Admision\Filters;

use \Vendor\ValidaForm;

trait InscripcionFilter {

    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }

    public function isValidate() {
        $this->valida()
                ->filter(["field" => "lst_tipodocumento", "label" => $this->_frm->title_tipo_documento])
                ->rule(["rule" => "required"])
                ->filter(["field" => "txt_numerodocumento", "label" => $this->_frm->title_numero_documento])
                ->rule(["rule" => "required"])
                ->filter(["field" => "txt_primernombre", "label" => $this->_frm->title_primernombre])
                ->rule(["rule" => "required"])
                ->filter(["field" => "txt_apellidopaterno", "label" => $this->_frm->title_apellidopaterno])
                ->rule(["rule" => "required"])
                ->filter(["field" => "txt_fechanacimiento", "label" => $this->_frm->title_fechanacimiento])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "date"])
                ->filter(["field" => "lst_estadocivil", "label" => $this->_frm->title_estadocivil])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_paisrecidencia", "label" => $this->_frm->title_pais])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_ubigeorecidencia", "label" => $this->_frm->title_ubigeo])
                ->rule(["rule" => "required"])
                ->filter(["field" => "txt_direccion", "label" => $this->_frm->title_direccion])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_paisnacimiento", "label" => $this->_frm->title_pais])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_programa", "label" => $this->_frm->title_programa])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_semestre", "label" => $this->_frm->title_semestre])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_sede", "label" => $this->_frm->title_sede])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_fase", "label" => $this->_frm->title_fase])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_modalidadadmision", "label" => $this->_frm->title_modalidadadmision])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_programaestudio", "label" => $this->_frm->title_programaestudio])
                ->rule(["rule" => "required"])
                ->filter(["field" => "lst_modalidadestudio", "label" => $this->_frm->title_modalidadestudio])
                ->rule(["rule" => "required"]) ;


        if ($this->valida()->isTrue()) {
            return true;
        }
        return false;
    }

}
