$(document).ready(function() {
    var todos = [];
    var prios = [];
    var tags = [];
    // var host = "http://localhost:52001/";
    var host = "http://89.142.196.244:52001/";
    // Funcija, ki doda opravek
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
    // Date-picker
    $('.date-datepicker').datepicker({
        format: "yyyy/mm/dd",
        autoclose: true
    });
    // Funkcija za odstranitev opravka
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
    // BackEnd pull
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
            addPriorityToSelect(prio);
            addPriorityMenu(prio);
        }
    });
    $.get( host + "tags", function(data) {
        tags = data;
        console.log("tags", tags);
        for(var tag of tags) {
            addTagMenu(tag);
        }
    });
});

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
// Funkcija, ki doda tag v menu
function addTagMenu(tag) {
    var tags = generateTagMenu(tag);
    $(".tag-menu").append(tags);
    tags.click(function() {
         if($(this).hasClass("current-tag")) {
            $(this).removeClass("current-tag")
        } else {
            $(this).addClass("current-tag");
        }
        filterTodos();
    });
}
// Funkcija, ki doda prioritete v menu
function addPriorityMenu(priority) {
    var prio = generatePriorityMenu(priority);
    $(".prio-menu").append(prio);
    prio.click(function() {
         if($(this).hasClass("current-priority")) {
            $(this).removeClass("current-priority")
        } else {
            $(".current-priority").removeClass("current-priority");
            $(this).addClass("current-priority");
        }
        filterTodos();
    });
}
// Fukcija, ki zgenerira HTML opraveka
function generateTodoHtml(opravek) {
    var done = "";
    if(opravek.checked == "true") {
        done = "checked";
    }
    var tag = [];
    var tags = "";
    if(opravek.tags.length != 0) {
        for(var t of opravek.tags) {
            tags += '<li data-tag="' + t.name + '" class="task-tag" style="background: ' + t.color + '"><span>' + t.name + '</span></li>';
            tag.push(t.name);
        }
    }
    var html = '<div class="task" data-tag="' + tag + '" data-priority="' + opravek.priority.name + '" data-id="' + opravek.id + '"><div class="col-xs-12"><input class="todo-checkbox" id="checkbox' + opravek.id + '" type="checkbox" ' + done + ' hidden><label for="checkbox' + opravek.id + '" style="color: ' + opravek.priority.color + ';">' + opravek.title + '</label></div><div class="col-xs-12"><div class="task-date"><small><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;' + moment(opravek.finish_date).format("DD.MM.YYYY") + '</small></div></div><ul class="task-tags">' + tags + '</ul></div>';

    return $(html);
}
// Funkcija, ki zgenerira HTML oznake
function generateTagMenu(tag) {
    var html = '<div class="menu"><i class="fa ' + tag.icon + '" data-id="' + tag.id + '" aria-hidden="true" style="color:' + tag.color + '"></i><div>' + tag.name + '</div></div>';

    return $(html);
}
// Funkcija, ki zgenerira HTML prioritete
function generatePriorityMenu(priority) {
    var html = '<div class="menu"><i class="fa ' + priority.icon + '" data-id="' + priority.id + '" aria-hidden="true" style="color:' + priority.color + '"></i><div style="color:' + priority.color + '">' + priority.name + '</div></div>';

    return $(html);
}
// Funcija, ki pokaze prioritete
function showPriorities(priority) {
    $(".task").each(function() {
        if($(this).data("priority") == priority) {
            $(this).show();
        } else {
            $(this).hide();
        };
    });
}
// Funcija, ki filtrira opravke
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
        var this_tags = $(this).data("tag").split(",");
        var intersect = $(this_tags).filter(selected_tags);
        if(intersect.length != 0) {
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
