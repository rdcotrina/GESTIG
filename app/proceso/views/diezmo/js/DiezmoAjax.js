/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        09-11-2017 10:11:28 
 * Descripcion : DiezmoAjax.js 
 * ---------------------------------------
 */
"use strict";
class DiezmoAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'proceso/Diezmo/';
        this._views = 'app/proceso/views/diezmo/';
        this._idGridDiezmo = null;
        this._persona = null;
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
            final:  (obj) =>{/*se ejecuta una vez que se cargo el HTML en success*/
                obj.context.gridDiezmo(this._alias);
                Tools.addEvent().date(`#${this._alias}txt_fecha`);
                context.addButtonsFormNew();
                
                $(`#${context._alias}txt_persona`).autocomplete({
                    source: 'proceso/Diezmo/getPersona',
                    extraParams: {"test": "thisisatest"},
                    minLength: 3,
                    select: (event, ui) => {
                        this._persona = ui.item.id;
                    }
                });

                $(`#${this._alias}formRegistraDiezmo`).appList({
                    items: [
                        {
                            data: 'tipomoneda',
                            container: '#' + context._alias + 'div_tipomoneda',
                            attr: {
                                id: context._alias + 'lst_tipomoneda',
                                name: context._alias + 'lst_tipomoneda'
                            },
                            default: 1
                        }
                    ]
                });

            }
        });
    }

    gridDiezmo(alias) {
        $(`#${TABS.DIZ}grid`).livianGrid({
            context: this,
            alias: alias,
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: "_4 DESC",
            tColumns: [
                {title: SYS_LANG_LABELS.apellidoynombre, field: "_2", width: "350", sortable: true, filter: {type: "text"}},
                {title: SYS_LANG_LABELS.importe, field: "_3", width: "150", sortable: true, filter: {type: "text"}},
                {title: SYS_LANG_LABELS.fecha, field: "_4", width: "150", sortable: true, filter: {type: "date"}}
            ],
            sExport: {
                buttons: {excel: true},
                nameFile: "Diezmo",
                orientation: "landscape",
                caption: '..'
            },
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,
            sAxions: {
                buttons: [{
                    button: BTNSYS.DEL,
                    ajax: {
                        fn: "Exe.DiezmoDom.deleteDiezmo",
                        serverParams: "_1"
                    }
                }]
            },
            tScroll: {
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridDiezmo = oSettings.tObjectTable;
            }
        });
    }

    newDiezmo(btn, context, tk) {
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
            }
        });
    }

    editDiezmo(btn, context, tk) {
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
                obj.context.findDiezmo(context);
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
            form: '#formRegistraDiezmo',
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_pkPersona', value: this._persona});
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
                sData.push({name: '_pkDiezmo', value: contextDom._key});
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
                sData.push({name: '_pkDiezmo', value: obj.context._key});
            }
        });
    }

    findDiezmo(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findDiezmo`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setDiezmo(obj.data);
            }
        });
    }

}