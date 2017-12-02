<form class="modal inmodal fade in" id="formNew" name="formNew">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="title_boton_new"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="descripcion"></label>
                    <div class="col-lg-10">
                        <input type="text" class="form-control lv-requided" id="txt_descripcion" name="txt_descripcion" /> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="alias"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control tr-language-title lv-requided" id="txt_alias" name="txt_alias" data-trtitle="t_btn_alias" maxlength="10" data-toggle="tooltip" data-placement="right"/> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="icono"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control lv-requided" id="txt_icono" name="txt_icono" /> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="css"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control tr-language-title lv-requided" id="txt_css" name="txt_css" data-trtitle="t_btn_css" data-toggle="tooltip" data-placement="right"/> 
                    </div>
                </div>

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
            </div>

            <div class="modal-footer">
                <div class="lv-modalrequired"></div>
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
                    required: true,
                    minlength: 3
                },
                txt_alias: {
                    required: true,
                    minlength: 3,
                    maxlength: 10
                },
                txt_icono: {
                    required: true,
                    minlength: 3
                },
                txt_css: {
                    required: true,
                    minlength: 3
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Exe.BotonDom.postNewBoton(__PK__);
            }
        });
    </js>
</form>
