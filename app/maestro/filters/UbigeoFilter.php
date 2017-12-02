<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 17:08:47 
* Descripcion : UbigeoFilter.php
* ---------------------------------------
*/ 

namespace Maestro\Filters;

use \Vendor\ValidaForm;

trait UbigeoFilter {

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
                ->rule(["rule" => "minlength:3"])
                ->rule(["rule" => "maxlength:150"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }