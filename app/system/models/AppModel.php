<?php

namespace System\Models;

class AppModel extends \Vendor\DataBase {

    protected $_form;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post(); 

       # print_r($_POST);
    }
 
    
    protected function consulta($flag='') {

        if(!empty($flag)){
            $this->_form->_flag = $flag;
        }
        
        $query = "CALL sp_sys_listas_consultas (:flag,:criterio) ; ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':criterio' => @$this->_form->_criterio
        ];
      
        return $this->getRows($query, $parms);   /* devuelve un registro */
    }
     

}
