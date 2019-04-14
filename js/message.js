"use strict";

const Message = (function () {
    let messageID = 0;

    function nextID() {
        return messageID++;
    }

    return function (content) {
        const ID = nextID();
        const messageContainer = $("#message-container");
        const boxWrapper = $("<div>").addClass("box-wrapper");
        const box = $("<div>").addClass("message-box");
        const text = $("<div>").addClass("message-text");

        box.append(text);
        boxWrapper.append(box);
        text.append(content);

        box.attr("id", boxID());
        boxWrapper.attr("id", boxWrapperID());
        text.attr("id", textID());

        function boxID() {
            return "box-" + ID;
        }

        function boxWrapperID() {
            return "boxWrapper-" + ID;
        }

        function textID() {
            return "text-" + ID;
        }

        function appendToContainer() {
            messageContainer.append(boxWrapper);
        }

        /* make message object appears */
        function appear() {
            // boxWrapper.style.height = boxWrapper.clientHeight + "px";

            // boxWrapper.addClass("appeared")
        }

        return {
            get content() {
                return content;
            },

            appendToContainer: appendToContainer,
            appear: appear
        }
    }
})();


function showMessages(jsonData) {
    for (const message of jsonData.messages) {
        console.log(message);
        const messageObject = new Message(message.content);
        messageObject.appendToContainer();
        messageObject.appear();
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
