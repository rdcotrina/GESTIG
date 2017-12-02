/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        17-08-2017 11:08:15 
 * Descripcion : UsuarioDom.js
 * ---------------------------------------
 */
"use strict";

class UsuarioDom_ extends UsuarioAjax_ {

    constructor() {
        super();
        this._alias = Exe.getAlias();                       /*alias que se agregara a cada ID y NAME del TAB*/
        this._container = `#${this._alias}_CONTAINER`;      /*<div> del TAB*/
        this._key = null;
        this._persona = null;
    }

    main() {
        Tools.addTab({
            context: this,
            id: this._alias,
            label: Exe.getTitle(),
            breadCrumb: Exe.getRoot(),
            fnCallback: function (context) {
                context.index();
            }
        });
    }

    index() {
        super.formIndex(this);
    }

    formNewUsuario(btn, tk) {
        this._key = null;
        this._persona=0;
        super.newUsuario(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }

    formEditUsuario(btn, id, tk) {
        this._key = id;
        super.editUsuario(btn, this, tk).done(function () {
            $('#formEdit').modal('show');
        });
    }

    formRestClaveUsuario(btn, id, tk) {
        //    alert(id);
        this._key = id;
        super.resetClaveUsuario(btn, this, tk).done(function () {
            $('#formReset').modal('show');
        });
    }

    addButtonsFormNew() {
        $.fn.getButtonsys({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.GRB, type: 'submit'}]
        });
    }

    addButtonsFormEdit() {
        $.fn.getButtonsys({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.UPD, type: 'submit'}]
        });
    }

    postNewUsuario(tk) {
        if ($(`#${this._alias}formNew`).find('input:checkbox:checked').length == 0) {
            Tools.notify().error({
                content: SYS_LANG_MSN.app.rol_required
            });
 
        } else if ($.isEmptyObject(this._persona)) {
            Tools.notify().error({
                content: SYS_LANG_MSN.persona_require
            });
            $(`#${this._alias}txt_buscar_persona_`).focus();
            $(`#${this._alias}txt_buscar_persona_`).addClass('error');
             
        } else {
            var tthis = this;
            super.postNew(tk).done(function (obj) {
                Tools.execMessage(obj);
                if (obj.ok_error != 'error') {
                    Tools.closeModal.call(tthis, '#formNew');
                    Tools.refreshGrid(this._idGridUsuario);
                }
            });
        }

    }

    postEditUsuario(tk) {
        if ($(`#${this._alias}formEdit`).find('input:checkbox:checked').length == 0) {
            Tools.notify().error({
                content: SYS_LANG_MSN.app.rol_required
            });
        } else {
            var tthis = this;
            super.postEdit(tk, this).done(function (obj) {
                Tools.execMessage(obj);
                if (obj.ok_error != 'error') {
                    Tools.closeModal.call(tthis, '#formEdit');
                    Tools.refreshGrid(this._idGridUsuario);
                }
            });
        }
    }

    postResetClaveUsuario(tk) {

        var tthis = this;
        super.postResetClave(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formReset');
                Tools.refreshGrid(this._idGridUsuario);
            }
        });

    }

    deleteUsuario(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridUsuario);
                });
            }
        });
    }

    setUsuario(data) {
        this._persona=data._4;
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_user', value: data._1},
                {item: 'txt_buscar_persona', value: data._3} 
            ]
        });
        super.getRol(this, data._1);
    }

    setResetClaveUsuario(data) {
        this._persona=data._4;
        Tools.setDataForm('#formReset', {
            alias: this._alias,
            elements: [
                {item: 'txt_user', value: data._1},
                {item: 'txt_pass', value: ''}
            ]
        });

    }

    addListRol(data, sele) {


        var html = '';
        var html2 = '';
        var aa = 0;
        var aa2 = 0;
        $.each(data, function (i, b) {
            if (b._3 == 1) {
                aa2++;
                if (aa2 == '1') {
                    html2 += '<div class="form-group" >'
                }

                html2 += '<div class="col-lg-4">'
                html2 += '   <div class="checkbox smart-form"> '
                html2 += '       <label class="checkbox">'
                html2 += '           <input type="checkbox" id="chk_rol_' + b._1 + '" name="chk_rol[]" ' + (b._3 == 1 ? 'checked' : '') + '   value="' + b._1 + '"/>'
                html2 += '           <i></i> '
                html2 += '           <span class="lv-checkbox" >' + b._2 + '</span> '
                html2 += '       </label>'
                html2 += '   </div> '
                html2 += '</div>';

                if (aa2 == '3') {
                    html2 += '</div>'
                    aa2 = 0;
                }
            } else {




                aa++;
                if (aa == '1') {
                    html += '<div class="form-group" >'
                }

                html += '<div class="col-lg-4">'
                html += '   <div class="checkbox smart-form"> '
                html += '       <label class="checkbox">'
                html += '           <input type="checkbox" id="chk_rol_' + b._1 + '" name="chk_rol[]" ' + (b._3 == 1 ? 'checked' : '') + '   value="' + b._1 + '"/>'
                html += '           <i></i> '
                html += '           <span class="lv-checkbox" >' + b._2 + '</span> '
                html += '       </label>'
                html += '   </div> '
                html += '</div>';

                if (aa == '3') {
                    html += '</div>'
                    aa = 0;
                }
            }
        })

        $(`#${this._alias}div_rol`).html(html);
        if (sele != null) {
            $(`#${this._alias}div_rol_asignado`).html(html2);
        }
    }

    addSearch() {
        var t = this;
        var search_ = $(`#${this._alias}txt_buscar_persona`).autoCompleteTable({
            
            id:`${this._alias}txt_buscar_persona_`,
            columns: [SYS_LANG_LABELS.apellidoynombre, SYS_LANG_LABELS.title_tipo_documento_abreviado, SYS_LANG_LABELS.title_numero_documento_abreviado],
            rows: ['_1', '_2', '_3', '_4'],
            hide: [false], //columnas que se ocultaran de rows
            indexColumView: 1, //esta columna de la tabla se cargara en el text q se busca
            placeholder: SYS_LANG_LABELS.buscar_x_nom_nrodoc,
            ajax: {
                url: `${super.getRootController()}getPersona`,
                type: "POST",
                data: function () {
                    return {_paramSearch: search_.searchdata(), _alias: t._alias};
                },
                success: function (data) {
                    var filterData = [];
                    var searchData = eval("/" + search_.searchdata() + "/gi");
                    $.each(data, function (i, v) {
                        if (v._2.search(new RegExp(searchData)) != -1 || v._4.search(new RegExp(searchData)) != -1) {
                            filterData.push(v);
                        }
                    });
                    return filterData;
                }
            },
            onchange: function () {
                var sele = search_.all();
                t._persona = sele._1;
            }
        });
    }

}