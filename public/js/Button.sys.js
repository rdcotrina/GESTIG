"use strict";
var OBJBTNS = [];
(function ($) {

    let BTNSYSCTXT = [];    /*los botones con texto*/
    let BTNSYSSTXT = [];    /*los botones sin texto*/
    let BTNSLI = [];    /*los botones en <li>*/

    $.fn.extend({

        buttonsys: function (opt) {

            let defaults = {
                data: []
            };

            var options = $.extend(defaults, opt);
            /*=========================================METODOS PRIVADOS=========================================*/
            var _private = {

                createButton: function (oSettings) {
                    let v = oSettings.data;
                    let b = `<button id="BCTXT_${v.alias + v.alias_btn}" type="button" class="${v.css}"><i class="${v.icono}"></i> ${Tools.traslate(v.nboton)}</button>`;
                    BTNSYSCTXT.push({keymnu: v.alias, keybtn: v.alias_btn, btn: b});

                    b = `<button id="BSTXT_${v.alias + v.alias_btn}" type="button" class="${v.css}" title="${Tools.traslate(v.nboton)}"><i class="${v.icono}"></i></button>`;
                    BTNSYSSTXT.push({keymnu: v.alias, keybtn: v.alias_btn, btn: b});

                    b = `<li><a id="BSLI_${v.alias + v.alias_btn}" href="javascript:;" style="color:#333"><i class="${v.icono}"></i> ${Tools.traslate(v.nboton)}</a></li>`;
                    BTNSLI.push({keymnu: v.alias, keybtn: v.alias_btn, btn: b});
                    OBJBTNS[`${v.alias}${v.alias_btn}`] = v;
                }

            };
            /*=========================================FIN METODOS PRIVADOS=====================================*/

            return this.each(function () {

                var oSettings = options;

                let method = {

                    init: function () {
                        _private.createButton(oSettings);
                    }

                };

                method.init.call(this);


            });
        },

        getButtonsys: function (opt, callback = null) {

            let defaults = {
                keymnu: null, /*alias del menu*/
                btns: [], /*botones*/
                notext: false, /*indica que se retornara el boton con sus descripcion*/
                container: null,
                type: 'button',
                forceBtnXs: false,
                aliasBtn: null  /*aplicable solo para <li>*/
            };

            var options = $.extend(defaults, opt);
            /*=========================================METODOS PRIVADOS=========================================*/
            var _private = {

                render: function (oSettings) {
                    let data = (oSettings.notext) ? BTNSYSSTXT : BTNSYSCTXT;
                    let idbtn = (oSettings.notext) ? 'BSTXT_' : 'BCTXT_';
                    let typebtn = null;

                    /*verificar si se generara <li>*/
                    data = (oSettings.type == 'li') ? BTNSLI : data;
                    idbtn = (oSettings.type == 'li') ? 'BSLI_' : idbtn;

                    if (oSettings.type == 'li') {
                        $(oSettings.container).append('<ul class="dropdown-menu"></ul>');
                    }

                    /*recorrido de botones requeridos*/
                    $.each(oSettings.btns, function (i, v) {
                        typebtn = (v.type == undefined) ? 'button' : v.type;

                        /*recorrido de todos botones generados*/
                        $.each(data, function (ii, vv) {
                            let kbtn = null;
                            if (oSettings.keymnu == vv.keymnu && v.keybtn == vv.keybtn) {
                                

                                if (oSettings.type == 'li') {
                                    $(oSettings.container).find('ul').append(vv.btn);
                                }else{
                                    $(oSettings.container).append(vv.btn);
                                    if(oSettings.forceBtnXs){
                                        $(oSettings.container).find('button').addClass('btn-xs');
                                    }
                                }

                                kbtn = `${idbtn}${oSettings.keymnu}${vv.keybtn}`;
                                
                                /*agregar type de boton*/
                                if (oSettings.type == 'button') {
                                    $(`#${kbtn}`).attr('type', typebtn);
                                }
                                
                                /*cambiando id de li si se envia aliasbtn*/
                                if(oSettings.aliasBtn != undefined){
                                    $(oSettings.container).find(`#${kbtn}`).attr('id', kbtn + oSettings.aliasBtn);
                                    kbtn = kbtn + oSettings.aliasBtn;
                                }
                                
//                                if (oSettings.aliasBtn != undefined && oSettings.type == 'li') { 
//                                    $(oSettings.container).find(`#${kbtn}`).attr('id', kbtn + oSettings.aliasBtn);
//                                    kbtn = kbtn + oSettings.aliasBtn;
//                                }

                                /*recorrido de eventos*/
                                $.each(v.evts, function (a, b) {
                                    $.each(b, function (x, y) {
                                        eval(`
                                        setTimeout(function(){
                                            $('#${kbtn}').off('${x}');
                                            $('#${kbtn}').${x}(function(){
                                                ${y}(this,'${_sys_sg}');
                                            });
                                        },500);
                                        `);
                                    });
                                });
                            }
                        });
                    });

                    if (typeof callback === 'function') {
                        callback(oSettings);
                    }
                }

            };
            /*=========================================FIN METODOS PRIVADOS=====================================*/

            var oSettings = options;

            _private.render(oSettings);

        }

    });

})(jQuery);