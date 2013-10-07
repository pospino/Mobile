function Calcular(Genero) {
	var A = parseFloat($("#" + Genero + " input[name='PP_A']:checked").val());
	var C = parseFloat($("#" + Genero + " input[name='PP_C']:checked").val());
	var D = parseFloat($("#" + Genero + " input[name='PP_D']:checked").val());
	var E = parseFloat($("#" + Genero + " input[name='PP_E']:checked").val());
	var F = parseFloat($("#" + Genero + " input[name='PP_F']:checked").val());
	var G = parseFloat($("#" + Genero + " input[name='PP_G']:checked").val());
	var H = parseFloat($("#" + Genero + " input[name='PP_H']:checked").val());

	var B1 = parseFloat($("#" + Genero + " input[name='PP_B1']").val());
	var B2 = parseFloat($("#" + Genero + " input[name='PP_B2']").val()) / 100;
	var B = B1 / (B2 * B2);

	if (!isNaN(B)) {

		$("#" + Genero + " #PP_B").val(B);
		var MB = "";
		if (B < 18.5)
			MB = "Infrapeso";
		else if (B > 18.5 && B < 25)
			MB = "Normal";
		else if (B >= 25 && B < 30)
			MB = "Sobrepeso";
		else
			MB = "Obeso";
		$("#" + Genero + " #MB").text(MB);

	}

	if (B < 25)
		B = 0;
	else if (B >= 25 && B < 30)
		B = 1;
	else
		B = 3;

	var total = A + B + C + D + E + F + G + H;
	var resultado = "Su riesgo es: ";
	if (total < 7)
		resultado += "Bajo";
	else if (total >= 7 && total <= 11)
		resultado += "Ligeramente elevado";
	else if (total >= 12 && total <= 14)
		resultado += "Moderado";
	else if (total >= 15 && total <= 20)
		resultado += "Alto";
	else if (total > 20)
		resultado += "Muy Alto";
	alert(resultado);
}