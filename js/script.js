$(document).ready(function() {
    var todos = [];
    var prios = [];
    var tags = [];
    // var host = "http://localhost:52001/";
    var host = "http://89.142.196.244:52001/";

    $("#add").click(function() {
        var todoTitle = $("#todoTitle").val();
        var todoDescription = $("#todoDescription").val();
        var date = $("#todoDate").val();
        date = moment(date, "YYYY/MM/DD").format();
        var todoDate = date;
        var todoPriority = $("#choose-prio").val();
        if(todoPriority == -1) {
            todoPriority = null;
        }
        var opravek = {
            title: todoTitle,
            description: todoDescription,
            finish_date: todoDate,
            priority_id: todoPriority
        };
        $.ajax({
            url : host + "todos",
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
        format: "yyyy/mm/dd",
        autoclose: true
    });
    $(".menu-high").click(function() {
        if($(this).hasClass("current-priority")) {
            $(this).removeClass("current-priority");
        } else {
            $(".current-priority").removeClass("current-priority");
            $(this).addClass("current-priority");
        }
        filterTodos();
    });
    $(".menu-medium").click(function() {
         if($(this).hasClass("current-priority")) {
            $(this).removeClass("current-priority")
        } else {
            $(".current-priority").removeClass("current-priority");
            $(this).addClass("current-priority");
        }
        filterTodos();
    });
    $(".menu-low").click(function() {
         if($(this).hasClass("current-priority")) {
            $(this).removeClass("current-priority")
        } else {
            $(".current-priority").removeClass("current-priority");
            $(this).addClass("current-priority");
        }
        filterTodos();
    });
    $(".menu-personal").click(function() {
         if($(this).hasClass("current-tag")) {
            $(this).removeClass("current-tag")
        } else {
            $(this).addClass("current-tag");
        }
        filterTodos();
    });
    $(".menu-work").click(function() {
         if($(this).hasClass("current-tag")) {
            $(this).removeClass("current-tag")
        } else {
            $(this).addClass("current-tag");
        }
        filterTodos();
    });
    $(".menu-shopping").click(function() {
         if($(this).hasClass("current-tag")) {
            $(this).removeClass("current-tag")
        } else {
            $(this).addClass("current-tag");
        }
        filterTodos();
    });
    $("#remove").click(function() {
        $( ".todo-checkbox:checkbox:checked" ).each(function( index ) {
            var id = $(this).parents(".task").data("id");
            var t = $(this);
            $.ajax({
                url : host + "todos",
                type: "DELETE",
                data : {id: id},
                success: function(data, textStatus, jqXHR)
                {
                    //data - response from server
                    t.parents(".task").remove();
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
            
                }
            });
        });
    });
    $.get( host + "todos", function(data) {
        todos = data;
        console.log("todos", todos);
        for(var todo of todos) {
            addTodo(todo);
        }
    });
    $.get( host + "priorities", function(data) {
        prios = data;
        console.log("prios", prios);
        for(var prio of prios) {
            addPriority(prio);
            addPriorityToSelect(prio);
        }
    });
    $.get( host + "tags", function(data) {
        tags = data;
        console.log("tags", tags);
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
    $("#choose-prio").append(prio);
}
// Funcija, ki doda opravek
function addTodo(opravek) {
    var todo = generateTodoHtml(opravek);
    var date = moment(opravek.finish_date).format("YYYY-MM-DD");
    $(".column[data-date='" + date +"']").append(todo);
    todo.find("label").click(function() {
        var ele = $(this).parents(".task");
        ele.toggleClass("done");
        var id = ele.data("id");
        var input = ele.hasClass("done");
        $.ajax({
            url : host + "todo/check",
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
    var tag = "";
    var tags = "";
    if(opravek.tags.length != 0) {
        tag = opravek.tags[0].name;
        for(var t of opravek.tags) {
            tags += '<li data-tag="' + t.name + '" class="task-tag" style="background: ' + t.color + '"><span>' + t.name + '</span></li>'
        }
    }
    var html = '<div class="task" data-tag="' + tag + '" data-priority="' + opravek.priority.name + '" data-id="' + opravek.id + '"><div class="col-xs-12"><input class="todo-checkbox" id="checkbox' + opravek.id + '" type="checkbox" ' + done + ' hidden><label for="checkbox' + opravek.id + '" style="color: ' + opravek.priority.color + ';">' + opravek.title + '</label></div><div class="col-xs-12"><div class="task-date"><small><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;' + moment(opravek.finish_date).format("DD.MM.YYYY") + '</small></div></div><ul class="task-tags">' + tags + '</ul></div>';

    return $(html);
}
function showPriorities(priority) {
    $(".task").each(function() {
        if($(this).data("priority") == priority) {
            $(this).show();
        } else {
            $(this).hide();
        };
    });
}
function filterTodos() {
    var selected_priority = $(".current-priority").find("div").text();
    var selected_tags = [];
    $(".current-tag").each(function(i) {
        var t = $(this);
        // save text into variable
        var text = t.find("div").text();
        // push to selected_tag
        selected_tags.push(text);
    });
    if((selected_tags.length == 0) && (selected_priority.length == 0)) {
        $(".task").show();
        return;
    }
    $(".task").each(function() {
        if($.inArray($(this).data("tag"), selected_tags) != -1) {
            $(this).show();
            if(selected_priority.length > 0) {
                if($(this).data("priority") == selected_priority) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        } else if(($(this).data("priority") == selected_priority) && (selected_tags.length == 0)) {
            $(this).show();
        } else {
            $(this).hide();
        }
       
       
    });
}
