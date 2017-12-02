<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-08-2017 22:08:55 
* Descripcion : OperacionFilter.php
* ---------------------------------------
*/ 

namespace Admision\Filters;

use \Vendor\ValidaForm;

trait OperacionFilter {

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
                ->rule(["rule" => "required"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }