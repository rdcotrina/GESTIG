<form id="formNew" name="formNew">
    <div class="jarviswidget jarviswidget-color-blueDark">
        <header>
            <span class="widget-icon">
                <i class="fa fa-edit" style="padding-top: 10px;"></i>
            </span>
            <h2 style="text-transform: uppercase;"  class="tr-language" data-tr="title_inscripcion_new"></h2>
        </header>
        <div>
            <div class="jarviswidget-editbox"></div>
            <div class="widget-body no-padding">
                <div class="smart-form">
                     <fieldset>
                        <div class="row">
                            <section class="col col-6">
                                <label class="label tr-language" data-tr="buscar_persona"></label>
                                
                                <label class="input"> 
                                    <input type="text" class="form-control" id="txt_buscar_persona" name="txt_buscar_persona" maxlength="50" /> 
                                
                                </label>
                                
                                 
                                     
                            </section>
                            
                            <section class="col col-6">
                            </section>

                        </div>
                    </fieldset>
                    <header><i class="fa fa-user"></i> <b class="tr-language"  data-tr="title_datos_personales" ></b></header>
                    <fieldset>

                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_tipo_documento" ></label>
                                <label class="select" id="div_tipodocumento">
                                    <select  name="lst_tipodocumento" id="lst_tipodocumento">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>

                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_numero_documento" ></label>
                                <label class="input"><i class="icon-append fa fa-camera-retro"></i>
                                    <input type="text" name="txt_numerodocumento" id="txt_numerodocumento">
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_sexo" > </label>
                                <div class="inline-group">
                                    <label class="radio">
                                        <input type="radio" id="rdo_sexoM" name="rdo_sexo" checked="checked">
                                        <i></i><span class="tr-language" data-tr="title_sexo_m"></span>
                                    </label>
                                    <label class="radio">
                                        <input type="radio" id="rdo_sexoF" name="rdo_sexo"  >
                                        <i></i><span class="tr-language" data-tr="title_sexo_f"></span> 
                                    </label> 
                                </div>
                            </section>
                            <section class="col col-3">
                            </section>
                        </div>
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_primernombre"></label>
                                <label class="input"><i class="icon-append fa fa-user"></i>
                                    <input  class="form-control" type="text" name="txt_primernombre" id="txt_primernombre">
                                </label>
                            </section> 
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_segundonombre"></label>
                                <label class="input"><i class="icon-append fa fa-user"></i>
                                    <input type="text" name="txt_segundonombre" id="txt_segundonombre">
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_apellidopaterno"></label>
                                <label class="input"><i class="icon-append fa fa-user"></i>
                                    <input type="text" name="txt_apellidopaterno" id="txt_apellidopaterno">
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_apellidomaterno"></label>
                                <label class="input"><i class="icon-append fa fa-user"></i>
                                    <input type="text" name="txt_apellidomaterno" id="txt_apellidomaterno">
                                </label>
                            </section>

                        </div>
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_fechanacimiento"></label>
                                <label class="input"><i class="icon-append fa fa-calendar"></i>
                                    <input type="text" name="txt_fechanacimiento" id="txt_fechanacimiento">
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_estadocivil"></label>
                                <label class="select" id="div_estadocivil"> 
                                    <select  name="lst_estadocivil" id="lst_estadocivil">
                                        <option></option>
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-6">
                            </section>
                        </div>
                    </fieldset>
                    <header><i class="fa fa-bullhorn"></i> <b class="tr-language" data-tr="title_mediocomunicacion"></b></header>
                    <fieldset>
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_telefonofijo"></label>
                                <label class="input"><i class="icon-append fa fa-mobile"></i>
                                    <input type="text" name="txt_telefonofijo" id="txt_telefonofijo">
                                </label>
                            </section>

                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_telefonomovil"></label> 
                                <label class="input"><i class="icon-append fa fa-mobile"></i>
                                    <input type="text" name="txt_telefonomovil" id="txt_telefonomovil">
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_correopersonal"></label>  
                                <label class="input"><i class="icon-append fa fa-envelope"></i>
                                    <input type="text" name="txt_correopersonal" id="txt_correopersonal">
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_correocorporativo"></label>   
                                <label class="input"><i class="icon-append fa fa-envelope"></i>
                                    <input type="text" name="txt_correocorporativo" id="txt_correocorporativo">
                                </label>
                            </section>

                        </div>
                    </fieldset>
                    <header><i class="fa fa-map-marker"></i> <b class="tr-language" data-tr="title_lugarrecidencia"> </b></header>
                    <fieldset>
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_pais"></label>
                                <label class="select" id="div_paisrecidencia"> 
                                    <select  name="lst_paisrecidencia" id="lst_paisrecidencia">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_ubigeo"></label> 
                                <label class="input" id="div_ubigeorecidencia"> 
                                    <select  name="lst_ubigeorecidencia" id="lst_ubigeorecidencia">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_tipovia"></label> 
                                <label class="select"  id="div_tipovia"> 
                                    <select  name="lst_tipovia" id="lst_tipovia">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section> 
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_tipozona"></label> 
                                <label class="select" id="div_tipozona"> 
                                    <select  name="lst_tipozona" id="lst_tipozona">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                        </div>

                        <div class="row">
                            <section class="col col-6">
                                <label class="label tr-language" data-tr="title_direccion"></label> 
                                <label class="textarea"> <i class="icon-append fa fa-comment"></i> 										
                                    <textarea rows="4" name="txt_direccion" id="txt_direccion"></textarea> </label>

                            </section>
                            <section class="col col-6">

                            </section>
                        </div>
                    </fieldset>
                    <header><i class="fa fa-bullseye"></i> <b class="tr-language" data-tr="title_lugarnacimiento"> </b></header>
                    <fieldset> 
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_pais"></label>
                                <label class="select" id="div_paisnacimiento"> 
                                    <select  name="lst_paisnacimiento" id="lst_paisnacimiento">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_ubigeo"></label> 
                                <label class="input" id="div_ubigeonacimiento"> 
                                    <select  name="lst_ubigeonacimiento" id="lst_ubigeonacimiento">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>

                            <section class="col col-6">
                            </section>
                        </div>


                    </fieldset>
                    <header><i class="fa fa-bank"></i> <b class="tr-language" data-tr="title_estudios"> </b></header>
                    <fieldset>
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_pais"></label>
                                <label class="select" id="div_paisestudios"> 
                                    <select  name="lst_paisestudios" id="lst_paisestudios">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_ubigeo"></label> 
                                <label class="input" id="div_ubigeoestudios"> 
                                    <select  name="lst_ubigeoestudios" id="lst_ubigeoestudios">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_tipoinstitucion"></label>
                                <label class="select" id="div_tipoinstitucion">
                                    <select  name="lst_tipoinstitucion" id="lst_tipoinstitucion" >
                                        <option value="" ></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_institucion"></label>
                                <label class="select" id="div_institucion">
                                    <select  name="lst_institucion" id="lst_institucion" >
                                        <option value="" ></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>

                        </div>

                        <div class="row" >
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_yearegreso"></label>
                                <label class="input"><i class="icon-append fa fa-calendar"></i>
                                    <input type="text" name="txt_yearegreso" id="txt_yearegreso" maxlength="4">
                                </label>
                            </section>

                            <section class="col col-6">
                                <span id="btn_agregar"></span>


                            </section>
                            <section class="col col-3">

                            </section>
                        </div>

                        <div class="row" >
                            <section class="col col-12" style="width: 100%;">

                                <div id="div_estudios"> 
                                    <div class="table-responsive">

                                        <table width="80%" class="table table-striped table-bordered table-hover" >
                                            <thead>
                                                <tr>
                                                    <th style="text-align:center; width: 30px;" class="tr-language" data-tr="nro"></th>
                                                    <th style="text-align:center;width: 60px;" class="tr-language" data-tr="acciones"></th>
                                                    <th style="text-align:center;width: 150px;" class="tr-language" data-tr="title_tipoinstitucion" ></th>
                                                    <th style="text-align:center;" class="tr-language" data-tr="title_institucion" ></th>
                                                    <th style="text-align:center;width: 100px;" class="tr-language" data-tr="title_yearegreso" ></th> 
                                                </tr>
                                            </thead>
                                            <tbody >
                                                <tr >
                                                    <td colspan="5"  style="text-align:center;" >
                                                        <div class="alert alert-info fade in">

                                                            <i class="fa-fw fa fa-info"></i>
                                                            <strong>No se han agregado Estudios.</strong>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>



                        </div>
                    </fieldset>
                    <header><i class="fa fa-graduation-cap"></i> <b class="tr-language" data-tr="title_inscripcion"> </b></header>
                    <fieldset>
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_programa"></label>
                                <label class="select"id="div_programa"> 
                                    <select  name="lst_programa" id="lst_programa">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>     
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_semestre"></label>
                                <label class="select"id="div_semestre"> 
                                    <select  name="lst_semestre" id="lst_semestre">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>     
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_sede"></label>
                                <label class="select"id="div_sede"> 
                                    <select  name="lst_sede" id="lst_sede">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>     
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_fase"></label>
                                <label class="select"id="div_fase"> 
                                    <select  name="lst_fase" id="lst_fase">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>     
                        </div>
                        <div class="row">
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_modalidadadmision"></label>
                                <label class="select"id="div_modalidadadmision"> 
                                    <select  name="lst_modalidadadmision" id="lst_modalidadadmision">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>     

                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_programaestudio"></label>
                                <label class="select"id="div_programaestudio"> 
                                    <select  name="lst_programaestudio" id="lst_programaestudio">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>     
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_segundaopcion"></label>
                                <label class="select"id="div_segundaopcion"> 
                                    <select  name="lst_segundaopcion" id="lst_segundaopcion">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>
                            <section class="col col-3">
                                <label class="label tr-language" data-tr="title_modalidadestudio"></label>
                                <label class="select"id="div_modalidadestudio"> 
                                    <select  name="lst_modalidadestudio" id="lst_modalidadestudio">
                                        <option value=""></option> 
                                    </select>
                                    <i></i>
                                </label>
                            </section>    

                        </div>

                    </fieldset>


                    <footer class="modal-footer">

                        <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
                        <span id="foot_btns"></span>
                    </footer>
                </div>
            </div>
        </div>
    </div>
    <js id="js_formNew">
        function validar2() {

            Tools.removeValidate("#formNew");
            $("#formNew").validate({

                ignore: [],
                rules: {
                    lst_tipoinstitucion: {
                        required: true
                    },
                    lst_institucion: {
                        required: true
                    },
                    txt_yearegreso: {
                        required: true,
                        maxlength: 4,
                        minlength: 4,
                        number: true
                    }
                },
                errorPlacement: function (error, element) {
                        error.insertAfter(element.parent());
                }
            });

            if ($("#formNew").valid()) {

                    Exe.InscripcionDom.setInstitucion(1, '');
            }

        }

        function validar1() {
                Tools.removeValidate("#formNew");
                $("#formNew").validate({
                    ignore: [],
                            rules: {
                            lst_tipodocumento: {
                            required: true
                    },
                    txt_numerodocumento: {
                                    required: true
                    },
                    txt_primernombre: {
                                    required: true,
                                    minlength: 2
                    },
                    txt_apellidopaterno: {
                                    required: true,
                                    minlength: 2
                    },
                    txt_fechanacimiento: {
                                    required: true,
                                    date: true
                    },
                    lst_estadocivil: {
                                    required: true
                    },
                    txt_telefonofijo: {
                                    number: true,
                                    minlength: 6
                    },
                    txt_telefonomovil: {
                                    number: true,
                                    minlength: 9
                    },
                    txt_correopersonal: {
                                    email: true
                    },
                    txt_correocorporativo: {
                                    email: true
                    },
                    lst_paisrecidencia: {
                                    required: true
                    },
                    lst_ubigeorecidencia: {
                                    required: true
                    },
                    txt_direccion: {
                                    required: true,
                                    minlength: 3
                    },
                    lst_paisnacimiento: {
                                    required: true
                    },
                    lst_programa: {
                                    required: true
                    },
                    lst_semestre: {
                                    required: true
                    },
                    lst_sede: {
                                    required: true
                    },
                    lst_fase: {
                                    required: true
                    },
                    lst_modalidadadmision: {
                                    required: true
                    },
                    lst_programaestudio: {
                                    required: true
                    },
                    lst_modalidadestudio: {
                                    required: true
                    },
                    lst_metodologia: {
                                    required: true
                    }
                },
                errorPlacement: function (error, element) {
                                error.insertAfter(element.parent());
                }
            });

            if ($("#formNew").valid()) {
                            Exe.InscripcionDom.postNewInscripcion(__PK__);
            }
        }
    </js>

</form>