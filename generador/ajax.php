<?php

#print_r($_POST);
$ajax = isset($_POST['ajax']) ? $_POST['ajax'] : null;


if ($ajax != '') {


    require_once '../config/Config.php';
    require_once 'mysql.class.php';


    $c_Mysql = new Mysql;
    $c_Mysql->connect();

    $html = '';
    $addscript = '';



    switch ($ajax) {
        case '1':
            $valor = isset($_POST['valor']) ? $_POST['valor'] : null;

            /*
              $html .= '<select id="txt_alias" name="txt_alias">';
              $query = $c_Mysql->query("SELECT * FROM app_menu WHERE parent IN (SELECT id_menu FROM app_menu WHERE parent IN (SELECT id_menu FROM app_menu WHERE parent='0' AND alias='$valor'))");

              while ($row = $c_Mysql->fetch_row($query)) {
              $html .= '<option value="' . $row["alias"] . '">' . $row["nmenu"] . ' (' . $row["alias"] . ')</option>';
              }

              $html .= '
              </select> <i class="ab">Se relaciona con la opción de la tabla de Menu.</i><br><br>';
             */
#################################################################################################

            $query2 = $c_Mysql->query("SELECT id_menu,nmenu,alias,parent ,(SELECT COUNT(id_menu) FROM app_menu WHERE parent=m.id_menu) AS conteo
FROM app_menu m
WHERE parent IN (SELECT id_menu FROM app_menu WHERE parent='0' AND alias='$valor')");
            $data_1 = array();

            while ($row2 = $c_Mysql->fetch_row($query2)) {

                $data_1[] = $row2;
            }


            $query2 = $c_Mysql->query("SELECT id_menu,nmenu,alias,parent ,(SELECT COUNT(id_menu) FROM app_menu WHERE parent=mm.id_menu) AS conteo
FROM app_menu mm 
WHERE parent IN (
	SELECT id_menu
	FROM app_menu m
	WHERE parent IN (SELECT id_menu FROM app_menu WHERE parent='0' AND alias='$valor')
)");
            $data_2 = array();

            while ($row2 = $c_Mysql->fetch_row($query2)) {

                $data_2[] = $row2;
            }

            $query2 = $c_Mysql->query("SELECT id_menu,nmenu,alias,parent 
FROM app_menu mmm  
WHERE parent IN (
	SELECT id_menu 
	FROM app_menu mm 
	WHERE parent IN (
		SELECT id_menu
		FROM app_menu m
		WHERE parent IN (SELECT id_menu FROM app_menu WHERE parent='0' AND alias='$valor')
	)
)");
            $data_3 = array();

            while ($row2 = $c_Mysql->fetch_row($query2)) {

                $data_3[] = $row2;
            }




            $html .= '<select id="txt_alias" name="txt_alias">';

            foreach ($data_1 as $row) {
                $menu_1 = $row["id_menu"];
                if ($row["conteo"] > 0) {
                    $html .= '<optgroup label = "' . $row["nmenu"] . ' (' . $row["conteo"] . ')">';
                } else {
                    $html .= '<option value="' . $row["alias"] . '">' . $row["nmenu"] . ' (' . $row["alias"] . ')</option>';
                }

                foreach ($data_2 as $row2) {
                    $menu_2 = $row2["id_menu"];
                    $parent = $row2["parent"];

                    if ($parent == $menu_1) {

                        if ($row2["conteo"] > 0) {
                            $html .= '<optgroup label = "-------' . $row2["nmenu"] . ' (' . $row2["conteo"] . ')">';
                        } else {
                            $html .= '<option value="' . $row2["alias"] . '">----' . $row2["nmenu"] . ( $row2["conteo"] == 0 ? ' (' . $row2["alias"] . ')' : '(' . $row2["conteo"] . ')') . ' </option>';
                        }



                        foreach ($data_3 as $row3) {
                            $menu_3 = $row3["id_menu"];
                            $parent_3 = $row3["parent"];

                            if ($parent_3 == $menu_2) {
                                $html .= '<option value="' . $row3["alias"] . '">--------' . $row3["nmenu"] .   ' (' . $row3["alias"] . ')  </option>';
                            }
                        }
                        if ($row2["conteo"] > 0) {
                            $html .= ' </optgroup>';
                        }
                    }
                }
                if ($row["conteo"] > 0) {
                    $html .= ' </optgroup>';
                }
            }

            $html .= '
            </select> <i class="ab">Se relaciona con la opción de la tabla de Menu.</i><br><br>';

            break;
    }


    echo $html;
}
?>