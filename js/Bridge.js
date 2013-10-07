function queryServerPatientProfileReg() {
    var ServerPatient = localStorage["ServerPatient"];
    if (ServerPatient == null) {

    } else {
        $.ajax({
            url: "AjaxBridge.aspx?queryServerPatientProfileReg",
            type: "POST",
            data: "{'PID':'" + "" + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

            }
        });
    }
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
                    $("input[name='SEX']")
                    $("#HEIGHT").val(Dato.PP_Height);
                    $("#WEIGHT").val(Dato.PP_Weight);
                }
                return null;
            }, onError);
    });
}