/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        07-11-2017 16:11:30 
* Descripcion : MiembroDom.js
* ---------------------------------------
*/ 
"use strict";

class MiembroDom_ extends MiembroAjax_ {

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
    
            
    formNewMiembro(btn, tk) {
        super.newMiembro(btn, this, tk).done(function () {
            $('#formNew').modal('show');            
        });
    }
    
    formEditMiembro(btn, id, tk) {
        this._key = id;
        super.editMiembro(btn, this, tk).done(function () {
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
            
    postNewMiembro(tk) {
        var tthis = this;
        super.postNew(tk).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formNew');
                Tools.refreshGrid(this._idGridMiembro);
            }
        });
    }
    
    postEditMiembro(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formEdit');
                Tools.refreshGrid(this._idGridMiembro);
            }
        });
    } 
    
    deleteMiembro(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridMiembro);
                });
            }
        });
    }
     
    setMiembro(data) {
        let sxH = (data._6 == 'H')?1:0;
        let sxM = (data._6 == 'M')?1:0;
        
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_apellido_paterno', value: data._1},
                {item: 'txt_apellido_materno', value: data._2},
                {item: 'txt_primer_nombre', value: data._3},
                {item: 'txt_segundo_nombre', value: data._4},
                {item: 'txt_fecha_nace', value: data._5},
                {item: 'txt_dni', value: data._8},
                {item: 'rd_sexoH', value: sxH, type: 'radio'},
                {item: 'rd_sexoM', value: sxM, type: 'radio'}
            ]
        });
    } 
    
}