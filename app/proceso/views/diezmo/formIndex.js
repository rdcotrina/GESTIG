<div>
<div class="row">
    <div class="col-lg-6">
        <fieldset>
            <legend><b><i class="fa fa-money"></i> <span class="tr-language" data-tr="registrar_diezmo"></span></b></legend>
            <form id="formRegistraDiezmo" name="formRegistraDiezmo" class="form-horizontal">
                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="buscar_persona"></label>
                    <div class="col-md-9">
                        <input class="form-control" id="txt_persona" name="txt_persona" type="text"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="moneda"></label>
                    <div class="col-md-3" id="div_tipomoneda">
                        <select class="form-control" name="lst_tipomoneda" id="lst_tipomoneda">
                            <option value=""></option> 
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="importe"></label>
                    <div class="col-md-3">
                        <input class="form-control text-right" id="txt_importe" name="txt_importe" type="text" autocomplete="off"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="fecha"></label>
                    <div class="col-md-3">
                        <input class="form-control" id="txt_fecha" name="txt_fecha" type="text"/>
                    </div>
                </div>
                <div class="form-actions" id="foot_btns">
                </div>
                <js id="js_formRegistraDiezmo">
                    $("#formRegistraDiezmo").validate({
                        ignore: [],
                        rules: {
                            txt_persona: {
                                required: true
                            },
                            txt_importe: {
                                required: true,
                                number: true
                            },
                            lst_tipomoneda: {
                                required: true
                            },
                            txt_fecha: {
                                required: true,
                                date: true
                            }
                        },
                        errorPlacement: function (error, element) {
                            error.insertAfter(element.parent());
                        },
                        submitHandler: function () {
                            Exe.DiezmoDom.postNewDiezmo(__PK__);
                        }
                    });
                </js>
            </form>
        </fieldset>
    </div>
    <div class="col-lg-6">
        <div id = "grid"></div>
    </div>
</div>
</div>