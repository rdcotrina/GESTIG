/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        09-11-2017 10:11:28 
 * Descripcion : DiezmoDom.js
 * ---------------------------------------
 */
"use strict";

class DiezmoDom_ extends DiezmoAjax_ {

    constructor() {
        super();
        this._alias = Exe.getAlias();                       /*alias que se agregara a cada ID y NAME del TAB*/
        this._container = `#${this._alias}_CONTAINER`;      /*<div> del TAB*/
        this._key = null;

        this._resetForm = () => {
            this._persona = null;
            Tools.setDataForm('#formRegistraDiezmo', {
                alias: this._alias,
                elements: [
                    {item: 'txt_persona', value: ''},
                    {item: 'txt_importe', value: ''},
                    {item: 'txt_fecha', value: ''}
                ]
            });
        };
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

    formNewDiezmo(btn, tk) {
        super.newDiezmo(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }

    formEditDiezmo(btn, id, tk) {
        this._key = id;
        super.editDiezmo(btn, this, tk).done(function () {
            $('#formEdit').modal('show');
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

    postNewDiezmo(tk) {
        if ($.isEmptyObject(this._persona)) {
            Tools.notify().error({
                content: SYS_LANG_MSN.persona_require
            });
            return false;
        }
        super.postNew(tk).done((obj) => {
            Tools.execMessage(obj);
            Tools.refreshGrid(this._idGridDiezmo);
            this._resetForm();
        });
    }

    postEditDiezmo(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formEdit');
                Tools.refreshGrid(this._idGridDiezmo);
            }
        });
    }

    deleteDiezmo(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridDiezmo);
                });
            }
        });
    }

}