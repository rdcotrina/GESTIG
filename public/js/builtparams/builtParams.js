"use strict";

(function ($) {

    $.fn.extend({

        builtParams: function (opt) {
            let defaults = {
                alias: null,
                data: [],
                title: null
            };

            var options = $.extend(defaults, opt);

            /*=========================================METODOS PRIVADOS=========================================*/
            var _private = {

                generateElement: function (idFset, v, i, oSettings) {
                    var element, css = 'input', js = '', idEl = oSettings.alias + idFset.replace('#', '') + i;
                    switch (v.parametro_tipo) {
                        case 'STRG': /*Cadena*/
                            element = `<input type="text" id="${idEl}STRG" name="${idEl}STRG" value="${v.valor}">`;
                            break;
                        case 'BOOL': /*Boleno*/
                            css = 'checkbox';
                            element = `<input type="checkbox" id="${idEl}BOOL" name="${idEl}BOOL"><i></i>`;
                            break;
                        case 'LIST': /*Lista*/
                            css = 'select';
                            element = Tools.listBox({
                                data: [],
                                optionSelec: true,
                                content: '#return',
                                attr: {
                                    id: `${idEl}LIST`,
                                    name: `${idEl}LIST`
                                },
                                dataView: {
                                    etiqueta: 'db_etiqueta',
                                    value: 'db_value'
                                }
                            });
                            js += `$("#${idEl}LIST").chosen();$("#${idEl}LIST_chosen").css({width: '100%'});`;
                            break;
                        case 'ARLS': /*Array Lista*/
                            css = 'select';
                            element = Tools.listBox({
                                data: [],
                                optionSelec: true,
                                content: '#return',
                                attr: {
                                    id: `${idEl}ARLS`,
                                    name: `${idEl}ARLS`,
                                    multiple: 'multiple'
                                },
                                dataView: {
                                    etiqueta: 'db_etiqueta',
                                    value: 'db_value'
                                }
                            });
                            js += `$("#${idEl}ARLS").chosen();$("#${idEl}ARLS_chosen").css({width: '100%'});`;
                            break;
                        case 'ARCH': /*Array Char*/
                            element = `<input id="${idEl}ARCH" name="${idEl}ARCH" type="type" class="tagsinput" placeholder="${SYS_LANG_LABELS.press_enter}">`;
                            js += `$('#${idEl}ARCH').tagsinput({id: '${idEl}tagsinputARCH'});`;
                            break;
                    }
                    $(idFset).find(`#element_${i}`).append(`<label class="${css}" style="text-align:left">${element}</label>`);
                    eval(js);
                },

                renderParams: function (data, r, oSettings) {
                    var c, idFset = `#fd_${r.parametro}_${r.parametro_seccion}`;

                    $.each(data, function (i, v) {
                        c = `
                        <div class="alert alert-info" style="-webkit-border-radius: 5px !important;-moz-border-radius: 5px !important;border-radius: 5px !important;border-top:1px solid #9cb4c5 !important;">
                            <div class="row">
                                <section id="element_${i}" class="col col-10">
                                    <label class="label"><a href="javascript:;" title="${SYS_LANG_LABELS.edit_param}">${v.parametro_nombre}</a></label>
                                    
                                </section>
                            </div>
                        </div>`;
                        $(idFset).append(c);
                        _private.generateElement(idFset, v, i, oSettings);
                    });
                },

                generate: function (oSettings) {
                    var seccionTMP = null, t = this, c, arrData;

                    $(t).html(`
                    <div class="jarviswidget jarviswidget-color-blueDark">
                        <header>
                            <span class="widget-icon">
                                <i class="fa fa-list" style="padding-top: 10px;"></i>
                            </span>
                            <h2 style="text-transform: uppercase;">${oSettings.title}</h2>
                        </header>
                        <div>
                            <div class="jarviswidget-editbox"></div>
                            <div class="widget-body no-padding">
                                <div class="params smart-form"></div>
                            </div>
                        </div>
                    </div>`);

                    $.each(oSettings.data, function (i, v) {
                        if (seccionTMP != v.parametro_seccion) {

                            c = `
                            <div style="width: 48%;float:left">
                                <header class="text-left">
                                    <i class="fa fa-th-large"></i> <b>${v.parametro_seccion_nombre}</b>
                                </header>
                                <fieldset id="fd_${v.parametro}_${v.parametro_seccion}"></fieldset>
                            </div>`;

                            $(t).find('.params').append(c);

                            arrData = $.grep(oSettings.data, function (e) {
                                return e.parametro_seccion == v.parametro_seccion;
                            });
                            _private.renderParams(arrData, v, oSettings);
                        }
                        seccionTMP = v.parametro_seccion;
                    });

                }

            };
            /*=========================================FIN METODOS PRIVADOS=====================================*/


            return this.each(function () {

                var oSettings = options;

                let method = {

                    init: function () {
                        _private.generate.call(this, oSettings);
                    }

                };

                method.init.call(this);


            });

        }

    });

})(jQuery);