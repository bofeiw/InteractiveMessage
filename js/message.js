"use strict";

const Message = function (content, id) {
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
    const loading = document.createElement("span");
    const text = document.createElement("span");
    const br = document.createElement("br");

    // assemble elements
    container.appendChild(contents);
    container.appendChild(br);
    contents.appendChild(loading);
    contents.appendChild(text);

    // add tags
    contents.id = id;
    text.innerHTML = content;
    loading.innerHTML = '<b>•</b><b>•</b><b>•</b>';
    container.classList.add("message-wrapper");
    contents.classList.add("content-container");
    loading.classList.add("content-loading");
    text.classList.add("content-text");


    const optionIDs = [];

    function addOption(id) {
        optionIDs.push(id);
    }

    return {
        get id() {
            return id;
        },
        get HTML() {
            return container;
        },
        get loadingHTML() {
            return loading;
        },
        get textHTML() {
            return text;
        },
        get optionIDs() {
            return optionIDs;
        },
        get contentWrapper() {
            return contents;
        },
        get content() {
            return content;
        },
        addOption: addOption
    }
};

const Option = function (content, id, replyMessageID, onclick) {
    return {
        get id() {
            return id;
        },
        get replyMessageID() {
            return replyMessageID;
        },
        get HTML() {
            /*
            structure:
            div container
                div text
             */

            // create elements
            const container = document.createElement("button");
            const text = document.createElement("div");

            // assemble elements
            container.appendChild(text);

            // add tags
            container.id = id;
            text.innerHTML = content;
            container.addEventListener("click", () => onclick(id));

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
    let container;
    let messageContainer;
    let optionContainer;

    let sendingActive = false;
    const typingSpeed = 20;

    function init() {
        container = document.getElementById("interactive-message");
        if (!container) {
            // if no container, create one
            container = document.createElement("div");
            container.id = "interactive-message";
            document.body.appendChild(container);
        }
        messageContainer = document.createElement("div");
        optionContainer = document.createElement("div");

        messageContainer.id = "message-container";
        optionContainer.id = "option-container";

        container.appendChild(messageContainer);
        container.appendChild(optionContainer);
    }

    // parse JSON into properties
    function parseJSON(JSON) {
        for (let messageJSON of JSON.messages) {
            const message = parseMessage(messageJSON);
            pendingMessageIDs.push(message.id);
        }
    }

    function parseMessage(messageJSON) {
        // create message object
        const message = new Message(messageJSON.content, `message-${messageIDused++}`);

        // add options if any
        const optionJSON = messageJSON.option;
        if (optionJSON) {
            const option = parseOption(optionJSON);
            message.addOption(option.id);
        }

        messages.push(message);
        return message;
    }

    function parseOption(optionJSON) {
        const replyMessage = parseMessage(optionJSON.reply);
        const option = new Option(optionJSON.content, `option-${optionIDused++}`, replyMessage.id, onOptionClick);
        options.push(option);
        pendingOptionIDs.push(option.id);
        return option;
    }

    function onOptionClick(optionID) {
        const option = getOptionByID(optionID);
        if (option) {
            removeElement(optionID, pendingOptionIDs);
            document.getElementById(optionID).remove();
            nextMessageID = getOptionByID(optionID).replyMessageID;
            if (!sendingActive) {
                sendMessage(nextMessageID);
            }
        }
    }

    // animate message to page
    function sendMessage(messageID, onFinish) {
        sendingActive = true;
        const message = getMessageByID(messageID);
        if (message) {
            let typing = true;
            const waitTime = message.content.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed + anime.random(900, 1200);
            removeElement(messageID, pendingMessageIDs);
            currentMessageID = messageID;

            // append to container
            messageContainer.appendChild(message.HTML);

            const dimensions = getDimensions(message);
            message.contentWrapper.style.width = dimensions.loading.w;
            message.contentWrapper.style.height = dimensions.loading.h;
            const diaplayBefore = message.textHTML.style.display;
            message.textHTML.style.display = "none";

            // show up
            anime({
                targets: message.HTML,
                opacity: [0, 1]
            });

            // loading dots
            anime({
                targets: message.HTML.querySelectorAll('b'),
                opacity: [0.5, 1],
                scale: [0.8, 1],
                direction: 'alternate',
                loop: true,
                duration: 300,
                delay: function (el, i) {
                    return (i * 100) + 50
                },
                loopComplete: (anim) => {
                    // remove loading dots
                    if (!typing) {
                        anim.pause();
                        anime({
                            targets: message.HTML.querySelectorAll('b'),
                            opacity: 0,
                            scale: 0,
                            loop: false,
                            duration: 300,
                            easing: 'easeOutQuad',
                            delay: anime.stagger(50),
                        });
                    }
                }
            });

            // time's up, show content
            setTimeout(() => {
                typing = false;
                // adjust bubble size
                anime({
                    targets: message.contentWrapper,
                    width: [dimensions.loading.w, dimensions.message.w],
                    height: [dimensions.loading.h, dimensions.message.h],
                    easing: 'easeOutQuad',
                    duration: 200,
                    complete: () => {
                        message.textHTML.style.opacity = 0;
                        message.textHTML.style.display = diaplayBefore;
                        // show text
                        anime({
                            targets: message.textHTML,
                            opacity: 1,
                            easing: 'easeInQuad',
                            duration: 200,
                            complete: () => {
                                sendingActive = false;
                                if (onFinish) {
                                    onFinish();
                                }
                            }
                        });
                    }
                })
            }, waitTime);

            // append options if any
            if (message.optionIDs) {
                for (let optionID of message.optionIDs) {
                    const option = getOptionByID(optionID);
                    removeElement(optionID, pendingOptionIDs);
                    displayingOptionIDs.push(optionID);
                    optionContainer.appendChild(option.HTML);
                }
            }

            sentMessageIDs.push(messageID);
            currentMessageID = undefined;
        }
    }

    // send next message to page
    function sendNextMassage() {
        if (nextMessageID && pendingMessageIDs.includes(nextMessageID)) {
            // particular message is specified, send first
            const tempNextMessageID = nextMessageID;
            nextMessageID = undefined;
            sendMessage(tempNextMessageID, sendNextMassage);
        } else if (pendingMessageIDs.length > 0) {
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

    function getDimensions(message) {
        return {
            message: {
                w: anime.get(message.textHTML, "width", "rem") + 'rem',
                h: anime.get(message.textHTML, "height", "rem") + 'rem',
            },
            loading: {
                w: anime.get(message.loadingHTML, "width", "rem") + 'rem',
                h: anime.get(message.loadingHTML, "height", "rem") + 'rem',
            }
        }
    }

    function start() {
        sendNextMassage();
    }

    return {
        init: init,
        parseJSON: parseJSON,
        start: start
    }
};

// ref https://stackoverflow.com/a/18278346/9494810
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function start() {
    const manager = new MessageManager();
    manager.init();

    loadJSON("samples/basicReply.json",
        data => {
            console.log(data);
            manager.parseJSON(data);
            manager.start();
        },
        () => alert("error loading JSON")
    )
}

window.onload = function () {
    start();
};