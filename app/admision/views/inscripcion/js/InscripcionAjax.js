/* 
 * ---------------------------------------
 * --------- CREATED BY GENERADOR --------
 * fecha:        14-08-2017 23:08:46 
 * Descripcion : InscripcionAjax.js 
 * ---------------------------------------
 */
"use strict";
class InscripcionAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'admision/Inscripcion/';
        this._views = 'app/admision/views/inscripcion/';
        this._idGridInscripcion = null;
        this._dataEstidio = [];
    }

    formIndex(context) {
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
                obj.context.gridInscripcion(context._alias);
            }
        });
    }

    gridInscripcion(alias) {
        $(`#${TABS.ADMINSC}grid`).livianGrid({
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
            tButtons: [{
                    button: BTNSYS.NEW,
                    ajax: `Exe.InscripcionDom.formNewInscripcion`
                }],
            fnServerParams: function (sData) {
                sData.push({name: "_alias", value: alias});
            },
            pPaginate: true,
            sAxions: {
                buttons: [{
                        button: BTNSYS.EDT,
                        ajax: {
                            fn: "Exe.InscripcionDom.formEditInscripcion",
                            serverParams: "_1"
                        }
                    }, {
                        button: BTNSYS.DEL,
                        ajax: {
                            fn: "Exe.InscripcionDom.deleteInscripcion",
                            serverParams: "_1"
                        }
                    }]
            },

            tScroll: {
                cRowsInVerticalScroll: 10 /*activa el scrool, se visualizara de 10 en 10*/
            },
            ajaxSource: this._controller + "getGrid",
            fnCallback: function (oSettings) {
                oSettings.context._idGridInscripcion = oSettings.tObjectTable;
            }
        });
    }

    newInscripcion(btn, context, tk) {        
        return super.send({
            token: tk,
            element: btn,
            context: this,
            root: `${this._views}formNew.js`,
            dataAlias: context._alias,
            dataType: 'text',
            success: function (obj) {
                $('#' + context._alias + 'POSTULANTE_CONTAINER').html(obj.data);

            },
            final: function (obj) {/*se ejecuta una vez que se cargo el HTML en success*/
                context.addButtonsFormNew();
                context.addButtonsAgregar();

                //  context.getListas(1,2,1);

                context.getListas();
                context.addSearch();
            }
        });
    }
    getRootController() {
        return this._controller;
    }
    editInscripcion(btn, context, tk) {
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
                obj.context.findInscripcion(context);
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
                sData.push({name: '_pkInscripcion', value: contextDom._key});
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
                sData.push({name: '_pkInscripcion', value: obj.context._key});
            }
        });
    }

    findInscripcion(contextDom) {
        super.send({
            flag: 1,
            token: _tk_,
            dataAlias: this._alias,
            context: this,
            root: `${this._controller}findInscripcion`,
            dataType: 'json',
            serverParams: function (sData, obj) {
                sData.push({name: '_criterio', value: contextDom._key});
            },
            success: function (obj) {
                contextDom.setInscripcion(obj.data);
            }
        });
    }

    getFase() {

        var programa = $(`#${this._alias}lst_programa`).val();
        var semestre = $(`#${this._alias}lst_semestre`).val();
        var sede = $(`#${this._alias}lst_sede`).val();

        if (programa != '' && semestre != '' && sede != '') {

            super.send({
                flag: 1,
                token: _tk_,
                dataAlias: this._alias,
                context: this,
                root: `${this._controller}getFase`,
                dataType: 'json',
                serverParams: function (sData, obj) {
                    sData.push({name: '_criterio', value: `${programa}^${semestre}^${sede}`});
                },
                success: function (obj) {
                    Exe.InscripcionDom.addListFase(obj.data, '');
                }
            });
        } else {
            Exe.InscripcionDom.addListFase({}, '');
        }
    }

    getTipoIngreso() {
        var fase = $(`#${this._alias}lst_fase`).val();
        if (fase != '') {

            super.send({
                flag: 1,
                token: _tk_,
                dataAlias: this._alias,
                context: this,
                root: `${this._controller}getTipoIngreso`,
                dataType: 'json',
                serverParams: function (sData, obj) {
                    sData.push({name: '_criterio', value: fase});
                },
                success: function (obj) {
                    Exe.InscripcionDom.addListTipoIngreso(obj.data, '');
                }
            });
        } else {
            Exe.InscripcionDom.addListTipoIngreso({}, '');
        }
    }

    getEscuela() {
        var tipoingreso = $(`#${this._alias}lst_modalidadadmision`).val();
        var fase = $(`#${this._alias}lst_fase`).val();
        if (tipoingreso != '' && fase != '') {

            super.send({
                flag: 1,
                token: _tk_,
                dataAlias: this._alias,
                context: this,
                root: `${this._controller}getEscuela`,
                dataType: 'json',
                serverParams: function (sData, obj) {
                    sData.push({name: '_criterio', value: `${fase}^${tipoingreso}`});
                },
                success: function (obj) {
                    Exe.InscripcionDom.addListEscuela(obj.data, '');
                }
            });
        } else {
            Exe.InscripcionDom.addListEscuela({}, '');
        }
    }

    getInstitucion() {
 
        var ubigeo = this._ubigeoInstitucion;
        var tipoinstitucion = $(`#${this._alias}lst_tipoinstitucion`).val();
        if (ubigeo != '' && tipoinstitucion != '') {

            super.send({
                flag: 1,
                token: _tk_,
                gifProcess: true,
                dataAlias: this._alias,
                context: this,
                root: `${this._controller}getInstitucion`,
                dataType: 'json',
                serverParams: function (sData, obj) {
                    sData.push({name: '_criterio', value: `${ubigeo}^${tipoinstitucion}`});
                },
                success: function (obj) {
                    Exe.InscripcionDom.addListInstitucion(obj.data, '');
                }
            });
        } else {
            Exe.InscripcionDom.addListInstitucion({}, '');
        }
    }

    setInstitucion(flag, institucion) {

        if (flag == 1) {
            var institucion = $(`#${this._alias}lst_institucion`).val();
            var institucion_nom = $(`#${this._alias}lst_institucion option:selected`).text();
            var tipoinstitucion = $(`#${this._alias}lst_tipoinstitucion option:selected`).text();
            var year = $(`#${this._alias}txt_yearegreso`).val();

            var indice = false;

            $.each(this._dataEstidio, function (i, v) {
                if (institucion == v.institucion) {
                    indice = true;
                }
            });
            if (indice == false) {
                this._dataEstidio.push({institucion: institucion, year: year, institucion_nom: institucion_nom, tipoinstitucion: tipoinstitucion});
                $(`#${this._alias}lst_institucion`).val('');
                $(`#${this._alias}txt_yearegreso`).val('');
                this.setInstitucion('2', '');
                Tools.execMessage({ok_error: 'ok', mensaje: 'save_ok'});
            } else {
                Tools.execMessage({ok_error: 'error', mensaje: 'aca.institucion_exist'});
            }
        } else if (flag == 2) {
            var html = '';
            var contador = 0;
            html += `<div class="table-responsive">
                <table width="80%" class="table table-striped table-bordered table-hover" >
                    <thead>
                        <tr>
                            <th style="text-align:center; width: 30px;" class="tr-language" data-tr="nro">` + SYS_LANG_LABELS.nro + `</th>
                            <th style="text-align:center;width: 60px;" class="tr-language" data-tr="acciones">` + SYS_LANG_LABELS.acciones + `</th>
                            <th style="text-align:center;width: 150px;" class="tr-language" data-tr="title_tipoinstitucion" >` + SYS_LANG_LABELS.title_tipoinstitucion + `</th>
                            <th style="text-align:center;" class="tr-language" data-tr="title_institucion" >` + SYS_LANG_LABELS.title_institucion + `</th>
                            <th style="text-align:center;width: 100px;" class="tr-language" data-tr="title_yearegreso" >` + SYS_LANG_LABELS.title_yearegreso + `</th> 
                        </tr>
                    </thead>
                    <tbody >`;
            if (this._dataEstidio.length == 0) {
                html += `<tr >
                    <td colspan="5"  style="text-align:center;" >
                        <div class="alert alert-info fade in">

                            <i class="fa-fw fa fa-info"></i>
                            <strong>No se han agregado Estudios.</strong>
                        </div>
                    </td>
                </tr>`;
            } else {
                $.each(this._dataEstidio, function (i, v) {
                    contador = (parseInt(contador) + 1);
                    html += ` 
                    <tr>
                        <td style="text-align:center;" >${contador}</td>
                        <td style="text-align:center;"><button type="button" data-i="${i}"  title="Eliminar" class="btn btn-danger btn-xs btndelete" style="margin-right: 3px;"><i class="fa fa-trash-o"></i></button></td>
                        <td style="text-align:center;" >${v.tipoinstitucion}</td>
                        <td style="text-align:center;" >${v.institucion_nom}</td>
                        <td style="text-align:center;" >${v.year}</td> 
                    </tr>`;
                });
            }
            html += ` 
                    </tbody>
                </table>
            </div>  `;

            $(`#${this._alias}div_estudios`).html(html);
            
            $('.btndelete').off('click');
            $('.btndelete').click(function () {
                var t = this;

                Tools.notify().confirm({
                    context: t,
                    content: SYS_LANG_MSN.you_sure_delete,
                    yes: function (context) {
                        Exe.InscripcionDom.setInstitucion('3', $(context).data('i'));
                    }
                });
            });
        } else if (flag == 3) {
            this._dataEstidio.splice(institucion, 1);
            this.setInstitucion('2', '');
            Tools.execMessage({ok_error: 'ok', mensaje: 'delete_ok'});
        }

    }

}

