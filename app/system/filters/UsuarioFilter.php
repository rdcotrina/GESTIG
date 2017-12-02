<?php

/*
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        17-08-2017 11:08:15 
 * Descripcion : UsuarioFilter.php
 * ---------------------------------------
 */

namespace System\Filters;

use \Vendor\ValidaForm;

trait UsuarioFilter {

    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }

    public function isValidate() {
        #print_r($_POST);
        $this->valida()
                ->filter(["field" => "txt_user", "label" => $this->_frm->user])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "minlength:3"])
                ->rule(["rule" => "maxlength:100"]) 
                ->filter(["field" => "persona", "label" => @$this->_frm->buscar_persona])
                ->rule(["rule" => "required"]) ;

        if ($this->valida()->isTrue()) {
            return true;
        }
        return false;
    }

}
