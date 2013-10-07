
var hasDB = false;
var lista1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var lista2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var lista3 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
function getDB() {
    var db = openDatabase('mydbp', '1.0', 'MiDiabetrics', 3 * 1024 * 1024);
    if (!db) {
        alert("Ocurrio un error al crear la base de datos");
        return false;
    }
    if (db != false) {
        db.transaction(
            function (tx) {
                //sql =
                //    'drop table PatientProfile';
                //tx.executeSql(sql, [], onSuccessExecuteSql, onError);
                sql =
                    'CREATE TABLE IF NOT EXISTS MResult (' +
                    'MR_AutoID	integer PRIMARY KEY AUTOINCREMENT NOT NULL,' +
                    'MR_Date	datetime,' +
                    'MR_Time	datetime,' +
                    'MR_Slot	integer,' +
                    'MR_Type	integer NOT NULL,' +
                    'MR_Value1	float,' +
                    'MR_Note	varchar(250) COLLATE NOCASE' +
                    ')';
                tx.executeSql(sql, [], onSuccessExecuteSql, onError);
                sql =
                    'CREATE TABLE IF NOT EXISTS PatientProfile (' +
                    'PP_AutoID              varchar(40),' +
                    'PP_Name	            nvarchar(50),' +
                    'PP_Birthday	        datetime,' +
                    'PP_Sex	                char(1) ,' +
                    'PP_Height	            float,' +
                    'PP_Weight	            float,' +
                    "PP_GetUpTime	        datetime default '06:00'," +
                    "PP_BreakfastTime	    datetime default '08:00'," +
                    "PP_LunchTime	        datetime default '12:00'," +
                    "PP_DinnerTime	        datetime default '18:00'," +
                    "PP_SleepTime	        datetime default '22:00'," +
                    'PP_BGPrescribedFreq    int,' +
                    'PP_DType               int)';
                tx.executeSql(sql);

                sql =
                    'CREATE TABLE IF NOT EXISTS PatientTarget (' +
                    'PT_TargetType	integer NOT NULL,' +
                    'PT_Target1_U	float,' +
                    'PT_Target1_L	float,' +
                    'PT_Target2_U	float,' +
                    'PT_Target2_L	float,' +
                    'PT_Target3_U	float,' +
                    'PT_Target3_L	float,' +
                    'PT_Target4_U	float,' +
                    'PT_Target4_L	float,' +
                    'PT_Target5_U	float,' +
                    'PT_Target5_L	float,' +
                    'PRIMARY KEY (PT_TargetType))';
                tx.executeSql(sql);
            }, onError, onReadyTransaction);
    }
    return db;
}
function createDB() {
    var db = getDB();
    if (db != false) {
        db.transaction(
            function (tx) {
                sql =
                    'CREATE TABLE IF NOT EXISTS MResult (' +
                    'MR_AutoID	integer PRIMARY KEY AUTOINCREMENT NOT NULL,' +
                    'MR_Date	datetime,' +
                    'MR_Time	datetime,' +
                    'MR_Slot	integer,' +
                    'MR_Type	integer NOT NULL,' +
                    'MR_Value1	float,' +
                    'MR_Note	nvarchar(200) COLLATE NOCASE' +
                    ')';
                tx.executeSql(sql, [], onSuccessExecuteSql, onError);
                sql =
                    'CREATE TABLE IF NOT EXISTS PatientProfile (' +
                    'PP_Name	        nvarchar(50),' +
                    'PP_Birthday	    datetime,' +
                    'PP_Sex	            char(1) ,' +
                    'PP_Height	        float,' +
                    'PP_Weight	        float,' +
                    'PP_GetUpTime	    datetime,' +
                    'PP_BreakfastTime	datetime,' +
                    'PP_LunchTime	    datetime,' +
                    'PP_DinnerTime	    datetime,' +
                    'PP_SleepTime	    datetime, ' +
                    'PP_DiabetesType int)';
                tx.executeSql(sql);
                sql =
                    'CREATE TABLE IF NOT EXISTS PatientSlot (' +
                    'PS_SlotType	integer NOT NULL,' +
                    'PS_Time1	    datetime,' +
                    'PS_Time2	    datetime,' +
                    'PS_Time3	    datetime,' +
                    'PS_Time4	    datetime,' +
                    'PS_Time5	    datetime,' +
                    'PS_Time6	    datetime,' +
                    'PS_Time7	    datetime,' +
                    'PS_Time8	    datetime,' +
                    'PS_Time9	    datetime,' +
                    'PRIMARY KEY (PS_SlotType))';
                tx.executeSql(sql);
                sql =
                    'CREATE TABLE IF NOT EXISTS PatientTarget (' +
                    'PT_TargetType	integer NOT NULL,' +
                    'PT_SlotType	integer NOT NULL,' +
                    'PT_Target_U	float,' +
                    'PT_Target_L	float,' +
                    'PRIMARY KEY (PT_SlotType, PT_TargetType))';
                tx.executeSql(sql);
            }, onError, onReadyTransaction);
    }
}

function insertPatientProfile(Datos) {
    try {
        var db = getDB();
        db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM PatientProfile", [],
                    function (tx, results) {
                        if (results.rows.length == 0) {
                            db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        'INSERT INTO PatientProfile(' +
                                        'PP_Name,' +
                                        'PP_Birthday,' +
                                        'PP_Sex,' +
                                        'PP_Height,' +
                                        'PP_Weight,' +
                                        'PP_BGPrescribedFreq,' +
                                        'PP_DType' +
                                        ') VALUES (?,?,?,?,?,?,?)',
                                        [
                                            Datos.PP_Name,
                                            Datos.PP_Birthday,
                                             Datos.PP_Sex,
                                             Datos.PP_Height,
                                             Datos.PP_Weight,
                                             Datos.PP_BGPrescribedFreq,
                                             Datos.PP_DType
                                        ],
                                         function (tx, result) {
                                             console.log("Paciente creado localmente");
                                             localStorage.setItem('Estado', 'Creado');
                                             if (hasDB && localStorage["EULA"]) {
                                                 $.ajax({
                                                     type: "POST",
                                                     url: "Middle/AjaxBridge.aspx/regPatient",
                                                     contentType: "application/json; charset=utf-8",
                                                     dataType: "json",
                                                     data: "{ 'dato': " + JSON.stringify(Datos) + " }",
                                                     success: function (data) {
                                                         db.transaction(
                                                             function (tx2) {
                                                                 tx2.executeSql("UPDATE PatientProfile SET PP_AutoID = ?", [data.d.PID],
                                                                     function (tx, result) {
                                                                         localStorage["PID"] = data.d.PID;
                                                                         localStorage["Estado"] = "Creado";
                                                                         window.location = "RegHabitos.aspx";
                                                                     });
                                                             });
                                                     },

                                                 });
                                             } else {
                                                 window.location = "RegHabitos.html";
                                             }

                                         })
                                }, onError, onReadyTransaction);
                        } else {
                            db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        'UPDATE PatientProfile SET ' +
                                        'PP_Name=?,' +
                                        'PP_Birthday=?,' +
                                        'PP_Sex=?,' +
                                        'PP_Height=?,' +
                                        'PP_Weight=?,' +
                                        'PP_BGPrescribedFreq = ?,' +
                                        'PP_DType= ?',
                                        [
                                            Datos.PP_Name,
                                            Datos.PP_Birthday,
                                            Datos.PP_Sex,
                                            Datos.PP_Height,
                                            Datos.PP_Weight,
                                            Datos.PP_BGPrescribedFreq,
                                            Datos.PP_DType
                                        ],
                                         function (tx, result) {
                                             console.log("Paciente Actualizado Localmente");
                                             Datos.PP_AutoID = results.rows.item(0).PP_AutoID;
                                             if (hasDB && localStorage["EULA"]) {
                                                 $.ajax({
                                                     type: "POST",
                                                     url: "Middle/AjaxBridge.aspx/updPatient",
                                                     contentType: "application/json; charset=utf-8",
                                                     dataType: "json",
                                                     data: "{ 'dato': " + JSON.stringify(Datos) + " }",
                                                     success: function (data) {
                                                         window.location = "RegHabitos.html";
                                                     },

                                                 });
                                             } else {
                                                 window.location = "RegHabitos.html";
                                             }

                                         })
                                }, onError, onReadyTransaction);
                        }
                    });
            });
    } catch (e) {
        console.log(e.message);
    }
}
function insertPatientPesoAltura(Datos) {
    Datos.PP_AutoID = localStorage["PID"];
    var db = getDB();
    if (db != false) {
        db.transaction(
            function (tx) {
                tx.executeSql(
                    'UPDATE PatientProfile SET ' +
                    ' PP_Height = ?, ' +
                    ' PP_Weight = ? ' +
                    'Where PP_AutoID = ?',
                    [
                        Datos.PP_Height,
                        Datos.PP_Weight,
                        Datos.PP_AutoID
                    ],
                    function (tx, result) {
                        console.log("Paciente actualizado");
                        var Test = new Object;
                        Test.MR_Slot = "";
                        Test.MR_Value1 = Datos.PP_Weight;
                        Test.MR_Date = new Date().toJSON().substring(0, 10);
                        Test.MR_Time = new Date().toLocaleTimeString();
                        Test.MR_Note = "";
                        Test.MR_Type = 2;
                        insertGSResult(Test);
                    },
                    onError);
            });
    }
}
function insertPatientHabitos(Datos) {
    Datos.PP_AutoID = localStorage["PID"];
    var db = getDB();
    if (db != false) {
        db.transaction(
            function (tx) {
                tx.executeSql(
                    'UPDATE PatientProfile SET ' +
                    'PP_GetUpTime=?,' +
                    'PP_BreakfastTime=?,' +
                    'PP_LunchTime=?,' +
                    'PP_DinnerTime=?,' +
                    'PP_SleepTime=?',
                    [
                        Datos.PP_GetUpTime,
                        Datos.PP_BreakfastTime,
                        Datos.PP_LunchTime,
                        Datos.PP_DinnerTime,
                        Datos.PP_SleepTime
                    ],
                    function (tx, result) {
                        console.log("Paciente creado con Habitos");
                        localStorage.setItem('Estado', 'hasHabitos');
                        if (hasDB && localStorage["EULA"]) {
                            $.ajax({
                                type: "POST",
                                url: "Middle/AjaxBridge.aspx/regPatientHabitos",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: "{ 'dato': " + JSON.stringify(Datos) + " }",
                                success: function (data) {
                                    window.location = "RegObjetivos.html";
                                },

                            });
                        } else {
                            window.location = "RegObjetivos.html";
                        }
                    },
                    onError);
            },
            onError,
            onReadyTransaction);
    }
}
function insertPatientObjetivos(Datos) {
    var db = getDB();
    var sql = "";
    db.transaction(
        function (tx) {
            tx.executeSql(
                "SELECT * FROM PatientTarget WHERE PT_TargetType = ?", [Datos.PT_TargetType],
                function (tx, results) {
                    if (results.rows.length == 0) {
                        db.transaction(
                            function (tx) {
                                sql = "INSERT INTO PatientTarget VALUES(?,?,?,?,?,?,?,?,?,?,?)";
                                tx.executeSql(
                                    sql,
                                    [
                                        Datos.PT_TargetType,
                                        Datos.PT_Target1_U,
                                        Datos.PT_Target1_L,
                                        Datos.PT_Target2_U,
                                        Datos.PT_Target2_L,
                                        Datos.PT_Target3_U,
                                        Datos.PT_Target3_L,
                                        Datos.PT_Target4_U,
                                        Datos.PT_Target4_L,
                                        Datos.PT_Target5_U,
                                        Datos.PT_Target5_L
                                    ],
                                     function (tx, result) {
                                         console.log("Objetivos del Paciente creados localmente");
                                         localStorage.setItem('Estado', 'hasTargets');
                                         Datos.PT_PAID = localStorage["PID"];
                                         if (hasDB && localStorage["EULA"]) {
                                             $.ajax({
                                                 type: "POST",
                                                 url: "Middle/AjaxBridge.aspx/regPatientTarget",
                                                 contentType: "application/json; charset=utf-8",
                                                 dataType: "json",
                                                 data: "{ 'dato': " + JSON.stringify(Datos) + " }",
                                                 success: function (data) {
                                                     window.location = "GS.html";
                                                 },
                                             });
                                         } else {
                                             window.location = "GS.html";
                                         }
                                     })
                            }, onError, onReadyTransaction);
                    } else {
                        db.transaction(
                            function (tx) {
                                sql =
                               "UPDATE PatientTarget SET " +
                               "PT_Target1_U= ?, " +
                               "PT_Target1_L= ?, " +
                               "PT_Target2_U= ?, " +
                               "PT_Target2_L= ?, " +
                               "PT_Target3_U= ?, " +
                               "PT_Target3_L= ?, " +
                               "PT_Target4_U= ?, " +
                               "PT_Target4_L= ?, " +
                               "PT_Target5_U= ?, " +
                               "PT_Target5_L= ?  " +
                               "WHERE PT_TargetType = ?";
                                tx.executeSql(sql,
                                    [
                                        Datos.PT_Target1_U,
                                        Datos.PT_Target1_L,
                                        Datos.PT_Target2_U,
                                        Datos.PT_Target2_L,
                                        Datos.PT_Target3_U,
                                        Datos.PT_Target3_L,
                                        Datos.PT_Target4_U,
                                        Datos.PT_Target4_L,
                                        Datos.PT_Target5_U,
                                        Datos.PT_Target5_L,
                                        Datos.PT_TargetType
                                    ],
                                     function (tx, result) {
                                         console.log("Objetivos del Paciente Actualizado Localmente");
                                         Datos.PT_PAID = localStorage["PID"];
                                         if (hasDB && localStorage["EULA"]) {
                                             $.ajax({
                                                 type: "POST",
                                                 url: "Middle/AjaxBridge.html/updPatientTarget",
                                                 contentType: "application/json; charset=utf-8",
                                                 dataType: "json",
                                                 data: "{ 'dato': " + JSON.stringify(Datos) + " }",
                                                 success: function (data) {
                                                     window.location = "GS.html";
                                                 },

                                             });
                                         } else {
                                             window.location = "GS.html";
                                         }

                                     })
                            }, onError, onReadyTransaction);
                    }
                });
        });
}
function insertGSResult(Datos) {
    var db = getDB();
    var sql = "";
    db.transaction(
        function (tx) {
            sql =
                'INSERT INTO MResult(' +
                 'MR_Date,' +
                 'MR_Time,' +
                 'MR_Slot,' +
                 'MR_Type,' +
                 'MR_Value1,' +
                 'MR_Note' +
                 ') VALUES (?,?,?,?,?,?)';
            tx.executeSql(
             sql, [Datos.MR_Date, Datos.MR_Time, Datos.MR_Slot, Datos.MR_Type, Datos.MR_Value1, Datos.MR_Note],
             function (tx, result) {
                 console.log("Datos de Glucosa Ingresados");
                 if (hasDB && localStorage["EULA"]) {
                     Datos.MR_PAID = localStorage["PID"];
                     $.ajax({
                         type: "POST",
                         url: "Middle/AjaxBridge.aspx/regGSResult",
                         contentType: "application/json; charset=utf-8",
                         dataType: "json",
                         data: "{ 'dato': " + JSON.stringify(Datos) + " }",
                         success: function (data) {
                             window.location = "GS.html";
                         },

                     });
                 } else {
                     if(Datos.MR_Type == 1)
                         window.location = "GS.html";
                     if(Datos.MR_Type == 2)
                         window.location = "Peso.html";

                 }
             },
             function (err) {
                 console.log(err);
                 alert("Ocurrio un error intentelo nuevamente - GSInsert");
                 return false;
             })
        },
        onReadyTransaction,
        onError);
}
function queryPatientProfile() {
    var db = getDB();
    db.transaction(function (tx) {
        tx.executeSql(
            "SELECT * FROM PatientProfile", [],
            function (tx, results) {
                if (results.rows.length > 0) {
                    var Dato = new Object;
                    Dato.PP_Name =
                    results.rows.item(0).PP_Name;
                    Dato.PP_Birthday =
                    results.rows.item(0).PP_Birthday;
                    Dato.PP_Sex =
                    results.rows.item(0).PP_Sex;
                    Dato.PP_Height =
                    results.rows.item(0).PP_Height;
                    Dato.PP_Weight =
                    results.rows.item(0).PP_Weight;
                    Dato.PP_GetUpTime =
                    results.rows.item(0).PP_GetUpTime;
                    Dato.PP_BreakfastTime =
                    results.rows.item(0).PP_BreakfastTime;
                    Dato.PP_LunchTime =
                    results.rows.item(0).PP_LunchTime;
                    Dato.PP_DinnerTime =
                    results.rows.item(0).PP_DinnerTime;
                    Dato.PP_SleepTime =
                    results.rows.item(0).PP_SleepTime;
                    return Dato;
                }
                return null;
            }, onError);
    });
}

function queryPatientProfileReg() {
    var db = getDB();
    db.transaction(function (tx) {
        tx.executeSql(
            "SELECT * FROM PatientProfile", [],
            function (tx, results) {
                if (results.rows.length > 0) {
                    var Dato = new Object;
                    Dato.PP_Name =
                    results.rows.item(0).PP_Name;
                    Dato.PP_Birthday =
                    results.rows.item(0).PP_Birthday;
                    Dato.PP_Sex =
                    results.rows.item(0).PP_Sex;
                    Dato.PP_Height =
                    results.rows.item(0).PP_Height;
                    Dato.PP_Weight =
                    results.rows.item(0).PP_Weight;
                    $("#NAME").val(Dato.PP_Name);
                    $("#BIRTHDAY").val(Dato.PP_Birthday);
                    $("#HEIGHT").val(Dato.PP_Height).slider('refresh');
                    $("#WEIGHT").val(Dato.PP_Weight).slider('refresh');
                    $("#BGPrescribedFreq").val(results.rows.item(0).PP_BGPrescribedFreq).slider('refresh');
                    $('input:radio[name="DType"]').filter('[value="' + results.rows.item(0).PP_DType + '"]').next().click();
                    $('input:radio[name="SEX"]').filter('[value="' + Dato.PP_Sex + '"]').next().click();

                   
                }
                return null;
            }, onError);
    });
}
function queryPatientIMC() {
    var db = getDB();
    db.transaction(function (tx) {
        tx.executeSql(
            "SELECT PP_HEIGHT,PP_WEIGHT FROM PatientProfile", [],
            function (tx, results) {
                if (results.rows.length > 0) {
                    var Dato = new Object;
                    Dato.PP_Height =
                    results.rows.item(0).PP_Height;
                    Dato.PP_Weight =
                    results.rows.item(0).PP_Weight;
                    $("#Altura").val(Dato.PP_Height).slider('refresh');
                    $("#Peso").val(Dato.PP_Weight).slider('refresh');
                    var imc = Dato.PP_Weight / ((Dato.PP_Height * Dato.PP_Height) / 10000);
                    if (imc >= 40)
                        $("#ImgResultado").animate({ backgroundPosition: '-81px 0px' });
                    else
                        if (imc >= 35 && imc < 40)
                            $("#ImgResultado").animate({ backgroundPosition: '-162px 0px' });
                        else
                            if (imc >= 30 && imc < 35)
                                $("#ImgResultado").animate({ backgroundPosition: '-243px 0px' });
                            else
                                if (imc >= 25 && imc < 30)
                                    $("#ImgResultado").animate({ backgroundPosition: '-324px 0px' });
                                else
                                    if (imc >= 18.5 && imc < 25)
                                        $("#ImgResultado").animate({ backgroundPosition: '-405px 0px' });
                                    else
                                        if (imc >= 17 && imc < 18.5)
                                            $("#ImgResultado").animate({ backgroundPosition: '-486px 0px' });
                                        else
                                            if (imc >= 16 && imc < 17)
                                                $("#ImgResultado").animate({ backgroundPosition: '-567px 0px' });
                                            else
                                                $("#ImgResultado").animate({ backgroundPosition: '-729px 0px' });


                }
                return null;
            }, onError);
    });
}
function queryPatientHabitosReg() {
    var db = getDB();
    db.transaction(function (tx) {
        tx.executeSql(
            "SELECT * FROM PatientProfile", [],
            function (tx, results) {
                if (results.rows.length > 0) {
                    $("#PP_GetUpTime").val(results.rows.item(0).PP_GetUpTime);
                    $("#PP_BreakfastTime").val(results.rows.item(0).PP_BreakfastTime);
                    $("#PP_LunchTime").val(results.rows.item(0).PP_LunchTime);
                    $("#PP_DinnerTime").val(results.rows.item(0).PP_DinnerTime);
                    $("#PP_SleepTime").val(results.rows.item(0).PP_SleepTime);
                }
                return null;
            }, onError);
    });
}
function queryPatientObjetivosReg() {
    var db = getDB();
    db.transaction(function (tx) {
        tx.executeSql(
            "SELECT * FROM PatientTarget", [],
            function (tx, results) {
                if (results.rows.length > 0) {
                    $("#T1_a").val(results.rows.item(0).PT_Target1_U).slider('refresh');
                    $("#T1_b").val(results.rows.item(0).PT_Target1_L).slider('refresh');
                    $("#T2_a").val(results.rows.item(0).PT_Target2_U).slider('refresh');
                    $("#T2_b").val(results.rows.item(0).PT_Target2_L).slider('refresh');
                    $("#T3_a").val(results.rows.item(0).PT_Target3_U).slider('refresh');
                    $("#T3_b").val(results.rows.item(0).PT_Target3_L).slider('refresh');
                    $("#T4_a").val(results.rows.item(0).PT_Target4_U).slider('refresh');
                    $("#T4_b").val(results.rows.item(0).PT_Target4_L).slider('refresh');
                    $("#T5_a").val(results.rows.item(0).PT_Target5_U).slider('refresh');
                    $("#T5_b").val(results.rows.item(0).PT_Target5_L).slider('refresh');
                }
                return null;
            }, onError);
    });
}
function queryResultToday(Type) {
    try{
        var db = getDB();
        localStorage["lista1"] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var ticks = ["Despertar", "Antes Desayuno", "Despues Desayuno", "Antes Almuerzo", "Despues Almuerzo", "Antes Cena", "Despues Cena", "Al Dormir", "Media Noche"];
        var plot4 = $.jqplot('chartdiv', [lista1, lista2, lista3], {
            title: 'Mi grafica de hoy',
            seriesDefaults: {
                showMarker: false,
                pointLabels: {
                    show: true
                }
            },
            series: [
                { label: 'Mis Datos' },
                { label: 'Minimos' },
                { label: 'Maximos' }
            ],
            axes: {
                xaxis:
                    {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            angle: -30,
                            fontSize: '10pt'
                        }
                    }
            },
            legend: {
                show: true,
                location: 'e', placement: 'outsideGrid'
            },
        });
        db.transaction(function (tx) {
            var d = new Date();
            tx.executeSql(
                "SELECT * FROM MREsult Where MR_Type = ? AND MR_Date = ? ",
                [
                    Type,
                    d.toJSON().substring(0, 10)
                ],
                function (tx, results) {
                    var nrows = results.rows.length;
                    if (nrows > 0) {
                        var lista = new Array;
                    
                        for (var i = 0; i < nrows; i++) {
                            lista[results.rows.item(i).MR_Slot] = results.rows.item(i).MR_Value1;
                        }
                        localStorage["lista1"] = [lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9]];
                       
                        plot4.replot({ data: [localStorage["lista1"].split(','), lista2, lista3] });
                    }
                }, onError);
            db.transaction(function (tx) {
                tx.executeSql(
                    "SELECT * FROM PatientTarget Where PT_TargetType = ? ",
                    [
                        Type,
                    ],
                    function (tx, results) {
                        if (results.rows.length > 0) {
                            lista2 =
                                [
                                   results.rows.item(0).PT_Target1_U,
                                   results.rows.item(0).PT_Target2_U,
                                   results.rows.item(0).PT_Target3_U,
                                   results.rows.item(0).PT_Target2_U,
                                   results.rows.item(0).PT_Target3_U,
                                   results.rows.item(0).PT_Target2_U,
                                   results.rows.item(0).PT_Target3_U,
                                   results.rows.item(0).PT_Target4_U,
                                   results.rows.item(0).PT_Target5_U
                                ];
                            lista3 =
                                [
                                    results.rows.item(0).PT_Target1_L,
                                    results.rows.item(0).PT_Target2_L,
                                    results.rows.item(0).PT_Target3_L,
                                    results.rows.item(0).PT_Target2_L,
                                    results.rows.item(0).PT_Target3_L,
                                    results.rows.item(0).PT_Target2_L,
                                    results.rows.item(0).PT_Target3_L,
                                    results.rows.item(0).PT_Target4_L,
                                    results.rows.item(0).PT_Target5_L
                                ];
                            plot4.replot({ data: [localStorage["lista1"].split(','), lista2, lista3] });
                        }

                        //var ctx = document.getElementById("myChart").getContext("2d");
                        //respChart($("#myChart"), data);
                        //legend(document.getElementById("lineLegend"), data);
                        // $.jqplot('chartdiv', [lista1, lista2, lista3]);
                    
                  

                    }, onError);
            });

        });
    } catch (e) {
        console.log(e.message);
    }
}
function queryResultDias(Type,dias) {
    try {
        var db = getDB();
        localStorage["lista1"] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var ticks = ["Despertar", "Antes Desayuno", "Despues Desayuno", "Antes Almuerzo", "Despues Almuerzo", "Antes Cena", "Despues Cena", "Al Dormir", "Media Noche"];
        var plot4 = $.jqplot('chartdiv', [lista1, lista2, lista3], {
            title: 'Mi Grafica en '+dias+' dias',
            seriesDefaults: {
                showMarker: false,
                pointLabels: {
                    show: true
                }
            },
            series: [
                { label: 'Mis Datos' },
                { label: 'Minimos' },
                { label: 'Maximos' }
            ],
            axes: {
                xaxis:
                    {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            angle: -30,
                            fontSize: '10pt'
                        }
                    }
            },
            legend: {
                show: true,
                location: 'e', placement: 'outsideGrid'
            },
        });
        db.transaction(function (tx) {
            var d = new Date();
            var e = new Date().adjustDate(dias*(-1));
            var f = d.toJSON().substring(0, 10);
            var g = e.toJSON().substring(0, 10);
            var sql = "SELECT MR_Slot,AVG(IFNULL(MR_Value1,0)) MR_Value1 FROM MResult WHERE MR_Type = '1' AND MR_Date >= '" + g + "' AND MR_Date <= '" + f + "' GROUP BY MR_Slot ORDER BY MR_Slot ";
            tx.executeSql(
                sql,
                [
                 
                ],
                function (tx, results) {
                    var nrows = results.rows.length;
                    if (nrows > 0) {
                        var lista = new Array;

                        for (var i = 0; i < nrows; i++) {
                            lista[results.rows.item(i).MR_Slot] = results.rows.item(i).MR_Value1;
                        }
                        localStorage["lista1"] = [lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9]];

                        plot4.replot({ data: [localStorage["lista1"].split(','), lista2, lista3] });
                    }
                }, onError);
            db.transaction(function (tx) {
                tx.executeSql(
                    "SELECT * FROM PatientTarget Where PT_TargetType = ? ",
                    [
                        Type,
                    ],
                    function (tx, results) {
                        if (results.rows.length > 0) {
                            lista2 =
                                [
                                   results.rows.item(0).PT_Target1_U,
                                   results.rows.item(0).PT_Target2_U,
                                   results.rows.item(0).PT_Target3_U,
                                   results.rows.item(0).PT_Target2_U,
                                   results.rows.item(0).PT_Target3_U,
                                   results.rows.item(0).PT_Target2_U,
                                   results.rows.item(0).PT_Target3_U,
                                   results.rows.item(0).PT_Target4_U,
                                   results.rows.item(0).PT_Target5_U
                                ];
                            lista3 =
                                [
                                    results.rows.item(0).PT_Target1_L,
                                    results.rows.item(0).PT_Target2_L,
                                    results.rows.item(0).PT_Target3_L,
                                    results.rows.item(0).PT_Target2_L,
                                    results.rows.item(0).PT_Target3_L,
                                    results.rows.item(0).PT_Target2_L,
                                    results.rows.item(0).PT_Target3_L,
                                    results.rows.item(0).PT_Target4_L,
                                    results.rows.item(0).PT_Target5_L
                                ];
                            plot4.replot({ data: [localStorage["lista1"].split(','), lista2, lista3] });
                        }

                        //var ctx = document.getElementById("myChart").getContext("2d");
                        //respChart($("#myChart"), data);
                        //legend(document.getElementById("lineLegend"), data);
                        // $.jqplot('chartdiv', [lista1, lista2, lista3]);



                    }, onError);
            });

        });
    } catch (e) {
        console.log(e.message);
    }
}



function onReadyTransaction() {
    console.log('Transaction completed')
}

function onSuccessExecuteSql(tx, results) {
    console.log('Execute SQL completed')
}

function onError(err) {
    console.log(err)
}

if (!Date.prototype.adjustDate) {
    Date.prototype.adjustDate = function (days) {
        var date;

        days = days || 0;

        if (days === 0) {
            date = new Date(this.getTime());
        } else if (days > 0) {
            date = new Date(this.getTime());

            date.setDate(date.getDate() + days);
        } else {
            date = new Date(
                this.getFullYear(),
                this.getMonth(),
                this.getDate() - Math.abs(days),
                this.getHours(),
                this.getMinutes(),
                this.getSeconds(),
                this.getMilliseconds()
            );
        }

        this.setTime(date.getTime());

        return this;
    };
}