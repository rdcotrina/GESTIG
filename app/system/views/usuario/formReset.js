<form class="modal inmodal fade in" id="formReset" name="formReset">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="title_usuario_reset"></h4>
            </div>
            <div class="modal-body form-horizontal" style="max-height: 450px; overflow: auto;">

                <fieldset> 

                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="user"></label>
                        <div class="col-lg-9">
                            <input type="text" class="form-control" id="txt_user" name="txt_user" maxlength="50"  readonly /> 
                        </div>
                    </div> 
                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="pass_new"></label>
                        <div class="col-lg-9">
                            <input type="password" class="form-control" id="txt_pass" name="txt_pass" maxlength="100" /> 
                        </div>
                    </div> 
                </fieldset>


            </div>

            <div class="modal-footer">
                <span id="foot_btns"></span>
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
    <js id="js_formReset">
        $("#formReset").validate({
        ignore: [],
        rules: {
        txt_pass: {
        required: true,
                minlength: 6,
                maxlength: 100
        } 
        },
        errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
        },
        submitHandler: function () {
                Exe.UsuarioDom.postResetClaveUsuario(__PK__);
        }
        });
    </js>
</form>
 