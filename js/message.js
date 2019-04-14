"use strict";

const Message = (function () {
    let messageID = 0;

    function nextID() {
        return "box-" + messageID++;
    }

    return function (content) {
        const ID = nextID();
        const messageContainer = $("#message-container");
        const box = $("<div>").addClass("message-box");
        const text = $("<div>").addClass("message-text message-loading");
        box.attr("id", ID);
        box.append(text);
        
        function showText() {
            text.removeClass("message-loading", 500, () => {
                text.append(content);
            });
        }

        function load() {
            // const loading = $("<div>").addClass("loading");
            // loading.append($("<div>").addClass("dot"));
            // box.append(loading);
            // box.append($("<div>").addClass("tail"));
            // box.addClass("loading-box");

        }

        function appendToContainer() {
            messageContainer.append(box);
            messageContainer.append($("<br>"));
        }

        return {
            get content() {
                return content;
            },

            appendToContainer: appendToContainer,
            load: load,
            showText: showText
        }
    }
})();

let messageOb;

function showMessages(jsonData) {
    for (const message of jsonData.messages) {
        console.log(message);
        const messageObject = new Message(message.content);
        messageObject.appendToContainer();
        messageOb = messageObject;
        messageObject.showText();
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
    // $('<button onclick="messageOb.load()">load</button>').appendTo('body');
    // $('<button onclick="messageOb.showText()">show</button>').appendTo('body');
};