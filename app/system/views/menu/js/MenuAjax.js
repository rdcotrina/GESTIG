"use strict";
class MenuAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'system/menu/';
        this._views = 'app/system/views/menu/';
        this._parent = 0;
    }

    formNewMenu(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formNewMenu.js`,
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
    
    formEditMenu(btn, context, tk) {
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formEditMenu.js`,
            dataAlias: context._alias,
            dataType: 'text',
            success: function (obj) {
                $('#cont-modal-sys').html(obj.data);
            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormEdit();
                obj.context.findMenu(context._key,context);
            }
        });
    }

    postNewMenu(tk,contextDom) {
        return super.send({
            flag: 1,
            token: tk,
            dataAlias: this._alias,
            element: `#BCTXT_${this._alias}GRB`,
            context: this,
            root: `${this._controller}postMantenimiento`,
            form: '#formNewMenu',
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_parent', value: contextDom._parent});
            }
        });
    }
    
    postEditMenu(tk){
        return super.send({
            flag: 2,
            token: tk,
            dataAlias: this._alias,
            element: `#BCTXT_${this._alias}UPD`,
            context: this,
            root: `${this._controller}postMantenimiento`,
            form: '#formEditMenu',
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_pkMenu', value: obj.context._key});
            }
        });
    }
    
    postOrdenar(tk,ordenElements){
        return super.send({
            token: tk,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}postOrdenar`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_ordenElements', value: ordenElements});
            }
        });
    }

    getData(tk) {
        return super.send({
            token: tk,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}getData`,
            dataType: 'json'
        });
    }
    
    findMenu(keymnu,mdom){
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findMenu`,
            dataType: 'json',
            decodeHtmlEntities: true,
            serverParams: function (sData, obj) {
                sData.push({name: '_param', value: keymnu});
            },
            success: function (obj) {
                mdom.setMenu(obj.data);
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
            root: `${this._controller}postDelete`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_pkMenu', value: obj.context._key});
            }
        });
    }

}