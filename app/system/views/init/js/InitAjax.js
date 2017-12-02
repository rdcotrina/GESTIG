"use strict";
class InitAjax_ extends Ajax_ {

    constructor() {
        super();
        this._controller = 'system/init/';

//        this._fields = {
//            usuario: $('#txtUser'),
//            clave: $('#txtClave')
//        };
    }

    postLogin() {
        _sys_sg = 1;
        super.send({
            token: 1,
            flag: 1,
            element: '#btn_entrar',
            encrypt: true,
            root: this._controller + 'postLogin',
            form: '#formLogin',
            dataAlias: false,
            clear: false,
            serverParams: function(sData){
                sData.push({name: '_ipLocal', value: localStorage.getItem('sys_idLocal')});
            },
            success: function (obj) {
                if (obj.data.result == 1) {
                    localStorage.setItem('__',parseInt(Math.random() * 999999999999999));
                    Tools.notify().ok({
                        content: SYS_LANG_MSN.loginok
                    });
                    location.reload(true);
                } else if (obj.data.result == 2) {
                    $("#main").effect('shake');
                    Tools.notify().error({
                        content: SYS_LANG_MSN.loginfail
                    });
                }
            }
        });
    }
    
    logOut(){
        super.send({
            token: _tk_,
            flag: 1,
            element: '#btn_entrar',
            encrypt: true,
            dataAlias: false,
            root: this._controller + 'logOut',
            clear: false,
            success: function (obj) {
                location.reload(true);
                localStorage.clear();
            }
        });
    }
    
    postChangeRol(idrol){
        super.send({
            token: _tk_,
            gifProcess: true,
            dataAlias: false,
            root: this._controller + 'postChangeRol',
            dataType: 'json',
            serverParams: function(sData){
                sData.push({name: '_idRol', value: idrol});
            },
            success: function (obj) {
                location.reload(true);
            }
        });
    }
    
    postChangeIdiom(elm){ 
        super.send({
            flag: 1,
            token: _tk_,
            gifProcess: true,
            dataAlias: false,
            root: this._controller + 'postChangeIdiom',
            dataType: 'json',
            serverParams: function(sData){ 
                sData.push({name: '_language', value: $(elm).data('lang')});
            },
            success: function (obj) {
                location.reload(true);
            }
        });
    }

    theme_opcion_user(flag){
		
		var valor;
		
		if(flag=='1'){
			valor=$('#smart-fixed-header').prop('checked');
		}else if(flag=='2'){
			valor=$('#smart-fixed-navigation').prop('checked');
		}else if(flag=='3'){
			valor=$('#smart-fixed-ribbon').prop('checked');
		}else if(flag=='4'){
			valor=$('#smart-fixed-footer').prop('checked');
		}else if(flag=='5'){
			valor=$('#smart-fixed-container').prop('checked');
		}else if(flag=='6'){
			valor=$('#smart-rtl').prop('checked');
		}else if(flag=='7'){
			valor=$('#smart-topmenu').prop('checked');
		}else if(flag=='8'){
			valor=$('#colorblind-friendly').prop('checked');
		}else if(flag=='9'){
			valor='';
		}else if(flag=='10'){
			valor='smart-style-1';
			flag='9';
		}else if(flag=='11'){
			valor='smart-style-2';
			flag='9';
		}else if(flag=='12'){
			valor='smart-style-3';
			flag='9';
		}else if(flag=='13'){
			valor='smart-style-4';
			flag='9';
		}else if(flag=='14'){
			valor='smart-style-5';
			flag='9';
		}else if(flag=='15'){
			valor='smart-style-6';
			flag='9';
		}
		
        super.send({
            token: _tk_,
            flag: flag,
            root: this._controller + 'theme_option_user',
            dataAlias: false,
            serverParams: function(sData){
                sData.push({name: 'valor', value: valor});

            }
        });



    }
    
}

