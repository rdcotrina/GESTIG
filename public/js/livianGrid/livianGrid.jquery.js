/*
 * Documento   : dataGrid.jquery.js v.2.0 .. . heredado desde simpleGrid (CS)
 * Creado      : noviembre-2014
 * Heredado    : mayo 2015
 * Autor       : CS
 * Descripcion : data grid, incluye TABLE_SCROOL_HV
 */
(function ($) {

    "use strict";

    var COUNT_EXE_SCROLL = [];       /*almacena cuantas veces se ejecuta el srcoll por cada grid*/

    var FIELDS = [];       /*almacena los campos, para ocultar los filtros de cada columna*/

    var DATA_SELECT = [];       /*almacena los datos de un <select> via ajax o cliente*/

    var TH_TMP = null;     /*para detectar a q columna no se reiniciara los css de sorting*/

    $.fn.extend({

        livianGrid: function (opt) {

            var defaults = {
                context: null,
                alias: null,
                tObjectContainer: $(this).attr('id'), /*identificador del contenedor de la grilla*/
                tObjectTable: null, /*identificador de la grilla*/
                tWidthFormat: 'px', /*para dimension de columnas*/
                tChangeLength: true, /*activa combo de registros a mostrar por pagina*/
                tRegsLength: [10, 25, 50, 100], /*para numero de registros por pagina*/
                tColumns: [], /*columnas del header*/
                tMsnNoData: 'No se encontraron registros.',
                tNumbers: true, /*para mostrar la numeracion*/
                tButtons: [], /*botones en el toolbar*/
                tShowHideColumn: false, /*para mostrar-oucltar columnas, se recomienda no usar cuando se active el scrool horizontal*/
                tLabelAxion: 'Acciones',
                sAjaxSource: null, /*url para la data via ajax*/
                pPaginate: true,
                pDisplayStart: 0,
                pDisplayLength: 50,
                pItemPaginas: 5,
                pOrderField: '', /*para el order ASC o DESC*/
                sAxions: [], /*acciones del grid*/
                tSendJSON: [], /*enviar json desde el cliente para usar dentro del grid*/
                tDynamicCols: false,
                tPivoteColumn: 5, /*se crean cinco columnas fijas, para el manejo de las columnas dinamicas*/
                tViewInfo: true                                     /*visualizar info de paginacion*/
            };

            var options = $.extend(defaults, opt);

            var _private = {};

            _private.cssTable = 'table table-striped table-hover table-condensed dataTable lv-grid table-bordered dataGrid';

            _private.positionAxion = 'first';                           /*posicion de las acciones*/

            _private.btnFirst = 'fa fa-fast-backward';

            _private.btnPrev = 'fa fa-backward';

            _private.btnNext = 'fa fa-forward';

            _private.btnLast = 'fa fa-fast-forward';

            _private.iniInfo = 0;

            _private.finInfo = 0;

            _private.totalInfo = 0;

            _private.colspanRecords = 0;

            _private.ifSearch = false;

            _private.ifDatePicker = false;

            _private.ifTimePicker = false;

            _private.totalizerColumn = [];                  /*para totalizadores de columnas*/

            _private.isTotalizer = false;                /*activa si grid tiene totalozador o no*/

            _private.cssReplaceTilteDynamic = 'cs_replace'; /*css para realizar el reemplazo del titulo en columnas dinamicas*/

            _private.sgbd = 'mysql';

            /*
             * Rretorna info sobre cantidad de registros
             * @returns {String}
             */
            _private.txtInfo = function () {
                return `${_private.iniInfo} al ${_private.finInfo} de ${_private.totalInfo}`;
            };

            _private.aData = [];

            _private.spinner = '<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>';

            _private.htmlBtn = '';

            _private.iniLoading = function (oSettings, btn) {
                if (btn !== undefined) {
                    _private.htmlBtn = $(btn).html();
                    $(btn).html(_private.spinner).attr('disabled', true);
                } else {
                    $('#btnRefresh_' + oSettings.tObjectTable).html(_private.spinner).attr('disabled', true);
                }
            };

            _private.endLoading = function (oSettings, btn) {
                if (btn !== undefined) {
                    $(btn).html(_private.htmlBtn).attr('disabled', false);
                } else {
                    $('#btnRefresh_' + oSettings.tObjectTable).html('<i class="fa fa-refresh"></i>').attr('disabled', false);
                }
            };

            /*
             * Ejecuta el scroll
             * cFixedColsLeft                  columnas fijas del lado izquierdo
             * cFixedColsRight                 columnas fijas del lado derecho
             * cColsInHorizontalScroll              columnas a visualizar en el scroll horizontal (puede tener varias oculats, pero se visualizan las q se indique aqui)
             * cRowsInVerticalScroll                filas a visualizar en el scroll vertical (puede tener varias oculats, pero se visualizan las q se indique aqui)
             * cRowsInFooter                   filas fijas en el foot de la tabla
             * cRowsInHeader                   filas fijas en el head de a tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.exeScroll = function (oSettings) {
                /*Validar columnas Dinamicas*/
                _private.dynamicCols(oSettings);

                var scroll = oSettings.tScroll;
                if (scroll !== undefined && scroll instanceof Object && oSettings.sData.length > 0) {
                    /*reinicio scroll*/
                    _private.removeScroll(oSettings);

                    $('#' + oSettings.tObjectTable).scrollTable({
                        fixedColumnsLeft: (scroll.cFixedColsLeft !== undefined) ? scroll.cFixedColsLeft : 0,
                        fixedColumnsRight: (scroll.cFixedColsRight !== undefined) ? scroll.cFixedColsRight : 0,
                        columnsInScrollableArea: (scroll.cColsInHorizontalScroll !== undefined) ? scroll.cColsInHorizontalScroll : 7,
                        rowsInScrollableArea: (scroll.cRowsInVerticalScroll !== undefined) ? scroll.cRowsInVerticalScroll : 10,
                        rowsInFooter: (scroll.cRowsInFooter !== undefined) ? scroll.cRowsInFooter : null,
                        rowsInHeader: (scroll.cRowsInHeader !== undefined) ? scroll.cRowsInHeader : null
                    });

                    if (COUNT_EXE_SCROLL[oSettings.tObjectTable] === undefined) {
                        COUNT_EXE_SCROLL[oSettings.tObjectTable] = 1;       /*primera generada de scroll para grid*/
                    } else {
                        COUNT_EXE_SCROLL[oSettings.tObjectTable]++;         /*se suma en uno las veces q se genera el scroll*/
                    }
                }
            };

            /*
             * Resetea scroll
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.removeScroll = function (oSettings) {
                /*quitar efecto scroll para volver a crear, no se ejecuta en la pagina 1*/
                if (COUNT_EXE_SCROLL[oSettings.tObjectTable] >= 1 && COUNT_EXE_SCROLL[oSettings.tObjectTable] !== undefined) {
                    /*se elimina ultimo <td> de <theader>*/
                    $('#' + oSettings.tObjectTable).find('thead').find('tr').find('td').remove();
                    /*se muestra columnas ocultas*/
                    $('#' + oSettings.tObjectTable).find('thead').find('tr').find('th').css({display: ''});
                    $('#' + oSettings.tObjectTable).find('tbody').find('tr').find('td').css({display: ''});
                }
            };

            /*
             * Crea columna con el texto axion en el head
             * @param {type} oSettings
             * @returns {$}
             */
            _private.headAxion = function (oSettings) {
                var g = (oSettings.sAxions.group !== undefined) ? oSettings.sAxions.group : [];
                var b = (oSettings.sAxions.buttons !== undefined) ? oSettings.sAxions.buttons : [];
                var x = (oSettings.sAxions.width !== undefined) ? oSettings.sAxions.width : '50';

                if (g.length || b.length) {
                    var txtax = $('<th class="text-center"></th>');
                    txtax.css({width: x + oSettings.tWidthFormat});
                    txtax.attr('id', oSettings.tObjectTable + '_axions');
                    txtax.html(oSettings.tLabelAxion);
                    txtax.css({'vertical-align': 'middle'});
                    return txtax;
                }
            };

            /*
             * Obtiene las columnas a exportar
             * @param {type} oSettings
             * @returns {oSettings.sExport.columns|oSettings.tColumns}
             */
            _private.getColumnsExport = function (oSettings) {
                var exCol = (oSettings.sExport.columns !== undefined) ? oSettings.sExport.columns : oSettings.tColumns;
                return exCol;
            };

            /*
             * Retorna el nombre del archivo a crear
             * @param {type} oSettings
             * @returns {String|oSettings.sExport.nameFile|dataGrid.jquery_L8.dataGrid.jqueryAnonym$0.dataGrid._private.getFileName.myRand}
             */
            _private.getFileName = function (oSettings) {
                var myRand = parseInt(Math.random() * 999999999999999);
                var nFile = (oSettings.sExport.nameFile !== undefined) ? oSettings.sExport.nameFile : 'file';

                return nFile + myRand;
            };

            /*
             * Crea el archivo excel
             * @param {type} data
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.createFileExcel = function (data, oSettings) {
                excelFactory.create({
                    data: data,
                    rows: _private.getColumnsExport(oSettings)
                });
            };

            /*
             * Crear html a exportar pdf
             * @param {type} data
             * @param {type} oSettings
             * @param {type} doc
             * @returns {String}
             */
            _private.createHtmlExport = function (data, oSettings) {
                var columns = _private.getColumnsExport(oSettings);
                var caption = (oSettings.sExport.caption !== undefined) ? oSettings.sExport.caption : '';
                //'+oSettings.tLogo+'
                var pag = '<div>{{page}}/{{totalPages}}</div>'; /*si es PDF mostrar paginacion*/
                var tableEx = '<HEADER>' + pag + '</HEADER>';
                tableEx += '<table border="1">';
                tableEx += '<caption>' + caption + '</caption>';
                tableEx += '<thead>';
                tableEx += '<tr>';

                tableEx += '<th>Nro.</th>';
                /*recorrido de columnas*/
                $.each(columns, function (c, v) {
                    var title = (columns[c].title !== undefined) ? columns[c].title : '';
                    tableEx += '<th>' + title + '</th>';
                });
                tableEx += '</thead>';
                tableEx += '<tbody>';
                /*================================*/
                var lll = data.length,
                        n = 0;
                if (data.length) {
                    /*recorrido de los registros del server*/
                    $.each(data, function (r, v) {
                        if (r < lll) {
                            n++;
                            tableEx += '<tr>';
                            tableEx += '<td>' + n + '</td>';

                            var ncol = columns.length;
                            /*recorrido de columnas configuradas en js*/
                            $.each(columns, function (c, v) {
                                /*esta validacion es solo para ERP UNI*/
                                if (c < ncol) {
                                    var zell = (data[r][columns[c].field] === null) ? '' : data[r][columns[c].field];
                                    tableEx += '<td>' + zell + '</td>';
                                }
                            });
                            tableEx += '</tr>';
                        }
                    });
                } else {
                    tableEx += '<tr>';
                    tableEx += '<td><div class="alert alert-info text-center"><i class="fa-info"></i> No se encontraron registros.<div></td>';
                    tableEx += '</tr>';
                }
                /*=================================*/
                tableEx += '</tbody>';
                tableEx += '</table>';
                return tableEx;
            };

            /*
             * Crear pdf con js
             * @param {type} oSettings
             * @param {type} html
             * @returns {undefined}
             */
            _private.createFilePDF = function (oSettings, html) {
                var land = (oSettings.sExport.orientation !== undefined) ? oSettings.sExport.orientation : 'l'; /*p - l*/
                var nameFile = _private.getFileName(oSettings);

                //'l', 'mm', [ 841.89,  595.28]
                var pdf = new jsPDF(land)
                        , source = html
                        // we support special element handlers. Register them with jQuery-style
                        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
                        // There is no support for any other type of selectors
                        // (class, of compound) at this time.
                        , specialElementHandlers = {

                        },
                        margins = {
                            top: 10,
                            bottom: 10,
                            left: 30,
                            width: 1700
                        };

                //pdf.addImage(oSettings.tLogo, 'png', 15, 10, 200, 70);
                // all coords and widths are in jsPDF instance's declared units
                // 'inches' in this case
                var obj = pdf.fromHTML(
                        source // HTML string or DOM elem ref.
                        , margins.left // x coord
                        , margins.top // y coord
                        , {
                            'width': margins.width // max width of content on PDF
                            , 'elementHandlers': specialElementHandlers
                        },
                        function (dispose) {
                            // dispose: object with X, Y of the last line add to the PDF
                            //          this allow the insertion of new lines after html
                            $.each(pdf.internal.pages, function (index, value) {
                                if (value) {
                                    $.each(value, function (innerIndex, innerValue) {
                                        var continueAfterThis = true;
                                        if (innerValue.indexOf('{{page}}') > -1) {
                                            //value[innerIndex] = innerValue.replace('{{{logo}}}',oSettings.tLogo);
                                            //pdf.internal.addImage(oSettings.tLogo, 'png', 15, 10, 200, 80);
                                            continueAfterThis = false;
                                        }
                                        return continueAfterThis;
                                    });
                                    $.each(value, function (innerIndex, innerValue) {
                                        var continueAfterThis = true;
                                        if (innerValue.indexOf('{{totalPages}}') > -1) {
                                            value[innerIndex] = innerValue.replace('{{totalPages}}', pdf.internal.getNumberOfPages);
                                            continueAfterThis = false;
                                        }
                                        return continueAfterThis;
                                    });
                                    $.each(value, function (innerIndex, innerValue) {
                                        var continueAfterThis = true;
                                        if (innerValue.indexOf('{{page}}') > -1) {
                                            value[innerIndex] = innerValue.replace('{{page}}', index);
                                            continueAfterThis = false;
                                        }
                                        return continueAfterThis;
                                    });
                                }
                            });
                            pdf.save(nameFile + '.pdf');
                        },
                        margins
                        );
                /*eliminar iframe creado por jspdf*/
                $('#dpdf_' + obj).remove();

            };

            /*
             * Ajax para exportar datos
             * @param {type} oSettings
             * @param {type} params
             * @param {type} doc
             * @returns {undefined}
             */
            _private.ajaxExport = function (oSettings, params, doc, btn) {
                $(btn).attr('disabled', true);
                /*inica efecto loading*/
                _private.iniLoading(oSettings, btn);


                /*Verificamos si se enviara parametros al server*/
                if (oSettings.fnServerParams !== undefined) {
                    oSettings.fnServerParams(_private.aData);
                }

                oSettings.pFilterCols = _private.prepareFilters(oSettings);

                var filters = (oSettings.pFilterCols !== undefined) ? Tools.e(oSettings.pFilterCols) : '';

                /*Enviamos datos de paginacion*/
                _private.aData.push({name: 'pOrder', value: oSettings.pOrderField});
                _private.aData.push({name: 'pFilterCols', value: filters});

                var datosx = _private.serialize();

                $.ajax({
                    type: "POST",
                    data: datosx + '&_sExport=1',
                    url: oSettings.ajaxSource,
                    dataType: 'json',
                    success: function (data) {
                        /*validar error del SP*/
                        if (data.length > 0 || data.error !== undefined) {
                            /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
                            if (data instanceof Object === false || data.error !== undefined) {
                                var msn = data;
                                if (data.error !== undefined) {
                                    msn = data.error;
                                }
                                alert(msn);
                            }
                        }

                        switch (doc.toString()) {
                            case 'E':/*a excel*/
                                _private.createFileExcel(data, oSettings);
                                break;
                            case 'P':/*a PDF*/
                                /*generar html*/
                                var html = _private.createHtmlExport(data, oSettings);

                                _private.createFilePDF(oSettings, html);
                                break;
                        }

                        /*finaliza efecto loading*/
                        _private.endLoading(oSettings, btn);

                        $(btn).attr('disabled', false);
                    }
                });
            };

            /*
             * Crea los botones en toolbar
             * @param {type} oSettings
             * @param {type} params
             * @returns {undefined}
             */
            _private.addTopButtons = function (oSettings, params) {
                var toolbar = $('<div></div>');
                toolbar.attr('id', 'toolbar_cont_' + oSettings.tObjectTable);
                toolbar.addClass('dt-toolbar text-right');
                toolbar.css({
                    padding: '3px',
                    position: 'relative'
                });

                /*div group*/
                var toolbarIn = $('<div></div>');
                toolbarIn.addClass('btn-group');
                toolbarIn.attr('id', 'toolbar_' + oSettings.tObjectTable);

                $(toolbar).html(toolbarIn);

                /*agregando toolbar a tObjectContainer*/
                $('#' + oSettings.tObjectContainer).html(toolbar);
                $('#' + oSettings.tObjectContainer).addClass('table-responsive');
                var dataFilter = 'hs_cols';



                /*===========================AGREGANDO BOTONES=======================*/
                var btns = oSettings.tButtons;

                /*verificar si se configuro botones*/
                if (btns.length && $.isArray(btns)) {
                    $.each(btns, function (b, v) {
                        var button = (btns[b].button !== undefined) ? btns[b].button : 0;
                        var ajax = (btns[b].ajax !== undefined) ? btns[b].ajax : '';

                        $.fn.getButtonsys({
                            container: `#toolbar_${oSettings.tObjectTable}`,
                            keymnu: oSettings.alias,
                            btns: [
                                {keybtn: button, evts: [{click: ajax}]}
                            ]
                        });
                    });

                }
                /*=========================FIN AGREGANDO BOTONES=====================*/

                var sExport = (oSettings.sExport !== undefined) ? oSettings.sExport : 0;

                /*verificar si se configuro exportaciones*/
                if (sExport !== 0) {
                    /*======================AGREGAR BOTON EXPORTAR EXCEL========================*/
                    if (sExport.buttons.excel && sExport.buttons.excel !== undefined) {
                        var btnExcel = $('<button></button>');
                        btnExcel.attr('type', 'button');
                        btnExcel.attr('id', 'btnEexcel_' + oSettings.tObjectTable);
                        btnExcel.addClass('btn btn-default');
                        btnExcel.html('<i class="fa fa-file-excel-o"></i> Excel');
                        btnExcel.click(function () {
                            _private.ajaxExport(oSettings, params, 'E', this);
                        });

                        $('#toolbar_' + oSettings.tObjectTable).append(btnExcel);
                    }
                    /*======================FIN AGREGAR BOTON EXPORTAR EXCEL========================*/

                    /*======================AGREGAR BOTON EXPORTAR PF========================*/
                    if (sExport.buttons.pdf && sExport.buttons.pdf !== undefined) {
                        var btnPDF = $('<button></button>');
                        btnPDF.attr('type', 'button');
                        btnPDF.addClass('btn btn-default');
                        btnPDF.attr('id', 'btnEexcel_' + oSettings.tObjectTable);
                        btnPDF.html('<i class="fa fa-file-pdf-o"></i> PDF');
                        btnPDF.click(function () {
                            _private.ajaxExport(oSettings, params, 'P', this);
                        });

                        $('#toolbar_' + oSettings.tObjectTable).append(btnPDF);
                    }
                    /*======================FIN AGREGAR BOTON EXPORTAR PF========================*/
                }

                /*===========================AGREGANDO BOTON VER-OCULTAR COLUMNAS==================*/
                /*varificar si se activo tShowHideColumn*/
                if (oSettings.tShowHideColumn) {
                    var btnSHColumn = $('<button></button>');
                    btnSHColumn.attr('type', 'button');
                    btnSHColumn.attr('id', 'btn_hidecolumn' + oSettings.tObjectTable);
                    btnSHColumn.addClass('btn btn-default');
                    btnSHColumn.html('<i class="fa fa-random" data-filter="' + dataFilter + '"></i> Ver/Ocultar Cols');
                    btnSHColumn.click(function () {
                        $('#contvo_' + oSettings.tObjectTable).toggle();
                    });
                    btnSHColumn.attr('data-filter', dataFilter);

                    /*agregando btnSHColumn a toolbar*/
                    $('#toolbar_' + oSettings.tObjectTable).append(btnSHColumn);



                    /*creando opciones para ver - ocultar*/
                    var ul = $('<ul></ul>');
                    ul.attr('id', 'contvo_' + oSettings.tObjectTable);
                    ul.addClass('ColVis_collection');
                    ul.attr('data-filter', dataFilter);
                    ul.css({
                        position: 'absolute',
                        right: '5px',
                        display: 'none',
                        top: '32px'
                    });

                    $.each(oSettings.tColumns, function (i, v) {
                        var title = (oSettings.tColumns[i].title !== undefined) ? oSettings.tColumns[i].title : '[field] no definido.';
                        var field = (oSettings.tColumns[i].field !== undefined) ? oSettings.tColumns[i].field : '[field] no definido.';

                        var li = $('<li></li>');
                        li.html('<label><input type="checkbox" data-field="' + field + '" checked><span>' + title + '</span></label>');
                        li.find('input').click(function () {
                            /*para ver - ocultar columnas*/
                            var dfield = $(this).data('field');
                            if ($(this).is(':checked')) {
                                $('.col_' + dfield).show();
                            } else {
                                $('.col_' + dfield).hide();
                            }
                        });
                        li.find('label').attr('data-filter', dataFilter);
                        li.find('input').attr('data-filter', dataFilter);
                        li.find('span').attr('data-filter', dataFilter);
                        li.attr('data-filter', dataFilter);
                        ul.append(li);
                    });

                    $('#toolbar_' + oSettings.tObjectTable).append(ul);
                }
                /*fin de boton ver-mostrar columnas*/
            };

            /*
             * Crea la tabla para el dataGrid
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.table = function (oSettings) {
                var tb = $('<table></table>');
                tb.attr('id', oSettings.tObjectTable);
                tb.attr('class', _private.cssTable);

                /*agregando tabla a div*/
                $('#' + oSettings.tObjectContainer).append(tb);
            };

            /*
             * Crea el checkbox en el head de la tabla
             * @param {type} oSettings
             * @returns {$}
             */
            _private.headCheckbox = function (oSettings) {
                _private.colspanRecords++;
                var td = $('<th></th>');
                td.attr('class', 'text-center');
                td.attr('id', oSettings.tObjectTable + '_chkall_0');
                td.css({'width': '1%'});

                var chk = $('<input></input>');
                chk.attr('type', 'checkbox');
                chk.attr('onclick', '$.method.checkAll(this,\'#' + oSettings.tObjectTable + '\')');

                td.append(chk);
                return td;
            };

            /*
             * Crea el radio en el head de la tabla
             * @param {type} oSettings
             * @returns {$}
             */
            _private.headRadio = function (oSettings) {
                _private.colspanRecords++;
                var td = $('<th>..</th>');
                td.attr('class', 'text-center');
                td.css({'width': '1%'});

                return td;
            };

            /*
             * Obtener el operador
             * @param {type} o
             * @returns {dataGrid.jquery_L8.dataGrid.jqueryAnonym$0.dataGrid._private.operator.dataGrid.jqueryAnonym$7}
             */
            _private.operator = function (o) {
                var com1 = '', com2 = '', op = o;
                /*si operator es LIKE se agrea comodin % */
                if (o.toLowerCase() === 'like') {
                    com1 = '*';  /*este sera el comodin*/
                    com2 = '*';  /*este sera el comodin*/
                } else if (o.toLowerCase() === 'c') {/*compienza por*/
                    op = 'LIKE';
                    com2 = '*';  /*este sera el comodin*/
                } else if (o.toLowerCase() === 't') {/*termina por*/
                    op = 'LIKE';
                    com1 = '*';  /*este sera el comodin*/
                }
                return {a: com1, b: com2, c: op};
            };

            /*
             * prepara string para filtros en query
             */
            _private.prepareFilters = function (oSettings) {
                var searchTxt = '';
                $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(1)').find('th').each(function () {
                    var filter1 = $(this).find('div:eq(0)').find('input, select');
                    var field = filter1.attr('field');

                    if (field !== undefined) {
                        var div2 = $(this).find('#cont_filter_' + oSettings.tObjectTable + '_' + field);

                        var operator1 = $.trim(div2.find('.operador1').val());
                        var operator2 = $.trim(div2.find('.operador2').val());
                        var operator3 = $.trim(div2.find('.operador3').val());
                        var filter2 = $.trim(div2.find('.filter2').val());
                        var campo = field;

                        /* = <> > >= < <= C T LIKE */
                        /*valor de primer filtro tiene contenido*/
                        if (filter1.val() !== '') {
                            var oA = _private.operator(operator1);
                            /*verificar si hay AND o OR*/
                            if (filter2 !== '') {
                                var oB = _private.operator(operator3);

                                searchTxt += ' AND (' + campo + ' ' + oA.c + ' "' + oA.a + $.trim(filter1.val()) + oA.b + '" ' + operator2 + ' ' + campo + ' ' + oB.c + ' "' + oB.a + filter2 + oB.b + '")';
                            } else {
                                searchTxt += ' AND ' + campo + ' ' + oA.c + ' "' + oA.a + $.trim(filter1.val()) + oA.b + '"';
                            }
                        }
                    }
                    $(this).find('.main-filter').css({display: 'none'});
                });
                return searchTxt;
            };

            /*
             * Ejecuta la busqueda mediante los filtros
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.executeFilter = function (oSettings) {
                oSettings.pFilterCols = _private.prepareFilters(oSettings);
                oSettings.pDisplayStart = (_private.sgbd == 'mysql') ? 0 : 1;
                $.method.sendAjax(oSettings);
            };

            /*
             * Limpia la busqueda, reset
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.clearFilter = function (oSettings, idCont) {
//                $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(1)').find('th').each(function() {
//                    $(this).find('div').find('input, .filter1, .filter2').val('');
//                    $(this).find('.main-filter').css({display: 'none'});
//                });
                var c = $('#' + idCont).parent('th').find('input:text, select').val('');
                oSettings.pFilterCols = _private.prepareFilters(oSettings);
//                oSettings.pDisplayStart = 1;
                $.method.sendAjax(oSettings);
            };

            /*
             * Crea los filtros y condiciones q se visualizaran al pulsar el icono: FILTRO
             * @param {type} field
             * @param {type} oSettings
             * @param {type} tipo
             * @returns {undefined}
             */
            _private.addFilters = function (field, oSettings, tipo, operator) {
                var idCont = 'cont_filter_' + oSettings.tObjectTable + '_' + field;
                var divF = $('<div></div>');
                divF.attr('data-filter', field);
                divF.attr('class', 'well well-sm main-filter');
                divF.css({
                    'display': 'none',
                    'position': 'absolute',
                    'right': '6px',
                    'z-index': 5
                });
                divF.attr('id', idCont);

                /*agregar texto 1*/
                var txt1 = $('<p></p>');
                txt1.attr('data-filter', field);
                txt1.html('Mostrar&nbsp;registros&nbsp;que&nbsp;sean:');

                divF.append(txt1);

                /*agregar primer <select> de operadores 1*/
                var operator1 = $('<select></select>');
                operator1.attr('id', 'op1_' + oSettings.tObjectTable + '_' + field);
                operator1.attr('data-filter', field);
                operator1.attr('class', 'form-control operador1');
                operator1.html('<option value="LIKE" ' + ((operator == 'LIKE') ? 'selected="selected"' : '') + '>Contiene</option><option value="=" ' + ((operator == '=') ? 'selected="selected"' : '') + '>Igual</option><option value="!=" ' + ((operator == '!=') ? 'selected="selected"' : '') + '>Diferente</option><option value=">" ' + ((operator == '>') ? 'selected="selected"' : '') + '>Mayor</option><option value=">=" ' + ((operator == '>=') ? 'selected="selected"' : '') + '>Mayor o igual</option><option value="<" ' + ((operator == '<') ? 'selected="selected"' : '') + '>Menor</option><option value="<=" ' + ((operator == '<=') ? 'selected="selected"' : '') + '>Menor o igual</option><option value="C" ' + ((operator == 'C') ? 'selected="selected"' : '') + '>Comienza</option><option value="T" ' + ((operator == 'T') ? 'selected="selected"' : '') + '>Termina</option>');
                operator1.find('option').attr('data-filter', field);
                divF.append(operator1);

                /*combo con operadores 2 AND, OR*/
                var operator2 = $('<select></select>');
                operator2.attr('id', 'op2_' + oSettings.tObjectTable + '_' + field);
                operator2.attr('data-filter', field);
                operator2.attr('class', 'form-control operador2');
                operator2.css({'margin-top': '5px', 'margin-bottom': '5px', width: '80px'});
                operator2.html('<option value="AND">AND</option><option value="OR">OR</option>');
                operator2.find('option').attr('data-filter', field);
                divF.append(operator2);

                /*agregar primer <select> de operadores 3*/
                var operator3 = $('<select></select>');
                operator3.attr('id', 'op3_' + oSettings.tObjectTable + '_' + field);
                operator3.attr('data-filter', field);
                operator3.attr('class', 'form-control operador3');
                operator3.css({'margin-bottom': '5px'});
                operator3.html('<option value="LIKE" ' + ((operator == 'LIKE') ? 'selected="selected"' : '') + '>Contiene</option><option value="=" ' + ((operator == '=') ? 'selected="selected"' : '') + '>Igual</option><option value="!=" ' + ((operator == '!=') ? 'selected="selected"' : '') + '>Diferente</option><option value=">" ' + ((operator == '>') ? 'selected="selected"' : '') + '>Mayor</option><option value=">=" ' + ((operator == '>=') ? 'selected="selected"' : '') + '>Mayor o igual</option><option value="<" ' + ((operator == '<') ? 'selected="selected"' : '') + '>Menor</option><option value="<=" ' + ((operator == '<=') ? 'selected="selected"' : '') + '>Menor o igual</option><option value="C" ' + ((operator == 'C') ? 'selected="selected"' : '') + '>Comienza</option><option value="T" ' + ((operator == 'T') ? 'selected="selected"' : '') + '>Termina</option>');
                operator3.find('option').attr('data-filter', field);
                divF.append(operator3);

                /*agregando filtro dos*/
                var filter2 = null, cont, icon;

                switch (tipo.toLowerCase()) {
                    case 'text':                            /*se crea input:text*/
                        filter2 = $('<input></input>');
                        filter2.attr('type', 'text');
                        filter2.addClass('form-control filter2');

                        break;
                    case 'date':                            /*se crea input:text, con datepicker*/
                        filter2 = $('<input></input>');
                        filter2.addClass('datepickerGrid');
                        filter2.attr('type', 'text');
                        filter2.addClass('form-control filter2');

                        icon = $('<label></label>');
                        icon.attr('for', field);
                        icon.attr('data-filter', field);
                        icon.attr('class', 'glyphicon glyphicon-calendar');

                        cont = $('<div></div>');
                        cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                        cont.attr('data-filter', field);
                        cont.html(filter2);
                        cont.append(icon);

                        filter2 = cont;
                        break;
                    case 'time':                        /*se crea input:text, con clockpicker*/
                        filter2 = $('<input></input>');
                        filter2.addClass('timepickerGrid');
                        filter2.attr('data-filter', field);
                        filter2.attr('type', 'text');
                        filter2.addClass('form-control filter2');

                        icon = $('<label></label>');
                        icon.attr('for', field);
                        icon.attr('data-filter', field);
                        icon.attr('class', 'glyphicon glyphicon-time');

                        cont = $('<div></div>');
                        cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                        cont.attr('data-filter', field);
                        cont.html(filter2);
                        cont.append(icon);

                        filter2 = cont;
                        break;
                    case 'select':
                        filter2 = $('<select></select>');

                        /*options*/
                        var opt = $('<option></option>');
                        opt.attr('value', '');
                        opt.html('Seleccionar...');

                        filter2.append(opt);
                        filter2.addClass('form-control filter2');

                        var dataClient = '';
                        $.each(DATA_SELECT, function (t, v) {
                            $.each(DATA_SELECT[t], function (g, v) {
                                if (oSettings.tObjectTable + '_' + field === g) {
                                    dataClient = DATA_SELECT[t][g];
                                }
                            });
                        });

                        filter2.append(dataClient);
                        break;
                }
                filter2.attr('id', 'f2_' + oSettings.tObjectTable + '_' + field);
                filter2.attr('data-filter', field);

                divF.append(filter2);

                /*botones filtrar y cerrar*/
                var cntBtn = $('<div></div>');
                cntBtn.attr('data-filter', field);
                cntBtn.css({'margin-top': '5px'});

                var btnFilter = $('<button></button>');
                btnFilter.attr('type', 'button');
                btnFilter.attr('class', 'btn btn-default');
                btnFilter.attr('data-filter', field);
                btnFilter.css({float: 'left'});
                btnFilter.html('<i class="fa fa-search"></i> Filtrar');
                btnFilter.click(function () {
                    _private.executeFilter(oSettings);
                });

                cntBtn.append(btnFilter);

                var btnClose = $('<button></button>');
                btnClose.attr('type', 'button');
                btnClose.attr('class', 'btn btn-default');
                btnClose.attr('data-filter', field);
                btnClose.css({float: 'right'});
                btnClose.html('<i class="fa fa-trash-o"></i> Limpiar');
                btnClose.click(function () {
                    $("#" + idCont).css({display: "none"});
                    _private.clearFilter(oSettings, idCont);
                });

                cntBtn.append(btnClose);

                divF.append(cntBtn);

                $('#th_cont_search_' + oSettings.tObjectTable + '_' + field).append(divF);
            };

            /*
             * Crea icono filtro en cada <th>
             * @param {type} idTH   --  id del <th> de cada filtro en el <thead>
             * @returns {undefined}
             */
            _private.addIconFilter = function (field, oSettings, tipo, operator) {
                var sp = $('<span></span>');
                sp.attr('class', 'input-group-addon');
                sp.attr('data-filter', field);
                sp.attr('onclick', '$("#cont_filter_' + oSettings.tObjectTable + '_' + field + '").toggle();');

                var ii = $('<i></i>');
                ii.attr('data-filter', field);
                ii.css({cursor: 'pointer'});
                ii.attr('class', 'glyphicon glyphicon-filter');

                sp.html(ii);
                $('#th_cont_search_' + oSettings.tObjectTable + '_' + field).find('div:eq(0)').append(sp);

                /*insertar capa con condicionales*/
                _private.addFilters(field, oSettings, tipo, operator);
            };

            /*
             * Crea los elementos para los filtros
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.addSearchCols = function (oSettings) {
                /*recorrido de columnas, creando los filtros*/
                $.each(oSettings.tColumns, function (c, v) {
                    var elementSearch = null;                          /*el filtro*/
                    var cont, idTH;
                    var kfield = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '';
                    var search = (oSettings.tColumns[c].filter !== undefined) ? oSettings.tColumns[c].filter : false;   /*para activar busqueda de columnas*/

                    /*verificar si se configuro la busqueda*/
                    if (search instanceof Object && search !== false) {
                        var tipo = (search.type !== undefined) ? search.type : 'text';                  /*tipo de elemento*/
                        var field = (search.compare !== undefined) ? search.compare : kfield;            /*el campo q se buscara, en caso oSettings.tColumns[c].campo no sea util*/
                        var idField = 'input_search_' + oSettings.tObjectTable + '_' + field;
                        var operator = (search.operator !== undefined) ? search.operator : '';
                        var icon = null;           /*para el icono del field*/

                        FIELDS.push(field);                          /*para ocultar filtros al dar click en document*/

                        /*id del <th>*/
                        idTH = 'th_cont_search_' + oSettings.tObjectTable + '_' + field;

                        /*switch segun type de objeto*/
                        switch (tipo.toLowerCase()) {
                            case 'text':                            /*se crea input:text*/
                                elementSearch = $('<input></input>');
                                elementSearch.attr('type', 'text');
                                elementSearch.attr('id', 'f1_' + oSettings.tObjectTable + '_' + field);
                                elementSearch.addClass('form-control filter1');
                                elementSearch.attr('field', field);
                                elementSearch.keypress(function (tecla) {
                                    if (tecla.keyCode === 13) {
                                        _private.executeFilter(oSettings);
                                    }
                                });

                                cont = $('<label></label>');
                                cont.css({display: 'block'});       /*para que ocupe todo el <th>*/
                                cont.html(elementSearch);


                                $('#' + idTH).find('div').html(cont);

                                /*agregando el operador*/
                                _private.addIconFilter(field, oSettings, tipo, operator);
                                break;
                            case 'date':                            /*se crea input:text, con datepicker*/
                                _private.ifDatePicker = true;

                                elementSearch = $('<input></input>');
                                elementSearch.addClass('datepickerGrid');
                                elementSearch.attr('type', 'text');
                                elementSearch.attr('id', 'f1_' + oSettings.tObjectTable + '_' + field);
                                elementSearch.addClass('form-control filter1');
                                elementSearch.attr('field', field);
                                elementSearch.keypress(function (tecla) {
                                    if (tecla.keyCode === 13) {
                                        _private.executeFilter(oSettings);
                                    }
                                });
                                elementSearch.change(function () {
                                    _private.executeFilter(oSettings);
                                });

                                icon = $('<label></label>');
                                icon.attr('for', idField);
                                icon.attr('class', 'glyphicon glyphicon-calendar');

                                cont = $('<div></div>');
                                cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                                cont.html(elementSearch);
                                cont.append(icon);

                                $('#' + idTH).find('div').html(cont);

                                /*agregando el operador*/
                                _private.addIconFilter(field, oSettings, tipo, operator);
                                break;
                            case 'time':                        /*se crea input:text, con clockpicker*/
                                _private.ifTimePicker = true;

                                elementSearch = $('<input></input>');
                                elementSearch.addClass('timepickerGrid');
                                elementSearch.attr('type', 'text');
                                elementSearch.attr('id', 'f1_' + oSettings.tObjectTable + '_' + field);
                                elementSearch.addClass('form-control filter1');
                                elementSearch.attr('field', field);
                                elementSearch.keypress(function (tecla) {
                                    if (tecla.keyCode === 13) {
                                        _private.executeFilter(oSettings);
                                    }
                                });
                                elementSearch.change(function () {
                                    _private.executeFilter(oSettings);
                                });

                                icon = $('<label></label>');
                                icon.attr('for', idField);
                                icon.attr('class', 'glyphicon glyphicon-time');

                                cont = $('<div></div>');
                                cont.addClass('icon-addon addon-md');                      /*para los iconos*/
                                cont.html(elementSearch);
                                cont.append(icon);

                                $('#' + idTH).find('div').html(cont);

                                /*agregando el operador*/
                                _private.addIconFilter(field, oSettings, tipo, operator);
                                break;
                            case 'select':                      /*se crea <select>*/
                                var url = (search.ajaxData !== undefined) ? search.ajaxData : null; /*para data de combo*/
                                var options = (search.options !== undefined) ? search.options : [];          /*campos para select*/
                                var dataClient = (search.dataClient !== undefined) ? search.dataClient : [];          /*data desde el cliente*/
                                var flag = (search.flag !== undefined) ? search.flag : '';

                                if (options.length === 0) {
                                    alert('[options] No definido, defina [options].')
                                }

                                if (url !== null) {                    /*datos desde el servidor*/
                                    var data_s;
                                    var promise = $.ajax({
                                        type: "POST",
                                        url: url,
                                        dataType: 'json',
                                        data: {_flag: flag, _field: field, _options: options}, /*se envia configuracion de <select> porq la llamada es multiple*/
                                        success: function (resp) {
                                            data_s = resp;
                                        }
                                    });
                                    /*promesa se ejecuta a la respuesta del server*/
                                    promise.done(function () {
                                        elementSearch = $('<select></select>');
                                        elementSearch.attr('id', 'f1_' + oSettings.tObjectTable + '_' + data_s.field);
                                        elementSearch.addClass('form-control filter1');
                                        elementSearch.attr('field', data_s.field);
                                        elementSearch.change(function () {
                                            _private.executeFilter(oSettings);
                                        });

                                        /*options*/
                                        var opt = $('<option></option>');
                                        opt.attr('value', '');
                                        opt.html('Todos...');

                                        elementSearch.append(opt);

                                        var oopp = '';
                                        $.each(data_s.dataServer, function (x, v) {
                                            oopp += '<option value="' + data_s.dataServer[x][data_s.opt.value] + '">' + data_s.dataServer[x][data_s.opt.label] + '</option>';
                                        });

                                        elementSearch.append(oopp);

                                        cont = $('<label></label>');
                                        cont.css({display: 'block'});       /*para que ocupe todo el <th>*/
                                        cont.html(elementSearch);

                                        /*data retorna del server, se debe insertar en <th> con html()*/
                                        $('#th_cont_search_' + oSettings.tObjectTable + '_' + data_s.field).find('div').html(cont);

                                        /*guardando data para el filtro 2*/
                                        var indice = oSettings.tObjectTable + '_' + data_s.field;
                                        eval('DATA_SELECT.push({' + indice + ': \'' + oopp + '\'});');

                                        /*agregando el operador*/
                                        _private.addIconFilter(data_s.field, oSettings, 'select', operator);
                                    });
                                } else if (dataClient.length > 0 && dataClient instanceof Object) {    /*datos desde el cliente*/
                                    cont = $('<label></label>');
                                    cont.css({display: 'block'});       /*para que ocupe todo el <th>*/

                                    elementSearch = $('<select></select>');

                                    /*options*/
                                    var opt = $('<option></option>');
                                    opt.attr('value', '');
                                    opt.html('Todos...');

                                    elementSearch.append(opt);
                                    elementSearch.attr('id', 'f1_' + oSettings.tObjectTable + '_' + field);
                                    elementSearch.addClass('form-control filter1');
                                    elementSearch.attr('field', field);
                                    elementSearch.change(function () {
                                        _private.executeFilter(oSettings);
                                    });

                                    var oopp = '';
                                    $.each(dataClient, function (x, v) {
                                        oopp += '<option value="' + dataClient[x].value + '">' + dataClient[x].etiqueta + '</option>';
                                    });
                                    elementSearch.append(oopp);

                                    cont.html(elementSearch);
                                    $('#' + idTH).find('div').html(cont);

                                    /*guardando data para el filtro 2*/
                                    var indice = oSettings.tObjectTable + '_' + field;
                                    eval('DATA_SELECT.push({' + indice + ': \'' + oopp + '\'});');

                                    /*agregando el operador*/
                                    _private.addIconFilter(field, oSettings, tipo, operator);
                                }
                                break;
                        }
                    }
                });

                /*verificar si se aplica datepicker*/
                if (_private.ifDatePicker) {
                    $('.datepickerGrid').datepicker({
                        prevText: '<i class="fa fa-chevron-left"></i>',
                        nextText: '<i class="fa fa-chevron-right"></i>',
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: 'dd-mm-yy'
                    });
                    $('.datepickerGrid').mask('99-99-9999');
                }

                /*verificar si se aplica clockpicker*/
                if (_private.ifTimePicker) {
                    $('.timepickerGrid').clockpicker({
                        autoclose: true
                    });
                    $('.timepickerGrid').mask('99:99');
                }
            };

            /*
             * Crea <tr> para busqueda por columnas
             * @param {type} oSettings
             * @returns {$}
             */
            _private.addTrSearchCols = function (oSettings) {
                var tr = $('<tr></tr>'),
                        chkExist = 0,
                        rdExist = 0;

                var gBtn = (oSettings.sAxions.group !== undefined) ? oSettings.sAxions.group : [];
                var bBtn = (oSettings.sAxions.buttons !== undefined) ? oSettings.sAxions.buttons : [];

                /*agregando <th> por numeracion*/
                if (oSettings.tNumbers) {
                    var th = $('<th></th>');
                    tr.append(th);                              /*se agrega al <tr>*/
                }

                /*agregando <th> por txt de accion al inicio de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'first' && (gBtn.length > 0 || bBtn.length > 0)) {
                    var th = $('<th></th>');
                    tr.append(th);                              /*se agrega al <tr>*/
                }

                /*agregando <th> por el checkbox al inicio*/
                if (oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object) {
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'first';
                    if (pos.toLowerCase() === 'first') {
                        var th = $('<th></th>');
                        tr.append(th);                          /*se agrega al <tr>*/
                        chkExist = 1;
                    }
                }

                /*agregando <th> por el radio al inicio*/
                if (oSettings.sRadio !== undefined && oSettings.sRadio instanceof Object) {
                    var pos = (oSettings.sRadio.position !== undefined) ? oSettings.sRadio.position : 'first';
                    if (pos.toLowerCase() === 'first') {
                        var th = $('<th></th>');
                        tr.append(th);                          /*se agrega al <tr>*/
                        rdExist = 1;
                    }
                }

                /*recorrido de columnas, creando <tr> para filtros*/
                $.each(oSettings.tColumns, function (c, v) {
                    var kfield = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '';
                    var search = (oSettings.tColumns[c].filter !== undefined) ? oSettings.tColumns[c].filter : false;   /*para activar busqueda de columnas*/
                    var field = (search.compare !== undefined) ? search.compare : kfield;            /*el campo q se buscara, en caso oSettings.tColumns[c].campo no sea util*/
                    var idTH = 'th_cont_search_' + oSettings.tObjectTable + '_' + field;

                    var th = $('<th></th>');                    /*se crea la columna*/
                    th.attr('id', idTH);
                    th.css({position: 'relative'});
                    th.addClass('hasinput');
                    th.addClass('col_' + field);

                    var divg = $('<div></div>');
                    divg.attr('class', 'input-group input-group-md');

                    th.html(divg);
                    tr.append(th);                              /*se agrega al <tr>*/
                });

                /*agregando <th> por el radio al final*/
                if (oSettings.sRadio !== undefined && oSettings.sRadio instanceof Object && rdExist === 0) {
                    var pos = (oSettings.sRadio.position !== undefined) ? oSettings.sRadio.position : 'last';
                    if (pos.toLowerCase() === 'last') {
                        var th = $('<th></th>');
                        tr.append(th);                          /*se agrega al <tr>*/
                    }
                }

                /*agregando <th> por el checkbox al final*/
                if (oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object && chkExist === 0) {
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'last';
                    if (pos.toLowerCase() === 'last') {
                        var th = $('<th></th>');
                        tr.append(th);                          /*se agrega al <tr>*/
                    }
                }

                /*agregando <th> por txt de accion al final de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'last' && (gBtn.length > 0 || bBtn.length > 0)) {
                    var th = $('<th></th>');
                    tr.append(th);                              /*se agrega al <tr>*/
                }

                return tr;
            };

            /*
             * Ejecuta la ordenacion por columnas
             * @param {type} tthis
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.executeSorting = function (tthis, oSettings) {
                var thId = $(tthis).attr('id'),
                        orienta,
                        numPag;
                oSettings.pOrderField = $(tthis).data('order');

                /*antes de dar efecto se resetea para dar los nuevos css*/
                if (TH_TMP !== thId) {
                    /*a todos los <th> del primer <tr> que tengan los css .sorting_asc y .sorting_desc les agreso el css .sorting*/
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('.sorting_asc').addClass('sorting');
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('.sorting_desc').addClass('sorting');

                    /*a todos los <th> del primer <tr> les remuevo los css .sorting_asc y .sorting_desc*/
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('th').removeClass('sorting_asc');
                    $('#' + oSettings.tObjectTable).find('thead').find('tr:nth-child(1)').find('th').removeClass('sorting_desc');

                }

                if ($('#' + thId).is('.sorting')) {                /*ordenacion ascendente*/
                    $('#' + thId).removeClass('sorting');
                    $('#' + thId).addClass('sorting_asc');
                    orienta = ' ASC';
                } else if ($('#' + thId).is('.sorting_asc')) {      /*ordenacion ascendente*/
                    $('#' + thId).removeClass('sorting_asc');
                    $('#' + thId).addClass('sorting_desc');
                    orienta = ' DESC';
                } else if ($('#' + thId).is('.sorting_desc')) {     /*sin ordenacion*/
                    $('#' + thId).removeClass('sorting_desc');
                    $('#' + thId).addClass('sorting');
                    orienta = ' ';
                }

                TH_TMP = thId;

                numPag = parseInt($('#paginate_' + oSettings.tObjectTable).find('ul.pagination').find('li.activerd').find('a').html());

                oSettings.pOrderField += orienta;
                oSettings.pDisplayLength = $('#' + oSettings.tObjectTable + '_cbLength').val();  /*tomo el valor del combo para los registros a mostrar*/
                oSettings.pDisplayStart = (_private.sgbd == 'mysql') ? numPag - 1 : numPag;
                oSettings.pDisplayStart = (isNaN(oSettings.pDisplayStart)) ? (_private.sgbd == 'mysql') ? 0 : 1 : oSettings.pDisplayStart;
                oSettings.pFilterCols = _private.prepareFilters(oSettings);
                $.method.sendAjax(oSettings);
            };

            /*
             * Crea la cabecera de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.theader = function (oSettings) {
                var h = $('<thead></thead>'),
                        tr = $('<tr></tr>'),
                        chkExist = 0,
                        rdExist = 0;

                /*agregando numeracion*/
                if (oSettings.tNumbers) {
                    var th = $('<th>Nro.</th>');         /*se crea la columna*/
                    th.attr('class', 'text-center');
                    th.css('width', '1%');
                    tr.append(th);                       /*se agrega al <tr>*/
                }

                /*agregando accion al inicio de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'first') {
                    _private.colspanRecords++;
                    tr.append(_private.headAxion(oSettings));
                }

                /*agregando checkbox al inicio*/
                if (oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object) {
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'first';
                    if (pos.toLowerCase() === 'first') {
                        tr.append(_private.headCheckbox(oSettings));                      /*se agrega al <tr>*/
                        chkExist = 1;
                    }
                }

                /*agregando radio al inicio*/
                if (oSettings.sRadio !== undefined && oSettings.sRadio instanceof Object) {
                    var pos = (oSettings.sRadio.position !== undefined) ? oSettings.sRadio.position : 'first';
                    if (pos.toLowerCase() === 'first') {
                        tr.append(_private.headRadio(oSettings));                      /*se agrega al <tr>*/
                        rdExist = 1;
                    }
                }

                /*recorrido de columnas*/
                $.each(oSettings.tColumns, function (c, v) {
                    var th = $('<th></th>');         /*se crea la columna*/

                    var title = (oSettings.tColumns[c].title !== undefined) ? oSettings.tColumns[c].title : '';
                    var field = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '';
                    var sortable = (oSettings.tColumns[c].sortable !== undefined && oSettings.tColumns[c].sortable) ? ' sorting' : '';
                    var width = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                    var search = (oSettings.tColumns[c].filter !== undefined) ? oSettings.tColumns[c].filter : false;   /*para activar busqueda de columnas*/

                    th.attr('id', oSettings.tObjectTable + '_head_th_' + c);
                    th.attr('class', 'text-center');        /*agregado class css*/
                    th.css({width: width, 'vertical-align': 'middle'});                                          /*agregando width de columna*/
                    th.append(title);                                                 /*se agrega el titulo*/
                    th.attr('data-order', field);
                    th.addClass('col_' + field);                                      /*para tShowHideColumn*/

                    /*agregando css para sortable*/
                    if (sortable !== '') {
                        th.addClass(sortable);

                        th.click(function () {
                            _private.executeSorting(this, oSettings);
                        });
                    }
                    /*verificar si se inicio ordenamiento y agegar class a th*/
                    var cad = oSettings.pOrderField.split(' ');

                    if (cad[0] === field) {
                        th.removeClass(sortable);
                        th.addClass('sorting_' + cad[1].toLowerCase())
                    }

                    if (search instanceof Object) {    /*se verifica si existe busquedas por columnas*/
                        _private.ifSearch = true;
                    }

                    tr.append(th);                                                  /*se agrega al <tr>*/
                    _private.colspanRecords++;
                });

                /*agregando checkbox al final*/
                if (oSettings.sRadio !== undefined && oSettings.sRadio instanceof Object && rdExist === 0) {
                    var pos = (oSettings.sRadio.position !== undefined) ? oSettings.sRadio.position : 'last';
                    if (pos.toLowerCase() === 'last') {
                        tr.append(_private.headRadio(oSettings));                      /*se agrega al <tr>*/
                    }
                }

                /*agregando checkbox al final*/
                if (oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object && chkExist === 0) {
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'last';
                    if (pos.toLowerCase() === 'last') {
                        tr.append(_private.headCheckbox(oSettings));                      /*se agrega al <tr>*/
                    }
                }

                /*agregando accion al final de cabecera*/
                if (_private.positionAxion.toLowerCase() === 'last') {
                    _private.colspanRecords++;
                    tr.append(_private.headAxion(oSettings));
                }

                h.html(tr);                                         /*se agrega <tr> de cabeceras al <thead>*/

                /*agregando controles para busqueda por columna*/
                if (_private.ifSearch) {
                    h.append(_private.addTrSearchCols(oSettings));      /*se agrega <tr> de busquedas al <thead>*/
                }

                $('#' + oSettings.tObjectTable).append(h);          /*se agrega <thead> al <table>*/

                /*agregando filtros a <tr>*/
                if (_private.ifSearch) {
                    _private.addSearchCols(oSettings);      /*se agrega elementos de busquedas al <tr>*/
                }
            };

            /*
             * Crea el tbody de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.tbody = function (oSettings) {
                var tbody = $('<tbody></tbody>');
                tbody.attr('id', 'tbody_' + oSettings.tObjectTable);

                $('#' + oSettings.tObjectTable).append(tbody);          /*se agrega <tbody> al <table>*/
            };

            /*
             * Crea el combo para cambiar el total de registros a visualizar or pagina
             * @param {type} oSettings
             * @returns {String|$}
             */
            _private.cbLength = function (oSettings) {
                var cbCl = '';
                if (oSettings.tChangeLength) {
                    cbCl = $('<div></div>');
                    cbCl.attr('id', 'contCbLength_' + oSettings.tObjectTable);
                    cbCl.attr('class', 'pull-left mr5');

                    var span = $('<span></span>');
                    span.attr('class', 'smart-form');

                    var label = $('<label></label>');
                    label.attr('class', 'select');
                    label.css({width: '60px'});

                    var select = $('<select></select>');
                    select.attr('id', oSettings.tObjectTable + '_cbLength');
                    select.attr('name', oSettings.tObjectTable + '_cbLength');
                    select.css({width: '60px'});
                    select.change(function () {
                        $.method.cbChange(oSettings);
                    });
                    var op = '', lb = oSettings.tRegsLength.length, cc = 0;
                    $.each(oSettings.tRegsLength, function (l, v) {
                        cc++;
                        if (cc <= lb) {
                            var sel = '';
                            if (parseInt(oSettings.pDisplayLength) === parseInt(oSettings.tRegsLength[l])) {
                                sel = 'selected="selected"';
                            }
                            op += '<option value="' + oSettings.tRegsLength[l] + '" ' + sel + '>' + oSettings.tRegsLength[l] + '</option>';
                        }
                    });
                    select.html(op);

                    label.html(select);            /*se agrega select a label*/
                    label.append('<i></i>');
                    span.html(label);            /*se agrega label a span*/
                    cbCl.html(span);            /*se agrega span a cbCl*/
                }
                return cbCl;
            };

            /*
             * Crea el foot de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.tfoot = function (oSettings) {
                var df = $('<div></div>');
                df.attr('id', 'foot_' + oSettings.tObjectTable);
                df.attr('class', 'dt-toolbar-footer');

                /*===================INI IZQUIERDO===========================*/
                var dcontlf = $('<div></div>');
                dcontlf.attr('id', 'info_' + oSettings.tObjectTable);
                dcontlf.attr('class', 'col-sm-6 col-xs-12 hidden-xs');

                var dtxt = $('<div></div>');
                dtxt.attr('class', 'dataTables_info pull-left mr5');
                if (oSettings.tViewInfo) {
                    dtxt.html(_private.txtInfo);        /*info inicial*/

                    dcontlf.html(dtxt);

                    /*combo change length*/
                    dcontlf.append(_private.cbLength(oSettings));

                    /*boton refresh*/
                    var btnRefresh = $('<button></button>');
                    btnRefresh.attr('id', 'btnRefresh_' + oSettings.tObjectTable);
                    btnRefresh.attr('type', 'button');
                    btnRefresh.attr('class', 'btn btn-primary mr5 refresh-dg-rdcc');
                    btnRefresh.attr('title', 'Actualizar');
                    btnRefresh.html('<i class="fa fa-refresh"></i>');
                    dcontlf.append(btnRefresh);

                    df.append(dcontlf);
                }
                /*=========================FIN IZQUIERDO====================*/

                /*===================INI DERECHO===========================*/
                var dcontrh = $('<div></div>');
                dcontrh.attr('id', 'paginate_' + oSettings.tObjectTable);
                dcontrh.attr('class', 'col-sm-6 col-xs-12');

                var dcontpag = $('<div></div>');
                dcontpag.attr('class', 'dataTables_paginate paging_simple_numbers');

                /*ul para paginacion*/
                var ulp = $('<ul></ul>');
                ulp.attr('class', 'pagination pagination-sm');
                ulp.attr('id', 'ul_pagin_' + oSettings.tObjectTable);

                dcontpag.html(ulp);

                dcontrh.html(dcontpag);

                df.append(dcontrh);
                /*===================FIN DERECHO===========================*/

                /*agregando div a container*/
                $('#' + oSettings.tObjectContainer).append(df);
            };

            /*
             * Crea botones primero y anterior de paginacion
             * @param {type} oSettings
             * @param {type} pagActual
             * @returns {undefined}
             */
            _private.liFirstPrev = function (oSettings, pagActual) {

                /*se crea boton <li> ptimero*/
                var liFirst = $('<li></li>');

                if (pagActual > 1) {
                    liFirst.attr('class', 'paginate_button previous');
                } else {
                    liFirst.attr('class', 'paginate_button previous disabled');
                }

                /*se crea <a> primero*/
                var aFirst = $('<a></a>');
                aFirst.attr('href', 'javascript:;');
                aFirst.html('<i class="' + _private.btnFirst + '"></i>');
                if (pagActual > 1) {
                    aFirst.click(function () {
                        oSettings.pDisplayStart = (_private.sgbd == 'mysql') ? 0 : 1;
                        oSettings.pFilterCols = _private.prepareFilters(oSettings);
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liFirst).html(aFirst);                /*aFirst dentro de liFirst*/
                $('#ul_pagin_' + oSettings.tObjectTable).append(liFirst);                  /*liFirst dentro de ul*/


                /*se crea boton <li> anterior*/
                var liPrev = $('<li></li>');
                if (pagActual > 1) {
                    liPrev.attr('class', 'paginate_button previous');
                } else {
                    liPrev.attr('class', 'paginate_button previous disabled');
                }

                /*se crea <a> anterior*/
                var aPrev = $('<a></a>');
                aPrev.attr('href', 'javascript:;');
                aPrev.html('<i class="' + _private.btnPrev + '"></i>');
                if (pagActual > 1) {
                    aPrev.click(function () {
                        oSettings.pDisplayStart = (_private.sgbd == 'mysql') ? pagActual - 2 : pagActual - 1;
                        oSettings.pFilterCols = _private.prepareFilters(oSettings);
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liPrev).html(aPrev);                /*aPrev dentro de liPrev*/
                $('#ul_pagin_' + oSettings.tObjectTable).append(liPrev);                  /*liPrev dentro de ul*/
            };

            /*
             * Crea botones ultimo y siguiente de paginacion
             * @param {type} oSettings
             * @param {type} pagActual
             * @param {type} numPaginas
             * @returns {undefined}
             */
            _private.liLastNext = function (oSettings, pagActual, numPaginas) {
                /*se crea boton <li> siguiente*/
                var liNext = $('<li></li>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    liNext.attr('class', 'paginate_button next');
                } else {
                    liNext.attr('class', 'paginate_button next disabled');
                }

                /*se crea <a> next*/
                var aNext = $('<a></a>');
                aNext.attr('href', 'javascript:;');
                aNext.html('<i class="' + _private.btnNext + '"></i>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    aNext.click(function () {
                        oSettings.pDisplayStart = (_private.sgbd == 'mysql') ? pagActual : pagActual + 1;
                        oSettings.pFilterCols = _private.prepareFilters(oSettings);
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liNext).html(aNext);                /*aNext dentro de liNext*/
                $('#ul_pagin_' + oSettings.tObjectTable).append(liNext);                  /*liNext dentro de ul*/

                if (numPaginas > 1 && pagActual !== numPaginas) {
                    oSettings.pDisplayStart = numPaginas;     /*para boton ultimo, mysql numPaginas - 1*/
                }

                /*se crea boton <li> ultimo*/
                var liLast = $('<li></li>');

                if (numPaginas > 1 && pagActual !== numPaginas) {
                    liLast.attr('class', 'paginate_button next');
                } else {
                    liLast.attr('class', 'paginate_button next disabled');
                }

                /*se crea <a> ultimo*/
                var aLast = $('<a></a>');
                aLast.attr('href', 'javascript:;');
                aLast.html('<i class="' + _private.btnLast + '"></i>');
                if (numPaginas > 1 && pagActual !== numPaginas) {
                    aLast.click(function () {
                        oSettings.pFilterCols = _private.prepareFilters(oSettings);
                        oSettings.pDisplayStart = (_private.sgbd == 'sql') ? numPaginas : numPaginas - 1;
                        $.method.sendAjax(oSettings);
                    });
                }
                $(liLast).html(aLast);                /*aLast dentro de liLast*/
                $('#ul_pagin_' + oSettings.tObjectTable).append(liLast);                  /*liLast dentro de ul*/
            };

            /*
             * Crea la paginacion del dataGrid
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.paginate = function (oSettings) {
                if (oSettings.sData.length === 0) {
                    /*agregando evento a boton actualizar*/
                    $('#btnRefresh_' + oSettings.tObjectTable).off('click');
                    $('#btnRefresh_' + oSettings.tObjectTable).click(function () {
                        oSettings.pDisplayStart = (_private.sgbd == 'sql') ? 1 : 0;
                        _private.executeFilter(oSettings);      /*al actuaizar debe mandar los filtros*/
                    });

                    /*actualizando info*/
                    _private.iniInfo = 0;
                    _private.finInfo = 0;
                    _private.totalInfo = 0;

                    $('#info_' + oSettings.tObjectTable).find('div:eq(0)').html(_private.txtInfo);
                    var xpagin = '<li class="paginate_button previous disabled">\n\
                                    <a href="javascript:;"><i class="fa fa-fast-backward"></i></a>\n\
                                </li>\n\
                                <li class="paginate_button previous disabled">\n\
                                    <a href="javascript:;"><i class="fa fa-backward"></i></a>\n\
                                </li>\n\
                                <li class="num paginate_button activerd">\n\
                                    <a href="javascript:;">1</a>\n\
                                </li>\n\
                                <li class="paginate_button next disabled">\n\
                                    <a href="javascript:;"><i class="fa fa-forward"></i></a>\n\
                                </li>\n\
                                <li class="paginate_button next disabled">\n\
                                    <a href="javascript:;"><i class="fa fa-fast-forward"></i></a>\n\
                                </li>';
                    $('#ul_pagin_' + oSettings.tObjectTable).html(xpagin);
                    return false;
                }

                if (oSettings.sData[0].total === undefined) {
                    Tools.notify.info({
                        content: '[total] indefinido'
                    });
                }

                var total = oSettings.sData[0].total;
                var start = oSettings.pDisplayStart;
                var length = oSettings.pDisplayLength;
                var data = (oSettings.sData !== undefined) ? oSettings.sData : [];

                /*verificar si paginate esta activo*/
                if (oSettings.pPaginate && total > 0) {
                    $('#ul_pagin_' + oSettings.tObjectTable).html('');

                    var paginaActual = (_private.sgbd == 'sql') ? start : start + 1;
                    var numPaginas = Math.ceil(total / length);     /*determinando el numero de paginas*/
                    var itemPag = Math.ceil(oSettings.pItemPaginas / 2);

                    var pagInicio = (paginaActual - itemPag);
                    var pagInicio = (pagInicio <= 0 ? 1 : pagInicio);
                    var pagFinal = (pagInicio + (oSettings.pItemPaginas - 1));
                    var trIni = ((paginaActual * length) - length) + 1;
                    var trFin = (paginaActual * length);

                    var cantRreg = trFin - (trFin - data.length);
                    var trFinOk = (cantRreg < length) ? (cantRreg === total) ? cantRreg : (parseInt(trFin) - (parseInt(length) - parseInt(cantRreg))) : trFin;

                    oSettings.pDisplayStart = paginaActual;   /*para boton actualizar, mysql paginaActual - 1;*/

                    /*actualizando info*/
                    _private.iniInfo = trIni;
                    _private.finInfo = trFinOk;
                    _private.totalInfo = total;

                    $('#info_' + oSettings.tObjectTable).find('div:eq(0)').html(_private.txtInfo);

                    /*====================INI UL NUMERACION ==================*/
                    _private.liFirstPrev(oSettings, paginaActual);

                    /*for para crear numero de paginas*/
                    for (var i = pagInicio; i <= pagFinal; i++) {
                        if (i <= numPaginas) {
                            /*se crea <li> para numeros de paginas*/
                            var liNumero = $('<li></li>');
                            /*se crea <a> anterior*/
                            var aNumero = $('<a></a>');
                            aNumero.attr('href', 'javascript:;');
                            aNumero.html(i);

                            if (i === paginaActual) {
                                liNumero.attr('class', 'num paginate_button activerd');
                            } else {
                                liNumero.attr('class', 'num paginate_button');
                            }

                            $(liNumero).html(aNumero);                /*aNumero dentro de liNumero*/
                            $('#ul_pagin_' + oSettings.tObjectTable).append(liNumero);                  /*liNumero dentro de ul*/
                        } else {
                            break;
                        }
                    }
                    /*fin for*/

                    _private.liLastNext(oSettings, paginaActual, numPaginas);
                    /*====================FIN UL NUMERACION ==================*/

                }

                if (!oSettings.pPaginate) {
                    /*actualizando info*/
                    _private.iniInfo = 1;
                    _private.finInfo = total;
                    _private.totalInfo = total;
                    $('#info_' + oSettings.tObjectTable).find('div:eq(0)').html(_private.txtInfo);
                }
                /*agregando eventos para paginacion*/
                $('#ul_pagin_' + oSettings.tObjectTable).find('li').each(function () {
                    var n = $(this).is('.num');
                    /*solo los numeros de pagina*/
                    if (n) {
                        var activo = $(this).is('.activerd');     /*numero de pagina actual*/
                        var numero = parseInt($(this).find('a').html());

                        /*evento a numeros inactivos*/
                        if (!activo) {
                            $(this).find('a').click(function () {
                                oSettings.pDisplayStart = (_private.sgbd == 'sql') ? numero : numero - 1;
                                oSettings.pFilterCols = _private.prepareFilters(oSettings);
                                $.method.sendAjax(oSettings);
                            });
                        } else {
                            /*agregando evento a boton actualizar, enviando el nuemro activo de pagina*/
                            $('#btnRefresh_' + oSettings.tObjectTable).off('click');
                            $('#btnRefresh_' + oSettings.tObjectTable).click(function () {
                                oSettings.pDisplayStart = (_private.sgbd == 'sql') ? numero : numero - 1;
                                _private.executeFilter(oSettings);      /*al actuaizar debe mandar los filtros*/
                            });
                        }
                    }
                });
            };

            /*
             * Define el limit inferior para paginacion
             * @param {type} oSettings
             * @returns {oSettings.pDisplayStart|oSettings.pDisplayLength}
             */
            _private.limitInferior = function (oSettings) {
                var limit0 = oSettings.pDisplayStart;
                if (_private.sgbd == 'mysql') {
                    if (oSettings.pDisplayStart > 0) {
                        limit0 = oSettings.pDisplayLength * limit0;
                    }
                }
                return limit0;
            };

            /*
             * Serializa _private.aData
             * @returns {String}
             */
            _private.serialize = function () {
                var data = '';
                $.each(_private.aData, function (i, v) {
                    data += _private.aData[i].name + '=' + _private.aData[i].value + '&';
                });
                _private.aData = [];
                data = data.substring(0, data.length - 1);
                return data;
            };

            /*
             * Setea desde el servidor
             * @param {type} params
             * @param {type} data
             * @returns {String}
             */
            _private.paramServer = function (params, data) {
                var result = '';
                /*validar si tiene parametros de servidor*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        $.each(params, function (x, v) {
                            result += "'" + data[params[x]] + "',";
                        });
                    } else {
                        /*se agrega parametros directos*/
                        result += "'" + data[params] + "',";
                    }
                }
                return result;
            };

            /*
             * Setea parametros desde el cliente
             * @param {type} params
             * @returns {String}
             */
            _private.paramClient = function (params) {
                var result = '';
                /*validar si tiene parametros de cliente*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        $.each(params, function (x, v) {
                            result += params[x] + ",";
                        });
                    } else {
                        /*se agrega parametros directos*/
                        result += params + ",";
                    }
                }
                return result;
            };

            /*
             * Ret0rna numero de inicio para la numeracion - Nro.
             * @param {type} oSettings
             * @returns {Number}
             */
            _private.numeracion = function (oSettings) {
                if (oSettings.tNumbers) {
                    var n;
                    _private.colspanRecords++; /*colspan para msn: no se encontraron registros*/
                    if (oSettings.pDisplayStart == 0) {
                        n = 1;
                    } else {
                        if (_private.sgbd == 'mysql') {
                            n = (oSettings.pDisplayStart * oSettings.pDisplayLength);
                        } else {
                            n = (oSettings.pDisplayStart * oSettings.pDisplayLength) - (oSettings.pDisplayLength - 1);
                        }

                    }
                    return n;
                }
            };

            /*
             * Crea <button> o <li> para las acciones
             * @param {type} oSettings  ... objeto grid
             * @param {type} buttons    ... array de bototnes
             * @param {type} td         ... td que se esta creando
             * @param {type} tipo       ... si se crea <button> o <li>
             * @param {type} data       ... datos del servidor
             * @param {type} r          ... numero de registro creado
             * @param {type} ig         ... numero de group button creado
             * @returns {undefined}         OBJBTNS
             */
            _private.createButtons = function (oSettings, buttons, td, tipo, data, r, ig) {
                $.each(buttons, function (i, v) {
                    var button = OBJBTNS[`${oSettings.alias}${v.button}`];

                    if (button) {

                        var titulo = (button.nboton !== undefined) ? Tools.traslate(button.nboton) : '';
                        var icono = (button.icono !== undefined) ? button.icono : '';
                        var klass = (button.css !== undefined) ? button.css : '';
                        var fnCallback = (v.fnCallback !== undefined) ? v.fnCallback : '';
                        /*parametros para ajax*/
                        var ajax = (v.ajax !== undefined) ? v.ajax : '';       /*ajax para <td>*/
                        var fn = '';
                        var flag = '';
                        var clientParams = '';
                        var serverParams = '';

                        /*verificar si tiene permiso asignado*/

                        if (ajax) {
                            fn = (ajax.fn !== undefined) ? ajax.fn : '';                                /*funcion ajax*/
                            flag = (ajax.flag !== undefined) ? ajax.flag : '';                          /*flag de la funcion*/
                            clientParams = (ajax.clientParams !== undefined) ? ajax.clientParams : '';  /*parametros desde el cliente*/
                            serverParams = (ajax.serverParams !== undefined) ? ajax.serverParams : '';  /*parametros desde el servidor*/
                        }
                        /*configurando ajax*/
                        if (fn) {
                            var xparams = '';

                            /*validar flag para agregar como parametro*/
                            if (flag) {
                                xparams = flag + ',';
                            }
                            /*parametros de servidor*/
                            xparams += _private.paramServer(serverParams, data[r]);
                            /*parametros de cliente*/
                            xparams += _private.paramClient(clientParams);
                            xparams = xparams.substring(0, xparams.length - 1);
                            fn = fn + `(this,${xparams},'${_tk_}')`;
                        }


                        switch (tipo) {
                            case 'btn': /*<button>*/
                                var btn = $('<button></button>');
                                btn.attr({
                                    type: 'button',
                                    id: `btn_axion_${oSettings.tObjectTable}_${r}`,
                                    title: titulo
                                });
//                                btn.css({
//                                    'margin-right': '3px'
//                                });

                                if (icono !== '') {
                                    btn.html('<i class="' + icono + '"></i>');
                                }
                                /*agregando ajax*/
                                if (fn) {
                                    btn.attr('onclick', fn);
                                }
                                if (klass !== '') {
                                    btn.attr('class', klass);
                                }
                                break;
                            case 'li': /*<li>*/
                                var btn = $('<li></li>');
                                var a = $('<a></a>');
                                a.attr('id', 'btn_axion_' + oSettings.tObjectTable + '_' + r + '_' + ig + '_' + i);
                                a.attr('href', 'javascript:;');
                                a.html('<i class="' + icono + '"></i> ' + titulo);
                                /*agregando ajax*/
                                if (fn) {
                                    a.attr('onclick', fn);
                                }

                                btn.html(a);
                                break;
                        }

                        /*verificar si tiene fnCallback configurado*/
                        if (fnCallback !== undefined && fnCallback instanceof Object) {
                            var call = fnCallback(r, data[r], oSettings.tSendJSON);       /*se ejecuta fnCallback*/
                            if (!call) {
                                //call es false, <td> sigue con su contenido original
                            } else {
                                switch (tipo) {
                                    case 'btn':
                                        btn = call;  /*se carga return de call*/
                                        break;
                                    case 'li':
                                        btn = '<li><a id="btn_axion_' + oSettings.tObjectTable + '_' + r + '_' + ig + '_' + i + '" href="javascript:;" onclick="' + fn + '">' + call + '</a></li>';  /*se carga return de call*/
                                        break;
                                }

                            }
                        }

                        td.append(btn);
                    }

                });
            };

            /*
             * Genera los botones para las acciones
             * @param {type} r
             * @param {type} data
             * @param {type} oSettings
             * @returns {$}
             */
            _private.axionButtons = function (r, data, oSettings) {
                var buttons = (oSettings.sAxions.buttons !== undefined) ? oSettings.sAxions.buttons : [];
                var group = (oSettings.sAxions.group !== undefined) ? oSettings.sAxions.group : '';

                /*verificar si axiones sera grupal*/
                if (group instanceof Object && group !== '') {
                    var td = $('<td></td>');
                    td.attr('class', 'text-center');

                    /*recorrido de acciones*/
                    $.each(group, function (i, v) {
                        var titulo = (group[i].titulo !== undefined) ? group[i].titulo : `<i class="fa fa-gear fa-lg"></i>`;  // default fa-gear
                        var tooltip = (group[i].tooltip !== undefined) ? group[i].tooltip : 'Acciones';
                        var klass = (group[i].class !== undefined) ? group[i].class : 'btn btn-primary';
                        var buttong = (group[i].buttons !== undefined) ? group[i].buttons : [];

                        /*div group*/
                        var divg = $('<div></div>');
                        divg.attr('class', 'btn-group');

                        /*boton para group*/
                        var btng = $('<button></button>');
                        btng.attr('class', klass + ' dropdown-toggle');
                        btng.attr('data-toggle', 'dropdown');
                        btng.attr('title', tooltip);
                        btng.html(titulo);
                        btng.append(' <span class="caret"></span>');

                        divg.append(btng);      /*se agrega <button> a <div>*/

                        /*ul para botones-opcioens*/
                        var ulb = $('<ul></ul>');
                        ulb.attr('class', 'dropdown-menu');

                        /*recorrido de botones*/
                        _private.createButtons(oSettings, buttong, ulb, 'li', data, r, i);

                        divg.append(ulb);      /*se agrega <ul> a <div>*/

                        td.append(divg);            /*se agrega <div> a <td>*/

                    });
                    return td;
                } else {
                    if (buttons.length) {
                        var td = $('<td></td>');
                        td.attr('class', 'text-center');

                        var btng = $('<div></div>');
                         btng.addClass('btn-group');

                        _private.createButtons(oSettings, buttons, btng, 'btn', data, r);

                        td.append(btng);
                        return td;
                    }
                }

            };

            /*
             * Setea values del checkbox provenientes del servidor
             * @param {type} params
             * @param {type} data
             * @returns {String}
             */
            _private.valuesServer = function (params, data) {
                var result = '';
                /*validar si tiene parametros de servidor*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        $.each(params, function (x, v) {
                            result += data[params[x]] + "*";
                        });
                    } else {
                        /*se agrega parametros directos*/
                        result += data[params] + "*";
                    }
                }
                return result;
            };

            /*
             * Setea values del checkbox provenientes del cliente
             * @param {type} params
             * @returns {String}
             */
            _private.valuesClient = function (params) {
                var result = '';
                /*validar si tiene parametros de cliente*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        $.each(params, function (x, v) {
                            result += params[x] + "*";
                        });
                    } else {
                        /*se agrega parametros directos*/
                        result += params + "*";
                    }
                }
                return result;
            };

            /*
             * Setea values del checkbox, asignadole como atributos data-
             * @param {type} params
             * @param {type} data
             * @returns {String}
             */
            _private.attrValuesServer = function (params, data) {
                var result = '';
                /*validar si tiene parametros de servidor*/
                if (params) {
                    /*validar si es array*/
                    if (params instanceof Object) {
                        /*se agrega paramtros desde array*/
                        $.each(params, function (x, v) {
                            $.each(params[x], function (y, v) {
                                if (data[params[x][y]] !== undefined) {
                                    result += " data-" + params[x][y] + "=\"" + data[params[x][y]] + "\"";
                                }
                            });
                        });
                    } else {
                        /*se agrega parametros directos*/
                        result += " data-" + params + "=\"" + data[params] + "\"";
                    }
                }
                return result;
            };

            /*
             * Crea los checkbox de la tabla
             * @param {type} oSettings
             * @param {type} data
             * @param {type} r
             * @returns {$}
             * sCheckbox: {
             serverValues: ['alias','estado'],
             clientValues: [pr1,pr2],
             attrServerValues: [
             {alias: 'alias'},
             {estado: 'estado'}
             ],
             fnCallback:function(){}                                                
             }
             */
            _private.createCheckbox = function (oSettings, data, r) {
                var clientValues = (oSettings.sCheckbox.clientValues !== undefined) ? oSettings.sCheckbox.clientValues : '';    /*parametros del cliente*/
                var serverValues = (oSettings.sCheckbox.serverValues !== undefined) ? oSettings.sCheckbox.serverValues : '';    /*parametros del servidor*/
                var attrServerValues = (oSettings.sCheckbox.attrServerValues !== undefined) ? oSettings.sCheckbox.attrServerValues : '';    /*parametros del servidor como atributos*/
                var fnCallback = (oSettings.sCheckbox.fnCallback !== undefined) ? oSettings.sCheckbox.fnCallback : '';
                var xvalues = '', attrValues = '';

                if (clientValues !== '') {
                    /*parametros de cliente*/
                    xvalues += _private.valuesClient(clientValues, data[r]);
                }
                if (serverValues !== '') {
                    /*parametros de servidor*/
                    xvalues += _private.valuesServer(serverValues, data[r]);
                }
                xvalues = xvalues.substring(0, xvalues.length - 1);

                if (attrServerValues !== '') {
                    /*parametros de servidor como atributos*/
                    attrValues = _private.attrValuesServer(attrServerValues, data[r]);
                }

                var td = $('<td></td>');
                td.attr('class', 'text-center');

                if (fnCallback === '') {
                    td.html('<input id="' + oSettings.tObjectTable + '_chk_' + r + '" name="' + oSettings.tObjectTable + '_chk[]" type="checkbox" value="' + xvalues + '" ' + attrValues + ' class="chkG">');
                } else {
                    /*verificar si tiene fnCallback configurado*/
                    if (fnCallback !== undefined && fnCallback instanceof Object) {
                        var call = fnCallback(r, data[r], oSettings.tSendJSON);       /*se ejecuta fnCallback*/
                        if (!call) {
                            //call es false, <td> sigue con su contenido original
                        } else {
                            td.html(call);  /*se carga return de call*/
                        }
                    }
                }
                //td.attr('data-render', '0');
                return td;
            };

            /*
             * Crea los radio de la tabla
             * @param {type} oSettings
             * @param {type} data
             * @param {type} r
             * @returns {$}
             * sRadio: {
             serverValues: ['alias','estado'],
             clientValues: [pr1,pr2],
             attrServerValues: [
             {alias: 'alias'},
             {estado: 'estado'}
             ],
             fnCallback:function(){}                                                
             }
             */
            _private.createRadio = function (oSettings, data, r) {
                var clientValues = (oSettings.sRadio.clientValues !== undefined) ? oSettings.sRadio.clientValues : '';    /*parametros del cliente*/
                var serverValues = (oSettings.sRadio.serverValues !== undefined) ? oSettings.sRadio.serverValues : '';    /*parametros del servidor*/
                var attrServerValues = (oSettings.sRadio.attrServerValues !== undefined) ? oSettings.sRadio.attrServerValues : '';    /*parametros del servidor como atributos*/
                var fnCallback = (oSettings.sRadio.fnCallback !== undefined) ? oSettings.sRadio.fnCallback : '';
                var xvalues = '', attrValues = '';

                if (clientValues !== '') {
                    /*parametros de cliente*/
                    xvalues += _private.valuesClient(clientValues, data[r]);
                }
                if (serverValues !== '') {
                    /*parametros de servidor*/
                    xvalues += _private.valuesServer(serverValues, data[r]);
                }
                xvalues = xvalues.substring(0, xvalues.length - 1);

                if (attrServerValues !== '') {
                    /*parametros de servidor como atributos*/
                    attrValues = _private.attrValuesServer(attrServerValues, data[r]);
                }

                var td = $('<td></td>');
                td.attr('class', 'text-center');

                if (fnCallback === '') {
                    td.html('<input id="' + oSettings.tObjectTable + '_rd_' + r + '" name="' + oSettings.tObjectTable + '_rd" type="radio" value="' + xvalues + '" ' + attrValues + ' class="chkG">');
                } else {
                    /*verificar si tiene fnCallback configurado*/
                    if (fnCallback !== undefined && fnCallback instanceof Object) {
                        var call = fnCallback(r, data[r], oSettings.tSendJSON);       /*se ejecuta fnCallback*/
                        if (!call) {
                            //call es false, <td> sigue con su contenido original
                        } else {
                            td.html(call);  /*se carga return de call*/
                        }
                    }
                }
                //td.attr('data-render', '0');
                return td;
            };

            /*
             * Cebra de columna al ordenar
             * @param {type} r
             * @param {type} pOrderField
             * @param {type} campo
             * @returns {String}
             */
            _private.cebraCol = function (c, oSettings, campo, r) {
                var m, classort;
                m = oSettings.pOrderField.split(' ');
                classort = '';

                /*verfificar si cplumna esta ordenada*/
                var cssTh1 = $('#' + oSettings.tObjectTable + '_head_th_' + c).is('.sorting_asc');
                var cssTh2 = $('#' + oSettings.tObjectTable + '_head_th_' + c).is('.sorting_desc');

                if (cssTh1 || cssTh2) {
                    if (campo === m[0]) {
                        classort = ' sorting_1';
                        if (r % 2) {
                            classort = ' sorting_2';
                        }
                    }
                }

                return classort;
            };

            /*
             * Crea los registros de la tabla
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.records = function (oSettings) {
                var data = oSettings.sData,
                        chkExist = 0,
                        rdExist = 0;
                var fnCallbackRow = oSettings.fnCallbackRow;
                $('#tbody_' + oSettings.tObjectTable).find('tr').remove();        /*remover <tr> para nueva data*/

                var num = _private.numeracion(oSettings);//mysql +1

                /*verificar q tenga data*/
                if (data.length) {
                    _private.totalizerColumn = [];
                    $.each(data, function (r, v) {
                        var tr = $('<tr></tr>');        /*se crea el tr*/
                        tr.attr('id', 'tr_' + oSettings.tObjectTable + '_' + r);

                        /*agregando numeracion*/
                        if (oSettings.tNumbers) {
                            var td = $('<td></td>');         /*se crea la columna*/
                            td.html('<b>' + (num++) + '</b>');
                            td.css('width', '1%');
                            //td.attr('data-render', '0');
                            tr.append(td);                   /*se agrega al <tr>*/
                        }

                        /*agregando acciones al inicio*/
                        if (_private.positionAxion.toLowerCase() === 'first') {
                            tr.append(_private.axionButtons(r, data, oSettings));
                        }

                        /*agregando checkbox al inicio*/
                        if (oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object) {
                            var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'first';
                            if (pos.toLowerCase() === 'first') {
                                tr.append(_private.createCheckbox(oSettings, data, r));        /*se agrega al <tr>*/
                                chkExist = 1;
                            }
                        }

                        /*agregando radio al inicio*/
                        if (oSettings.sRadio !== undefined && oSettings.sRadio instanceof Object) {
                            var pos = (oSettings.sRadio.position !== undefined) ? oSettings.sRadio.position : 'first';
                            if (pos.toLowerCase() === 'first') {
                                tr.append(_private.createRadio(oSettings, data, r));        /*se agrega al <tr>*/
                                rdExist = 1;
                            }
                        }


                        /*recorrido de columnas configuradas en js*/
                        $.each(oSettings.tColumns, function (c, v) {
                            var td = $('<td></td>');         /*se crea la columna*/
                            var width = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                            var valign = (oSettings.tColumns[c].valign !== undefined && oSettings.tColumns[c].valign) ? oSettings.tColumns[c].valign : '';
                            var klass = (oSettings.tColumns[c].class !== undefined) ? oSettings.tColumns[c].class : '';     /*clase css para <td>*/
                            var field = (oSettings.tColumns[c].field !== undefined) ? Tools.htmlEntities(data[r][oSettings.tColumns[c].field]) : '[field] no definido.';
                            var kfield = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '[field] no definido.';
                            var fnCallback = (oSettings.tColumns[c].fnCallback !== undefined) ? oSettings.tColumns[c].fnCallback : '';     /*closure css para <td>*/
                            var totalColumn = (oSettings.tColumns[c].totalColumn !== undefined && oSettings.tColumns[c].totalColumn) ? oSettings.tColumns[c].totalColumn : false;
                            var number = (oSettings.tColumns[c].number !== undefined) ? oSettings.tColumns[c].number : false;

                            /*parametros para ajax*/
                            var ajax = (oSettings.tColumns[c].ajax !== undefined) ? oSettings.tColumns[c].ajax : '';       /*ajax para <td>*/
                            var fn = '';
                            var flag = '';
                            var clientParams = '';
                            var serverParams = '';

                            if (ajax) {
                                fn = (ajax.fn !== undefined) ? ajax.fn : '';                      /*funcion ajax*/
                                flag = (ajax.flag !== undefined) ? ajax.flag : '';                  /*flag de la funcion*/
                                clientParams = (ajax.clientParams !== undefined) ? ajax.clientParams : '';  /*parametros desde el cliente*/
                                serverParams = (ajax.serverParams !== undefined) ? ajax.serverParams : '';  /*parametros desde el servidor*/
                            }

                            var texto = (number) ? Tools.formatNumber(field) : field; //dar formato de numero

                            /*verificar si columna tendra total*/
                            if (totalColumn) {
                                _private.isTotalizer = true;
                                if (_private.totalizerColumn[kfield] === undefined) {
                                    _private.totalizerColumn[kfield] = parseFloat(field);
                                } else {
                                    _private.totalizerColumn[kfield] += parseFloat(field);
                                }
                            }

                            /*agregando ajax*/
                            if (fn) {
                                var xparams = '';

                                /*validar flag para agregar como parametro*/
                                if (flag) {
                                    xparams = flag + ',';
                                }
                                /*parametros de servidor*/
                                xparams += _private.paramServer(serverParams, data[r]);
                                /*parametros de cliente*/
                                xparams += _private.paramClient(clientParams);

                                xparams = xparams.substring(0, xparams.length - 1);
                                fn = fn + '(' + xparams + ')';
                                texto = $('<a></a>');
                                texto.attr('href', 'javascript:;');
                                texto.html((number) ? Tools.formatNumber(field) : field); //dar formato de numero
                                texto.attr('onclick', fn);
                            }
                            td.html(texto);                         /*contenido original de <td>*/
                            td.attr('class', klass);                /*agregado class css*/
                            td.addClass('col_' + kfield);             /*para tShowHideColumn*/
                            /*verificar si se ordena para marcar*/
                            var classort = _private.cebraCol(c, oSettings, oSettings.tColumns[c].field, r);

                            td.addClass(classort);

                            td.attr({width: width});
                            td.css({'vertical-align': valign});
                            /*verificar si tiene fnCallback configurado*/
                            if (fnCallback !== undefined && fnCallback instanceof Object) {
                                var call = fnCallback(r, data[r], oSettings.tSendJSON);       /*se ejecuta fnCallback*/
                                if (!call) {
                                    //call es false, <td> sigue con su contenido original
                                } else {
                                    td.html(call);  /*se carga return de call*/
                                }
                            }

                            tr.append(td);                          /*se agrega al <tr>*/
                        });

                        //callback para tr
                        if (fnCallbackRow !== undefined && fnCallbackRow instanceof Object) {
                            fnCallbackRow(r, data[r], tr);
                        }

                        /*agregando radio al final*/
                        if (oSettings.sRadio !== undefined && oSettings.sRadio instanceof Object && rdExist === 0) {
                            var pos = (oSettings.sRadio.position !== undefined) ? oSettings.sRadio.position : 'last';
                            if (pos.toLowerCase() === 'last') {
                                tr.append(_private.createRadio(oSettings, data, r));        /*se agrega al <tr>*/
                            }
                        }

                        /*agregando checkbox al final*/
                        if (oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object && chkExist === 0) {
                            var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'last';
                            if (pos.toLowerCase() === 'last') {
                                tr.append(_private.createCheckbox(oSettings, data, r));        /*se agrega al <tr>*/
                            }
                        }

                        /*agregando acciones al final*/
                        if (_private.positionAxion.toLowerCase() === 'last') {
                            tr.append(_private.axionButtons(r, data, oSettings));
                        }

                        $('#tbody_' + oSettings.tObjectTable).append(tr);
                    });
                } else {
                    var col = $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(0)').find('th').length;



                    var tr = $('<tr></tr>');        /*se crea el tr*/
                    var td = $('<td></td>');         /*se crea la columna*/
                    td.attr('colspan', col);
                    td.html('<div class="alert alert-info text-center"><i class="fa fa-info"></i> ' + oSettings.tMsnNoData + '<div>');

                    tr.html(td);                                    /*se agrega al <tr>*/
                    $('#tbody_' + oSettings.tObjectTable).html(tr);
                }

                /*ejecutar totalizadores por columna*/
                if (_private.isTotalizer) {
                    _private.exeTotalizer(oSettings);
                }
            };

            _private.exeTotalizer = function (oSettings) {
                var colspanTT = 0;
                /*agregando numeracion*/
                if (oSettings.tNumbers) {
                    colspanTT++;
                }

                /*si tiene acciones al inicio se suma 1*/
                if (_private.positionAxion.toLowerCase() === 'first' && (oSettings.sAxions.group != undefined && oSettings.sAxions.group.length > 0)) {
                    colspanTT++;
                }

                /*agregando checkbox al inicio*/
                if (oSettings.sCheckbox !== undefined && oSettings.sCheckbox instanceof Object) {
                    var pos = (oSettings.sCheckbox.position !== undefined) ? oSettings.sCheckbox.position : 'first';
                    if (pos.toLowerCase() === 'first') {
                        colspanTT++;
                    }
                }



                $('#totalizer_tab_' + oSettings.tObjectTable).remove();        /*remover <table> para nueva data*/

//                var df  = $('<div></div>');
//                df.attr('id','totalizer_'+oSettings.tObjectTable);
//                df.attr('class','dt-toolbar-footer');

                /*creando tabla para totalizadores*/
                var ttz = $('<table></table>');
                ttz.attr({
                    id: 'totalizer_tab_' + oSettings.tObjectTable,
                    class: 'table table-striped table-hover table-condensed dataTable table-bordered dataGrid'
                });

                /*<tr>*/
                var trz = $('<tr></tr>');

                /*<td> para TOTAL*/
                var tdz = $('<td></td>');
                tdz.attr({
                    colspan: colspanTT,
                    class: 'text-right'
                });
                tdz.html('<b>Total:</b>');

                trz.append(tdz);

                /*agregar columnas dinamicas*/
                var data = oSettings.sData;

                /*verificar q tenga data*/
                if (data.length) {
                    /*recorrido de columnas configuradas en js*/
                    $.each(oSettings.tColumns, function (c, v) {
                        var td = $('<td></td>');         /*se crea la columna*/
                        var width = (oSettings.tColumns[c].width !== undefined) ? oSettings.tColumns[c].width + oSettings.tWidthFormat : '';
                        var valign = (oSettings.tColumns[c].valign !== undefined && oSettings.tColumns[c].valign) ? oSettings.tColumns[c].valign : '';
                        var klass = (oSettings.tColumns[c].class !== undefined) ? oSettings.tColumns[c].class : '';     /*clase css para <td>*/
                        var kfield = (oSettings.tColumns[c].field !== undefined) ? oSettings.tColumns[c].field : '[field] no definido.';
                        var totalColumn = (oSettings.tColumns[c].totalColumn !== undefined && oSettings.tColumns[c].totalColumn) ? oSettings.tColumns[c].totalColumn : false;

                        if (totalColumn) {
                            td.html('<b>' + Tools.formatNumber(_private.totalizerColumn[kfield]) + '</b>');
                        } else {
                            td.html('&nbsp;');
                        }

                        td.attr('class', klass);                /*agregado class css*/

                        trz.append(td);
                    });
                }

                /*agregando <tr> a tabla*/
                // ttz.append(trz);

//                df.append(ttz);

                /*agregando div a container*/
                $('#' + oSettings.tObjectTable).find('tbody').append(trz);
            };

            /*
             * Elimina las columnas que no forman parte de las que son dinamicas - OJO: el tope es 5, 
             * si llega a crecer modificar el valor de tPivoteColumn
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.dynamicCols = function (oSettings) {
                var numColsGrid = $('#' + oSettings.tObjectTable).find('tbody').find('tr:eq(0)').find('td').length;

                if (oSettings.tDynamicCols) {

                    var colsDelete = (oSettings.sData[0] === undefined) ? 0 : oSettings.tPivoteColumn - oSettings.sData[0].totalreg;

                    var i = numColsGrid - 1;
                    var x = 0;
                    for (i; i > colsDelete; i--) {
                        x++;
                        /*eliminando las columnas del <thead>*/
                        $('#' + oSettings.tObjectTable).find('thead').find('tr').each(function () {
                            $(this).find('th').each(function (index) {
                                if (i == index) {
                                    $(this).remove();
                                }
                            });
                        });

                        /*eliminando las columnas del <tbody>*/
                        $('#' + oSettings.tObjectTable).find('tbody').find('tr').each(function (iindex) {
                            $(this).find('td').each(function (index) {
                                if (i == index) {
                                    $(this).remove();
                                }

                                /*reemplazando titulos de cabeceras dinamicas*/
                                if (x === 1 && iindex === 1) {
                                    /*para detectar si ya se reemlazo los titulos*/
                                    var nore = $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(0)').find('th').eq(index).hasClass('no_replace');

                                    if ($(this).hasClass(_private.cssReplaceTilteDynamic) && !nore) {
                                        /*obteniendo nombre de campo DB*/
                                        var fieldDB = $.trim($('#' + oSettings.tObjectTable).find('thead').find('tr:eq(0)').find('th').eq(index).text());

                                        /*obteniendo contenido de campo DB*/
                                        var newField = eval('oSettings.sData[0].' + fieldDB);

                                        /*asignando titulo obtenido desde la DB*/
                                        $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(0)').find('th').eq(index).text(Tools.toPascalCase(newField));

                                        /*eliminar clase replace*/
                                        $('#' + oSettings.tObjectTable).find('thead').find('tr:eq(0)').find('th').eq(index).addClass('no_replace');
                                    }
                                }
                            });
                        });
                    }

                }
            };

            return this.each(function () {

                var oSettings = options;
                /*generando id de tabla*/
                oSettings.tObjectTable = oSettings.tObjectContainer + '_tab';

                $.method = {

                    /*
                     * Marcar / Desmarcar los checks de grid
                     * @param {type} el
                     * @param {type} tab
                     */
                    checkAll: function (el, tab) {
                        $(tab).find('tbody').find('tr').each(function () {
                            if ($(el).is(':checked')) {
                                if (!$(this).find('.chkG').is(':checked')) {
                                    $(this).find('.chkG').click();
                                }
                            } else {
                                if ($(this).find('.chkG').is(':checked')) {
                                    $(this).find('.chkG').click();
                                }
                            }
                        });
                    },

                    /*
                     * Evento para cbChange
                     * @param {type} oSettings
                     */
                    cbChange: function (oSettings) {
                        oSettings.pDisplayStart = (_private.sgbd == 'mysql') ? 0 : 1;
                        oSettings.pDisplayLength = $('#' + oSettings.tObjectTable + '_cbLength').val();
                        oSettings.pFilterCols = _private.prepareFilters(oSettings);
                        $.method.sendAjax(oSettings);
                    },

                    /*
                     * Inicia el dataGrid
                     */
                    ini: function () {
                        var params = _private.serialize();

                        /*agregando botones*/
                        _private.addTopButtons(oSettings, params);

                        /*la tabla*/
                        _private.table(oSettings);

                        /*la cabecera*/
                        _private.theader(oSettings);

                        /*el body de la tabla*/
                        _private.tbody(oSettings);

                        /*el pie*/
                        _private.tfoot(oSettings);

                        /*se valida se data sera via ajax*/
                        if (oSettings.ajaxSource) {
                            this.sendAjax(oSettings);
                        }

                        /*para ocultar filtros avanzados al dar click en document*/
                        if (FIELDS.length) {
                            $(document).click(function (a) {
                                $.each(FIELDS, function (i, v) {
                                    var filterParent = $(a.target).parent().attr('data-filter');    /*cuando es un date*/
                                    if (FIELDS[i] !== $(a.target).attr('data-filter') && FIELDS[i] !== filterParent && FIELDS[i]) {
                                        $('#cont_filter_' + oSettings.tObjectTable + '_' + FIELDS[i]).css({display: 'none'});
                                    }
                                });

                                if ($(a.target).attr('data-filter') !== 'hs_cols') {
                                    $('#contvo_' + oSettings.tObjectTable).css({display: 'none'});
                                }
                            });
                        }
                        /*agregando borde a div contenedor de grid core-bordercccccc, cuandosea un modal*/
                        if ($('#' + oSettings.tObjectContainer).parent().prop('tagName') === 'SECTION') {
                            $('#' + oSettings.tObjectContainer).addClass('core-bordercccccc');
                        }
                    },

                    /*
                     * Se realiza la consulta via Ajax
                     */
                    sendAjax: function (oSettings) {
                        /*inica efecto loading*/
                        _private.iniLoading(oSettings);

                        var limit0 = _private.limitInferior(oSettings);

                        /*Verificamos si se enviara parametros al server*/
                        if (oSettings.fnServerParams !== undefined) {
                            oSettings.fnServerParams(_private.aData);
                        }

                        var filters = (oSettings.pFilterCols !== undefined) ? Tools.e(oSettings.pFilterCols) : '';

                        /*Enviamos datos de paginacion*/
                        _private.aData.push({name: 'pDisplayStart', value: limit0});
                        _private.aData.push({name: 'pDisplayLength', value: oSettings.pDisplayLength});
                        _private.aData.push({name: 'pOrder', value: oSettings.pOrderField});
                        _private.aData.push({name: 'pFilterCols', value: filters});

                        var datosx = _private.serialize();

                        $.ajax({
                            type: "POST",
                            data: datosx,
                            url: oSettings.ajaxSource,
                            dataType: 'json',
                            success: function (data) {
                                /*validar error del SP*/
                                if (data.length > 0 || data.error !== undefined) {
                                    /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
                                    if (data instanceof Object === false || data.error !== undefined) {
                                        var msn = data;
                                        if (data.error !== undefined) {
                                            msn = data.error;
                                        }
                                        Tools.notify().error({
                                            content: msn
                                        });
                                    }
                                }

                                oSettings.pFilterCols = '';
                                oSettings.sData = (data.length > 0) ? data : [];

                                /*generar registros*/
                                _private.records(oSettings);

                                /*generar paginacion*/
                                _private.paginate(oSettings);

                                /*se ejecuta callback*/
                                if (oSettings.fnCallback !== undefined) {//si existe callback
                                    var callback = oSettings.fnCallback;
                                    callback(oSettings);
                                }

                                /*finaliza efecto loading*/
                                _private.endLoading(oSettings);

                                /*oculto lo eventos de la grilla: button, a, chk_all*/
                                Tools.removeAttr().click({
                                    container: "#" + oSettings.tObjectTable,
                                    typeElement: "button, a, span, #" + oSettings.tObjectTable + "_chkall_0 input:checkbox"
                                });

                                Tools.removeAttr().click({
                                    container: "#" + oSettings.tObjectContainer,
                                    typeElement: "button, a"
                                });

                                /*ejecutar el scroll
                                 * al aplicar setTimeout, el grid se distorciona (cuando no se ejecuta en un modal),
                                 * pero se hizo esto porque el grid cuando se ejecuta en un modal no fncionaba bien el scrool
                                 */
                                var inModal = $("#" + oSettings.tObjectTable).parents('form.modal');
                                if (inModal.length > 0) { /*grid esta dentro de un modal*/
                                    setTimeout(function () {
                                        _private.exeScroll(oSettings);
                                    }, 100);
                                } else {
                                    if (parseInt(oSettings.sData.length) > 0) {
                                        _private.exeScroll(oSettings);
                                    } else {
                                        $('#' + oSettings.tObjectContainer).find('.rwspn').remove();
                                    }
                                }
                            }
                        });

                    }

                };

                $.method.ini();

            });

        }

    });

})(jQuery);