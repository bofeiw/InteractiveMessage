"use strict";

function Message(content) {
    this.content = content;

    this.toHTML = function () {
        const boxWrapper = $("<div>").addClass("box-wrapper");
        const box = $("<div>").addClass("message-box");
        const text = $("<div>").addClass("message-text");
        box.append(text);
        boxWrapper.append(box);
        text.append(content);
        return boxWrapper;
    }
}


function showMessages(jsonData) {
    for (const message of jsonData.messages) {
        console.log(message);
        $("#message-container").append(new Message(message.content).toHTML());
    }
}

function start() {
    $.ajax({
        url: "samples/basicMessage.json",
        dataType: 'json',
        success: function (data) {
            console.log(data);
            showMessages(data);
        },
        error: function () {
            alert("error");
        }
    });
}

window.onload = function () {
    start();
};
