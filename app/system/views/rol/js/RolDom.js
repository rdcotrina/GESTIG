/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        17-08-2017 18:08:48 
 * Descripcion : RolDom.js
 * ---------------------------------------
 */
"use strict";

class RolDom_ extends RolAjax_ {

    constructor() {
        super();
        this._alias = Exe.getAlias();                       /*alias que se agregara a cada ID y NAME del TAB*/
        this._container = `#${this._alias}_CONTAINER`;      /*<div> del TAB*/
        this._key = null;
        this._rol = null;
        this._idOpcion = null;
        this._idRolOpcion = null;

        this._scAccess = function () {

            var tthis = this;

            let m = {
                renderRoles: function (data, parent) {
                    let li = '', text, btns, irm, evts;

                    $.each(data, function (i, v) {
                        if (parent == v.parent) {
                            irm = (!$.isEmptyObject(v.id_rolmenu)) ? `data-irm="${v.id_rolmenu}"` : '';
                            text = (v.childs > 0) ? `<i class="fa fa-lg icon-plus-sign"></i> ${Tools.traslate(v.nmenu)}` : `<label class="checkbox inline-block"><input type="checkbox" data-k="${v.id_menu}" data-in="${i}" ${irm} ${(v.assigned == 0) ? '' : 'checked'}><i></i> ${Tools.traslate(v.nmenu)}</label>`;
                            btns = (v.childs > 0) ? '' : `<span class="${tthis._alias}d_btn"></span>`;
                            evts = (v.childs > 0) ? '' : `<div><div id="${tthis._alias}${i}d_evts" class="d_evts" style="width:435px;position: absolute;right: -480px;top: 8px;"></div></div>`;

                            li += `
                            <li style="${(parent == 0) ? '' : 'display:none;'}width:300px;">
                                <span>${text}</span> ${btns} ${evts}`;
                            if (v.childs > 0) {
                                li += `
                                <ul>${tthis._scAccess().renderRoles.call(tthis, data, v.id_menu)}</ul>`;
                            }
                            li += `
                            </li>`;
                        }
                    });
                    return li;
                },
                disablebtn: function () {
                    let li;

                    $(`#${this._alias}d_tree`).find('button').prop('disabled', true);
                    $(`#${this._alias}d_tree`).find('input:checkbox:checked').each(function (i, v) {
                        li = $(v).parent().parent().parent('li');
                        li.find('button').prop('disabled', false);
                        li.find('button').data('k', $(v).data('k'));
                        li.find('button').data('irm', $(v).data('irm'));
                        li.find('button').data('in', $(v).data('in'));
                    });
                },
                addEvtBtn: function () {
                    let t = this;
                    $(`#${this._alias}d_tree`).find('button').off('click');
                    $(`#${this._alias}d_tree`).find('button').click(function () {
                        t.getEventsRol(this, _tk_);
                    });
                    //quitar eventos a botones disabled
                    $(`#${this._alias}d_tree`).find('button:disabled').off('click');
                },
                renderEvents: function (data, indice) {
                    var uAss = $('<ul></ul>'), uNoAss = $('<ul></ul>'), da = '', dna = '';

                    $.each(data, function (i, v) {
                        if (v.assigned == 0) {
                            dna += `<li data-k="${v.id_boton}" class="move-cursor"><span>${Tools.traslate(v.nboton)}</span></li>`;
                        } else {
                            da += `<li data-k="${v.id_boton}" class="move-cursor"><span>${Tools.traslate(v.nboton)}</span></li>`;
                        }
                    });

                    uAss.addClass('si-access');
                    uAss.attr('id', `${tthis._alias}_siAss`);
                    uAss.html(da);


                    uNoAss.addClass('no-access');
                    uNoAss.attr('id', `${tthis._alias}_noAss`);
                    uNoAss.html(dna);

                    let sch = `<input type="text" class="form-control" style="width:214px;margin-top:-35px;padding-left:5px" placeholder="${SYS_LANG_LABELS.search_sensitive}">`;

                    $('.d_evts').html('');

                    $(`#${tthis._alias}${indice}d_evts`).html(sch);
                    $(`#${tthis._alias}${indice}d_evts`).append(uAss);
                    $(`#${tthis._alias}${indice}d_evts`).append(uNoAss);


                    $(`#${tthis._alias}${indice}d_evts`).find('input:text').off('keyup');
                    $(`#${tthis._alias}${indice}d_evts`).find('input:text').keyup(function () {
                        $('.no-access li').hide();
                        $('.no-access li:contains("' + this.value + '")').show();

                    });

                    $.expr[":"].contains = $.expr.createPseudo(function (arg) {
                        return function (elem) {
                            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                        };
                    });

                    this.dragDrop();
                },
                dragDrop: function () {

                    $(`#${tthis._alias}_noAss`).sortable({
                        connectWith: `#${tthis._alias}_siAss`,
                        stop:function  (ev, ui) {
                            tthis.postBotonOpcionRol(1,$(ui.item).data('k'),_tk_);
                        }
                    });

                    $(`#${tthis._alias}_siAss`).sortable({
                        connectWith: `#${tthis._alias}_noAss`,
                        stop:function  (ev, ui) {
                            tthis.postBotonOpcionRol(2,$(ui.item).data('k'),_tk_);
                        }
                    });
                }
            };

            return m;
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

    formNewRol(btn, tk) {
        super.newRol(btn, this, tk).done(function () {
            $('#formNew').modal('show');
        });
    }

    formEditRol(btn, id, tk) {
        this._key = id;
        super.editRol(btn, this, tk).done(function () {
            $('#formEdit').modal('show');
        });
    }

    formAccessRol(btn, id, name, tk) {
        this._key = id;
        this._rol = name;
        super.accessRol(btn, this, tk).done(function () {
            $('#formAccess').modal('show');
        });
    }

    formPrintEvents(btn, tk){
        super.printEvents(btn, tk).done(function () {
            $('#formPrintEvents').modal('show');
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
    
    addBtnPrint() {
        $.fn.getButtonsys({
            container: `#${this._alias}d_btn_print`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.PRINT, evts: [{click: 'Exe.RolDom.formPrintEvents'}]}]
        });
    }

    addButtonsFormAccess() {
        $.fn.getButtonsys({
            container: `.${this._alias}d_btn`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.EVT}]
        }, function (oSettings) {
            $(oSettings.container).find('button').css({
                padding: '3px 5px 3px 5px'
            });
        });
    }

    postNewRol(tk) {
        super.postNew(tk).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(this, '#formNew');
                Tools.refreshGrid(this._idGridRol);
            }
        });
    }

    postEditRol(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formEdit');
                Tools.refreshGrid(this._idGridRol);
            }
        });
    }

    deleteRol(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridRol);
                });
            }
        });
    }

    setRol(data) {
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data._1},
                {item: 'chk_activo', value: data._2, type: 'checkbox'}
            ]
        });
    }

    setRoles(data) {

        let ul = `<ul>${this._scAccess().renderRoles.call(this, data, 0)}</ul>`;

        $(`#${this._alias}d_tree`).html(ul);

        Tools.tree(`#${this._alias}d_tree`);

        Tools.addEvent().click({
            element: `#${this._alias}d_tree input:checkbox`,
            event: `Exe.RolDom.postOpcionRol(this,${_tk_});`
        });

        //agregando boton eventos
        this.addButtonsFormAccess();

        //desabilitando botones para opcines que no esten asignadas
        this._scAccess().disablebtn.call(this);

        //agregando eventos a botones habilitados
        this._scAccess().addEvtBtn.call(this);

    }

    postOpcionRol(chk, tk) {
        this._idOpcion = $(chk).data('k');
        let falg = ($(chk).is(':checked')) ? 1 : 2;

        var din = $(chk).data('in');
        var btn = $(chk).parent().parent().parent('li').find('button');

        super.postOpcion(tk, this, falg).done(function (obj) {
            Tools.execMessage(obj);
            if (falg == 1) {//activar boton EVENTO y agregarle su evento click
                btn.prop('disabled', false);
                btn.data('irm', obj.id_rolmenu);
                btn.data('in', din);
                //agregando eventos a botones habilitados
                this._scAccess().addEvtBtn.call(this);
            } else if (falg == 2) {//desactivar boton EVENTO y quitar su evento click
                btn.prop('disabled', true);
                btn.removeData('k');
                btn.off('click');
                $('.d_evts').html('');
            }
        });
    }

    getEventsRol(btn, tk) {
        var indice = $(btn).data('in');
        this._idRolOpcion = $(btn).data('irm');

        super.getEvents(tk, btn).done(function (data) {
            this._scAccess().renderEvents(data, indice);
        });
    }
    
    postBotonOpcionRol(f,idBoton,tk){//al heredar RolAjax, este forma parde del objeto RolDom, es por ello q this._alias funciona en RolAjax, pork this se mantiene como RolDom
        super.postBotonOpcion(tk,idBoton,f).done(function (data) {
            Tools.execMessage(data);
        });
    }

}