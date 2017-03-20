$(document).ready(function() {
    var days = [];
    var number_of_days = 2;
    for(var x = -1; x <= number_of_days; x++) {
        var date = moment().add(x, "days");
        var label = "";
        if(x == -1) {
            label = "yesterday";
        }
        if(x == 0) {
            label = "today";
        }
        if(x == 1) {
            label = "tomorrow";
        }
        var parsed_date = {
            "month": date.format("MMMM"),
            "day_num": date.format("D"),
            "day_name": date.format("dddd"),
            "label": label,
            "date": date.format("YYYY-MM-DD"),
        };
        days.push(parsed_date);
    }
    insertDatesHtml(days);
    console.log(days);
});

function insertDatesHtml(dates) {
    for(var date of dates) {
        var day = $('<div class="day col-xs-3"><span class="upper-line">' + date.label + '</span><br /><span>' + date.day_name + " " + date.month + " " + date.day_num + '</span></div>');
        $(".calendar .row").append(day);
        var column = $('<div class="column col-xs-3" data-date="' + date.date + '"></div>');
        $(".tasks .row").append(column);

    }
    
}