/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        22-08-2017 18:08:28 
* Descripcion : GestionInstitucionDom.js
* ---------------------------------------
*/ 
"use strict";

class GestionInstitucionDom_ extends GestionInstitucionAjax_ {

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
    
            
    formNewGestionInstitucion(btn, tk) {
        super.newGestionInstitucion(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }
    
    formEditGestionInstitucion(btn, id, tk) {
        this._key = id;
        super.editGestionInstitucion(btn, this, tk).done(function () {
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
            
    postNewGestionInstitucion(tk) {
        var tthis = this;
        super.postNew(tk).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formNew');
                Tools.refreshGrid(this._idGridGestionInstitucion);
            }
        });
    }
    
    postEditGestionInstitucion(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formEdit');
                Tools.refreshGrid(this._idGridGestionInstitucion);
            }
        });
    } 
    
    deleteGestionInstitucion(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridGestionInstitucion);
                });
            }
        });
    }
     
    setGestionInstitucion(data) {
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data._1},
                {item: 'chk_activo', value: data._2, type: 'checkbox'} 
            ]
        });
    } 
    
}