<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        22-08-2017 12:08:42 
* Descripcion : ModalidadEstudioFilter.php
* ---------------------------------------
*/ 

namespace Academico\Filters;

use \Vendor\ValidaForm;

trait ModalidadEstudioFilter {

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
                ->rule(["rule" => "maxlength:50"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }