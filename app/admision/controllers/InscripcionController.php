<?php

/*
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        14-08-2017 23:08:46 
 * Descripcion : InscripcionController.php
 * ---------------------------------------
 */

namespace Admision\Controllers;

use \Vendor\Controller;
use \Admision\Filters\InscripcionFilter;

class InscripcionController extends \Admision\Models\InscripcionModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use InscripcionFilter {
        InscripcionFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->__fConstruct();  /* se ejecuta el constructor del FILTER */
        $this->import(["admision" => "Fase"]);
        $this->import(["admision" => "TipoIngreso"]);
      
       # $this->import(["maestro" => "Estructura"]);
    }

    public function index() {
        
    }

    public function getGrid() {
        echo json_encode($this->grid());
    }

    public function postMantenimiento() {
        if ($this->isValidate()) {
            $data = $this->mantenimiento();
        } else {
            $data = $this->valida()->messages();
        }

        echo json_encode($data);
    }

    public function delete() {
        echo json_encode($this->mantenimiento());
    }

    public function findInscripcion() {
        echo json_encode($this->consulta());
    }

    public function getFase() {

        echo json_encode(Obj()->Admision->FaseController->getFases());
    }

    public function getTipoIngreso() {

        echo json_encode(Obj()->Admision->TipoIngresoController->getListTipoIngreso());
    }

    public function getEscuela() {

     #   echo json_encode(Obj()->Maestro->EstructuraController->getListEscuela());
        echo json_encode($this->consulta(2,2));
    }
    
    public function getInstitucion() {
    $this->import(["academico" => "Institucion"]);
        echo json_encode(Obj()->Academico->InstitucionController->getListInstitucion());
    }
    public function getPersona() {
        
        $this->_form->_criterio=$this->_form->_paramSearch;
        
        echo json_encode($this->consulta(3,2));
    }
}
