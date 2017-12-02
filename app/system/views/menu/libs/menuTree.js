"use strict";
(function ($) {

    $.fn.extend({

        menuTree: function (opt) {

            let defaults = {
                data: []
            };

            var options = $.extend(defaults, opt);

            /*=========================================METODOS PRIVADOS=========================================*/
            var _private = {

                childrens: function (oSettings, idMenu) {
                    let childrens = '';
                    $.each(oSettings.data, function (i, v) {
                        if (idMenu == v.parent) {
                            childrens += `{`;
                            if (v.evt_ajax != 'not') {
                                childrens += `  icon: false,`;
                            }
                            ;
                            childrens += `  text: '<span class="_pk hide">${Tools.htmlEntities(v.id_menu)}</span><span class="_activo hide">${v.activo}</span>${v.nmenu}'`;
                            if (v.evt_ajax == 'not') {
                                childrens += `,  children: [${_private.childrens(oSettings, v.id_menu)}]`;
                            }
                            childrens += `},`;
                        }
                    });
                    childrens = childrens.substr(0, childrens.length - 1);
                    return childrens;
                },

                render: function (oSettings) {
                    let cnt = null, that = this, cssenable = '';
                    $(that).html('');
                    $.each(oSettings.data, function (i, v) {
                        if (v.parent == 0) {
                            cssenable = (v.activo == '0') ? 'style="color:red;background: #fadbd8 ;"' : '';
                            cnt = `
                            <div class="col-lg-4" data-orden="${v.id_menu}">
                                <div class="panel panel-warning">
                                    <div class="panel-heading" ${cssenable}>
                                        <i class="fa fa-dedent"></i> ${Tools.htmlEntities(v.nmenu)}
                                        <div class="pull-right">
                                            <div class="btn-group">
                                                <div id="btns_${i}" class="btn-group _prt">
                                                    <button data-toggle="dropdown" class="btn btn-primary btn-xs dropdown-toggle" aria-expanded="false"><span class="caret"></span></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel-body" ${cssenable}>
                                        <div id="mnu_${i}" class="text-left">${Tools.spinner().main}</div>
                                    </div>
                                </div>
                            </div>`;
                            $(that).append(cnt);
                            $(`#btns_${i}`).data('keymnu', v.id_menu);
                            $(`#btns_${i}`).data('parent', '0');
                            $(`#mnu_${i}`).jstree({
                                toolsBtn: {
                                    alias: oSettings.alias,
                                    btns: [
                                        {keybtn: BTNSYS.EDT, parent: 0, evts: [{click: 'Exe.MenuDom.formEditMenu'}]},
                                        {keybtn: BTNSYS.NEW, parent: 1, evts: [{click: 'Exe.MenuDom.formNewMenu'}]},
                                        {keybtn: BTNSYS.DEL, parent: 0, evts: [{click: 'Exe.MenuDom.delete'}]}
                                    ]
                                },
                                core: {
                                    data: eval(`[${_private.childrens(oSettings, v.id_menu)}]`)
                                }
                            });
                            $.fn.getButtonsys({
                                aliasBtn: i,
                                container: `#btns_${i}`,
                                keymnu: oSettings.alias,
                                type: 'li',
                                btns: [
                                    {keybtn: BTNSYS.EDT, evts: [{click: 'Exe.MenuDom.formEditMenu'}]},
                                    {keybtn: BTNSYS.NEW, evts: [{click: 'Exe.MenuDom.formNewMenu'}]},
                                    {keybtn: BTNSYS.DEL, evts: [{click: 'Exe.MenuDom.delete'}]}
                                ]
                            });
                        }
                    });

                    $(that).append('<div class="clearfix"></div>');
                    
                }

            };
            /*=========================================FIN METODOS PRIVADOS=====================================*/

            return this.each(function () {

                var oSettings = options;

                let method = {

                    init: function () {
                        _private.render.call(this, oSettings);
                    }

                };

                method.init.call(this);


            });
        }

    });

})(jQuery);