<?php

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);

require_once (ROOT . 'config' . DS . 'Config.php');
require_once (ROOT . 'config' . DS . 'Config.ini.php');

try {
    \Vendor\Registry::addClass('Registry', '\\Vendor\\Registry');
    \Vendor\Registry::addClass('Session', '\\Vendor\\Session');
    \Vendor\Registry::addClass('Bootstrap', '\\Vendor\\Bootstrap');
    \Vendor\Registry::addClass('Request', '\\Vendor\\Request');
    \Vendor\Registry::addClass('View', '\\Vendor\\View');
    \Vendor\Registry::addClass('Tools', '\\Vendor\\Tools');
    \Vendor\Registry::addClass('Aes', '\\Libs\\Aes');
    \Vendor\Registry::addClass('AesCtr', '\\Libs\\AesCtr');

    Obj()->Vendor->Session->run();
    Obj()->Vendor->Bootstrap->run();
} catch (Exception $exc) {
    echo $exc->getMessage();
}

