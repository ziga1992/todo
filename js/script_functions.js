function updateDate() {
    var today = new Date();  
    var leto = today.getFullYear();
    var mesec = today.getMonth() + 1;
    var dan = today.getDate();

    //2017-02-23
    var formated_today = leto + "-" + mesec + "-" + dan;

    document.getElementById("date").innerHTML = today;

}
var rezultat = [];

for(var i = 1; i <= 1000; i++) {
    deljivo(i);
} 
console.log(rezultat);
function deljivo(stevilo){
    //Ali je deljivo z 3?
    //če je pushaj v rezultat
    if((stevilo % 3 == 0) || (stevilo % 5 == 0)) {
        rezultat.push(stevilo);
    }
    //ali je deljivo s 5?
    //če je pushaj v rezultat

}


//var rezultat = sestej(stevilo1, stevilo2);

function sestej(st1, st2) {
    console.log("st1", st1);
    console.log("st2", st2);
    return st1 + st2;
}

// fib(n) = fib(n - 1) + fib(n - 2)
// n = 1
// F(1) = 1;
//funkcija fib(n) vrne število na n-tem mestu fibonačijevega zaporedja
var stevka = fib(60);
console.log(stevka);
// 4!
// 4 * 3 * 2 * 1

// 6!
// 6 * 5 * 4 * 3 * 2 * 1


//                13
//           8             5
//       5         3    3    2
//  3      2     2  1  2 1  1 1
// 2 1 1 1 1 1
// 1 1
function fib(n) {
    if(n <= 1) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
}