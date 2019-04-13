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
