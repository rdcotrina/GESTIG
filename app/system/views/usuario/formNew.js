<form class="modal inmodal fade in" id="formNew" name="formNew">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="title_usuario_new"></h4>
            </div>
            <div class="modal-body form-horizontal" style="max-height: 450px; min-height: 450px;   overflow-y: scroll;">
                <fieldset>
                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="buscar_persona"></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control" id="txt_buscar_persona" name="txt_buscar_persona" maxlength="50" /> 
                        </div>
                    </div>                     
                </fieldset> 
                <fieldset>
                    <legend><i class="fa fa-lock"></i> <b class="tr-language"  data-tr="datosacceso"></b></legend>

                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="user"></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control" id="txt_user" name="txt_user" maxlength="50" autocomplete="off" /> 
                        </div>
                    </div> 
                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="pass"></label>
                        <div class="col-lg-9">
                            <input type="password" class="form-control" id="txt_pass" name="txt_pass" maxlength="50" autocomplete="off" /> 
                        </div>
                    </div> 
                </fieldset>
                <fieldset>
                    <legend><i class="fa fa-check-square"></i> <b class="tr-language"  data-tr="asignarrol"></b></legend>
                    <div  id="div_rol">


                    </div>  
                </fieldset>

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
             txt_user: {
                required: true,
                minlength: 6,
                maxlength: 100
            },        
            txt_pass: {
                required: true,
                minlength: 3,
                maxlength: 100
            }  
        },
        errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
                 
        },
        submitHandler: function () {
          
                Exe.UsuarioDom.postNewUsuario(__PK__);
        }
        });
    </js>
</form>