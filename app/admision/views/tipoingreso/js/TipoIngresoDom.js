/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        09-08-2017 20:08:02 
 * Descripcion : TipoIngresoDom.js
 * ---------------------------------------
 */
"use strict";

class TipoIngresoDom_ extends TipoIngresoAjax_ {

    constructor() {
        super();
        this._alias = Exe.getAlias();                       /*alias que se agregara a cada ID y NAME del TAB*/
        this._container = `#${this._alias}_CONTAINER`;      /*<div> del TAB*/
        this._key = null;
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

    formNewTipoIngreso(btn, tk) {
        super.newTipoIngreso(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }

    formEditTipoIngreso(btn, id, tk) { 
        this._key = id;
        super.editTipoIngreso(btn, this, tk).done(function () {
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

    postNewTipoIngreso(tk) {
        super.postNew(tk).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(this, '#formNew');
                Tools.refreshGrid(this._idGridTipoIngreso);
            }
        });
    }

    postEditTipoIngreso(tk) {
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(this, '#formEdit');
                Tools.refreshGrid(this._idGridTipoIngreso);
            }
        });
    }

    deleteTipoIngreso(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridTipoIngreso);
                });
            }
        });
    }

    setTipoIngreso(data) {
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data._1},
                {item: 'chk_activo', value: data._2, type: 'checkbox'},
                {item: 'chk_ingresodirecto', value: data._4, type: 'checkbox'}
            ]
        });
        super.getModalidad(this,data._3);
    }

    addListModalidad(data,sele) {
       
        Tools.listBox({
            data: data,
            optionSelec: true,
            content: `#${this._alias}div_modalidad`,
            default:sele,
            attr: {
                id: `${this._alias}lst_modalidad`,
                name: `${this._alias}lst_modalidad`
            },
            dataView: {
                etiqueta: '_2',
                value: '_1'
            }
        });
    }

}