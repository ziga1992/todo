document.getElementById('demo').innerHTML = "opravila za danes";
//console.log(document.getElementById('demo').innerHTML);
var stevilo1 = parseInt(document.getElementById("stevilo1").innerHTML);
var stevilo2 = parseInt(document.getElementById("stevilo2").innerHTML);
var rezultat = stevilo1 + stevilo2;

console.log(rezultat);
document.getElementById("rezultat").innerHTML = rezultat;


