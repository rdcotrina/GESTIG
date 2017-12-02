/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        07-11-2017 16:11:30 
* Descripcion : MiembroAjax.js 
* ---------------------------------------
*/ 
"use strict";
class MiembroAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'maestro/Miembro/';
        this._views = 'app/maestro/views/miembro/';
        this._idGridMiembro = null;
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
                obj.context.gridMiembro(context._alias);
            }
        });
    }
    
    gridMiembro(alias){
        $(`#${TABS.MMB}grid`).livianGrid({
            context: this,
            alias: alias,
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: "_2 ASC",
            tColumns: [
                {title: SYS_LANG_LABELS.nombre, field: "_2", width: "550", sortable: true, filter: {type: "text"}},
                {title: SYS_LANG_LABELS.tipo_miembro, field: "_3", width: "150", sortable: true, filter: {type: "text"}}
            ],    
            tButtons:[{
                button: BTNSYS.NEW,                
                ajax: `Exe.MiembroDom.formNewMiembro`
            }],     
            sExport: {
                buttons: {excel: true},
                nameFile: "miembros",
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
                        fn: "Exe.MiembroDom.formEditMiembro",
                        serverParams: "_1"
                    }
                }, {
                    button: BTNSYS.DEL,
                    ajax: {
                        fn: "Exe.MiembroDom.deleteMiembro",
                        serverParams: "_1"
                    }
                }]
            },
            
            tScroll:{
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridMiembro = oSettings.tObjectTable;
            }
        });
    }
               
    newMiembro(btn, context, tk) {
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
            final:  (obj) =>{/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormNew();
                Tools.addEvent().date(`#${context._alias}txt_fecha_nace`);
                
                $(`#${this._alias}formNew`).appList({
                    items: [
                        {
                            data: 'tipomiembro',
                            container: '#' + context._alias + 'div_tipomiembro',
                            attr: {
                                id: context._alias + 'lst_tipomiembro',
                                name: context._alias + 'lst_tipomiembro'
                            }
                        }
                    ]
                });
            }
        });
    }
               
    editMiembro(btn, context, tk) {
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
                Tools.addEvent().date(`#${context._alias}txt_fecha_nace`);
                obj.context.findMiembro(context);
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
                sData.push({name: '_pkMiembro', value: contextDom._key});
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
                sData.push({name: '_pkMiembro', value: obj.context._key});
            }
        });
    }
            
    findMiembro(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findMiembro`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setMiembro(obj.data);
            }
        });
    }

}