<?php
date_default_timezone_set("America/Lima");
$date = ('01-01-2000');
#echo  date("Y-m-d",strtotime($date));

require_once '../config/Config.php';
require_once 'mysql.class.php';
require_once 'generador.class.php';

$tipo = isset($_POST['rd_tipo']) ? $_POST['rd_tipo'] : null;
$modulo = isset($_POST['txt_modulo']) ? trim(strtolower($_POST['txt_modulo'])) : '';

$modulo2 = isset($_POST['lst_modulo']) ? trim(strtolower($_POST['lst_modulo'])) : '';
$opcion = isset($_POST['txt_opcion']) ? trim(strtolower($_POST['txt_opcion'])) : '';

$opcion2 = isset($_POST['lst_opcion']) ? trim(strtolower($_POST['lst_opcion'])) : '';
$control = isset($_POST['txt_controller']) ? trim($_POST['txt_controller']) : '';
$alias = isset($_POST['txt_alias']) ? trim($_POST['txt_alias']) : '';

$bd_menu = isset($_POST['lst_bd_menu']) ? trim($_POST['lst_bd_menu']) : '';
$sp_grid_op = isset($_POST['lst_sp_grid_op']) ? trim($_POST['lst_sp_grid_op']) : '';

$tabla2 = isset($_POST['lst_bd_tabla2']) ? trim($_POST['lst_bd_tabla2']) : '';
$bd_sp = isset($_POST['lst_bd_sp']) ? trim($_POST['lst_bd_sp']) : '';



$sp = isset($_POST['txt_sp_new2']) ? trim($_POST['txt_sp_new2']) : '';

$txt_sp_new = isset($_POST['txt_sp_new']) ? trim($_POST['txt_sp_new']) : '';
$tabla = isset($_POST['lst_bd_tabla']) ? trim($_POST['lst_bd_tabla']) : '';

$chk_reemplaza = isset($_POST['chk_reemplazaCN']) ? trim($_POST['chk_reemplazaCN']) : '0';

if ($chk_reemplaza) {
    $opcion2 = isset($_POST['txt_opcionreemplaza']) ? trim($_POST['txt_opcionreemplaza']) : '';
}


$tabla5 = isset($_POST['lst_bd_tabla5']) ? trim($_POST['lst_bd_tabla5']) : '';

###########################################################################################################
### OPCION

$lst_opcion_modulo = isset($_POST['lst_opcion_modulo']) ? trim($_POST['lst_opcion_modulo']) : '';
$txt_opcion_nombre = isset($_POST['txt_opcion_nombre']) ? trim($_POST['txt_opcion_nombre']) : '';
$txt_alias = isset($_POST['txt_alias']) ? trim($_POST['txt_alias']) : '';

$lst_opcion_tabla = isset($_POST['lst_opcion_tabla']) ? trim($_POST['lst_opcion_tabla']) : '';

$ckb_opcion_btnnuevo = isset($_POST['ckb_opcion_btnnuevo']) ? trim($_POST['ckb_opcion_btnnuevo']) : '';
$ckb_opcion_btneditar = isset($_POST['ckb_opcion_btneditar']) ? trim($_POST['ckb_opcion_btneditar']) : '';
$ckb_opcion_btneliminar = isset($_POST['ckb_opcion_btneliminar']) ? trim($_POST['ckb_opcion_btneliminar']) : '';
$ckb_opcion_btnexel = isset($_POST['ckb_opcion_btnexel']) ? trim($_POST['ckb_opcion_btnexel']) : '';
$lst_opcion_btnstyle = isset($_POST['lst_opcion_btnstyle']) ? trim($_POST['lst_opcion_btnstyle']) : '';
$ckb_opcion_colestado = isset($_POST['ckb_opcion_colestado']) ? trim($_POST['ckb_opcion_colestado']) : '';
$lst_opcion_btnsmodal = isset($_POST['lst_opcion_btnsmodal']) ? trim($_POST['lst_opcion_btnsmodal']) : '';

$ckb_opcion_min = isset($_POST['ckb_opcion_min']) ? trim($_POST['ckb_opcion_min']) : '';
$ckb_opcion_max = isset($_POST['ckb_opcion_max']) ? trim($_POST['ckb_opcion_max']) : '';

$lst_opcion_grid_op = isset($_POST['lst_opcion_grid_op']) ? trim($_POST['lst_opcion_grid_op']) : '';
$txt_opcion_grid_nuevo = isset($_POST['txt_opcion_grid_nuevo']) ? trim($_POST['txt_opcion_grid_nuevo']) : '';
$lst_opcion_grid_existe = isset($_POST['lst_opcion_grid_existe']) ? trim($_POST['lst_opcion_grid_existe']) : '';

$lst_opcion_mantenimiento_op = isset($_POST['lst_opcion_mantenimiento_op']) ? trim($_POST['lst_opcion_mantenimiento_op']) : '';
$txt_opcion_mantenimiento_nuevo = isset($_POST['txt_opcion_mantenimiento_nuevo']) ? trim($_POST['txt_opcion_mantenimiento_nuevo']) : '';
$lst_opcion_mantenimiento_existe = isset($_POST['lst_opcion_mantenimiento_existe']) ? trim($_POST['lst_opcion_mantenimiento_existe']) : '';

$lst_opcion_consulta_op = isset($_POST['lst_opcion_consulta_op']) ? trim($_POST['lst_opcion_consulta_op']) : '';
$txt_opcion_consulta_nuevo = isset($_POST['txt_opcion_consulta_nuevo']) ? trim($_POST['txt_opcion_consulta_nuevo']) : '';
$lst_opcion_consulta_existe = isset($_POST['lst_opcion_consulta_existe']) ? trim($_POST['lst_opcion_consulta_existe']) : '';



###########################################################################################################






$msn = '';

$c_Mysql = new Mysql;
$c_Mysql->connect();

if (!is_null($tipo)) {



    switch ($tipo) {
        case 'MN': # crear carpeta de modulo 
            if (empty($modulo)) {
                $msn = 'Debe ingresar el nombre del módulo';
            } else {
                $ruta = '../app/' . $modulo;
                if (Factory::createModulo($ruta)) {

                    if (Factory::createOpcion($ruta)) {

                        if ($bd_menu != '') {
                            $c_Mysql->query("update app_menu  set alias='$modulo' where id_menu='$bd_menu';");
                        }
                        $msn = 'Módulo se creo correctamente';
                    } else {
                        $msn = 'Módulo ya existe';
                    }
                } else {
                    $msn = 'Módulo ya existe';
                }
            }
            break;

        case 'CN':
            if (empty($lst_opcion_modulo)) {
                $msn = 'Debe seleccionar un modulo';
            } elseif (empty($txt_opcion_nombre)) {
                $msn = 'Debe ingresar el nombre de la opcion';
            } elseif (empty($txt_alias)) {
                $msn = 'Debe seleccionar el Alias';
            } elseif (empty($lst_opcion_tabla)) {
                $msn = 'Debe seleccionar la tabla';
            } elseif (empty(($lst_opcion_grid_op == 'N' ? $txt_opcion_grid_nuevo : $lst_opcion_grid_existe))) {
                $msn = 'Debe ingresar o seleccionar el SP del Grid';
            } else {
                # print_r($_POST);

                $procede = 0;
                $ruta = '../app/' . $lst_opcion_modulo;
                if (Factory::createController($ruta, $txt_opcion_nombre, $txt_alias)) {


                    if (Factory::createFilter($ruta, $txt_opcion_nombre, $ckb_opcion_min, $ckb_opcion_max)) {

                        $sp_grid = '';
                        if ($lst_opcion_grid_op == 'N') {
                            $sp_grid = $txt_opcion_grid_nuevo;
                        } else {
                            $sp_grid = $lst_opcion_grid_existe;
                        }

                        $sp_mantenimiento = '';
                        if ($lst_opcion_mantenimiento_op == 'N') {
                            $sp_mantenimiento = $txt_opcion_mantenimiento_nuevo;
                        } elseif ($lst_opcion_mantenimiento_op == 'E') {
                            $sp_mantenimiento = $lst_opcion_mantenimiento_existe;
                        }

                        $sp_consulta = '';
                        if ($lst_opcion_consulta_op == 'N') {
                            $sp_consulta = $txt_opcion_consulta_nuevo;
                        } elseif ($lst_opcion_mantenimiento_op == 'E') {
                            $sp_consulta = $lst_opcion_consulta_existe;
                        }



                        if (Factory::createModel($ruta, $txt_opcion_nombre, $sp_grid, $sp_mantenimiento, $sp_consulta)) {

                            if (Factory::createDirView($ruta, $txt_opcion_nombre, $txt_alias, $ckb_opcion_colestado, $ckb_opcion_btnnuevo, $ckb_opcion_btnexel, $ckb_opcion_btneditar, $ckb_opcion_btneliminar, $lst_opcion_btnstyle)) {

                                if (Factory::createJsDom($ruta, $txt_opcion_nombre, $ckb_opcion_btnnuevo, $ckb_opcion_btneditar, $ckb_opcion_btneliminar, $ckb_opcion_colestado, $lst_opcion_btnsmodal, $lst_opcion_tabla)) {

                                    if (Factory::createIndex($ruta, $txt_opcion_nombre)) {

                                        if ($ckb_opcion_btnnuevo == '1') {

                                            if (Factory::createFormNew($ruta, $txt_opcion_nombre, $ckb_opcion_colestado, $ckb_opcion_min, $ckb_opcion_max)) {
                                                $procede = '1';
                                            } else {
                                                $procede = '0';
                                                $msn = 'El FormNew ya existe';
                                            }
                                        }

                                        if ($ckb_opcion_btneditar == '1') {

                                            if (Factory::createFormEdit($ruta, $txt_opcion_nombre, $ckb_opcion_colestado, $ckb_opcion_min, $ckb_opcion_max)) {
                                                $procede = '1';
                                            } else {
                                                $procede = '0';
                                                $msn = 'El FormEdit ya existe';
                                            }
                                        }

                                        if ($ckb_opcion_btneditar == '' && $ckb_opcion_btnnuevo == '') {
                                            $procede = '1';
                                        }
                                    } else {
                                        $msn = 'El Index ya existe';
                                    }
                                } else {
                                    $msn = 'El Dom ya existe';
                                }
                            } else {
                                $msn = 'El AJAX ya existe';
                            }
                        } else {
                            $msn = 'El Model ya existe';
                        }
                    } else {
                        $msn = 'El Filtro ya existe';
                    }


                    ###########################################################################################
                    if ($procede == '1') {
                        #crear el sp
                        $procede_sp = 1;

                        if ($lst_opcion_grid_op == 'N') {
                            if (Factory::createSP('G', $lst_opcion_tabla, $txt_opcion_grid_nuevo, $ckb_opcion_colestado, $txt_opcion_nombre)) {
                                $procede_sp = 1;
                            } else {
                                $procede_sp = 0;
                                $msn = 'SP Grid ya existe';
                            }
                        }

                        if ($lst_opcion_mantenimiento_op == 'N') {
                            if (Factory::createSP('M', $lst_opcion_tabla, $txt_opcion_mantenimiento_nuevo, $ckb_opcion_colestado, $txt_opcion_nombre)) {
                                $procede_sp = 1;
                            } else {
                                $procede_sp = 0;
                                $msn = 'SP Mantenimiento ya existe';
                            }
                        }

                        if ($lst_opcion_consulta_op == 'N') {
                            if (Factory::createSP('C', $lst_opcion_tabla, $txt_opcion_consulta_nuevo, $ckb_opcion_colestado, $txt_opcion_nombre)) {
                                $procede_sp = 1;
                            } else {
                                $procede_sp = 0;
                                $msn = 'SP Consulta ya existe';
                            }
                        }

                        if ($procede_sp == 1) {
                            $msn = 'Opción se creo correctamente';
                        }
                    }
                } else {
                    $msn = 'Controlador ya existe';
                }
            }
            break;

        case 'SP':
            if (empty($tabla)) {
                $msn = 'Debe Seleccionar la Tabla.';
            } else if (empty($txt_sp_new)) {
                $msn = 'Debe ingresar el nombre del SP.';
            } else {

                if (Factory::createSP($tabla, $txt_sp_new)) {
                    $msn = 'SP se creo correctamente (' . $txt_sp_new . ')';
                } else {
                    $msn = 'el SP ya existe';
                }
            }
            break;

        case 'CA':
            if (empty($tabla5)) {
                $msn = 'Debe Seleccionar la Tabla.';
            } else {
                $conteo = 0;
                $campo_key = '';

                $c_Mysql->query("CALL sp_sys_auditoria_addcampos('" . DB_NAME . "','$tabla5');");



                $msn = 'Se agrego los campos de Auditoria a la Tabla (' . $tabla5 . ')';
            }
            break;
    }
}



define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);
?>

<html>
    <head>
        <title>GENERADOR DE CODIGO V.2</title>        
        <link rel="stylesheet" href="jquery-ui.css">
        <script src="<?php echo BASE_URL; ?>public/js/jquery/jquery.js"></script>        
        <script src="jquery-ui.js"></script>

        <style>
            form{
                font-family: arial;
                font-size: 12px;
            }
            .msn{
                border:1px solid #990000;
                color: red;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            .ops{
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                background: #e2e2e2;
            }
            .lb{
                margin-bottom: 5px;
                display: inline-block;
                width: 160px;
            }
            .ab{
                position: absolute;
            }
            input,select{
                width: 100%;
            }
        </style>
    </head>
    <body>
        <form method="POST" id="target">
            <input  type="hidden" name="rd_tipo" value="MN" id="flag_tab_sele">       
            <div id="tabs">
                <ul>
                    <li><a href="#tabs-1">  Módulo </a></li>

                    <li><a href="#tabs-3"> Opción</a></li>
                    <li><a href="#tabs-4"> SP </a></li>
                    <li><a href="#tabs-5"> Auditoria </a></li>
                </ul>
                <div id="tabs-1">
                    <fieldset id="fl_modulo">
                        <legend>Crear Módulo</legend>
                        <div class="sp_nuevo">
                            <label class="lb">Menu Módulo:</label>
                            <label class="lb">
                                <select id="lst_bd_menu" name="lst_bd_menu" style="width: 300px;">
                                    <option value="">Seleccionar</option>
                                    <?php
                                    $query = $c_Mysql->query("SELECT id_menu,nmenu FROM app_menu WHERE parent='0' order by nmenu");

                                    while ($row = $c_Mysql->fetch_row($query)) {
                                        echo '<option value="' . $row["id_menu"] . '">' . $row["nmenu"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label class="lb">Módulo:<br><br></label>
                            <label class="lb">
                                <input type="text" id="txt_modulo" name="txt_modulo"><br>
                                <i class="ab">Nombre de módulo debe ser en minúscula (Se actualizara al alias del menu.)</i><br>
                            </label>
                        </div>
                    </fieldset>
                </div>

                <div id="tabs-3">      
                    <fieldset >
                        <legend>Crear Opción</legend>
                        <div>
                            <label class="lb">Modulo: </label>
                            <label class="lb" style="width: 300px">
                                <select id="lst_opcion_modulo" name="lst_opcion_modulo">
                                    <option value="">Seleccionar</option>
                                    <?php foreach (Factory::scanSubDir('../app/') as $value): ?>
                                        <option value="<?php echo $value['dir']; ?>"><?php echo $value['dir']; ?></option>    
                                    <?php endforeach; ?>
                                </select>

                            </label>
                        </div>                         
                        <div>
                            <label class="lb">Opción:<br><br></label>
                            <label class="lb"   >
                                <input type="text" id="txt_opcion_nombre" name="txt_opcion_nombre" ><br>
                                <i class="ab">Nombre de controlador debe ser en Pascalcase. Se crearán: filter, model, views, js</i><br>
                            </label>
                        </div>
                        <div>
                            <label class="lb">Alias:<br><br></label>
                            <label class="lb" id="div_alias">
                                <select id="lst_opcion_alias" name="lst_opcion_alias">
                                    <option value="">Seleccionar</option>

                                </select> 
                                <i class="ab">Se relaciona con la opción de la tabla de Menu.</i><br><br>
                            </label>
                        </div>                     
                    </fieldset><br><br>
                    <fieldset  >
                        <legend>Tabla de BD</legend>    
                        <div >
                            <label class="lb">Tabla:</label>
                            <label class="lb">
                                <select id="lst_opcion_tabla" name="lst_opcion_tabla" style="width: 300px;">
                                    <option value="">Seleccionar</option>
                                    <?php
                                    #  echo "SELECT table_name,(SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='" . DB_NAME . "' AND TABLE_NAME=a.TABLE_NAME AND column_key='PRI' limit 1) AS campo_key  FROM information_schema.TABLES a WHERE TABLE_SCHEMA = '" . DB_NAME . "' ORDER BY table_name;";
                                    $query = $c_Mysql->query("
SELECT table_name,campo_key,(SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='" . DB_NAME . "' AND TABLE_NAME=b.table_name AND COLUMN_NAME=CONCAT(campo_key,'_nombre') LIMIT 1  ) AS campo_nombre_max
FROM (
	SELECT table_name
	,(SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='" . DB_NAME . "' AND TABLE_NAME=a.TABLE_NAME  AND column_key='PRI'  LIMIT 1  ) AS campo_key   
	FROM information_schema.TABLES a WHERE TABLE_SCHEMA = '" . DB_NAME . "' ORDER BY table_name 
) b ORDER BY table_name;");

                                    while ($row = $c_Mysql->fetch_row($query)) {
                                        echo '<option value="' . $row["table_name"] . '" data-max="' . $row["campo_nombre_max"] . '">' . $row["table_name"] . '</option>';
                                    }
                                    ?>
                                </select>

                            </label>
                        </div>
                        <div >
                            <label class="lb"><i class="ab">Nota: En base al nombre de la tabla se crearan los SP</i><br></label>
                        </div>
                        <br>
                    </fieldset><br><br>
                    <fieldset >
                        <legend>Acciones</legend>    
                        <div >
                            <label class="lb">Boton Nuevo:</label>
                            <label class="lb">
                                <input type="checkbox" id="ckb_opcion_btnnuevo" checked name="ckb_opcion_btnnuevo" value="1" style="width: 15px;" >
                            </label>
                        </div>
                        <div >
                            <label class="lb">Boton Editar:</label>
                            <label class="lb">
                                <input type="checkbox" id="ckb_opcion_btneditar" checked name="ckb_opcion_btneditar" value="1" style="width: 15px;" >
                            </label>
                        </div>
                        <div >
                            <label class="lb">Boton Eliminar:</label>
                            <label class="lb">
                                <input type="checkbox" id="ckb_opcion_btneliminar" checked  name="ckb_opcion_btneliminar" value="1" style="width: 15px;" >
                            </label>
                        </div>
                        <div >
                            <label class="lb">Boton Exel:</label>
                            <label class="lb">
                                <input type="checkbox" id="ckb_opcion_btnexel" name="ckb_opcion_btnexel" value="1" style="width: 15px;" >
                            </label>
                        </div>
                        <div>
                            <br>
                        </div>
                        <div>
                            <label class="lb">Style Boton:</label>
                            <label class="lb">
                                <select id="lst_opcion_btnstyle" name="lst_opcion_btnstyle" >                                    
                                    <option value="A" >Agrupados</option>
                                    <option value="S" selected>Separados</option>
                                </select>
                            </label>                            
                        </div> 
                        <div>
                            <br>
                        </div>
                        <div >
                            <label class="lb">Columna Estado:</label>
                            <label class="lb">
                                <input type="checkbox" id="ckb_opcion_colestado" name="ckb_opcion_colestado" value="1" checked style="width: 15px;" >
                            </label>
                        </div>
                        <div>
                            <br>
                        </div>
                        <div>
                            <br>
                        </div>
                        <div>
                            <label class="lb">Modal Nuevo:</label>
                            <label class="lb">
                                <select id="lst_opcion_btnsmodal" name="lst_opcion_btnsmodal" >                                    
                                    <option value="o" >Nuevo</option>
                                    <option value="a" selected>Nueva</option>
                                </select>
                            </label>                            
                        </div> 
                        <div>
                            <br>
                        </div>
                    </fieldset><br><br>
                    <fieldset >
                        <legend>Filtros</legend> 
                        <div >
                            <label class="lb">minlength:</label>
                            <label class="lb">
                                <input type="text" id="ckb_opcion_min"    name="ckb_opcion_min" value="3"  >
                            </label>
                        </div>
                        <div >
                            <label class="lb">maxlength:</label>
                            <label class="lb">
                                <input type="text" id="ckb_opcion_max"    name="ckb_opcion_max" value=""  >
                            </label>
                        </div> 
                        <div >
                            <label class="lb"> 
                                <i class="ab">Nota: Si se deja vacio, no se considerara estos filtros.</i><br>
                            </label>
                        </div>
                    </fieldset><br><br>                    
                    <fieldset>
                        <legend>SP</legend>
                        <div>
                            <label class="lb">SP del <b>Grid</b>:</label>
                            <label class="lb">
                                <select id="lst_opcion_grid_op" name="lst_opcion_grid_op" >
                                    <option value="N" selected>Nuevo</option>
                                    <option value="E">Existente</option>
                                </select>
                            </label>                            
                        </div>
                        <div class="div_opcion_grid_op_nuevo">
                            <label class="lb"></label>
                            <label class="lb">
                                <input type="text" id="txt_opcion_grid_nuevo" name="txt_opcion_grid_nuevo" value="" style="width: 300px;">
                            </label>
                        </div>
                        <div class="div_opcion_grid_op_existe">
                            <label class="lb"> </label>
                            <label class="lb">
                                <select id="lst_opcion_grid_existe" name="lst_opcion_grid_existe" style="width: 300px;">
                                    <option value="">Seleccionar</option>
                                    <?php
                                    $query = $c_Mysql->query("SELECT  SPECIFIC_NAME AS nombre FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA='" . DB_NAME . "' AND ROUTINE_TYPE='PROCEDURE' AND ROUTINE_name LIKE '%_grid%' ORDER BY nombre;");

                                    while ($row = $c_Mysql->fetch_row($query)) {
                                        echo '<option value="' . $row["nombre"] . '">' . $row["nombre"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </label>
                        </div>
                        <div>
                            <br>
                        </div>
                        <div>
                            <label class="lb">SP del <b>Mantenimiento</b>:</label>
                            <label class="lb">
                                <select id="lst_opcion_mantenimiento_op" name="lst_opcion_mantenimiento_op" >
                                    <option value="" >NO</option>
                                    <option value="N" selected>Nuevo</option>
                                    <option value="E">Existente</option>
                                </select>
                            </label>                            
                        </div> 

                        <div class="div_opcion_mantenimiento_op_nuevo">
                            <label class="lb"> </label>
                            <label class="lb">
                                <input type="text" id="txt_opcion_mantenimiento_nuevo" name="txt_opcion_mantenimiento_nuevo" value="" style="width: 300px;">
                            </label>
                        </div>
                        <div class="div_opcion_mantenimiento_op_existe">
                            <label class="lb"> </label>
                            <label class="lb">
                                <select id="lst_opcion_mantenimiento_existe" name="lst_opcion_mantenimiento_existe" style="width: 300px;">
                                    <option value="">Seleccionar</option>
                                    <?php
                                    $query = $c_Mysql->query("SELECT  SPECIFIC_NAME AS nombre FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA='" . DB_NAME . "' AND ROUTINE_TYPE='PROCEDURE' AND ROUTINE_name LIKE '%_mantenimiento%' ORDER BY nombre;");

                                    while ($row = $c_Mysql->fetch_row($query)) {
                                        echo '<option value="' . $row["nombre"] . '">' . $row["nombre"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </label>
                        </div>
                        <div>
                            <br>
                        </div>
                        <div>
                            <label class="lb">SP de <b>Consultar</b>:</label>
                            <label class="lb">
                                <select id="lst_opcion_consulta_op" name="lst_opcion_consulta_op" >
                                    <option value="" >NO</option>
                                    <option value="N" selected>Nuevo</option>
                                    <option value="E">Existente</option>
                                </select>
                            </label>                            
                        </div> 
                        <div class="div_opcion_consulta_op_nuevo">
                            <label class="lb"> </label>
                            <label class="lb">
                                <input type="text" id="txt_opcion_consulta_nuevo" name="txt_opcion_consulta_nuevo" value="" style="width: 300px;">
                            </label>
                        </div>
                        <div class="div_opcion_consulta_op_existe">
                            <label class="lb"> </label>
                            <label class="lb">
                                <select id="lst_opcion_consulta_existe" name="lst_opcion_consulta_existe" style="width: 300px;">
                                    <option value="">Seleccionar</option>
                                    <?php
                                    $query = $c_Mysql->query("SELECT  SPECIFIC_NAME AS nombre FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA='" . DB_NAME . "' AND ROUTINE_TYPE='PROCEDURE' AND ROUTINE_name LIKE '%_consulta%' ORDER BY nombre;");

                                    while ($row = $c_Mysql->fetch_row($query)) {
                                        echo '<option value="' . $row["nombre"] . '">' . $row["nombre"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </label>
                        </div>
                    </fieldset>

                </div>
                <div id="tabs-4">
                    <fieldset id="fl_modulo">
                        <legend>Crear SP Grid</legend>
                        <div>
                            <label class="lb">Tabla:</label>
                            <label class="lb">
                                <select id="lst_bd_tabla" name="lst_bd_tabla" style="width: 300px;">
                                    <option value="">Seleccionar</option>
                                    <?php
                                    $query = $c_Mysql->query("SELECT table_name  FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'erp_uni' ORDER BY table_name;");

                                    while ($row = $c_Mysql->fetch_row($query)) {
                                        echo '<option value="' . $row["table_name"] . '">' . $row["table_name"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label class="lb"> </label>
                            <label class="lb">
                                <input type="text" id="txt_sp_new" name="txt_sp_new" value="" style="width: 300px;">
                            </label>
                        </div>
                    </fieldset>
                </div>
                <div id="tabs-5">      
                    <fieldset id="fl_controler" >
                        <legend>Agregar campos de Auditoria a las Tablas</legend>

                        <div >
                            <label class="lb">Tabla:</label>
                            <label class="lb">
                                <select id="lst_bd_tabla5" name="lst_bd_tabla5" style="width: 300px;">
                                    <option value="">Seleccionar</option>
                                    <?php
                                    $query = $c_Mysql->query("SELECT table_name  FROM information_schema.TABLES WHERE TABLE_SCHEMA = '" . DB_NAME . "' ORDER BY table_name;");

                                    while ($row = $c_Mysql->fetch_row($query)) {
                                        echo '<option value="' . $row["table_name"] . '">' . $row["table_name"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </label>
                        </div>

                    </fieldset>

                </div>
            </div>
            <div><br>
                <button type="submit">Grabar</button>
            </div><br>
            <!-- <div class="ops"></div>-->
            <?php
            if ($msn != '') {
                echo '<div class="msn">' . $msn . '</div>';
            }
            ?>
        </form>
    </body>
    <script>


        $('#chk_reemplazaCN').click(function () {
            if ($(this).is(':checked')) {
                $('#txt_opcionreemplaza').show();
            } else {
                $('#txt_opcionreemplaza').hide().val('');
            }
        });

        $("#tabs").tabs();


        $('#target').submit(function (event) {

            if ($('#flag_tab_sele').val() == '') {

                alert('Seleccione una opcion.');

                return false;
            } else {
                if ($('#tabs-1').attr('aria-hidden') == 'false') {

                    $('#flag_tab_sele').val('MN');

                } else if ($('#tabs-2').attr('aria-hidden') == 'false') {

                    $('#flag_tab_sele').val('OP');

                } else if ($('#tabs-3').attr('aria-hidden') == 'false') {

                    $('#flag_tab_sele').val('CN');

                } else if ($('#tabs-4').attr('aria-hidden') == 'false') {

                    $('#flag_tab_sele').val('SP');

                } else if ($('#tabs-5').attr('aria-hidden') == 'false') {

                    $('#flag_tab_sele').val('CA');
                }



                //alert( "se envio..." );
                return true;
            }

        });


        /////////////////////////////////////////////////////////////////////////////////////
        // ocultamos los div de sp existe
        $('.div_opcion_grid_op_nuevo').css('display', 'block');
        $('.div_opcion_grid_op_existe').css('display', 'none');

        $('.div_opcion_mantenimiento_op_nuevo').css('display', 'block');
        $('.div_opcion_mantenimiento_op_existe').css('display', 'none');

        $('.div_opcion_consulta_op_nuevo').css('display', 'block');
        $('.div_opcion_consulta_op_existe').css('display', 'none');

        //al seleccionar la tabla se genera el nombre
        $('#lst_opcion_tabla').change(function () {
            if ($('#lst_opcion_tabla').val() == '') {

                $('#txt_opcion_grid_nuevo').val('');
                $('#txt_opcion_mantenimiento_nuevo').val('');
                $('#txt_opcion_consulta_nuevo').val('');


            } else {

                $('#txt_opcion_grid_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_grid');
                $('#txt_opcion_mantenimiento_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_mantenimiento');
                $('#txt_opcion_consulta_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_consultar');

            }

            $('#lst_opcion_grid_op').val('N');
            $('#lst_opcion_mantenimiento_op').val('N');
            $('#lst_opcion_consulta_op').val('N');

            $('#ckb_opcion_max').val($('#lst_opcion_tabla').find(':selected').data('max'));


        });

        // lst de la opcion grid       
        $('#lst_opcion_grid_op').change(function () {
            if ($('#lst_opcion_grid_op').val() == 'N') {

                $('.div_opcion_grid_op_nuevo').css('display', 'block');
                $('.div_opcion_grid_op_existe').css('display', 'none');

            } else {

                $('.div_opcion_grid_op_nuevo').css('display', 'none');
                $('.div_opcion_grid_op_existe').css('display', 'block');

            }

            if ($('#lst_opcion_tabla').val() != '') {
                $('#txt_opcion_grid_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_grid');
                $('#lst_opcion_grid_existe').val('sp_' + $('#lst_opcion_tabla').val() + '_grid');
            } else {
                $('#txt_opcion_grid_nuevo').val('');
                $('#lst_opcion_grid_existe').val('');
            }
        });

        // lst de la opcion mantenimeito       
        $('#lst_opcion_mantenimiento_op').change(function () {
            if ($('#lst_opcion_mantenimiento_op').val() == 'N') {

                $('.div_opcion_mantenimiento_op_nuevo').css('display', 'block');
                $('.div_opcion_mantenimiento_op_existe').css('display', 'none');
                if ($('#lst_opcion_tabla').val() != '') {
                    $('#txt_opcion_mantenimiento_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_mantenimiento');
                } else {
                    $('#txt_opcion_mantenimiento_nuevo').val('');
                }


            } else if ($('#lst_opcion_mantenimiento_op').val() == '') {

                $('.div_opcion_mantenimiento_op_nuevo').css('display', 'block');
                $('.div_opcion_mantenimiento_op_existe').css('display', 'none');
                $('#txt_opcion_mantenimiento_nuevo').val('');

            } else {

                $('.div_opcion_mantenimiento_op_nuevo').css('display', 'none');
                $('.div_opcion_mantenimiento_op_existe').css('display', 'block');

            }

            if ($('#lst_opcion_tabla').val() != '' && ($('#lst_opcion_mantenimiento_op').val() == 'N' || $('#lst_opcion_mantenimiento_op').val() == 'E')) {
                $('#txt_opcion_mantenimiento_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_mantenimiento');
                $('#lst_opcion_mantenimiento_existe').val('sp_' + $('#lst_opcion_tabla').val() + '_mantenimiento');
            } else {
                $('#txt_opcion_mantenimiento_nuevo').val('');
                $('#lst_opcion_mantenimiento_existe').val('');
            }
        });

        // lst de la opcion consulta       
        $('#lst_opcion_consulta_op').change(function () {
            if ($('#lst_opcion_consulta_op').val() == 'N') {

                $('.div_opcion_consulta_op_nuevo').css('display', 'block');
                $('.div_opcion_consulta_op_existe').css('display', 'none');
                if ($('#lst_opcion_tabla').val() != '') {
                    $('#txt_opcion_consulta_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_consultar');
                } else {
                    $('#txt_opcion_consulta_nuevo').val('');
                }


            } else if ($('#lst_opcion_consulta_op').val() == '') {

                $('.div_opcion_consulta_op_nuevo').css('display', 'block');
                $('.div_opcion_consulta_op_existe').css('display', 'none');
                $('#txt_opcion_consulta_nuevo').val('');

            } else {

                $('.div_opcion_consulta_op_nuevo').css('display', 'none');
                $('.div_opcion_consulta_op_existe').css('display', 'block');

            }


            if ($('#lst_opcion_tabla').val() != '' && ($('#lst_opcion_consulta_op').val() == 'N' || $('#lst_opcion_consulta_op').val() == 'E')) {
                $('#txt_opcion_consulta_nuevo').val('sp_' + $('#lst_opcion_tabla').val() + '_consultar');
                $('#lst_opcion_consulta_existe').val('sp_' + $('#lst_opcion_tabla').val() + '_consultar');
            } else {
                $('#txt_opcion_consulta_nuevo').val('');
                $('#lst_opcion_consulta_existe').val('');
            }
        });

        ////////////////////////////////////////////////////////////////////////////////////
        $('#lst_bd_tabla').change(function () {
            if ($('#lst_bd_tabla').val() != '') {

                $('#txt_sp_new').val('sp_' + $('#lst_bd_tabla').val() + '_grid');

            } else {
                $('#txt_sp_new').val('');
            }

        });


        $('#lst_opcion_modulo').change(function () {
            $.ajax({
                method: "POST",
                url: "ajax.php",
                data: {ajax: "1", valor: $('#lst_opcion_modulo').val()}
            })
                    .done(function (msg) {

                        $('#div_alias').html(msg);
                        //alert( "Data Saved: " + msg );
                    });
        });

    </script>
</html>

