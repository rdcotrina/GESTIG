"use strict";
class BotonAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'system/boton/';
        this._views = 'app/system/views/boton/';
        this._idGridBoton = null;
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
                obj.context.gridBoton(context._alias);
            }
        });
    }
    
    gridBoton(alias) {
        $(`#${TABS.BTN}grid`).livianGrid({
            context: this,
            alias: alias,
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: "_2 ASC",
            tColumns: [
                {title: SYS_LANG_LABELS.nombre, field: "_2", width: "150", sortable: true, filter: {type: "text"}},
                {
                    title: SYS_LANG_LABELS.disenio,
                    width: "150",
                    field: "_4",
                    class: "text-center",
                    fnCallback: function (fila, row) {
                        return '<button type="button" class="' + row._5 + '"><i class="' + row._4 + '"></i></button>';
                    }
                },
                {title: SYS_LANG_LABELS.alias, field: "_3", width: "150", sortable: true, filter: {type: "text"}},
                {
                    title: SYS_LANG_LABELS.estado, 
                    width: "70", 
                    field: "_6", 
                    sortable: true, 
                    class: "text-center",
                    filter:{
                        type:"select",
                        dataClient:[{etiqueta:SYS_LANG_LABELS.activo,value:"1"},{etiqueta:SYS_LANG_LABELS.inactivo,value:"0"}],
                        options:{label:"etiqueta",value:"value"}
                    },
                    fnCallback:function(fila,row){
                        return Tools.labelState(row._6);
                    }
                }
            ],
            tButtons: [{
                    button: BTNSYS.NEW,
                    ajax: `Exe.BotonDom.formNewBoton`
                }],
            sExport: {
                buttons: {excel: true},
                nameFile: "Boton",
                orientation: "landscape",
                caption: '..'
            },
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,
            sAxions: {
                buttons: [{
                        button: BTNSYS.EDT,
                        ajax: {
                            fn: "Exe.BotonDom.formEditBoton",
                            serverParams: "_1"
                        }
                    }, {
                        button: BTNSYS.DEL,
                        ajax: {
                            fn: "Exe.BotonDom.deleteBoton",
                            serverParams: "_1"
                        }
                    }]
            },
            tScroll: {
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridBoton = oSettings.tObjectTable;
            }
        });
    }
    
    newBoton(btn, context, tk) {
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

    editBoton(btn, contextDom, tk) {
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
                contextDom.addButtonsFormEdit();
                obj.context.findBoton(contextDom);
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
            dataType: 'json'
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
                sData.push({name: '_pkKey', value: contextDom._key});
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
                sData.push({name: '_pkKey', value: obj.context._key});
            }
        });
    }

    findBoton(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findBoton`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setBoton(obj.data);
            }
        });
    }
    
}