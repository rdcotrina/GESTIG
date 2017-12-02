<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        14-08-2017 23:08:32 
* Descripcion : TipoDocumentoFilter.php
* ---------------------------------------
*/ 

namespace Maestro\Filters;

use \Vendor\ValidaForm;

trait TipoDocumentoFilter {

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
                ->rule(["rule" => "maxlength:70"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }