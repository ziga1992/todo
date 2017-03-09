$(document).ready(function(){
   $("#click").click(function(){
    radi();
   });
});

function radi() {
    var today = new Date();
    var leto = today.getFullYear();
    var letnica = parseInt($("#rojstvo").val());
    var starost = leto - letnica;
    $("#starost").text(starost);

    var ime = $("#ime").val();
    var priimek = $("#priimek").val();
    $("#polno-ime").text(ime + " " + priimek);
    $("#date").text(today);
}

// potenciraj števili

$(document).ready(function(){
    $("#potenciraj").click(function(){
        preradi();
    });
});
    //document.getElementById("demo").innerHTML = Math.pow(4, 3);

function preradi() {
    var st1 = parseInt($("#st1").val());
    var st2 = parseInt($("#st2").val());
    var rezultat = Math.pow(st1, st2);
    $("#rezultat").val(rezultat);
    $("#zgodovina").prepend("<li>" + st1 + " ˆ " + st2 + " = " + rezultat + "</li>");
    
}