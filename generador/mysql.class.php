<?php 
class Mysql
{
    private $obj = array ("dbname"=>DB_NAME,"dbuser"=>DB_USER,"dbpwd"=>DB_PASS,"dbhost"=>DB_HOST);
    private $q_id	="";
    private $db_connect_id = "";
    private $query_count   = 0;
	 
public function connect() {
		$this->db_connect_id = mysqli_connect($this->obj['dbhost'] ,$this->obj['dbuser'],$this->obj['dbpwd'],$this->obj['dbname']);
        if (!$this->db_connect_id) {
         //   echo (" Error no se puede conectar al servidor:".mysqli_connect_error());
            echo (" Error no se puede conectar al servidor:");
    	}
    }

public function query($query) {       
	  $this->q_id = mysqli_query($this->db_connect_id,$query );
        if (!$this->q_id ) {
        $error1 = mysqli_error($this->db_connect_id);
        $error2 = mysqli_errno($this->db_connect_id);
            die ("ERROR: error DB.<br> No Se Puede Ejecutar La Consulta: $query <br>MySql Tipo De Error: $error1 <br>Cod Error MySql: $error2");
 //           die ("ERROR: error DB.<br> Informe al Programador: Abel Mores - 943786728");
            exit;
        }
	$this->query_count++;
	return $this->q_id;
    }


public function fetch_row($q_id = "") {
    	if ($q_id == "") {
    		$q_id = $this->q_id;
   	 	}
        $result = mysqli_fetch_array($q_id, MYSQL_ASSOC);
        return $result;
    }	

public function get_num_rows() {
        return mysqli_num_rows($this->q_id);
    }
	
public function get_insert_id() {
        return mysqli_insert_id($this->db_connect_id);
    }

public function free_result($q_id) {
   		if($q_id == ""){
    		$q_id = $this->q_id;
		}
	mysqli_free_result($q_id);
    }	

public function close_db() {
        return mysqli_close($this->db_connect_id);
    }
	
}
?>