<?php

namespace Vendor;

use Exception;
use Vendor\Obj;

final class Bootstrap {

    public function run() {
        $module = Obj()->Vendor->Request->getModule();
        $controller = Obj()->Vendor->Request->getController();
        $method = Obj()->Vendor->Request->getMethod();
        $args = Obj()->Vendor->Request->getArgs();

        $controllerFile = ucfirst($controller) . 'Controller';
        $filterFile = ucfirst($controller) . 'Filter';
        $modelFile = ucfirst($controller) . 'Model';

        $namespace = '\\' . ucfirst($module) . '\\Controllers\\' . $controllerFile;    #namespace del controlador


        $urlController = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . 'controllers' . DS . $controllerFile . '.php';
        $urlFilter = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . 'filters' . DS . $filterFile . '.php';
        $urlModel = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . 'models' . DS . $modelFile . '.php';

        /* cargando trait filter q contiene validacion de formulario */
        if (is_readable($urlFilter)) {
            require_once ($urlFilter);
        }
        /* cargando el modelo */
        if (is_readable($urlModel)) {
            require_once ($urlModel);
        }

        if (is_readable($urlController)) {
            require_once ($urlController);
            Obj()->Vendor->Registry->addClass($controllerFile, $namespace); #registro de clase

            /* el namespace */
            $MMDD = ucfirst($module);

            /* se crea objeto por el cual se accedera a sus clases */
            eval('
                use Vendor\Obj;
                Obj()->' . $MMDD . ' = function(){
                return Obj::run("' . $MMDD . '");
            };');

            /* se verifica si el metodo existe en el controller */
            if (!is_callable([Obj()->$MMDD->$controllerFile, $method])) {
                throw new Exception('Error de Controlador Metodo: <b>' . $method . '</b> no encontrado.');
            }

            /* si se envia parametros se ejecuta el metodo y se los envia */
            if (isset($args)) {
                call_user_func_array([Obj()->$MMDD->$controllerFile, $method], $args);
            } else {
                /* si no tiene parametros solo se ejecuta el metodo */
                call_user_func([Obj()->$MMDD->$controllerFile, $method]);
            }
        } else {
            throw new Exception('Error de Controlador: <b>' . $urlController . '</b> no encontrado.');
        }
    }

}
