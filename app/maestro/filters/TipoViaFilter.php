<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 17:08:16 
* Descripcion : TipoViaFilter.php
* ---------------------------------------
*/ 

namespace Maestro\Filters;

use \Vendor\ValidaForm;

trait TipoViaFilter {

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
                ->rule(["rule" => "maxlength:100"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }