"use strict";
var counterTabsSys = 0;
class Tools_ {

    constructor() {
        this._tabs = $("#cont-general-tabs-sys").tabs();
        this._tabTemplate = `<li style='position:relative;border-radius: 3px 3px 0 0;-moz-border-radius: 3px 3px 0 0;-webkit-border-radius: 3px 3px 0 0;' id='#{idli}'> 
                                <span class='delete-tab' style='top:2px; left:2px;position:absolute;'>
                                    <button class='btn btn-xs font-xs btn-default hover-transparent'><i class='fa fa-times'></i></button>
                                </span>
                                <a href='#{href}'>&nbsp;&nbsp;&nbsp; #{label}</a>
                            </li>`;
    }

    addTab(obj) {
        /*verificar si tab existe.*/
        if ($('#cont-general-tabs-sys').find('#' + obj.id + '_CONTAINER').length > 0) {
            $('#li-' + obj.id).remove();
            $('#cont-general-tabs-sys').find('#' + obj.id + '_CONTAINER').remove();
        }

        let li = $(this._tabTemplate.replace(/#\{href\}/g, "#" + obj.id + '_CONTAINER').replace(/#\{label\}/g, obj.label).replace(/#\{idli\}/g, 'li-' + obj.id));
        let tabContentHtml = (obj.content !== undefined) ? obj.content : `<h1><i class="fa fa-cog fa-spin"></i> ${SYS_LANG_LABELS.loading}</h1>`;

        this._tabs.find("#cont-tabs-sys").append(li);
        this._tabs.find('#cont-main-sys').append("<div id='" + obj.id + "_CONTAINER' class='tab-pane'><p>" + tabContentHtml + "</p></div>");
        this._tabs.tabs("refresh");

        if (obj.breadCrumb) {
            $(obj.context._container).html(Tools.breadcrumb(obj.breadCrumb));
        } else {
            console.log('[breadCrumb] es requerido en Tools.addTab');
        }

        if (obj.fnCallback !== undefined) {
            if (obj.context == undefined) {
                console.log('[context] no definido.');
            }
            obj.fnCallback(obj.context);
            $('#process-general').fadeOut();
        }

        $('#li-' + obj.id).find('a').click();

    }

    closeTabs() {
        let t = this;
        $("#cont-general-tabs-sys").on("click", 'span.delete-tab', function () {
            /*detecto id de tab dentro del contenedro del aplicativo*/
            let panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
            t._tabs.tabs("refresh");
        });
    }

    /*
     * mensajes
     */
    notify() {
        let m = {
            ok: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : SYS_LANG_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#739E73",
                    iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-check shake animated",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            error: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : SYS_LANG_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#C46A69",
                    iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-warning shake animated",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            info: function (obj) {
                $.bigBox({
                    title: (obj.title !== undefined) ? obj.title : SYS_LANG_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#3276B1",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                    icon: (obj.icon !== undefined) ? obj.icon : "fa fa-bell swing animated",
                    number: (obj.number !== undefined) ? obj.number : "1"
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            warning: function (obj) {
                $.bigBox({
                    title: (obj.title !== undefined) ? obj.title : SYS_LANG_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#C79121",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                    icon: (obj.icon !== undefined) ? obj.icon : "fa fa-shield fadeInLeft animated",
                    number: (obj.number !== undefined) ? obj.number : "1"
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            msn: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : SYS_LANG_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#296191",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                    icon: (obj.icon !== undefined) ? obj.icon : "fa fa-bell swing animated"
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            smallMsn: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : SYS_LANG_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#296191",
                    iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-thumbs-up bounce animated",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            confirm: function (obj) {
                $.SmartMessageBox({
                    title: `<b>${SYS_LANG_MSN.msn_sys}</b>`,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    buttons: '[No][Si]'
                }, function (ButtonPressed) {
                    if (obj.context == undefined) {
                        console.log('[context] no definido, puede causar errores para ejecucion de callback');
                    }
                    if (ButtonPressed === "Si") {
                        if (obj.yes !== undefined) {
                            obj.yes(obj.context); /*context es para enviar el scope de la clase en donde se ejecuta Tools*/
                        }
                    }
                    if (ButtonPressed === "No") {
                        if (obj.not !== undefined) {
                            obj.not(obj.context);
                        }
                    }
                });
            },
            alert: function (obj) {
                $.SmartMessageBox({
                    title: SYS_LANG_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    buttons: '[Aceptar]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Aceptar") {
                        if (obj.callback !== undefined) {
                            obj.callback();
                        }
                    }
                });
            }
        };
        return m;
    }

    /*
     * Quita el validate de jquery de un fronulario
     * @param {type} f
     * @returns {undefined}
     */
    removeValidate(f) {
        $(f).removeData("validator");
        $(f).find('.chosen-container').css('border', '0px');
    }

    /*para agregar eventos a elementos*/
    addEvent() {
        let ev = {
            click: function (obj) {
                $(obj.element).off('click');
                $(obj.element).on({
                    click: function () {
                        eval(obj.event);
                    }
                });
            },
            keypress: function (obj) {
                $(obj.element).off('keypress');
                $(obj.element).on({
                    keypress: function () {
                        eval(obj.event);
                    }
                });
            },
            keyup: function (obj) {
                $(obj.element).off('keyup');
                $(obj.element).on({
                    keypress: function () {
                        eval(obj.event);
                    }
                });
            },
            change: function (obj) {
                $(obj.element).off('change');
                $(obj.element).on({
                    keypress: function () {
                        eval(obj.event);
                    }
                });
            },
            date: function (obj) {
                $(obj).datepicker();
                $(obj).mask('99-99-9999');
            },
            //Tools.setEvent.dateRange({ini: '#txt_fechaini', fin: '#txt_fechafin'});
            dateRange: function (obj) {
                $(obj.ini).datepicker();
                $(obj.fin).datepicker();
                $(obj.ini).on("dp.change", function (e) {
                    $(obj.fin).data("DateTimePicker").minDate(e.date);
                });
                $(obj.fin).on("dp.change", function (e) {
                    $(obj.ini).data("DateTimePicker").maxDate(e.date);
                });
                $(obj.ini).mask('99-99-9999');
            },
            time: function (obj) {
                $(obj.element).clockpicker({
                    autoclose: true
                });
                $(obj.element).mask('99:99');
            }
        };

        return ev;
    }

    /*
     * Encriptar
     * @param {type} c
     * @returns {String}
     */
    e(c) {
        return Aes.Ctr.post(c, 256);
    }
    /*
     * desencriptar
     * @param {type} c
     * @returns {String}
     */
    d(c) {
        return Aes.Ctr.get(c, 256);
    }
    /*
     * 
     * @param {type} obj
     * @returns {undefined}
     * @uso 
     *       Tools.listBox({
     *           data: data,
     *           optionSelec: true,
     *           content: 'content',
     *           attr:{
     *               id: 'lst_element',
     *               name: 'lst_element'
     *           },
     *           dataView:{
     *               etiqueta: 'db_etiqueta',
     *               value: 'db_value'
     *           }
     *       });
     * 
     */
    createListBox(obj) {
        var data = obj.data,
                optionSelec = (obj.optionSelec === undefined) ? true : obj.optionSelec, /*para mostrar texto seleccionar*/
                content = obj.content, /*id deelemento donde se cargara <select>*/
                required = (obj.required === undefined) ? false : true,
                deffault = (obj.deffault !== undefined) ? obj.deffault : '', /*para seleccionar un registro por defecto*/
                fnCallback = (obj.fnCallback !== undefined) ? obj.fnCallback : '', /*funcion anonima*/
                dataView = obj.dataView, /*la data a setear en <select>*/
                attr = '', /*los atributos html del <select>*/
                chosen = (obj.chosen === undefined) ? true : obj.chosen,
                allWidth = (obj.allWidth === undefined) ? false : obj.allWidth,
                optionAll = (obj.optionAll === undefined) ? false : obj.optionAll;

        let iidd = '';
        if (obj.attr !== undefined && obj.attr !== '') {
            for (var i in obj.attr) {
                if (i == 'id') {
                    iidd = obj.attr[i];
                }
                attr += i + '="' + obj.attr[i] + '" ';
            }
        }
        let cb = '<select ' + attr + ' >';
        if (optionSelec) {
            cb += '<option value="">Seleccionar</option>';
        }
        if (optionAll) {
            cb += '<option value="ALL">Todos</option>';
        }
        let sel = '';
        let id = '';
        let value = '';
        let dataAttr = '';

        for (var i in data) {
            id = '';
            dataAttr = '';

            /*creando data-*/
            if (dataView.attr !== undefined) {
                if ($.isArray(dataView.attr)) {
                    for (var k in dataView.attr) {
                        dataAttr += 'data-' + dataView.attr[k] + '="' + eval('data[i].' + dataView.attr[k]) + '" ';
                    }
                } else {
                    dataAttr = 'data[i].' + dataView.attr;
                    dataAttr = 'data-' + dataView.attr + '="' + eval(dataAttr) + '" ';
                }
            }

            if ($.isArray(dataView.value)) {
                for (var j in dataView.value) {
                    id += eval('data[i].' + dataView.value[j]) + '-';
                }

                id = id.substring(0, id.length - 1);

            } else {
                id = 'data[i].' + dataView.value;
                id = eval(id);
            }

            value = '';
            if ($.isArray(dataView.etiqueta)) {
                for (var j in dataView.etiqueta) {
                    value += eval('data[i].' + dataView.etiqueta[j]) + ' - ';
                }

                value = value.substring(0, value.length - 2);

            } else {
                value = 'data[i].' + dataView.etiqueta;
                value = eval(value);
            }
            sel = '';
            if (deffault === id) {
                sel = ' selected = "selected" ';
            }
            cb += '<option value="' + id + '" ' + sel + ' ' + dataAttr + '>' + value + '</option>';
        }
        cb += '</select>';

        if (!chosen) {
            cb += '<i></i>';
        }

        if (required) {
            cb += '<div class="obligar"></div>';
        }

        if (content == 'return') {
            return cb;
        } else {
            $('#' + content).html(cb);
        }
        if (chosen) {
            $('#' + iidd).chosen();
        }
        if (fnCallback !== '') {
            fnCallback();
        }
        if (allWidth) {
            $('#' + iidd + '_chosen').css({width: '100%'});
        }
    }

    /*anular submit en en evento enter de elementos de un formulario*/
    noSubmit(form) {
        $(form).find('input:text').keypress(function (e) {
            if (e.keyCode === 13)
                return false;
        });
    }

    en(c) {
        return Aes.Ctr.post(c, 256);
    }

    de(c) {
        return Aes.Ctr.get(c, 256);
    }
    /*
     * Traduce todas las etiquetas del app
     * @param {type} root
     * @returns {undefined}
     */
    traslation(lang) {
        if ($.isEmptyObject(lang)) {
            var ln = window.navigator.language || navigator.browserLanguage;
            var lang = ln.split('-')[0].toUpperCase();
        }

        Exe.require(`${localStorage.getItem('sys_root')}config/18n/language_${lang}`, function () {

            var elems = document.querySelectorAll(".tr-language"), ev = '';
            for (var x = 0; x < elems.length; x++) {
                ev = `language_${lang}.labels[ '${elems[x].dataset.tr}' ]`;
                elems[x].innerHTML = eval(ev);
                
                $(elems[x]).removeClass('tr-language');
                $(elems[x]).addClass('tr-language-valida');
            }
            //los placeholders
            elems = document.querySelectorAll(".tr-language-ph"), ev = '';
            for (var x = 0; x < elems.length; x++) {
                ev = `language_${lang}.labels[ '${elems[x].dataset.trph}' ]`;
                elems[x].placeholder = eval(ev);
                
                $(elems[x]).removeClass('tr-language-ph');
            }

            //los titles
            elems = document.querySelectorAll(".tr-language-title"), ev = '';
            for (var x = 0; x < elems.length; x++) {
                ev = `language_${lang}.labels[ '${elems[x].dataset.trtitle}' ]`;
                elems[x].title = eval(ev);
                
                $(elems[x]).removeClass('tr-language-title');
            }

            SYS_LANG_MSN = eval(`language_${lang}.msn`); /*para los alertas*/
            SYS_LANG_LABELS = eval(`language_${lang}.labels`); /*para etiquetas y placeholders*/
            localStorage.setItem('sys_lang', lang);
        });
    }
    /*
     * Traduce de idioma las etiquetas de el menu y los botones
     * @param {type} text
     * @returns {Tools_.traslate.t2}
     */
    traslate(text) {
        let lang = localStorage.getItem('sys_lang');
        let t1 = text.split(',');
        let t2 = null;
        let t3 = null;

        $.each(t1, function (i, v) {
            t2 = v.split('-');

            if (lang == t2[0]) {
                t3 = t2[1];
            }
        });

        return t3;
    }

    breadcrumb(data) {
        let d = data.split('/');
        let b = `
        <ul class="lv-breadcrumb">
            <li><a href="javascript:;"><i class="fa fa-home"></i></a></li>`;
        $.each(d, function (i, v) {
            b += `<li><a href="javascript:;">${v}</a></li>`;
        });
        b += `</ul><div class="lv-divider-bread"></div>`;
        return b;
    }
    /*
     * Cierra y quita los modals del DOM
     * @param {type} obj
     * @returns {undefined}
     */
    closeModal(obj) {
        var search = obj.toString().indexOf('#'), id = '', id2;
        if (search === -1) {/*cuando se cierra modal desde botones*/
            id = '#' + $(obj).parent().parent().parent().parent().attr('id');
            id2 = id;
        } else {/*cuando se cierra modal desde closeModal*/
            id2 = obj;
            id = obj.replace('#', `#${this._alias}`);
        }

        $(id).modal('hide');
        setTimeout(function () {
            $(id).remove();
            $(id2 + '_modalFormBoot').remove();
        }, 200);
        $(".modal").off("keypress");/*quitar evento que se agrega al momento de usar el TREE.php*/
    }
    /*
     * Agregar alias a HTML
     * @param {type} data
     * @param {type} alias
     * @returns {undefined}
     */
    addAliasData(data, alias) {
        let sc = null, idsc = null, nform = 0, c = null, ee = null, f1 = 0;
        $(data).find('input,div,span,select,label,button,form,js').each(function (i, v) {
            if ($(v).attr('name') != undefined) {
                $(`#${v.id}`).attr('name', alias + $(v).attr('name'));
            }
            if ($(v).attr('id') != undefined) {
                $(`#${v.id}`).attr('id', alias + $(v).attr('id'));
            }

            if ($(v).parent().prop('tagName') == 'FORM' && nform == 0) {
                nform++;
                $(`#${$($(v).parent()).attr('id')}`).attr('name', alias + $($(v).parent()).attr('id'));
                $(`#${$($(v).parent()).attr('id')}`).attr('id', alias + $($(v).parent()).attr('id'));
            }
            if ($(v).prop('tagName') == 'JS') {
                idsc = alias + $(v).attr('id');
                sc = $(v).html();

                /*agregando ALIAS  <js>*/
                $(data).find('input,div,span,select,label,button,form').each(function (ii, vv) {
                    /*para id de <form>*/
                    f1++;
                    if ($(vv).parent().prop('tagName') == 'FORM' && f1 == 1) {
                        c = $(`#${alias}${$($(vv).parent('form')).attr('id')}`).find('js').html();//id de form con alias
                        var t = $($(vv).parent('form')).attr('id').replace(alias, '');//se quita el alias
                        ee = eval(`c.replace(/${t}/gi,'${alias}${t}')`);
                        $(`#${idsc}`).html(ee);
                    }
                    if ($(vv).attr('id') != undefined) {
                        c = $(`#${idsc}`).html();
                        ee = eval(`c.replace(/${vv.id}/gi,'${alias}${vv.id}')`);
                        ee = eval(`ee.replace(/__PK__/gi,${_sys_sg})`);
                        $(`#${idsc}`).html(ee);
                    }
                });
            }
        });
        $(`#${$(`#${idsc}`).parent('form').attr('id')}`).append(`<script>${$(`#${idsc}`).html()}</script>`);
        $(`#${$(`#${idsc}`).parent('form').attr('id')}`).find('script').remove();
        $(`#${$(`#${idsc}`).parent('form').attr('id')}`).find('js').remove();

    }

    getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
        //compatibility for firefox and chrome
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
                noop = function () {},
                localIPs = {},
                ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                key;

        function iterateIP(ip) {
            if (!localIPs[ip])
                onNewIP(ip);
            localIPs[ip] = true;
        }

        //create a bogus data channel
        pc.createDataChannel("");

        // create offer and set local description
        pc.createOffer().then(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0)
                    return;
                line.match(ipRegex).forEach(iterateIP);
            });

            pc.setLocalDescription(sdp, noop, noop);
        }).catch(function (reason) {
            // An error occurred, so handle the failure to connect
        });

        //listen for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex))
                return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }

    spinner() {
        return {
            main: `
            <h1><i class="fa fa-cog fa-spin"></i> ${SYS_LANG_LABELS.loading}</h1>`
        };
    }

    removeAttr() {
        return {
            click: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var onclick = $(this).attr('onclick');
                    /*asignar evento*/
                    $(this).click(function () {
                        eval(onclick);
                    });
                    $(this).attr('onclick', null);
                });
            },
            keypress: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var keypress = $(this).attr('onkeypress');
                    /*asignar evento*/
                    $(this).keypress(function () {
                        eval(keypress);
                    });
                    $(this).attr('onkeypress', null);
                });
            },
            keyup: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var keyup = $(this).attr('onkeyup');
                    /*asignar evento*/
                    $(this).keyup(function () {
                        eval(keyup);
                    });
                    $(this).attr('onkeyup', null);
                });
            },
            change: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var change = $(this).attr('onchange');
                    /*asignar evento*/
                    $(this).change(function () {
                        eval(change);
                    });
                    $(this).attr('onchange', null);
                });
            },
            mouseover: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var mouseover = $(this).attr('onmouseover');
                    /*asignar evento*/
                    $(this).mouseover(function () {
                        eval(mouseover);
                    });
                    $(this).attr('onmouseover', null);
                });
            },
            mousemove: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var mousemove = $(this).attr('onmousemove');
                    /*asignar evento*/
                    $(this).mousemove(function () {
                        eval(mousemove);
                    });
                    $(this).attr('onmousemove', null);
                });
            },
            dblclick: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var dblclick = $(this).attr('ondblclick');
                    /*asignar evento*/
                    $(this).dblclick(function () {
                        eval(dblclick);
                    });
                    $(this).attr('ondblclick', null);
                });
            },
            mouseout: function (obj) {
                var collection = $(obj.container).find(obj.typeElement);
                $.each(collection, function () {
                    /*obtener evento*/
                    var mouseout = $(this).attr('onmouseout');
                    /*asignar evento*/
                    $(this).mouseout(function () {
                        eval(mouseout);
                    });
                    $(this).attr('onmouseout', null);
                });
            }
        };
    }

    refreshGrid(grid) {
        $('#btnRefresh_' + grid).click();
    }

    execMessage(obj) {
        eval(`
            Tools.notify().${obj.ok_error}({
                content: SYS_LANG_MSN.${obj.mensaje}
            });
        `);
    }

    setDataForm(form, obj) {
        let alias = obj.alias, type, item, value, callback, chkrd;

        form = form.replace('#', `#${alias}`)

        $.each(obj.elements, function (i, v) {
            type = (v.type !== undefined) ? v.type : 'input';
            item = (v.item !== undefined) ? v.item : '';
            value = (v.value !== undefined) ? v.value : '';
            callback = (v.callback !== undefined && $.isFunction(v.callback)) ? v.callback : null;

            if ((type == 'input' || type == 'select') && !$.isEmptyObject(value)) {
                $(form).find(`#${alias}${item}`).val(value);
            }
            if (type == 'radio' || type == 'checkbox') {
                chkrd = (value == '1') ? true : false;
                $(form).find(`#${alias}${item}`).prop('checked', chkrd);
            }

            if (callback) {
                callback();
            }

        });
    }

    labelState(e) {
        var $c = $('<label></label>');
        $c.attr('class', 'label');

        switch (e) {
            case '1':
                $c.html('Activo');
                $c.addClass('label-success');
                break;
            case '0':
                $c.html('Inactivo');
                $c.addClass('label-danger');
                break;
        }

        return $c;
    }

    htmlEntities(str) {
        return String(str).replace(/&#039;/g, "'")
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
    }

    labelSiNo(e) {
        var $c = $('<label></label>');
        $c.attr('class', 'label');

        switch (e) {
            case '1':
                $c.html(SYS_LANG_LABELS.si);
                $c.addClass('label-success');
                break;
            case '0':
                $c.html(SYS_LANG_LABELS.no);
                $c.addClass('label-danger');
                break;
        }

        return $c;
    }

    /*
     * 
     * @param {type} obj
     * @returns {undefined}
     * @uso 
     *       Tools.listBox({
     *           data: data,
     *           optionSelec: true,
     *           content: 'content',
     *           attr:{
     *               id: 'lst_element',
     *               name: 'lst_element'
     *           },
     *           dataView:{
     *               etiqueta: 'db_etiqueta',
     *               value: 'db_value'
     *           }
     *       });
     * 
     */
    listBox(obj) {
        var data = obj.data,
                optionSelec = (obj.optionSelec === undefined) ? true : obj.optionSelec, /*para mostrar texto seleccionar*/
                content = obj.content, /*id deelemento donde se cargara <select>*/
                required = (obj.required === undefined) ? false : true,
                deffault = (obj.default !== undefined) ? obj.default : '', /*para seleccionar un registro por defecto*/
                fnCallback = (obj.fnCallback !== undefined) ? obj.fnCallback : '', /*funcion anonima*/
                dataView = obj.dataView, /*la data a setear en <select>*/
                attr = '', /*los atributos html del <select>*/
                chosen = (obj.chosen === undefined) ? true : obj.chosen,
                optionAll = (obj.optionAll === undefined) ? false : obj.optionAll,
                parent = (obj.parent === undefined) ? '000' : obj.parent,
                group = (obj.group === undefined) ? false : obj.group;

        var iidd = '';
        if (obj.attr !== undefined && obj.attr !== '') {
            for (var i in obj.attr) {
                if (i == 'id') {
                    iidd = obj.attr[i];
                }
                attr += i + '="' + obj.attr[i] + '" ';
            }
        }
        var cb = '<select ' + attr + ' class="form-control" >';
        if (optionSelec) {
            cb += '<option value="">' + SYS_LANG_LABELS.seleccionar + '</option>';
        }
        if (optionAll) {
            cb += '<option value="ALL">' + SYS_LANG_LABELS.todos + '</option>';
        }
        var sel = '';
        var id = '';
        var value = '';
        var dataAttr = '';
        var grupo = '', idx = '';

        $.each(data,function(i,v){
            id = '';
            dataAttr = '';

            /*creando data-*/
            if (dataView.attr !== undefined) {
                if ($.isArray(dataView.attr)) {
                    for (var k in dataView.attr) {
                        dataAttr += 'data-' + dataView.attr[k] + '="' + eval('data[i].' + dataView.attr[k]) + '" ';
                    }
                } else {
                    dataAttr = 'data[i].' + dataView.attr;
                    dataAttr = 'data-' + dataView.attr + '="' + eval(dataAttr) + '" ';
                }
            }

            if ($.isArray(dataView.value)) {
                for (var j in dataView.value) {
                    id += eval('data[i].' + dataView.value[j]) + '-';
                }

                id = id.substring(0, id.length - 1);

            } else {
                id = 'data[i].' + dataView.value;
                id = eval(id);
            }

            value = '';
            if ($.isArray(dataView.etiqueta)) {
                for (var j in dataView.etiqueta) {
                    value += eval('data[i].' + dataView.etiqueta[j]) + ' - ';
                }

                value = value.substring(0, value.length - 2);

            } else {
                value = 'data[i].' + dataView.etiqueta;
                value = eval(value);
            }
            sel = '';

            if (group === false) {
                if (deffault == id) {
                    sel = ' selected = "selected" ';
                }
                cb += '<option value="' + id + '" ' + sel + ' ' + dataAttr + '>' + value + '</option>';
            } else {
                if (parent === eval('data[i].parent')) {
                    grupo = eval('data[i].' + dataView.etiqueta);
                    cb += '<optgroup class="' + id + '" label="' + grupo + '" >';
                    for (var j in data) {
                        if (eval('data[j].parent') === id) {
                            sel = '';
                            if (deffault === eval('data[j].' + dataView.value)) {
                                sel = '  selected="selected" ';
                            }
                            value = eval('data[j].' + dataView.etiqueta);
                            idx = eval('data[j].' + dataView.value);
                            cb += '<option value="' + idx + '" ' + sel + ' ' + dataAttr + '>' + value + '</option>';
                        }
                    }
                    cb += '</optgroup>';
                }
            }
        });
        cb += '</select>';

        if (!chosen) {
            cb += '<i></i>';
        }

        if (required) {
            cb += '<div class="obligar"></div>';
        }

        if (content == '#return') {
            return cb;
        } else {
            $(content).html(cb);
        }
        if (chosen) {
            $('#' + iidd).chosen();
        }
        if (fnCallback !== '') {
            fnCallback();
        }
        $('#' + iidd + '_chosen').css({width: '100%'});
    }

    tree(el) {
        if ($(`${el} > ul`) && !mytreebranch) {
            var mytreebranch = $(el).find("li:has(ul)").addClass("parent_li").attr("role", "treeitem").find(" > span").attr("title", "Collapse this branch");
            $(`${el} > ul`).attr("role", "tree").find("ul").attr("role", "group");

            mytreebranch.on("click", function (a) {
                var b = $(this).parent("li.parent_li").find(" > ul > li");
                b.is(":visible") ? (b.hide("fast"), $(this).attr("title", "Expand this branch").find(" > i").addClass("icon-plus-sign").removeClass("icon-minus-sign")) : (b.show("fast"), $(this).attr("title", "Collapse this branch").find(" > i").addClass("icon-minus-sign").removeClass("icon-plus-sign")), a.stopPropagation();
            });
        }
    }
    
    /*
     * Retorna difrencia entre dos fechas
     * @param {type} f1
     * @param {type} f2
     * @returns {Number}
     */
    dateDiff(f1, f2) {
        var aFecha1 = f1.split('-');
        var aFecha2 = f2.split('-');
        var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
        var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
        var dif = fFecha2 - fFecha1;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
        return dias;
    }
}

const Tools = new Tools_();

/*agregar eventos a boton cerrar de TABS de cada opcion*/
Tools.closeTabs();
