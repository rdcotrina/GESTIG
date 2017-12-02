<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        17-08-2017 18:08:48 
* Descripcion : RolFilter.php
* ---------------------------------------
*/ 

namespace System\Filters;

use \Vendor\ValidaForm;

trait RolFilter {

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
                ->filter(["field" => "txt_descripcion", "label" => $this->_frm->descripcion])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "minlength:2"])
                ->rule(["rule" => "maxlength:100"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }