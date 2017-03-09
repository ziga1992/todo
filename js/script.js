$(document).ready(function() {
    var todos = [];
    var prios = [];
    var tags = [];
    $("#add").click(function() {
        var todoTitle = $("#todoTitle").val();
        var todoDescription = $("#todoDescription").val();
        var todoDate = moment($("#todoDate").val()).format();
        var todoPriority = $("#choose").val();
        if(todoPrority == -1) {
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
    var done = "";
    if(opravek.checked == "true") {
        done = "done";
    }
    var priorityNone= "";
    if(opravek.priority.hasOwnProperty('name')) {
        priorityNone = "(" + opravek.priority.name + ")";
    }
    var todo = $('<div class="checkbox ' + done + ' col-lg-12" data-id="' + opravek.id + '"><input type="checkbox" class="delete"><label>' + opravek.title + ' ' +  priorityNone + '</label></div>');
    $("#todo").append(todo);
    todo.find("label").click(function() {
        console.log($(this));
        var ele = $(this).parents(".checkbox");
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