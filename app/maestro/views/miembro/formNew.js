<form class="modal inmodal fade in" id="formNew" name="formNew">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="title_miembro_new"></h4>
            </div>
            <div class="modal-body form-horizontal">
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="title_apellidopaterno"></label>
                    <div class="col-lg-7">
                        <input type="text" class="form-control" id="txt_apellido_paterno" name="txt_apellido_paterno" /> 
                    </div>
                </div> 
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="title_apellidomaterno"></label>
                    <div class="col-lg-7">
                        <input type="text" class="form-control" id="txt_apellido_materno" name="txt_apellido_materno" /> 
                    </div>
                </div> 
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="title_primernombre"></label>
                    <div class="col-lg-7">
                        <input type="text" class="form-control" id="txt_primer_nombre" name="txt_primer_nombre" /> 
                    </div>
                </div> 
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="title_segundonombre"></label>
                    <div class="col-lg-7">
                        <input type="text" class="form-control" id="txt_segundo_nombre" name="txt_segundo_nombre" /> 
                    </div>
                </div> 
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="dni"></label>
                    <div class="col-lg-3">
                        <input type="text" class="form-control" id="txt_dni" name="txt_dni" /> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-4 control-label"></label>
                    <div class="col-md-7 smart-form">  
                        <div class="inline-group">
                            <label class="radio">
                                <input value="H" checked="" id="rd_sexoM" name="rd_sexo" type="radio"><i></i> <span style="margin-top: -6px;display: block" class="tr-language" data-tr="hombre"></span>
                            </label>
                            <label class="radio">
                                <input value="M" id="rd_sexoF" name="rd_sexo" type="radio"><i></i> <span style="margin-top: -6px;display: block" class="tr-language" data-tr="mujer"></span>
                            </label>
                        </div>   
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="tipo_miembro"></label>
                    <div class="col-lg-4" id="div_tipomiembro">
                        <select type="text" class="form-control" id="lst_tipomiembro" name="lst_tipomiembro"> 
                            <option value="" class="tr-language" data-tr="seleccionar"></option>
                        </select>
                    </div>
                </div> 
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="title_fechanacimiento"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_fecha_nace" name="txt_fecha_nace"/> 
                    </div>
                </div> 
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
            txt_primer_nombre: {
                required: true,
                minlength: 3
            },
            txt_apellido_paterno: {
                required: true,
                minlength: 3
            },
            lst_tipomiembro: {
                required: true
            },
            txt_fecha_nace: {
                date: true
            },
            txt_dni: {
                required: true,
                number: true,
                lengthChar: 8
            }
        },
        errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
        },
        submitHandler: function () {
                Exe.MiembroDom.postNewMiembro(__PK__);
        }
        });
    </js>
</form>