"use strict";

const Message = function (content, id) {
    const optionIDs = [];

    function addOption(id) {
        optionIDs.push(id);
    }

    return {
        get id() {
            return id;
        },
        get HTML() {
            /*
            structure:
            div container
                div contents
                    div loading
                    div text
                br
             */

            // create elements
            const container = document.createElement("div");
            const contents = document.createElement("div");
            const loading = document.createElement("div");
            const text = document.createElement("div");
            const br = document.createElement("br");

            // assemble elements
            container.appendChild(contents);
            container.appendChild(br);
            contents.appendChild(loading);
            contents.appendChild(text);

            // add tags
            contents.id = id;
            text.innerHTML = content;

            return container;
        },
        get optionIDs() {
            return optionIDs;
        },
        addOption: addOption
    }
};

const Option = function (content, id, reply, onclick) {
    return {
        get id() {
            return id;
        },
        get reply() {
            return reply;
        },
        get HTML() {
            /*
            structure:
            div container
                div text
             */

            // create elements
            const container = document.createElement("div");
            const text = document.createElement("div");

            // assemble elements
            container.appendChild(text);

            // add tags
            container.id = id;
            text.innerHTML = content;
            container.onclick = onclick(id);

            return container;
        }
    }
};

const MessageManager = function () {
    const messages = [];
    const options = [];

    let currentMessageID;
    let nextMessageID;
    const sentMessageIDs = [];
    const pendingMessageIDs = [];

    const displayingOptionIDs = [];
    const pendingOptionIDs = [];

    let messageIDused = 0;
    let optionIDused = 0;
    const container = document.getElementById("message-container");

    function init() {
        // TODO init DOM
    }

    // parse JSON into properties
    function parseJSON(JSON) {
        for (let messageJSON of JSON.messages) {
            // create message object
            const message = new Message(messageJSON.content, messageIDused++);
            messages.push(message);
            pendingMessageIDs.push(message.id);

            // add options if any
            // TODO support this
        }
    }

    function onOptionClick(optionID) {
        // TODO support this
    }

    // animate message to page
    function sendMessage(messageID, onFinish) {
        const message = getMessageByID(messageID);
        if (message) {
            removeElement(messageID, pendingMessageIDs);
            console.log(pendingMessageIDs);
            currentMessageID = messageID;

            container.appendChild(message.HTML);

            sentMessageIDs.push(messageID);
            currentMessageID = undefined;
        }
        onFinish();
    }

    // send next message to page
    function sendNextMassage() {
        if (nextMessageID && pendingMessageIDs.includes(nextMessageID)) {
            // particular message is specified, send first
            const tempNextMessageID = nextMessageID;
            nextMessageID = undefined;
            sendMessage(tempNextMessageID, sendNextMassage);
        } else if (pendingMessageIDs) {
            // no specification, send by increasing id
            sendMessage(pendingMessageIDs[0], sendNextMassage);
        }
    }

    // remove element from array
    // ref https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
    function removeElement(element, array) {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    // get object by ID in list if any
    function getByID(id, list) {
        for (let object of list) {
            if (object.id === id) {
                return object;
            }
        }
    }

    function getMessageByID(id) {
        return getByID(id, messages);
    }

    function getOptionByID(id) {
        return getByID(id, options);
    }


    function start() {
        sendMessage(0, sendNextMassage);
    }

    return {
        init: init,
        parseJSON: parseJSON,
        start: start
    }
};

function start() {
    const manager = new MessageManager();
    manager.init();

    $.ajax({
        url: "samples/basicMessage.json",
        dataType: 'json',
        success: function (data) {
            console.log(data);
            manager.parseJSON(data);
            manager.start();
        },
        error: function () {
            alert("error loading JSON");
        }
    });
}

window.onload = function () {
    start();
    // $('<button onclick="messageOb.load()">load</button>').appendTo('body');
    // $('<button onclick="messageOb.showText()">show</button>').appendTo('body');
};