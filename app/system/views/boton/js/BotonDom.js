"use strict";

class BotonDom_ extends BotonAjax_ {

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
    
    formNewBoton(btn, tk) {
        super.newBoton(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }

    formEditBoton(btn, id, tk) {
        this._key = id;
        super.editBoton(btn, this, tk).done(function () {
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
    
    addButtonsFormEdit(){
        $.fn.getButtonsys({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.UPD, type: 'submit'}]
        });
    }

    postNewBoton(tk) {
        var tthis = this;
        super.postNew(tk).done(function (obj) {;
            Tools.execMessage(obj);
            if(obj.ok_error != 'error'){
                Tools.closeModal.call(tthis,'#formNew');
                Tools.refreshGrid(this._idGridBoton);
            }
        });
    }
    
    postEditBoton(tk){
        var tthis = this;
        super.postEdit(tk,this).done(function (obj) {
            Tools.execMessage(obj);
            if(obj.ok_error != 'error'){
                Tools.closeModal.call(tthis,'#formEdit');
                Tools.refreshGrid(this._idGridBoton);
            }
        });
    }
    
    deleteBoton(btn,id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridBoton);
                });
            }
        });
    }
    
    setBoton(data){
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.nboton},
                {item: 'txt_alias', value: data.alias},
                {item: 'txt_icono', value: data.icono},
                {item: 'txt_css', value: data.css},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }

}
