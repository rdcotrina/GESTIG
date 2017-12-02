/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        14-08-2017 23:08:46 
 * Descripcion : InscripcionDom.js
 * ---------------------------------------
 */
"use strict";

class InscripcionDom_ extends InscripcionAjax_ {

    constructor() {
        super();
        this._alias = Exe.getAlias(); /*alias que se agregara a cada ID y NAME del TAB*/
        this._container = `#${this._alias}_CONTAINER`; /*<div> del TAB*/
        this._key = null;
        this._ubigeoInstitucion = null;
        this._ubigeoResidencia = null;
        this._ubigeoNacimiento = null;
    }

    main() {
        Tools.addTab({
            context: this,
            id: this._alias,
            label: Exe.getTitle(),
            breadCrumb: Exe.getRoot(),
            fnCallback: function (context) {
                context.index();
            }
        });
    }

    index() {
        super.formIndex(this);
    }

    formNewInscripcion(btn, tk) {
        Exe.require("public/js/arbol/arbol.jquery");

        this._dataEstidio = [];
        this._ubigeoInstitucion = null;
        this._ubigeoResidencia = null;
        this._ubigeoNacimiento = null;

        Tools.addTab({
            context: this,
            id: this._alias + 'POSTULANTE',
            label: SYS_LANG_LABELS.title_inscripcion_new,
            breadCrumb: '',
            fnCallback: function (context) {
                context.getnewInscripcion(btn, tk);
            }
        });
    }

    getnewInscripcion(btn, tk) {
        super.newInscripcion(btn, this, tk);
    }

    formEditInscripcion(btn, id, tk) {
        this._key = id;
        super.editInscripcion(btn, this, tk).done(function () {
            $('#formEdit').modal('show');
        });
    }

    addButtonsFormNew() {
        $.fn.getButtonsys({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.GRB, evts: [{click: 'validar1'}]}]

        });
    }

    addButtonsFormEdit() {
        $.fn.getButtonsys({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.UPD, evts: [{click: 'validar1'}]}]
        });
    }

    postNewInscripcion(tk) {
        if (!this.validaNroDocumento($(`#${this._alias}lst_tipodocumento`).val(), $(`#${this._alias}txt_numerodocumento`).val())) {
            Tools.notify().error({
                content: SYS_LANG_LABELS.nrodocumento_error
            });
        } else {
            super.postNew(tk).done(function (obj) {
                Tools.execMessage(obj);
                if (obj.ok_error != 'error') {
                    Tools.closeModal.call(this, '#formNew');
                    Tools.refreshGrid(this._idGridInscripcion);
                }
            });

        }
    }

    postEditInscripcion(tk) {
        var tthis = this;
        super.postEdit(tk, this).done(function (obj) {
            Tools.execMessage(obj);
            if (obj.ok_error != 'error') {
                Tools.closeModal.call(tthis, '#formEdit');
                Tools.refreshGrid(this._idGridInscripcion);
            }
        });
    }

    deleteInscripcion(btn, id, tk) {
        this._key = id;
        var d = super.delete;
        Tools.notify().confirm({
            context: this,
            content: SYS_LANG_MSN.you_sure_delete,
            yes: function (context) {
                d.call(context, btn, tk).done(function (obj) {
                    Tools.execMessage(obj);
                    Tools.refreshGrid(this._idGridInscripcion);
                });
            }
        });
    }

    setInscripcion(data) {
        Tools.setDataForm('#formEdit', {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data._1},
                {item: 'chk_activo', value: data._2, type: 'checkbox'}
            ]
        });
    }

    getListas(tipodocumeto = '', estadocivil = '', tipovia = '', tipozona = '', tipoprograma = '', semestre = '', filial = '', paisrecidencia = '9589', paisnacimiento = '9589', paisestudios = '9589', modalidadestudio = '', ubigeoestudios = '', ubigeorecidencia = '', ubigeonacimiento = '') {
        super.loadingServer();
        Tools.addEvent().date('#' + this._alias + 'txt_fechanacimiento');

        $(`#${this._alias}formNew`).appList({
            items: [
                {
                    data: 'tipodocumeto',
                    container: '#' + this._alias + 'div_tipodocumento',
                    attr: {
                        id: this._alias + 'lst_tipodocumento',
                        name: this._alias + 'lst_tipodocumento'
                    },
                    default: tipodocumeto
                },
                {
                    data: 'estadocivil',
                    container: '#' + this._alias + 'div_estadocivil',
                    attr: {
                        id: this._alias + 'lst_estadocivil',
                        name: this._alias + 'lst_estadocivil'
                    },
                    default: estadocivil
                },
                {
                    data: 'tipovia',
                    container: '#' + this._alias + 'div_tipovia',
                    attr: {
                        id: this._alias + 'lst_tipovia',
                        name: this._alias + 'lst_tipovia'
                    },
                    default: tipovia
                },
                {
                    data: 'tipozona',
                    container: '#' + this._alias + 'div_tipozona',
                    attr: {
                        id: this._alias + 'lst_tipozona',
                        name: this._alias + 'lst_tipozona'
                    },
                    default: tipozona
                },
                {
                    data: 'tipoinstitucion',
                    container: '#' + this._alias + 'div_tipoinstitucion',
                    attr: {
                        id: this._alias + 'lst_tipoinstitucion',
                        name: this._alias + 'lst_tipoinstitucion',
                        onchange: 'Exe.InscripcionDom.getInstitucion();'
                    },
                    default: tipozona
                },
                {
                    data: 'tipoprograma',
                    container: '#' + this._alias + 'div_programa',
                    attr: {
                        id: this._alias + 'lst_programa',
                        name: this._alias + 'lst_programa',
                        onchange: 'Exe.InscripcionDom.getFase();'
                    },
                    default: tipoprograma
                },
                {
                    data: 'semestre',
                    container: '#' + this._alias + 'div_semestre',
                    attr: {
                        id: this._alias + 'lst_semestre',
                        name: this._alias + 'lst_semestre',
                        onchange: 'Exe.InscripcionDom.getFase();'
                    },
                    default: semestre
                },
                {
                    data: 'filial',
                    container: '#' + this._alias + 'div_sede',
                    attr: {
                        id: this._alias + 'lst_sede',
                        name: this._alias + 'lst_sede',
                        onchange: 'Exe.InscripcionDom.getFase();'
                    },
                    default: filial
                },
                {
                    data: 'pais',
                    container: '#' + this._alias + 'div_paisrecidencia',
                    attr: {
                        id: this._alias + 'lst_paisrecidencia',
                        name: this._alias + 'lst_paisrecidencia'
                    },
                    default: paisrecidencia
                },
                {
                    data: 'pais',
                    container: '#' + this._alias + 'div_paisnacimiento',
                    attr: {
                        id: this._alias + 'lst_paisnacimiento',
                        name: this._alias + 'lst_paisnacimiento'
                    },
                    default: paisnacimiento
                },
                {
                    data: 'pais',
                    container: '#' + this._alias + 'div_paisestudios',
                    attr: {
                        id: this._alias + 'lst_paisestudios',
                        name: this._alias + 'lst_paisestudios'
                    },
                    default: paisestudios
                },
                {
                    data: 'modalidadestudio',
                    container: '#' + this._alias + 'div_modalidadestudio',
                    attr: {
                        id: this._alias + 'lst_modalidadestudio',
                        name: this._alias + 'lst_modalidadestudio'
                    },
                    default: modalidadestudio
                },
                {
                    type: 'tree',
                    data: 'ubigeo',
                    container: '#' + this._alias + 'div_ubigeoestudios',
                    onClick: 'Exe.InscripcionDom.getInstitucion',
                    parent: 0,
                    attr: {
                        id: this._alias + 'lst_ubigeoestudios',
                        name: this._alias + 'lst_ubigeoestudios'
                    },
                    default: ubigeoestudios,
                    fnCaptureKey: 'Exe.InscripcionDom.setUbigeoInstitucion'
                },
                {
                    type: 'tree',
                    data: 'ubigeo',
                    container: '#' + this._alias + 'div_ubigeorecidencia',
                    parent: 0,
                    attr: {
                        id: this._alias + 'lst_ubigeorecidencia',
                        name: this._alias + 'lst_ubigeorecidencia'
                    },
                    default: ubigeorecidencia,
                    fnCaptureKey: 'Exe.InscripcionDom.setUbigeoResidencia'

                },
                {
                    type: 'tree',
                    data: 'ubigeo',
                    container: '#' + this._alias + 'div_ubigeonacimiento',
                    parent: 0,
                    attr: {
                        id: this._alias + 'lst_ubigeonacimiento',
                        name: this._alias + 'lst_ubigeonacimiento'
                    },
                    default: ubigeonacimiento,
                    fnCaptureKey: 'Exe.InscripcionDom.setUbigeoNacimiento'
                }
            ]
        });
    }

    addListFase(data, sele) {

        Tools.listBox({
            data: data,
            optionSelec: true,
            content: `#${this._alias}div_fase`,
            default: sele,
            attr: {
                id: `${this._alias}lst_fase`,
                name: `${this._alias}lst_fase`,
                onchange: 'Exe.InscripcionDom.getTipoIngreso();'
            },
            dataView: {
                etiqueta: 'value',
                value: 'key'
            }
        });
    }

    addListTipoIngreso(data, sele) {

        Tools.listBox({
            data: data,
            optionSelec: true,
            content: `#${this._alias}div_modalidadadmision`,
            default: sele,
            attr: {
                id: `${this._alias}lst_modalidadadmision`,
                name: `${this._alias}lst_modalidadadmision`,
                onchange: 'Exe.InscripcionDom.getEscuela();'
            },
            dataView: {
                etiqueta: 'value',
                value: 'key'
            }
        });
    }

    addListEscuela(data, sele) {

        Tools.listBox({
            data: data,
            optionSelec: true,
            content: `#${this._alias}div_programaestudio`,
            default: sele,
            attr: {
                id: `${this._alias}lst_programaestudio`,
                name: `${this._alias}lst_programaestudio`
            },
            dataView: {
                etiqueta: 'value',
                value: 'key'
            }
        });
        Tools.listBox({
            data: data,
            optionSelec: true,
            content: `#${this._alias}div_segundaopcion`,
            default: sele,
            attr: {
                id: `${this._alias}lst_segundaopcion`,
                name: `${this._alias}lst_segundaopcion`
            },
            dataView: {
                etiqueta: 'value',
                value: 'key'
            }
        });
    }

    addListInstitucion(data, sele) {

        Tools.listBox({
            data: data,
            optionSelec: true,
            content: `#${this._alias}div_institucion`,
            default: sele,
            attr: {
                id: `${this._alias}lst_institucion`,
                name: `${this._alias}lst_institucion`
            },
            dataView: {
                etiqueta: 'value',
                value: 'key'
            }
        });
    }

    addButtonsAgregar() {
        $.fn.getButtonsys({
            container: `#${this._alias}btn_agregar`,
            keymnu: this._alias,
            btns: [{keybtn: BTNSYS.AGR, evts: [{click: 'validar2'}]}]
        }, function (obj) {
            $(obj.container).find('button').css({
                'margin-top': '24px',
                'padding': '5px'
            });
        });
    }

    addSearch() {
        var t = this;
        var search_ = $(`#${this._alias}txt_buscar_persona`).autoCompleteTable({

            id: `${this._alias}txt_buscar_persona_`,
            columns: [SYS_LANG_LABELS.apellidoynombre, SYS_LANG_LABELS.title_tipo_documento_abreviado, SYS_LANG_LABELS.title_numero_documento_abreviado],
            rows: ['_1', '_2', '_3', '_4'],
            hide: [false], //columnas que se ocultaran de rows
            indexColumView: 1, //esta columna de la tabla se cargara en el text q se busca
            placeholder: SYS_LANG_LABELS.buscar_x_nom_nrodoc,
            ajax: {
                url: `${super.getRootController()}getPersona`,
                type: "POST",
                data: function () {
                    return {_paramSearch: search_.searchdata(), _alias: t._alias};
                },
                success: function (data) {
                    var filterData = [];
                    var searchData = eval("/" + search_.searchdata() + "/gi");
                    $.each(data, function (i, v) {
                        if (v._2.search(new RegExp(searchData)) != -1 || v._4.search(new RegExp(searchData)) != -1) {
                            filterData.push(v);
                        }
                    });
                    return filterData;
                }
            },
            onchange: function () {
                var sele = search_.all();
                t._persona = sele._1;

            }
        });
    }

    setUbigeoInstitucion(u) {
        this._ubigeoInstitucion = u;
    }

    setUbigeoResidencia(u) {
        this._ubigeoResidencia = u;
    }

    setUbigeoNacimiento(u) {
        this._ubigeoNacimiento = u;
    }

    validaNroDocumento(tipo, numero) {

        if (tipo == 1) {
            //DNI
            if (numero.length != 8) {
                return false;
            } else if (!/^([0-9])*$/.test(numero)) {
                return false;
            } else {
                return true;
            }

        } else if (tipo == 4 || tipo == 7) {
            //CARNET EXT.
            if (numero.length > 12) {
                return false;

            } else {
                return true;
            }

        } else if (tipo == 6) {
            //RUC
            if (numero.length != 11) {
                return false;
            } else if (!/^([0-9])*$/.test(numero)) {
                return false;
            } else {
                return true;
            }
        } else if (tipo == 11) {
            //P. NAC.
            if (numero.length > 15) {
                return false;

            } else {
                return true;
            }
        } else {
            return true;

        }

    }

}
