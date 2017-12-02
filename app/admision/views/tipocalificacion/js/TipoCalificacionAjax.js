/* 
* ---------------------------------------
* --------- CREATED BY GENERADOR --------
* fecha:        09-08-2017 22:08:01 
* Descripcion : TipoCalificacionAjax.js 
* ---------------------------------------
*/ 
"use strict";
class TipoCalificacionAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'admision/TipoCalificacion/';
        this._views = 'app/admision/views/tipocalificacion/';
        this._idGridTipoCalificacion = null;
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
                obj.context.gridTipoCalificacion(context._alias);
            }
        });
    }
    
    gridTipoCalificacion(alias){
        $(`#${TABS.ADMTICA}grid`).livianGrid({
            context: this,
            alias: alias,
            tScrollY: "200px",
            pDisplayLength: 25,
            pOrderField: "_2 ASC",
            tColumns: [
                {title: SYS_LANG_LABELS.nombre, field: "_2", width: "550", sortable: true, filter: {type: "text"}}
            ],            
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,
            tScroll:{
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridTipoCalificacion = oSettings.tObjectTable;
            }
        });
    }
            
    findTipoCalificacion(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findTipoCalificacion`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setTipoCalificacion(obj.data);
            }
        });
    }

}