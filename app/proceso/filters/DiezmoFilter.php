<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-11-2017 10:11:28 
* Descripcion : DiezmoFilter.php
* ---------------------------------------
*/ 

namespace Proceso\Filters;

use \Vendor\ValidaForm;

trait DiezmoFilter {

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
            ->filter(["field" => "_pkPersona", "label" => $this->_frm->buscar_persona])
                ->rule(["rule" => "required"])
            ->filter(["field" => "txt_importe", "label" => $this->_frm->importe])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "number"])
            ->filter(["field" => "lst_tipomoneda", "label" => $this->_frm->moneda])
                ->rule(["rule" => "required"])
            ->filter(["field" => "txt_fecha", "label" => $this->_frm->fecha])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "date"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }