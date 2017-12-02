<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        23-11-2017 11:11:10 
* Descripcion : EtapaPersonaFilter.php
* ---------------------------------------
*/ 

namespace Maestro\Filters;

use \Vendor\ValidaForm;

trait EtapaPersonaFilter {

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