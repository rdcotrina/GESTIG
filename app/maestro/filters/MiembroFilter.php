<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        07-11-2017 16:11:30 
* Descripcion : MiembroFilter.php
* ---------------------------------------
*/ 

namespace Maestro\Filters;

use \Vendor\ValidaForm;

trait MiembroFilter {

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
            ->filter(["field" => "txt_apellido_paterno", "label" => $this->_frm->title_apellidopaterno])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "minlength:3"])
            ->filter(["field" => "txt_primer_nombre", "label" => $this->_frm->title_primernombre])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "minlength:3"])
            ->filter(["field" => "txt_fecha_nace", "label" => $this->_frm->title_fechanacimiento])
                ->rule(["rule" => "date"])
            ->filter(["field" => "txt_dni", "label" => $this->_frm->dni])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "number"])
                ->rule(["rule" => "lengthchar:8"]);

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }