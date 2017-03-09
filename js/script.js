$(document).ready(function() {
    var todos = [];
    var prios = [];
    var tags = [];
    $("#add").click(function() {
        var todoTitle = $("#todoTitle").val();
        var todoDescription = $("#todoDescription").val();
        var todoDate = moment($("#todoDate").val()).format();
        var todoPriority = $("#choose").val();
        if(todoPriority == -1) {
            todoPriority = null;
        }
       console.log(todoDate);
        var opravek = {
            title: todoTitle,
            description: todoDescription,
            finish_date: todoDate,
            priority_id: todoPriority
        };
        $.ajax({
            url : "http://localhost:52001/todos",
            type: "POST",
            data : opravek,
            success: function(data, textStatus, jqXHR)
            {
                //data - response from server
                addTodo(data);
                $('#addTodo').modal('toggle');
                $("#todoTitle, #todoDescription, #todoDate").val("");
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log(errorThrown);
            }
        });
    });
    $('.date-datepicker').datepicker({
        format: "dd.mm.yyyy",
        autoclose: true
    });
    $("#remove").click(function() {
        var remove = $(".delete:checkbox:checked").parents(".checkbox").data("id");
        $( ".delete:checkbox:checked" ).each(function( index ) {
            var id = $(this).parents(".checkbox").data("id");
            var t = $(this);
            $.ajax({
                url : "http://localhost:52001/todos",
                type: "DELETE",
                data : {id: id},
                success: function(data, textStatus, jqXHR)
                {
                    //data - response from server
                    t.parents(".checkbox").remove();
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
            
                }
            });
        });
    });
    $.get("http://localhost:52001/todos", function(data) {
        todos = data;
        console.log(todos);
        for(var todo of todos) {
            addTodo(todo);
        }
    });
    $.get("http://localhost:52001/priorities", function(data) {
        prios = data;
        console.log(prios);
        for(var prio of prios) {
            addPriority(prio);
            addPriorityToSelect(prio);
        }
    });
    $.get("http://localhost:52001/tags", function(data) {
        tags = data;
        console.log(tags);
        for(var tag of tags) {
            addTag(tag);
        }
    });
});

// Funkcija, ki doda oznako
function addTag(oznaka) {
    var tag = $('<div class="col-lg-12"><p style="border-left: 5px solid ' + oznaka.color + '">' + oznaka.name + '</p></div>')
    $("#tag").append(tag);
}
// Funkcija, ki doda prioriteto
function addPriority(prioriteta) {
    var prio = $('<div class="col-lg-12"><p>' + prioriteta.name + '</p></div>')
    $("#prio").append(prio);
}
// Funkcija, ki doda prioriteto v opravek
function addPriorityToSelect(prioriteta) {
    var prio = $('<option value="' + prioriteta.id + '">' + prioriteta.name + '</option>')
    $("#choose").append(prio);
}
// Funcija, ki doda opravek
function addTodo(opravek) {
    var todo = generateTodoHtml(opravek);
    $(".column").append(todo);
    todo.find("label").click(function() {
        console.log($(this));
        var ele = $(this).parents(".task");
        ele.toggleClass("done");
        var id = ele.data("id");
        var input = ele.hasClass("done");
        console.log(input);
        $.ajax({
            url : "http://localhost:52001/todo/check",
            type: "POST",
            data : {
                todo_id: id,
                checked: input
            },
            success: function(data, textStatus, jqXHR)
            {
                //data - response from server
                
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log(errorThrown);
            }
        });
    });
}
function generateTodoHtml(opravek) {
    var done = "";
    if(opravek.checked == "true") {
        done = "checked";
    }
    var priorityNone= "";
    if(opravek.priority.hasOwnProperty('name')) {
        priorityNone = "(" + opravek.priority.name + ")";
        if(opravek.priority.name == "high") {
            priorityNone = "#e74c3c";
        }
        if(opravek.priority.name == "medium") {
            priorityNone = "#e67e22";
        }
        if(opravek.priority.name == "low") {
            priorityNone = "#f1c40f";
        }
    }
    var html = '<div class="task" data-id="' + opravek.id + '"><div class="col-xs-12"><input id="checkbox' + opravek.id + '" type="checkbox" ' + done + ' hidden><label for="checkbox' + opravek.id + '" style="color: ' + priorityNone + ';">' + opravek.title + '</label></div><div class="col-xs-12"><div class="task-date"><small><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;' + moment(opravek.finish_date).format("DD.MM.YYYY") + '</small></div></div></div>';

    return $(html);
}