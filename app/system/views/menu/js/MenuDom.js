"use strict";

class MenuDom_ extends MenuAjax_ {

    constructor() {
        super();
        this._alias = Exe.getAlias();                       /*alias que se agregara a cada ID y NAME del TAB*/
        this._container = `#${this._alias}_CONTAINER`;      /*<div> del TAB*/
        this._divmain = `main_${this._alias}`;              /*<div> principal del TAB que se encuenra dentro de _container*/
        this._parent = 0;
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
                dmain.attr('id', context._divmain);
                dmain.addClass('text-center');
                dmain.css({
                    'margin-top': '10px'
                });
                dmain.html(Tools.spinner().main);
                $(context._container).append(dmain);

                context.renderData();
            }
        });
    }

    formNewMenu(btn, tk) {
        let prt = $(btn).parent().parent().parent('._prt');
        this._parent = $.trim($(btn).parent('li').find('._pk').html()) || 0;

        if (prt.length == 1) {
            this._parent = prt.data('keymnu');
        }

        super.formNewMenu(btn, this, tk).done(function () {
            $('#formNewMenu').modal('show');
            setTimeout(function () {
                $('.tagsinput').tagsinput({id: `${this._alias}tagsinput`});
                $('.bootstrap-tagsinput').addClass('col-lg-12');
            }, 100);
        });
    }

    formEditMenu(btn, tk) {
        this._key = $(btn).parent().parent().parent('div').data('keymnu') || $.trim($(btn).parent('li').find('._pk').html());
        super.formEditMenu(btn, this, tk).done(function () {
            $('#formEditMenu').modal('show');
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

    postNewMenu(tk) {
        super.postNewMenu(tk, this).done(function (obj) {
            if (obj.result == 1) {
                Tools.notify().ok({
                    content: SYS_LANG_MSN.save_ok
                });
                this.renderData();
                Tools.closeModal.call(this, '#formNewMenu');
            } else if (obj.result == 2) {
                Tools.notify().error({
                    content: SYS_LANG_MSN.mnu.nmenu_exist
                });
            } else if (obj.result == 3) {
                Tools.notify().error({
                    content: SYS_LANG_MSN.mnu.alias_exist
                });
            } else if (obj.result == 4) {
                Tools.notify().error({
                    content: SYS_LANG_MSN.mnu.ajax_exist
                });
            }
        });
    }

    postEditMenu(tk) {
        super.postEditMenu(tk).done(function (obj) {
            if (obj.result == 1) {
                Tools.notify().ok({
                    content: SYS_LANG_MSN.edit_ok
                });
                this.renderData();
                Tools.closeModal.call(this, '#formEditMenu');
            } else if (obj.result == 2) {
                Tools.notify().error({
                    content: SYS_LANG_MSN.mnu.nmenu_exist
                });
            } else if (obj.result == 3) {
                Tools.notify().error({
                    content: SYS_LANG_MSN.mnu.alias_exist
                });
            } else if (obj.result == 4) {
                Tools.notify().error({
                    content: SYS_LANG_MSN.mnu.ajax_exist
                });
            }
        });
    }

    delete(btn, tk) {
        this._key = $(btn).parent().parent().parent('div').data('keymnu') || $.trim($(btn).parent('li').find('._pk').html());
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    if (obj.result == 1) {
                        Tools.notify().ok({
                            content: SYS_LANG_MSN.delete_ok
                        });
                        this.renderData();
                    }
                });
            }
        });
    }

    postOrdenarMenu(ordenElements,tk){
        super.postOrdenar(tk,ordenElements).done(function (obj) {console.log(obj)
            Tools.execMessage(obj);
        });
    }
    
    renderData() {
        var tthis = this;
        var data = super.getData(_tk_);

        Exe.require(`${localStorage.getItem('sys_root')}app/system/views/menu/libs/menuTree`)
                .done(function () {
                    data.done(function (rows) {
                        $(`#${this._divmain}`).menuTree({
                            alias: this._alias,
                            data: rows
                        });

                        $(`#${this._divmain}`).sortable({
                            update: function () {
                                let ordenElements = $(this).sortable("toArray", {attribute: 'data-orden'}).toString();
                                tthis.postOrdenarMenu(ordenElements,_tk_);
                            }
                        });
                        
                        $(`#${this._divmain} ul`).sortable({
                            update: function () {
                                let ordenElements = $(this).sortable("toArray", {attribute: 'data-orden'}).toString();
                                tthis.postOrdenarMenu(ordenElements,_tk_);
                            }
                        });

                    });
                });

    }

    setMenu(data) {
        Tools.setDataForm('#formEditMenu', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.nmenu, callback: function () {
                        setTimeout(function () {
                            $('.tagsinput').tagsinput();
                            $('.bootstrap-tagsinput').addClass('col-lg-12');
                        }, 100);
                    }},
                {item: 'txt_alias', value: data.alias},
                {item: 'txt_ajax', value: (data.evt_ajax == 'not') ? '' : data.evt_ajax},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }

}
