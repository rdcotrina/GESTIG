/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        10-08-2017 17:08:47 
* Descripcion : UbigeoAjax.js 
* ---------------------------------------
*/ 
"use strict";
class UbigeoAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'maestro/Ubigeo/';
        this._views = 'app/maestro/views/ubigeo/';
        this._idGridUbigeo = null;
    }
    
    formIndex(context){
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
                obj.context.gridUbigeo(context._alias);
            }
        });
    }
    
    gridUbigeo(alias){
        $(`#${TABS.MAESECPARM}grid`).livianGrid({
            context: this,
            alias: alias,
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: "_2 ASC",
            tColumns: [
                {title: SYS_LANG_LABELS.nombre, field: "_2", width: "550", sortable: true, filter: {type: "text"}},
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
            tButtons:[{
                button: BTNSYS.NEW,                
                ajax: `Exe.UbigeoDom.formNewUbigeo`
            }],             
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,
            sAxions: {
                buttons: [{
                    button: BTNSYS.EDT,
                    ajax: {
                        fn: "Exe.UbigeoDom.formEditUbigeo",
                        
                        serverParams: "_1"
                    }
                }, {
                    button: BTNSYS.DEL,
                    ajax: {
                        fn: "Exe.UbigeoDom.deleteUbigeo",
                        
                        serverParams: "_1"
                    }
                }]
            },
            
            tScroll:{
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridUbigeo = oSettings.tObjectTable;
            }
        });
    }
               
    newUbigeo(btn, context, tk) {
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
               
    editUbigeo(btn, context, tk) {
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
                obj.context.findUbigeo(context);
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
                sData.push({name: '_pkUbigeo', value: contextDom._key});
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
                sData.push({name: '_pkUbigeo', value: obj.context._key});
            }
        });
    }
            
    findUbigeo(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findUbigeo`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setUbigeo(obj.data);
            }
        });
    }

}