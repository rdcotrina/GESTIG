/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 10:08:35 
* Descripcion : AmbienteDom.js
* ---------------------------------------
*/ 
"use strict";

class AmbienteDom_ extends AmbienteAjax_ {

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
    
    index(){
        super.formIndex(this);
    }
    
            
    formNewAmbiente(btn, tk) {
        super.newAmbiente(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }
    
    formEditAmbiente(btn, id, tk) {
        this._key = id;
        super.editAmbiente(btn, this, tk).done(function () {
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
            
    postNewAmbiente(tk) {
        super.postNew(tk).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(this, '#formNew');
                Tools.refreshGrid(this._idGridAmbiente);
            }
        });
    }
    
    postEditAmbiente(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formEdit');
                Tools.refreshGrid(this._idGridAmbiente);
            }
        });
    } 
    
    deleteAmbiente(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridAmbiente);
                });
            }
        });
    }
     
    setAmbiente(data) {
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data._1},
                {item: 'chk_activo', value: data._2, type: 'checkbox'} 
            ]
        });
    } 
    
}