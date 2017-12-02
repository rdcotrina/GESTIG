<?php

class Factory {

    public static function createModulo($ruta) {
        if (!file_exists($ruta)) {
            mkdir($ruta, 0700);
            return true;
        } else {
            return false;
        }
    }

    public static function createOpcion($ruta) {
# echo "$ruta)";
        if (file_exists($ruta)) {

#  mkdir($ruta, 0700);
            if (!file_exists($ruta . '/controllers')) {
                mkdir($ruta . '/controllers', 0700);
            }
            if (!file_exists($ruta . '/models')) {
                mkdir($ruta . '/models', 0700);
            }

            if (!file_exists($ruta . '/filters')) {
                mkdir($ruta . '/filters', 0700);
            }

            if (!file_exists($ruta . '/views')) {
                mkdir($ruta . '/views', 0700);
            }
            return true;
        } else {
            return false;
        }
    }

    public static function createController($ruta, $control, $alias) {
        self::_setConstantes($alias);

        $contenido = self::_contController($ruta, $control);
        $file = $ruta . '/controllers/' . $control . 'Controller.php';


        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);

            return true;
        } else {
            return false;
        }
    }

    public static function createSP($flag, $tabla, $nombre, $colestado,$opcion) {
        $mensaje = '';
        $c_Mysql = new Mysql;
        $c_Mysql->connect();

        $conteo = 0;
        $campo_key = '';

        $query = $c_Mysql->query("SELECT 
(SELECT COUNT(SPECIFIC_NAME)  FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA='" . DB_NAME . "' and ROUTINE_TYPE='PROCEDURE' AND ROUTINE_name='$nombre') AS conteo
,(SELECT column_name FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='" . DB_NAME . "' AND TABLE_NAME='$tabla' AND column_key='PRI') AS campo_key;
");

        while ($row = $c_Mysql->fetch_row($query)) {
            $conteo = $row["conteo"];
            $campo_key = $row["campo_key"];
        }

        if ($conteo == 0) {

            if ($flag == 'G') {
                $contenido = self::_contSpGrid($tabla, $nombre, $campo_key, $colestado);
            } elseif ($flag == 'M') {
                $contenido = self::_contSpMantenimeinto($tabla, $nombre, $campo_key, $colestado,$opcion);
            } elseif ($flag == 'C') {
                $contenido = self::_contSpConsulta($tabla, $nombre, $campo_key, $colestado);
            }

            $c_Mysql->query("$contenido");

            return true;
        } else {
            return false;
        }
    }

    public static function createIndex($ruta, $control) {
        $contenido = self::_contIndex();
        $file = $ruta . '/views/' . $control . '/formIndex.js';

        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);
            return true;
        } else {
            return false;
        }
    }

    public static function createFormNew($ruta, $control, $colestado, $min, $max) {
        $contenido = self::_contFormNew($control, $colestado, $min, $max);
        $file = $ruta . '/views/' . $control . '/formNew.js';

        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);
            return true;
        } else {
            return false;
        }
    }

    public static function createFormEdit($ruta, $control, $colestado, $min, $max) {
        $contenido = self::_contFormEdit($control, $colestado, $min, $max);
        $file = $ruta . '/views/' . $control . '/formEdit.js';

        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);
            return true;
        } else {
            return false;
        }
    }

    public static function createFilter($ruta, $control, $ckb_opcion_min, $ckb_opcion_max) {
        $contenido = self::_contFilter($ruta, $control, $ckb_opcion_min, $ckb_opcion_max);
        $file = $ruta . '/filters/' . $control . 'Filter.php';


        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);
            return true;
        } else {
            return false;
        }
    }

    public static function createDirView($ruta, $control, $alias, $colestado, $btnnuevo, $btnexel, $btneditar, $btneliminar, $btnstyle) {
        $dir = $ruta . '/views/' . strtolower($control);

        if (!file_exists($dir)) {
            mkdir($dir, 0700);
            mkdir($dir . '/js', 0700);
            self::_createJsAjax($ruta, $control, $alias, $colestado, $btnnuevo, $btnexel, $btneditar, $btneliminar, $btnstyle);
            return true;
        } else {
            return false;
        }
    }

    public static function createJsDom($ruta, $control, $btnnuevo, $btneditar, $btneliminar, $colestado, $modal, $tabla) {
        $contenido = self::_contJsDom($control, $btnnuevo, $btneditar, $btneliminar, $colestado);
        $file = $ruta . '/views/' . strtolower($control) . '/js/' . $control . 'Dom.js';

        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);

            #agregaomos en el language_es.js
            if ($btnnuevo == '1' || $btneditar == '1') {

                self::_contJsLanguaje($control, $btnnuevo, $btneditar, $modal, $tabla);
            }


            return true;
        } else {
            return false;
        }
    }

    public static function createModel($ruta, $control, $sp_grid, $sp_mantenimiento, $sp_consulta) {
        $contenido = self::_contModel($ruta, $control, $sp_grid, $sp_mantenimiento, $sp_consulta);
        $file = $ruta . '/models/' . $control . 'Model.php';


        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);
            return true;
        } else {
            return false;
        }
    }

    public static function readDir($dir) {
        $l = [];
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            if ($archivo != '.' && $archivo != '..') {
                $l[] = ['dir' => $archivo];
            }
        }
        closedir($directorio);

        return $l;
    }

    public static function scanSubDir($ruta) {
        $lista = [];
        $arrpa = scandir($ruta);
        foreach ($arrpa as $dir) {
            if ($dir != '.' && $dir != '..') {
                /*    $arr = scandir($ruta.$dir);
                  foreach ($arr as $sdir) {
                  if($sdir != '.' && $sdir != '..'){

                  }
                  } */
                $lista[] = ['dir' => $dir];
            }
        }
        return $lista;
    }

    private static function _setConstantes($pre) {

        $archivo = '../config/prefix/js.js';
        $existe = 0;

        $a = str_replace('__', '', $pre);
        $a = str_replace('_', '', $a);



        #validamos si ya existe la linea
        $lineas = file($archivo);
        $buscar = "TABS.$a";

        foreach ($lineas as $linea) {

            if (strstr($linea, $buscar)) {
                $existe = 1;
                break;
            }
        }

        if ($existe == 0) {
            $fpj = fopen($archivo, 'a');
            fwrite($fpj, chr(13) . chr(10) . '    TABS.' . $a . " = '" . $pre . "';");
            fclose($fpj);
        }
    }

    public static function _createJsAjax($ruta, $control, $alias, $colestado, $btnnuevo, $btnexel, $btneditar, $btneliminar, $btnstyle) {
        $contenido = self::_contJsAjax($ruta, $control, $alias, $colestado, $btnnuevo, $btnexel, $btneditar, $btneliminar, $btnstyle);
        $file = $ruta . '/views/' . strtolower($control) . '/js/' . $control . 'Ajax.js';

        if (!file_exists($file)) {
            $fp = fopen($file, "x");
            fwrite($fp, $contenido);
            fclose($fp);
            return true;
        } else {
            return false;
        }
    }

    private static function _contController($ruta, $name) {
        $c = explode('/', $ruta);
        $namespace = ucwords($c[2]);
        $opcion = ucwords(array_shift($c));
        $opcion2 = strtolower($name);



        $cont = '<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        ' . date('d-m-Y H:m:s') . ' 
* Descripcion : ' . $name . 'Controller.php
* ---------------------------------------
*/ 
 
namespace @_namespace_@\Controllers;

use \Vendor\Controller;
use \@_namespace_@\Filters\@_name_@Filter;

class @_name_@Controller extends \@_namespace_@\Models\@_name_@Model {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use @_name_@Filter {
        @_name_@Filter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* se ejecuta el constructor del MODEL */
        $this->__cConstruct();  /* se ejecuta el constructor del CONTROLLER */
        $this->__fConstruct();  /* se ejecuta el constructor del FILTER */
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

    public function find' . $name . '() {
        echo json_encode($this->consulta());
    }   
    
}';

        $cont = str_replace("@_namespace_@", "$namespace", $cont);
        $cont = str_replace("@_name_@", "$name", $cont);

        return $cont;
    }

    private static function _contModel($ruta, $name, $sp_grid, $sp_mantenimiento, $sp_consulta) {
        $c = explode('/', $ruta);
#   $namespace = array_shift($c);
        $namespace = ucwords($c[2]);
        $model = ucwords(array_shift($c));
        $model2 = strtolower($model);

        $cont = '<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        ' . date('d-m-Y H:m:s') . ' 
* Descripcion : ' . $name . 'Model.php
* ---------------------------------------
*/ 
 
namespace ' . $namespace . '\Models;

class ' . $name . 'Model extends \Vendor\DataBase {

    protected $_form;    
    private $_pFilterCols;
    private $_usurio;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        
        $this->_pFilterCols    =   @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)),ENT_QUOTES);

        $this->_usurio = Obj()->Vendor->Session->get(\'sys_idUsuario\');
        $this->_navegador = Obj()->Vendor->Session->get(\'sys_navegador\');
        $this->_ipPublica = Obj()->Vendor->Session->get(\'sys_ipPublica\');
        $this->_ipLocal = Obj()->Vendor->Session->get(\'sys_ipLocal\');
        $this->_hostName = Obj()->Vendor->Session->get(\'sys_hostName\');
    }

    public function grid(){
        $query = "CALL ' . $sp_grid . ' (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query,$parms);
       
        return $data;
    }';

        if ($sp_mantenimiento != '') {

            $cont .= '
                
    public function mantenimiento() {
        $query = "CALL ' . $sp_mantenimiento . ' (:flag,:key,:nombre,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            \':flag\' => $this->_form->_flag,
            \':key\' => @$this->_form->_pk' . $name . ',
            \':nombre\' => @$this->_form->txt_descripcion,
            \':activo\' => @($this->_form->chk_activo) ? $this->_form->chk_activo : 0,
            \':usuario\' => $this->_usurio,
            \':ipPublica\' => $this->_ipPublica,
            \':ipLocal\' => $this->_ipLocal,
            \':navegador\' => $this->_navegador,
            \':hostname\' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
    }';
        }


        if ($sp_consulta != '') {

            $cont .= '

    public function consulta() {
        $query = "CALL ' . $sp_consulta . ' (:flag,:criterio); ";
        $parms = [
            \':flag\' => $this->_form->_flag,
            \':criterio\' => @$this->_form->_criterio
        ];
        return $this->getRow($query, $parms);
    }';
        }


        $cont .= '
        
}';

        return $cont;
    }

    private static function _contJsAjax($ruta, $name, $alias, $colestado, $btnnuevo, $btnexel, $btneditar, $btneliminar, $btnstyle) {


        $a = str_replace('__', '', $alias);
        $alias = str_replace('_', '', $a);



        $c = explode('/', $ruta);
        $namespace = ucwords($c[2]);


        $cont = '/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        ' . date('d-m-Y H:m:s') . ' 
* Descripcion : ' . $name . 'Ajax.js 
* ---------------------------------------
*/ 
"use strict";
class ' . $name . 'Ajax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = \'@_namespace_@/@_name_@/\';
        this._views = \'app/@_namespace_@/views/@_name2_@/\';
        this._idGrid' . $name . ' = null;
    }
    
    formIndex(context){
        return super.send({
            token: _tk_,
            context: this,
            root: `${this._views}formIndex.js`,
            dataAlias: context._alias,
            dataType: \'text\',
            success: function (obj) {
                $(context._container).append(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                obj.context.grid' . $name . '(context._alias);
            }
        });
    }
    
    grid' . $name . '(alias){
        $(`#${TABS.' . $alias . '}grid`).livianGrid({
            context: this,
            alias: alias,
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: "_2 ASC",
            tColumns: [
                {title: SYS_LANG_LABELS.nombre, field: "_2", width: "550", sortable: true, filter: {type: "text"}}';

        if ($colestado == '1') {
            $cont .= ',
                {
                    title: SYS_LANG_LABELS.estado,
                    width: "70",
                    field: "_3",
                    sortable: true,
                    class: "text-center",
                    filter: {
                        type: "select",
                        dataClient: [{etiqueta: SYS_LANG_LABELS.activo, value: "1"}, {etiqueta: SYS_LANG_LABELS.inactivo, value: "0"}],
                        options: {label: "etiqueta", value: "value"}
                    },
                    fnCallback: function (fila, row) {
                        return Tools.labelState(row._3);
                    }
                }';
        }
        $cont .= '
            ],';

        if ($btnnuevo == '1') {
            $cont .= '    
            tButtons:[{
                button: BTNSYS.NEW,                
                ajax: `Exe.' . $name . 'Dom.formNew' . $name . '`
            }], ';
        }

        if ($btnexel == '1') {
            $cont .= '    
            sExport: {
                buttons: {excel: true},
                nameFile: "' . $name . '",
                orientation: "landscape",
                caption: \'..\'
            },';
        }

        $cont .= '            
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,';

#  $btneditar,$btneliminar,$btnstyle

        if ($btneditar == '1' || $btneliminar == '1') {

            $cont .= '
            sAxions: {';

            if ($btnstyle == 'S') {
                $cont .= '
                buttons: [{';
            }

            if ($btneditar == '1') {
                $cont .= '
                    button: BTNSYS.EDT,
                    ajax: {
                        fn: "Exe.' . $name . 'Dom.formEdit' . $name . '",
                        serverParams: "_1"
                    }';
            }

            if ($btnstyle == 'S' && $btneditar == '1' && $btneliminar == '1') {
                $cont .= '
                }, {';
            }

            if ($btneliminar == '1') {
                $cont .= '
                    button: BTNSYS.DEL,
                    ajax: {
                        fn: "Exe.' . $name . 'Dom.delete' . $name . '",
                        serverParams: "_1"
                    }';
            }

            if ($btnstyle == 'S') {
                $cont .= '
                }]';
            }


            $cont .= '
            },
            ';
        }

        $cont .= '
            tScroll:{
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGrid' . $name . ' = oSettings.tObjectTable;
            }
        });
    }';
        if ($btnnuevo == '1') {
            $cont .= '
               
    new' . $name . '(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formNew.js`,
            dataAlias: context._alias,
            dataType: \'text\',
            success: function (obj) {
                $(\'#cont-modal-sys\').html(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormNew();
            }
        });
    }';
        }

        if ($btneditar == '1') {
            $cont .= '
               
    edit' . $name . '(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formEdit.js`,
            dataAlias: this._alias,
            dataType: \'text\',
            success: function (obj) {
                $(\'#cont-modal-sys\').html(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormEdit();
                obj.context.find' . $name . '(context);
            }
        });
    }';
        }
        if ($btnnuevo == '1') {
            $cont .= '
               
    postNew(tk) {
        return super.send({
            flag: 1,
            token: tk,
            dataAlias: this._alias,
            element: `#BCTXT_${this._alias}GRB`,
            context: this,
            root: `${this._controller}postMantenimiento`,
            form: \'#formNew\',
            dataType: \'json\'
        });
    }';
        }
        if ($btneditar == '1') {
            $cont .= '
               
    postEdit(tk, contextDom) {
        return super.send({
            flag: 2,
            token: tk,
            dataAlias: this._alias,
            element: `#BCTXT_${this._alias}UPD`,
            context: this,
            root: `${this._controller}postMantenimiento`,
            form: \'#formEdit\',
            dataType: \'json\',
            serverParams: function (sData, obj) {
                sData.push({name: \'_pk' . $name . '\', value: contextDom._key});
            }
        });
    }';
        }

        if ($btneliminar == '1') {
            $cont .= '
               
    delete(btn, tk) {
        return super.send({
            flag: 3,
            token: tk,
            dataAlias: this._alias,
            element: btn,
            context: this,
            root: `${this._controller}delete`,
            dataType: \'json\',
            serverParams: function (sData, obj) {
                sData.push({name: \'_pk' . $name . '\', value: obj.context._key});
            }
        });
    }';
        }
        $cont .= '
            
    find' . $name . '(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}find' . $name . '`,
            dataType: \'json\',
            serverParams: function (sData, obj) {
                sData.push({name: \'_criterio\', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.set' . $name . '(obj.data);
            }
        });
    }

}';


        $cont = str_replace("@_namespace_@", strtolower($namespace), $cont);
        $cont = str_replace("@_name_@", $name, $cont);
        $cont = str_replace("@_name2_@", strtolower($name), $cont);

        return $cont;
    }

    private static function _contJsDom($name, $btnnuevo, $btneditar, $btneliminar, $colestado) {


        $cont = '/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        ' . date('d-m-Y H:m:s') . ' 
* Descripcion : ' . $name . 'Dom.js
* ---------------------------------------
*/ 
"use strict";

class ' . $name . 'Dom_ extends ' . $name . 'Ajax_ {

    constructor() {
        super();
        this._alias = Exe.getAlias();                       /*alias que se agregara a cada ID y NAME del TAB*/
        this._container = `#${this._alias}_CONTAINER`;      /*<div> del TAB*/
        this._key = null;
    }

    main() {
        Tools.addTab({
            context: this,
            id: this._alias,
            label: Exe.getTitle(),
            breadCrumb: Exe.getRoot(),
            fnCallback: function (context) {
                context.index();
            }
        });
    }
    
    index(){
        super.formIndex(this);
    }
    ';

        if ($btnnuevo == '1') {
            $cont .= '
            
    formNew' . $name . '(btn, tk) {
        super.new' . $name . '(btn, this, tk).done(function () {
            $(\'#formNew\').modal(\'show\');
        });
    }';
        }

        if ($btneditar == '1') {
            $cont .= '
    
    formEdit' . $name . '(btn, id, tk) {
        this._key = id;
        super.edit' . $name . '(btn, this, tk).done(function () {
            $(\'#formEdit\').modal(\'show\');
        });
    } ';
        }

        if ($btnnuevo == '1') {
            $cont .= '
            
    addButtonsFormNew() {
        $.fn.getButtonsys({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.GRB, type: \'submit\'}]
        });
    }';
        }

        if ($btneditar == '1') {
            $cont .= '
    
    addButtonsFormEdit() {
        $.fn.getButtonsys({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.UPD, type: \'submit\'}]
        });
    } ';
        }

        if ($btnnuevo == '1') {
            $cont .= '
            
    postNew' . $name . '(tk) {
        var tthis = this;
        super.postNew(tk).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != \'error\') {
                Tools.closeModal.call(tthis, \'#formNew\');
                Tools.refreshGrid(this._idGrid' . $name . ');
            }
        });
    }';
        }

        if ($btneditar == '1') {
            $cont .= '
    
    postEdit' . $name . '(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != \'error\') {
                Tools.closeModal.call(tthis, \'#formEdit\');
                Tools.refreshGrid(this._idGrid' . $name . ');
            }
        });
    } ';
        }

        if ($btneliminar == '1') {
            $cont .= '
    
    delete' . $name . '(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGrid' . $name . ');
                });
            }
        });
    }';
        }

        if ($btneditar == '1') {
            $cont .= '
     
    set' . $name . '(data) {
        Tools.setDataForm(\'#formEdit\', {
            alias: this._alias,
            elements: [
                {item: \'txt_descripcion\', value: data._1}';
            if ($colestado == '1') {
                $cont .= ',
                {item: \'chk_activo\', value: data._2, type: \'checkbox\'}';
            }
            $cont .= ' 
            ]
        });
    } ';
        }

        $cont .= '
    
}';


        return $cont;
    }

    private static function _contFilter($ruta, $name, $ckb_opcion_min, $ckb_opcion_max) {
        $c = explode('/', $ruta);
        $namespace = ucwords($c[2]);



        $cont = '<?php
/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        ' . date('d-m-Y H:m:s') . ' 
* Descripcion : ' . $name . 'Filter.php
* ---------------------------------------
*/ 

namespace ' . $namespace . '\Filters;

use \Vendor\ValidaForm;

trait ' . $name . 'Filter {

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
                ->rule(["rule" => "required"])';

        if ($ckb_opcion_min != '') {
            $cont .= '
                ->rule(["rule" => "minlength:' . $ckb_opcion_min . '"])';
        }
        if ($ckb_opcion_max != '') {
            $cont .= '
                ->rule(["rule" => "maxlength:' . $ckb_opcion_max . '"])';
        }
        $cont .= ';

            if ($this->valida()->isTrue()) {
                return true;
            }
            return false;
        }

        }';


        return $cont;
    }

    private static function _contIndex() {

        $cont = '<div><div id = "grid"></div></div>';
        return $cont;
    }

    private static function _contSpGrid($tabla, $nombre, $campo_key, $colestado) {

        $cont = "CREATE PROCEDURE  $nombre(
        _iDisplayStart INT,
	_iDisplayLength INT, 
	_iOrderCol VARCHAR(200),
	_sFilterCols VARCHAR(300),
	_sExport CHAR(1)
    )         
        BEGIN        
        DECLARE _orderby VARCHAR(300) DEFAULT '';
	DECLARE _filterCols VARCHAR(300) DEFAULT '';
	DECLARE _limit VARCHAR(300) DEFAULT '';
	
	IF LENGTH(TRIM(_sFilterCols)) > 0 THEN
		SET _filterCols = REPLACE(_sFilterCols,'&quot;', CHAR(39));
		SET _filterCols = REPLACE(_filterCols,'*','%');
		SET _filterCols = REPLACE(_filterCols,'&gt;','>');
		SET _filterCols = REPLACE(_filterCols,'&lt;','<');
	END IF;
	
	IF LENGTH(TRIM(_iOrderCol)) > 0 THEN 
		SET _orderby = CONCAT(' ORDER BY ',_iOrderCol);
	END IF;
	
	
	SET _limit = CONCAT(' LIMIT ',_iDisplayStart,',',_iDisplayLength);
	IF _sExport = '1' THEN
		SET _limit = '';
	END IF;
	
	
	SET @sentencia = CONCAT('
	SELECT
		COUNT(*) INTO @countx 
	FROM
	(
		SELECT 
			$campo_key _1,
			" . $campo_key . "_nombre _2";

        if ($colestado == '1') {
            $cont .= ",
                        activo _3      ";
        }
        $cont .= " 
		FROM $tabla		
	) c 
	WHERE 1=1
	',_filterCols,'; 
	');
	
	PREPARE consulta FROM @sentencia;
	EXECUTE consulta;
	DEALLOCATE PREPARE consulta;
	SET @sentencia = NULL;
	
	SET @sentencia = CONCAT('
	SELECT
		*
	FROM
	(
		SELECT 
			@countx as total,
			$campo_key _1,
			" . $campo_key . "_nombre _2";

        if ($colestado == '1') {
            $cont .= ",
                        activo _3      ";
        }
        $cont .= " 
		FROM $tabla		
	) c
	WHERE 1=1
	',_filterCols,'
	',_orderby,'  
	',_limit,'; ');
		 
	PREPARE consulta FROM @sentencia;
	EXECUTE consulta;
	DEALLOCATE PREPARE consulta;
	SET @sentencia = NULL;
        
    END;";
        return $cont;
    }

    private static function _contSpMantenimeinto($tabla, $nombre, $campo_key, $colestado,$opcion) {

        $cont = "CREATE PROCEDURE  $nombre(
        _flag INT,
	_$campo_key INT,
	_" . $campo_key . "_nombre VARCHAR(150),
	_activo CHAR(1),
	_usuario VARCHAR(150),
	_ip_publica VARCHAR(150),
	_ip_local VARCHAR(150),
	_navegador VARCHAR(150), 
	_hostname VARCHAR(150)
    )         
        BEGIN        
        DECLARE _duplica INT DEFAULT 0;
	DECLARE _mensaje VARCHAR(50) DEFAULT '';
	DECLARE _ok_error VARCHAR(20) DEFAULT 'ok';
        
        IF _flag = 1 THEN
		SELECT COUNT(*) INTO _duplica FROM $tabla WHERE REPLACE(" . $campo_key . "_nombre,' ','') = REPLACE(_" . $campo_key . "_nombre,' ','');
		
		IF _duplica = 0 THEN
			INSERT INTO $tabla(				 
				" . $campo_key . "_nombre";

        if ($colestado == '1') {
            $cont .= ",
                                activo";
        }
        $cont .= ",				 
				crea_usuario,
				crea_fecha,
				crea_ip_publica,
				crea_ip_local,
				crea_navegador,
				crea_hostname
			)VALUES(
				_" . $campo_key . "_nombre";

        if ($colestado == '1') {
            $cont .= ",
                                _activo";
        }
        $cont .= ", 
				_usuario,
				NOW(),
				_ip_publica,
				_ip_local,
				_navegador, 
				_hostname
			);
			
			SET _mensaje = 'save_ok';
		ELSE
			SET _mensaje = '" . strstr($tabla, '_', true) . '.' . strtolower($opcion) . "_exist';
			SET _ok_error = 'error';
		END IF;
        ELSEIF _flag = 2 THEN
		SELECT COUNT(*) INTO _duplica FROM $tabla WHERE REPLACE(" . $campo_key . "_nombre,' ','') = REPLACE(_" . $campo_key . "_nombre,' ','') AND " . $campo_key . " != _" . $campo_key . ";
		
		IF _duplica = 0 THEN
			UPDATE $tabla SET
				" . $campo_key . "_nombre = _" . $campo_key . "_nombre";

        if ($colestado == '1') {
            $cont .= ",
                                activo=_activo";
        }
        $cont .= ",
				modifica_usuario = _usuario,
				modifica_fecha = NOW(),
				modifica_ip_publica = _ip_publica,
				modifica_ip_local = _ip_local,
				modifica_navegador = _navegador,
				modifica_hostname = _hostname    
			WHERE " . $campo_key . " = _" . $campo_key . ";
			SET _mensaje = 'edit_ok';
			
		ELSE
			SET _mensaje = '" . strstr($tabla, '_', true) . '.' . strtolower($opcion) . "_exist';
			SET _ok_error = 'error';
		END IF;
	ELSEIF _flag = 3 THEN
                
                UPDATE $tabla SET 
			eliminado = '1',
			modifica_usuario = _usuario,
			modifica_fecha = NOW(),
			modifica_ip_publica = _ip_publica,
			modifica_ip_local = _ip_local,
			modifica_navegador = _navegador,
			modifica_hostname = _hostname
		WHERE " . $campo_key . " = _" . $campo_key . ";
                -- DETERMINAR CUAL DE LOS DOS COMANDO USAR
		DELETE FROM $tabla WHERE " . $campo_key . " = _" . $campo_key . ";
		SET _mensaje = 'delete_ok';
	END IF;
	
	
	SELECT _mensaje mensaje,_duplica duplica, _ok_error ok_error;        
 
    END;";
        return $cont;
    }

    private static function _contSpConsulta($tabla, $nombre, $campo_key, $colestado) {

        $cont = "CREATE PROCEDURE  $nombre(
        _flag INT,
	_criterio varchar(100)
    )         
        BEGIN        
        -- 1: selecciona $campo_key a editar.
	
	IF _flag = 1 THEN
		SELECT  " . $campo_key . "_nombre as _1";

        if ($colestado == '1') {
            $cont .= ",
                        activo as _2";
        }
        $cont .= " 
		FROM $tabla 
		WHERE $campo_key =_criterio;
	END IF;
        
    END;";
        return $cont;
    }

    private static function _contFormNew($name, $colestado, $min, $max) {
        $max = (!empty($max))?'maxlength="' . $max . '"':'';
        $cont = '<form class="modal inmodal fade in" id="formNew" name="formNew">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="title_' . strtolower($name) . '_new"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="descripcion"></label>
                    <div class="col-lg-10">
                        <input type="text" class="form-control" id="txt_descripcion" name="txt_descripcion" ' . $max . ' /> 
                    </div>
                </div>';

        if ($colestado == '1') {
            $cont .= ' 
                <div class="form-group">
                    <label class="col-lg-2 control-label"></label>
                    <div class="col-lg-10">
                        <div class="checkbox smart-form"> 
                            <label class="checkbox">
                                <input type="checkbox" id="chk_activo" name="chk_activo" checked value="1"/>
                                <i></i> 
                                <span class="tr-language lv-checkbox" data-tr="activo"></span> 
                            </label>
                        </div> 
                    </div>
                </div> ';
        }

        $cont .= ' 
            </div>

            <div class="modal-footer">
                <span id="foot_btns"></span>
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
    <js id="js_formNew">
        $("#formNew").validate({
            ignore: [],
            rules: {
                txt_descripcion: {
                    required: true';
        if ($min != '') {
            $cont .= ',
                    minlength: ' . $min . '';
        }
        if ($max != '') {
            $cont .= ',
                    maxlength: ' . $max . '';
        }

        $cont .= ' 
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                Exe.' . $name . 'Dom.postNew' . $name . '(__PK__);
            }
        });
    </js>
</form>';
        return $cont;
    }

    private static function _contFormEdit($name, $colestado, $min, $max) {
        $cont = '<form class="modal inmodal fade in" id="formEdit" name="formEdit">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="title_' . strtolower($name) . '_edit"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="descripcion"></label>
                    <div class="col-lg-10">
                        <input type="text" class="form-control" id="txt_descripcion" name="txt_descripcion" maxlength="50" /> 
                    </div>
                </div>';

        if ($colestado == '1') {
            $cont .= ' 

                <div class="form-group">
                    <label class="col-lg-2 control-label"></label>
                    <div class="col-lg-10">
                        <div class="checkbox smart-form"> 
                            <label class="checkbox">
                                <input type="checkbox" id="chk_activo" name="chk_activo" checked value="1"/>
                                <i></i> 
                                <span class="tr-language lv-checkbox" data-tr="activo"></span> 
                            </label>
                        </div> 
                    </div>
                </div>
            </div>';
        }

        $cont .= ' 

            <div class="modal-footer">
                <span id="foot_btns"></span>
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
    <js id="js_formEdit">
        $("#formEdit").validate({
            ignore: [],
            rules: {
                txt_descripcion: {
                    required: true';
        if ($min != '') {
            $cont .= ',
                    minlength: ' . $min . '';
        }
        if ($max != '') {
            $cont .= ',
                    maxlength: ' . $max . '';
        }

        $cont .= ' 
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Exe.' . $name . 'Dom.postEdit' . $name . '(__PK__);
            }
        });
    </js>
</form> ';
        return $cont;
    }

    private static function _contJsLanguaje($name, $btnnuevo, $btneditar, $modal, $tabla) {

        $archivo = '../config/18n/language_ES.js';
//
//        $name = 'Fase';
//        $btnnuevo = '1';
//        $btneditar = '1';
//        $modal = 'a';
//        $tabla = 'adm_fase';
//
//        $archivo = 'a/language_ES.js';
        $fpj = file($archivo);

        if ($btnnuevo == '1') {
            $title_new = "title_" . strtolower($name) . "_new";
        } else {
            $title_new = '';
        }



        if ($btneditar == '1') {
            $title_edit = "title_" . strtolower($name) . "_edit";
        } else {
            $title_edit = '';
        }

        $fila = 0;
        $fila_llave = 0;
        $fila_llave_msn = 0;
        $fila_llave_mod = 0;

        $encontrado_new = 0;
        $encontrado_edit = 0;

        $prefijo = strstr($tabla, '_', true) . ': {';



        foreach ($fpj as $linea) {
            $fila++;

            #buscamos la posiscion final de array para insertarlo
            if (strstr($linea, '},/*labels_fin*/') && $fila_llave == 0) {
                $fila_llave = $fila;
            }


            #buscamos si existe el nuevo
            if (strstr($linea, $title_new) || $title_new == '') {
                $encontrado_new = 1;
            }

            #buscamos si existe el editar
            if (strstr($linea, $title_edit) || $title_edit == '') {
                $encontrado_edit = 1;
            }


            if ($encontrado_new == 1 && $encontrado_edit == 1) {
                break;
            }
        }


 

        if ($encontrado_new == 0 || $encontrado_edit == 0) {

            $fila = 0;
            $html = '';

            foreach ($fpj as $linea) {
                $fila++;

                #insertamos en la linea de la llave del array


                if ($fila == $fila_llave) {
                    if ($title_new != '' && $encontrado_new == 0) {
                        $html .= "        $title_new: 'Nuev" . $modal . " $name'" . (($title_edit != '' && $encontrado_edit == 0) ? ',' : '') . "
";
                        #. ($title_edit != '' && $encontrado_edit == 0) ? ',' : '' . "
                    }

                    if ($title_edit != '' && $encontrado_edit == 0) {
                        $html .= "        $title_edit: 'Editar $name'
";
                    }

                    $html .= $linea;
                } else {
                    if ($fila == ($fila_llave - 1)) {
                        $html .= '        ' . trim($linea) . ',
';
                        #   echo "($linea)".strrpos(trim($linea),"'").'_<br>';
                    } else {
                        $html .= $linea;
                    }
                }
            }

            #borramos el archivo
            unlink($archivo);

            #abrimos el archvo
            $fpj_ = fopen($archivo, 'x');

            fwrite($fpj_, $html);
            fclose($fpj_);
            #  $mensaje = 'Se agrego la palabra (' . $palabra . ')';
        }
##########################################################################################################

      #  $html_1 = $html;
        $fpj2 = file($archivo);

        $encontrado_prefijo = 0;
        $encontrado_exist = 0;
        $fila = 0;

        foreach ($fpj2 as $linea) {
            $fila++;


            #buscamos la posiscion final de array para insertarlo
            if (strstr($linea, '/*msn_fin*/') && $fila_llave_msn == 0) {
                $fila_llave_msn = $fila;
            }

            #buscamos la posiscion final de array para insertarlo
            if (strstr($linea, '/*' . strstr($tabla, '_', true) . '_fin*/') && $fila_llave_mod == 0) {
                $fila_llave_mod = $fila;
            }


            #buscamos si existe el prefijo
            if (strstr($linea, $prefijo) || $prefijo == '') {
                $encontrado_prefijo = 1;
            }

            #buscamos si existe el exist
            if (strstr($linea, strtolower($name) . '_exist:')) {
                $encontrado_exist = 1;
            }

            if ($encontrado_prefijo == 1 && $encontrado_exist == 1) {
                break;
            }
        }
 
        if ($encontrado_exist == 0 && $encontrado_prefijo == 0) {

            $fila = 0;
            $html = '';
            foreach ($fpj2 as $linea) {
                $fila++;

                #insertamos en la linea de la llave del array


                if ($fila == $fila_llave_msn) {

                    $html .= "
        " . strstr($tabla, '_', true) . ": {
            " . strtolower($name) . "_exist: '$name ya existe.'
        }/*" . strstr($tabla, '_', true) . "_fin*/
";
                    $html .= $linea;
                } else {
                    if ($fila == ($fila_llave_msn - 1)) {
                        $html .= '        ' . trim($linea) . ',';
                    } else {
                        $html .= $linea;
                    }
                }
            }

            #borramos el archivo
            unlink($archivo);

            #abrimos el archvo
            $fpj_ = fopen($archivo, 'x');

            fwrite($fpj_, $html);
            fclose($fpj_);
            #  $mensaje = 'Se agrego la palabra (' . $palabra . ')';
            $html_2 = $html;
        } elseif ($encontrado_exist == 0 && $encontrado_prefijo == 1) {

            $fila = 0;
            $html = '';
            foreach ($fpj2 as $linea) {
                $fila++;

                #insertamos en la linea de la llave del array 
                if ($fila == $fila_llave_mod) {

                    $html .= "
            " . strtolower($name) . "_exist: '$name ya existe.'        
";
                    $html .= $linea;
                } else {
                    if ($fila == ($fila_llave_mod - 1)) {
                        $html .= '            ' . trim($linea) . ',';
                    } else {
                        $html .= $linea;
                    }
                }
            }

            #borramos el archivo
            unlink($archivo);

            #abrimos el archvo
            $fpj_ = fopen($archivo, 'x');

            fwrite($fpj_, $html);
            fclose($fpj_);
            #  $mensaje = 'Se agrego la palabra (' . $palabra . ')';
         #   $html_3 = $html;
        }
        return 1;
    }

}
