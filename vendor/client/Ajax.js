"use strict";
var httpR;
class Ajax_ {

    constructor() {

        this._sData = [];

        /*
         * gener parametros para enviar via AJAX
         */
        this._serialize = function () {
            let data = '';

            this._sData.forEach(elem => {
                data += elem.name + '=' + elem.value + '&';
            });

            this._sData = [];
            data = data.substring(0, data.length - 1);

            return data;
        };

        /*reset formulario*/
        this._clear = function (form) {
            if ($(form)[0] !== undefined) {
                $(form)[0].reset();
            }
            $('.chosen').val("").trigger("chosen:updated");
        };

        /*activa img loading*/
        this._processIn = function () {
            $('#process-general').fadeIn();
        };

        /*
         * desactiva img loading
         */
        this._processOut = function () {
            $('#process-general').fadeOut();
        };

        this._btnString = [];

        /*
         * desabilita boton y coloca imagen cargando
         */
        this._processObjetoIn = function (el) {
            /*guardo texto de boton*/
            this._btnString.push({
                objeto: el,
                xhtml: $(el).html()
            });
            $(el).html('<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>');
            $(el).attr('disabled', true);
        };

        /*
         * activa boton y devuelve su icono y texto
         */
        this._processObjetoOut = function (el) {
            let txt = '', xobj = '';
            for (let i in this._btnString) {
                if (el === this._btnString[i].objeto) {
                    xobj = this._btnString[i].objeto;
                    txt = this._btnString[i].xhtml;
                    $(xobj).html(txt);
                    $(xobj).attr('disabled', false);
                    break;
                }
            }
        };
        /*
         * Decodifica htmentities
         * @param {type} data
         * @returns {Ajax_._decodeHtmlEntities.ndata|JSON.parse.j|Array|Object|String}
         */
        this._decodeHtmlEntities = function (data) {
            let ndata = '';
           
            if ($.isArray(data)) {//es json [{a:b, c:d},{e: f, h: i}]
                ndata = '[';
                $.each(data, function (i, v) {
                    ndata += '{';
                    $.each(v, function (ii, vv) {
                        ndata += `"${ii}": "${Tools.htmlEntities(vv)}",`;
                    });
                    ndata = ndata.substr(0, ndata.length - 1);
                    ndata += '},';
                });
                ndata = ndata.substr(0, ndata.length - 1);
                ndata += ']';
            } else {// es bojeto {a:b, c:d}
                ndata = '{';
                $.each(data, function (i, v) {
                    ndata += `"${i}": "${Tools.htmlEntities(v)}",`;
                });
                ndata = ndata.substr(0, ndata.length - 1);
                ndata += '}';
            }
            ndata = JSON.parse(ndata);
         
            return ndata;
        };

    }

    /*
     * enviando via AJAX
     */
    send(obj) {
        let myRand = parseInt(Math.random() * 999999999999999);
        this._sData.push({name: '_keypassw', value: myRand});

        /*se activa boton loading en boton*/
        if (obj.element !== undefined) {
            this._processObjetoIn(obj.element);
        }
        /*se activa gif loading*/
        if (obj.gifProcess !== undefined && obj.gifProcess !== false) {
            this._processIn();
        }

        let typeData = (obj.dataType !== undefined) ? obj.dataType : 'json';
        let token = (obj.token !== undefined) ? obj.token : null;
        let dataAlias = (obj.dataAlias !== undefined) ? obj.dataAlias : null;
        let clear = (obj.clear === undefined) ? true : obj.clear;
        let encrypt = (obj.encrypt === undefined) ? false : obj.encrypt;
        let abort = (obj.abort === undefined) ? false : obj.abort;
        let contextt = (obj.context === undefined) ? '[context] no definido' : obj.context;
        let form = (obj.form !== undefined) ? obj.form : false;
        let decodeHtmlEntities = (obj.decodeHtmlEntities !== undefined) ? obj.decodeHtmlEntities : false;


        if (parseInt(token) !== parseInt(_sys_sg)) {
            console.log('Acceso restringido.');
            return false;
        }
        if (obj.flag !== undefined) {
            this._sData.push({name: '_flag', value: obj.flag});
        }
        if (obj.serverParams !== undefined) {
            obj.serverParams(this._sData, obj);
        }

        if ($.isEmptyObject(dataAlias) && dataAlias != false) {
            Tools.notify().error({
                content: '[dataAlias] no definido, debe especificar el alias ALIAS.'
            });
            return false;
        }

        if (dataAlias && form) {
            //se genera id de formulario con el alias
            form = form.replace('#', `#${dataAlias}`);
        }

        /*serializacion de datos*/
        let datos = this._serialize();
        datos += (form) ? '&' + $(form).serialize(encrypt) : '';
        datos += `&_alias=${dataAlias}`; 
        /*obteniendo etiquetas para alertas de los filters.php*/
        if (form) {
            let ev = null;
            $(form).find('.tr-language-valida').each(function (i, v) {
                ev = `language_${localStorage.getItem('sys_lang')}.labels[ '${$(v).data('tr')}' ]`;
                datos += `&${$(v).data('tr')}=${eval(ev)}`;
               
            });
        }

        let ddat = null;

        return $.ajax({
            type: "POST",
            data: datos,
            url: obj.root,
            dataType: typeData,
            cache: false,
            context: this,
            beforeSend: function (data2) {
                if (obj.abort) {
                    if (httpR) {
                        httpR.abort();
                    }
                    httpR = data2;
                }
            },
            success: function (data) {
                let er = 1; /*parametro para detectar si SERVER devuelve ERROR*/

                /*validar error del SP*/
                if (typeData === 'json' && data.length > 0 || data.error !== undefined) {
                    /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
                    if (data instanceof Object === false || data.error !== undefined) {
                        let msn = data;
                        if (data.error !== undefined) {
                            msn = data.error;
                        }
                        Tools.notify().error({
                            content: msn
                        });
                        er = 0;
                    }
                }

                /*verificar si data se decodificara htmlentities*/
                data = (decodeHtmlEntities) ? this._decodeHtmlEntities(data) : data;

                /*oculta img cargando de boton*/
                if (obj.element !== undefined) {
                    this._processObjetoOut(obj.element);//respuesta de servidor finalizada
                }

                if (obj.success !== undefined && $.isFunction(obj.success)) {//si existe callback
                    obj.success({data: data, context: contextt});
                }

                /*se optiene parametro DUPLICADO*/
                let d = (data.length > 1) ? data[0].duplicado : data.duplicado;

                /*limpia el formulario*/
                if (clear && parseInt(d) === 0 && er && obj.form !== undefined) {
                    this._clear(form);
                }
                /*se desactiva gif loading*/
                if (obj.gifProcess !== undefined && obj.gifProcess !== false) {
                    this._processOut();//respuesta de servidor finalizada
                }

                ddat = data;

            },
            complete: function (a, b) {
                if (typeData == 'html' || typeData == 'text') {
                    Tools.traslation();
                }
                Tools.addAliasData(ddat, dataAlias);
                if (obj.final !== undefined && $.isFunction(obj.final)) {//si existe callback
                    obj.final({data: ddat, context: contextt});
                }
                $('.modal-body').tooltip({
                    selector: "[data-toggle=tooltip]",
                    container: "body"
                });
            }
        });

    }

    /*
     * Deshabilita boton 
     */
    disableBtn(element) {
        this._processObjetoIn(element);
    }
    /*
     * habilita boton 
     */
    activeBtn(element) {
        this._processObjetoOut(element);
    }
    
    loadingServer(){
        this._processIn();
    }
    
    finishServer(){
        this._processOut();
    }

}
