/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        17-08-2017 18:08:48 
* Descripcion : RolAjax.js 
* ---------------------------------------
*/ 
"use strict";
class RolAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'system/Rol/';
        this._views = 'app/system/views/rol/';
        this._idGridRol = null;
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
                obj.context.gridRol(context._alias);
            }
        });
    }
    
    gridRol(alias){
        $(`#${TABS.SYSROL}grid`).livianGrid({
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
                ajax: `Exe.RolDom.formNewRol`
            }],             
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,
            sAxions: {
                buttons: [{
                    button: BTNSYS.ACC,
                    ajax: {
                        fn: "Exe.RolDom.formAccessRol",
                        serverParams: ["_1","_2"]
                    }
                },{
                    button: BTNSYS.EDT,
                    ajax: {
                        fn: "Exe.RolDom.formEditRol",
                        serverParams: "_1"
                    }
                }, {
                    button: BTNSYS.DEL,
                    ajax: {
                        fn: "Exe.RolDom.deleteRol",
                        serverParams: "_1"
                    }
                }]
            },
            
            tScroll:{
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridRol = oSettings.tObjectTable;
            }
        });
    }
               
    newRol(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formNew.js`,
            dataAlias: context._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').append(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormNew();
            }
        });
    }
               
    editRol(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formEdit.js`,
            dataAlias: this._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').append(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormEdit();
                obj.context.findRol(context);
            }
        });
    }
    
    accessRol(btn, context, tk){
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formAccess.js`,
            dataAlias: this._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').append(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                obj.context.getRoles(context);
                obj.context.addBtnPrint();
                $('#d_rol').html(context._rol);
            }
        });
    }
    
    printEvents(btn, tk){
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formPrintEvents.js`,
            dataAlias: this._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').append(obj.data);
            },
            final: function (obj) {
                obj.context.getDetailRol();
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
                sData.push({name: '_pkRol', value: contextDom._key});
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
                sData.push({name: '_pkRol', value: obj.context._key});
            }
        });
    }
            
    findRol(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findRol`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setRol(obj.data);
            }
        });
    }
    
    getRoles(contextDom) {
        super.send({
            flag: 4,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}getRolesJSON`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setRoles(obj.data);
            }
        });
    }
    
    postOpcion(tk, contextDom,f) {
        return super.send({
            flag: f,
            token: tk,
            dataAlias: this._alias,
            gifProcess: true,
            context: this,
            root: `${this._controller}postMantenimientoOpcion`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_pkRol', value: contextDom._key});
                sData.push({name: '_pkOpcion', value: contextDom._idOpcion});
            }
        });
    }
    
    getEvents(tk,btn) {
        return super.send({
            flag: 5,
            token: tk,
            element: btn,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}getEvents`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: obj.context._idRolOpcion});
            }
        });
    }
    
    postBotonOpcion(tk,idBoton,f){
        return super.send({
            flag: f,
            token: tk,
            dataAlias: this._alias,
            gifProcess: true,
            context: this,
            root: `${this._controller}postMantenimientoOpcionRol`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_pkBoton', value: idBoton});
                sData.push({name: '_pkRolOpcion', value: obj.context._idRolOpcion});
            }
        });
    }

    getDetailRol(){
    
    }
    
}