<?php

namespace System\Controllers;

use \Vendor\Controller;

class InitController extends \System\Models\InitModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
    }

    public function index() {
        $this->_createBtnFile();
        if (Obj()->Vendor->Session->get('sys_isLogin')) {
            $this->_getLanguaje();

            /* obteniendo el menu del usuario */
            $this->_getMenuUser();

            $this->_getThemeUser();

            Obj()->Vendor->View->render('index', false);
        } else {
            Obj()->Vendor->View->render('login', false);
        }
    }

    public function postLogin() {
        $data = $this->login();

        if (count($data) > 1) {
            /*
             * Sessiones para el sistema
             */
            Obj()->Vendor->Session->set('sys_isLogin', 1);
            Obj()->Vendor->Session->set('sys_nameUser', $data['nombre_completo']);
            Obj()->Vendor->Session->set('sys_idUsuario', $data['id_usuario']);
            Obj()->Vendor->Session->set('sys_idPersona', $data['persona']);
            Obj()->Vendor->Session->set('sys_language', $data['language']);
            Obj()->Vendor->Session->set('sys_navegador', $_SERVER['HTTP_USER_AGENT']);
            Obj()->Vendor->Session->set('sys_ipPublica', $_SERVER['REMOTE_ADDR']);
            Obj()->Vendor->Session->set('sys_ipLocal', $this->_form->_ipLocal);
            Obj()->Vendor->Session->set('sys_hostName', gethostbyaddr($_SERVER['REMOTE_ADDR']));

            /* servira para javascript */
            Obj()->Vendor->Session->set('sys_idUsuarioEncrypt', Obj()->Vendor->Tools->encrypt($data['id_usuario']));
            Obj()->Vendor->Session->set('sys_idPersonaEncrypt', Obj()->Vendor->Tools->encrypt($data['persona']));

            /* grabando ultimo acceso al sistema */
            $this->login(3, $data['id_usuario']);

            /* obteniendo roles de usuario */
            $this->_getRolesUser();

            echo json_encode(['result' => 1, 'data' => $data]);
        } else {
            echo json_encode(['result' => 2, 'data' => []]);
        }
    }

    public function logOut() {
        Obj()->Vendor->Session->destroy();
        echo json_encode(['result' => 1]);
    }

    private function _getMenuUser() {
        $data = $this->login(4, Obj()->Vendor->Session->get('sys_defaultIdRol'));
        Obj()->Vendor->Session->set('sys_menuUser', $data);
    }

    private function _getRolesUser() {
        /* obteniendo los roles y cargando rol por defecto */
        $dataRol = $this->login(2, Obj()->Vendor->Session->get('sys_idUsuario'));

        Obj()->Vendor->Session->set('sys_roles', $dataRol);
        Obj()->Vendor->Session->set('sys_defaultIdRol', $dataRol[0]['id_rol']);
        Obj()->Vendor->Session->set('sys_defaultNameRol', $dataRol[0]['nrol']);
    }

    private function _getThemeUser() {
        Obj()->Vendor->Session->set('sys_themeUserArray', $this->queryRow(['module' => 2, 'flag' => 2, 'param' => Obj()->Vendor->Session->get('sys_idUsuario')]));
    }

    public function theme_option_user() {
        echo json_encode($this->theme_option_user2());
    }

    public function postChangeRol() {
        Obj()->Vendor->Session->set('sys_defaultIdRol', $this->_form->_idRol);

        foreach (Obj()->Vendor->Session->get('sys_roles') as $row) {
            if ($row['id_rol'] == $this->_form->_idRol) {
                Obj()->Vendor->Session->set('sys_defaultNameRol', $row['nrol']);
            }
        }
        echo json_encode(['result' => 1]);
    }

    private function _getLanguaje() {
        Obj()->Vendor->Session->set('sys_idioms', $this->consulta(1));

        foreach (Obj()->Vendor->Session->get('sys_idioms') as $value) {
            if ($value['language'] == Obj()->Vendor->Session->get('sys_language')) {
                Obj()->Vendor->Session->set('sys_languageFlag', $value['bandera']);
            }
        }
    }

    public function postChangeIdiom() {
        Obj()->Vendor->Session->set('sys_language', $this->_form->_language);
        echo json_encode($this->languageMantenimiento());
    }

    private function _createBtnFile() {
        $dataBtn = $this->consulta(2);

        $file = ROOT . 'config' . DS . 'prefix' . DS . 'btn.js';
        
        Obj()->Vendor->Tools->deleteFile($file);

        $fopen = fopen($file, "a");
        fwrite($fopen,'var BTNSYS = {};');
        
        foreach ($dataBtn as $value) {
            fwrite($fopen, chr(13) . chr(10) . 'BTNSYS.'.$value['alias'].' = "'.$value['alias'].'";');
        }
        fclose($fopen);
    }

}
