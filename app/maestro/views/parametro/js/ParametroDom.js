/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 17:08:01 
* Descripcion : ParametroDom.js
* ---------------------------------------
*/ 
"use strict";

class ParametroDom_ extends ParametroAjax_ {

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
                /*id de div para los botones*/
                let idBtnra = `toolbar_${context._alias}`;

                /*div para los botones*/
                let btnr = $('<div />');
                btnr.attr('id', idBtnra);
                btnr.addClass('btn-group');
                btnr.css({
                    'margin-top': '10px'
                });

                /*se agrega el div para los botones*/
                $(context._container).append(btnr);

                /*cargando los botones*/
                $.fn.getButtonsys({
                    container: `#${idBtnra}`,
                    keymnu: context._alias,
                    btns: [
                        {keybtn: BTNSYS.NEW, evts: [{click: 'Exe.MenuDom.formNewMenu'}]}
                        //{keybtn: BTNSYS.EDT, evts: [{click: 'alert(99)'}]}
                    ]
                });

                /*<div> principal del TAB*/
                let dmain = $('<div />');
                dmain.addClass('text-center');
                dmain.css({
                    'margin-top': '10px'
                });
                dmain.html(Tools.spinner().main);
                $(context._container).append(dmain);

                context.renderData(dmain);
            }
        });
    }
    
    index(){
        super.formIndex(this);
    }
    
            
    formNewParametro(btn, tk) {
        super.newParametro(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }
    
    formEditParametro(btn, id, tk) {
        this._key = id;
        super.editParametro(btn, this, tk).done(function () {
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
            
    postNewParametro(tk) {
        super.postNew(tk).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(this, '#formNew');
                Tools.refreshGrid(this._idGridParametro);
            }
        });
    }
    
    postEditParametro(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formEdit');
                Tools.refreshGrid(this._idGridParametro);
            }
        });
    } 
    
    deleteParametro(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridParametro);
                });
            }
        });
    }
     
    setParametro(data) {
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data._1},
                {item: 'chk_activo', value: data._2, type: 'checkbox'} 
            ]
        });
    } 
    
    getParamsData(tk,dmain){
        super.getParams(tk).done(function(data){
            dmain.builtParams({
                alias: this._alias,
                data: data,
                title: SYS_LANG_LABELS.param_general
            });
        });
    }
    
    renderData(dmain){
        Exe.require(`${localStorage.getItem('sys_root')}public/js/builtparams/builtParams`,this).done(function(context){
            context.getParamsData(_tk_,dmain);
        });
    }
    
}