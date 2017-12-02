<?php

/**
 * Description of Tools
 *
 * @author DAVID
 */

namespace Vendor;

use Exception;

final class Tools {
    
    /*redirecciona a una ruta especifica*/
    final protected function redirect($ruta = false){
        if($ruta){
            header('location:' . BASE_URL . $ruta);
        }else{
            header('location:' . BASE_URL);
        }
    }
    
    /*
     * busca un dato en array
     */
    public function in_array_m($item, $array) {
        return preg_match('/"' . $item . '"/i', json_encode($array));
    }
    
    /*
     * Retorna implode de array multidiensional
     * Obj()->Tools->multipleImplode($data,'idfichasocioeconomicasaludproblema');
     */

    public function multipleImplode($data, $field, $delimiter = ',') {
        $d = [];
        foreach ($data as $value) {
            $d[] = $value[$field];
        }

        return implode($delimiter, $d);
    }
    
    /*
     * count array bidimensional
     */

    private function _count($data, $field, $item) {
        $c = 0;
        foreach ($data as $key => $value) {
            if ($value[$field] == $item) {
                $c++;
            }
        }
        return $c;
    }
    
    /*
     * retira valor unico de array bidimensional
     * $uniqM = Obj()->Tools->multiUnique($dataM,'idmodalidadadmision');
     */

    public function multiUnique($data, $item) {
        $uniq = [];
        $tmp = 'X';
        foreach ($data as $value) {
            if ($tmp != $value[$item]) {
                /* agregando indice count */
                $value['count'] = $this->_count($data, $item, $value[$item]);
                $uniq[] = $value;
            }
            $tmp = $value[$item];
        }
        return $uniq;
    }
    
    /*
     * bool is_bidimensional($array)
     * devuelve true si $array es solo bidimensional, false en caso contrario.
     */

    private function _is_bidimensional($array) {
        if (!is_array($array))
            return false;  // paranoia si no nos pasan un array

        foreach ($array as $elemento) {
            if (!is_array($elemento))
                return false;
            foreach ($elemento as $elem) {
                if (is_array($elem))
                    return false;
            }
        }

        return true;
    }
    
    /*
     * Desencripta elementos de un array. EJM: array('dg45wfdgh','@#$%453443','^&*()_++#4345')
     * uso::
     * Obj()->Tools->decriptArray(['data'=>  DATAARRAY, 'fields'=> CAMPO(S)ADESENCRIPTAR])
     */

    public function decriptArray($obj) {
        $data = isset($obj['data']) ? $obj['data'] : [];
        $fields = isset($obj['fields']) ? $obj['fields'] : null; /* debe tener la misma cantidad de elemntos q data */

        if (count($data)) {
            if ($this->_is_bidimensional($fields)) {/* fields es bidimensional */

                $fields = $this->_reorderFields(count($data), $fields); /* generar elementos conforme a data */

                return array_map(function($data, $fields) {
                    $f = explode('*', $fields); /* fields se convierte en array */

                    foreach ($data as $key => $value) {
                        $newvalue = $value;

                        if (!is_null($fields)) {/* se envio campos a envriptar */
                            /* se recorre fields para le encriptacion */
                            foreach ($f as $val) {
                                if ($val == $key && !is_null($fields)) {/* se envio campos a envriptar */
                                    $newvalue = Obj()->Libs->Aes->de($value);
                                }
                            }
                        } else {/* si no se envia fields, se encripta toda la data */
                            $newvalue = Obj()->Libs->Aes->de($value);
                        }


                        $data[$key] = $newvalue;
                    }
                    return $data;
                }, $data, $fields);
            } else {/* array es unidimensional */
                return array_map(function($param) {
                    return Obj()->Libs->Aes->de($param);
                }, $data);
            }
        } else {
            throw new Exception('Array no contiene datos en [Tools->decriptArray()]');
        }
    }
    
    /*
     * generar array del mismo length q data a encritar o desencripatar
     */

    private function _reorderFields($count, $param) {
        $v = '';
        if (is_array($param)) {
            foreach ($param as $value) {
                $v .= $value . '*';
            }
            $v = substr($v, 0, strlen($v) - 1);
        } else {
            $v = $param;
        }

        /* generar array en base a $count */
        $i = 0;
        $a = [];
        for ($i; $i < $count; $i++) {
            $a[] = $v;
        }
        return $a;
    }
    
    /*
     * Encripta elementos de un array.
     * uso::
     * Obj()->Tools->encriptArray(['data'=>  DATAARRAY, 'fields'=> CAMPO(S)ADESENCRIPTAR])
     */

    public function encriptArray($obj) {
        $data = isset($obj['data']) ? $obj['data'] : [];
        $fields = isset($obj['fields']) ? $obj['fields'] : null; /* debe tener la misma cantidad de elemntos q data */

        $fields = $this->_reorderFields(count($data), $fields); /* generar elementos conforme a data */

        if (count($data)) {
            return array_map(function($data, $fields) {
                $f = explode('*', $fields); /* fields se convierte en array */

                foreach ($data as $key => $value) {
                    $newvalue = $value;

                    if (!is_null($fields)) {/* se envio campos a envriptar */
                        /* se recorre fields para le encriptacion */
                        foreach ($f as $val) {
                            if ($val == $key && !is_null($fields)) {/* se envio campos a envriptar */
                                $newvalue = Obj()->Libs->Aes->en($value);
                            }
                        }
                    } else {/* si no se envia fields, se encripta toda la data */
                        $newvalue = Obj()->Libs->Aes->en($value);
                    }


                    $data[$key] = $newvalue;
                }
                return $data;
            }, $data, $fields);
        } else {
            /* para el datagrid si no hay data devolver array vacio */
            return $data;
        }
    }
    
    public function dateFormatClient($param) {
        return date("d-m-Y", strtotime($param));
    }

    public function dateFormatServer($param) {
        return date("Y-m-d", strtotime(str_replace('/','-',$param)));
    }
    
    public function encrypt($value) {
        return \Libs\Aes::en($value);
    }

    public function dencrypt($value) {
        return \Libs\Aes::de($value);
    }
    
    public function deleteFile($file) {
        if (is_readable($file)) {
            unlink($file);
        }
    }
    
}