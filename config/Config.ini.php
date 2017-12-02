<?php

define('DEFAULT_LAYOUT','smart');
define('APP_COMPANY','Erp Uni');

//configurar llamada de SPs
switch (DB_MOTOR) {
    case 'mysql':
        define('SP_CALL', 'CALL ');
        define('SP_INI', '(');
        define('SP_FIN', ')');
        break;
    case 'sql':
        define('SP_CALL', 'EXEC ');
        define('SP_INI', '');
        define('SP_FIN', '');
        break;
}

require_once ROOT . 'config' . DS . 'loads' . DS . 'LoadVendor.php';
require_once ROOT . 'config' . DS . 'loads' . DS . 'LoadLibs.php';

use Vendor\Obj;

/*
 *  Clase que almacenara todos los namespaces
 */

class NP {

    private $_data = [];

    public function __set($name, $value) {
        $this->_data[$name] = $value;
    }

    public function __get($name) {
        if (isset($this->_data[$name])) {
            return $this->_data[$name]();
        } else {
            return false;
        }
    }

}


$NP = new NP();

/*
 * Agregando metodo para el namescpace VENDOR
 */
$NP->Vendor = function(){
    return Obj::run('Vendor');
};

/*
 * Agregando metodo para el namescpace LIBS
 */
$NP->Libs = function(){
    return Obj::run('Libs');
};

/*funcion global que devuelve variable global que contiene la CLASE que retorna los OBJETOS por NAMESPACE*/
function Obj(){
    return $GLOBALS['NP'];
}



