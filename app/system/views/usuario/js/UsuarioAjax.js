/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        17-08-2017 11:08:15 
 * Descripcion : UsuarioAjax.js 
 * ---------------------------------------
 */
"use strict";
class UsuarioAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'system/Usuario/';
        this._views = 'app/system/views/usuario/';
        this._idGridUsuario = null;
    }

    formIndex(context) {
        return super.send({
            token: _tk_,
            context: this,
            root: `${this._views}formIndex.js`,
            dataAlias: context._alias,
            dataType: 'text',
            success: function (obj) {
                $(context._container).append(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                obj.context.gridUsuario(context._alias);
            }
        });
    }

    getRootController() {
        return this._controller;
    }

    gridUsuario(alias) {
        $(`#${TABS.SYSUSR}grid`).livianGrid({
            context: this,
            alias: alias,
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: "_2 ASC",
            tColumns: [
                {title: SYS_LANG_LABELS.user, field: "_2", width: "100", sortable: true, filter: {type: "text"}},
                {title: SYS_LANG_LABELS.nombreyapellido, field: "_4", width: "200", sortable: true, filter: {type: "text"}},
                {title: SYS_LANG_LABELS.ultimoacceso, field: "_5", width: "100", sortable: true, class: 'text-center', filter: {type: "text"}},
                {title: SYS_LANG_LABELS.rol, field: "_6", width: "50", sortable: true, class: 'text-center', filter: {type: "text"}},
                {
                    title: SYS_LANG_LABELS.estado,
                    width: "70",
                    field: "_3",
                    sortable: true,
                    class: "text-center",
                    filter: {
                        type: "select",
                        dataClient: [{etiqueta: SYS_LANG_LABELS.activo, value: "1"}, {etiqueta: SYS_LANG_LABELS.inactivo, value: "0"}],
                        options: {label: "etiqueta", value: "value"}
                    },
                    fnCallback: function (fila, row) {
                        return Tools.labelState(row._3);
                    }
                }
            ],
            tButtons: [{
                    button: BTNSYS.NEW,
                    ajax: `Exe.UsuarioDom.formNewUsuario`
                }],
            sExport: {
                buttons: {excel: true},
                nameFile: "Usuario",
                orientation: "landscape",
                caption: '..'
            },
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,
            sAxions: {
                buttons: [{
                        button: BTNSYS.RSCV,
                        ajax: {
                            fn: "Exe.UsuarioDom.formRestClaveUsuario",
                            serverParams: "_1"
                        }
                    },
                    {
                        button: BTNSYS.EDT,
                        ajax: {
                            fn: "Exe.UsuarioDom.formEditUsuario",
                            serverParams: "_1"
                        }
                    },
                    {
                        button: BTNSYS.DEL,
                        ajax: {
                            fn: "Exe.UsuarioDom.deleteUsuario",
                            serverParams: "_1"
                        }
                    }]
            },

            tScroll: {
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridUsuario = oSettings.tObjectTable;
            }
        });
    }

    newUsuario(btn, context, tk) {
        var t = this;
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formNew.js`,
            dataAlias: context._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').html(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormNew();
                t.getRol(context);
                context.addSearch();
            }
        });
    }

    editUsuario(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formEdit.js`,
            dataAlias: this._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').html(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormEdit();
                obj.context.findUsuario(context, 1);
            }
        });
    }

    resetClaveUsuario(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formReset.js`,
            dataAlias: this._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').html(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormEdit();
                obj.context.findUsuario(context, 2);
            }
        });
    }

    postNew(tk) {

        return super.send({
            flag: 1,
            token: tk,
            dataAlias: this._alias,
            element: `#BCTXT_${this._alias}GRB`,
            context: this,
            root: `${this._controller}postMantenimiento`,
            form: '#formNew',
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: obj.context._alias + 'persona', value: obj.context._persona});
            }
        });
    }

    postEdit(tk, contextDom) {
        return super.send({
            flag: 2,
            token: tk,
            dataAlias: this._alias,
            element: `#BCTXT_${this._alias}UPD`,
            context: this,
            root: `${this._controller}postMantenimiento`,
            form: '#formEdit',
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_pkUsuario', value: contextDom._key})
                sData.push({name: obj.context._alias + 'persona', value: obj.context._persona});
            }
        });
    }

    postResetClave(tk, contextDom) {
        return super.send({
            flag: 4,
            token: tk,
            dataAlias: this._alias,
            element: `#BCTXT_${this._alias}UPD`,
            context: this,
            root: `${this._controller}postMantenimiento`,
            form: '#formReset',
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_pkUsuario', value: contextDom._key});
                sData.push({name: obj.context._alias + 'persona', value: obj.context._persona});
            }
        });
    }

    delete(btn, tk) {
        return super.send({
            flag: 3,
            token: tk,
            dataAlias: this._alias,
            element: btn,
            context: this,
            root: `${this._controller}delete`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_pkUsuario', value: obj.context._key});
            }
        });
    }

    findUsuario(contextDom, flag = '1') {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findUsuario`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                if (flag == '1') {
                    contextDom.setUsuario(obj.data);
                } else {
                    contextDom.setResetClaveUsuario(obj.data);
                }
            }
        });
    }

    getRol(contextDom, sele) {

        super.send({
            flag: ($.isEmptyObject(contextDom._key)) ? 2 : 3,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}getRol`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.addListRol(obj.data, contextDom._key);
            }
        });
    }
}