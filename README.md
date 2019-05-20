# Interactive Message
Static interactive message with predefined data.  
It uses [Floating Circle](http://bofei.io/floatingCircle/) for circle simulation, [Anime.js](https://animejs.com) for animation.

# Demo 
Try here: https://bofei.io/InteractiveMessage/samples/reply

![demo.gif](docs/demo.gif)

# How to use
1. Add `css` and `js` in your HTML.
```html
<link rel="stylesheet" href="adjustSize.css">
<link rel="stylesheet" href="message.css">
<link rel="stylesheet" href="style.css">
```
```html
<script src="anime.min.js"></script>
<script src="adjustSize.js"></script>
<script src="circleCollision.js"></script>
<script src="message.js"></script>
```

2. Create a container and assign the ID to exactly `interactive-message`: 

```html
<div id="interactive-message"></div>
```
Tip: You can also wrap your container inside another `div` for styles.

3. Define your messages in a json file, for example, a hello world:
```json
{
  "messages": [
    {
      "content": "Hello world!"
    },
    {
      "content": "Another hello world!",
      "option": {
        "content": "This hello world is clickable!",
        "reply": {
          "content": "I can reply for your click!"
        }
      }
    }
  ]
}
```
And save it as `helloWrold.json`.

4. Add a line of `js` to pass the json path to start!
```html
<script>
    interactiveMessageStart("helloWorld.json");
</script>
```
You can also see the [complete example](samples/json/helloWorld.json) or other two examples: [basic messages only](samples/json/basicMessage.json) and [messages with reply](samples/json/basicReply.json).  

# JSON file structure
- First, `messages` is the enter point of Interactive Message. It corresponds to a list of Objects.   
- Each message object is one message that will be displayed one after another.  
- Each message object has a mandatory `content` which corresponds to a string and will be displayed on screen, and an optional `option` which corresponds to another Object.  
- An `option` object has two mandatory fields, `content` which corresponds to a string and will be displayed on screen, and `reply` which is a message object.  
- Recursive message with reply is supported.
- HTML tags are not filtered. This enables you to add anything you need, for example `links`, `images` or even `iframes`! But be careful about security issues.

The basic structure will look like this:
```json
{
  "messages": [
    {
      "content": "Your first message",
      "option": {
        "content": "Option is completely optional",
        "reply": {
          "content": "But if you have an option, you must define its reply"
        }
      }
    },
    {
      "content": "Here is your second message, and without option"
    },
    {
      "content": "This is your third message, and you can add more",
      "option": {
        "content": "This will be the clickable option",
        "reply": {
          "content": "Recursive message is supported",
          "option": {
            "content": "This will be the reply for recursive content",
            "reply": {
              "content": "Recursive message ends where a reply has no more recursive message object."
            }
          }
        }
      }
    }
  ]
}
``` 
And the following is the json file used in the [demo page](https://bofei.io/InteractiveMessage/samples/reply).
```json
{
  "messages": [
    {
      "content": "Hello there!",
      "option": {
        "content": "Hello! What's your name?",
        "reply": {
          "content": "I am Interactive Message!"
        }
      }
    },
    {
      "content": "Here are some usage of messages"
    },
    {
      "content": "Welcome to this demo!",
      "option": {
        "content": "What is this demo about?",
        "reply": {
          "content": "This demo shows some of the features of Interactive Message.",
          "option": {
            "content": "What are the features?",
            "reply": {
              "content": "It will come soon!"
            }
          }
        }
      }
    },
    {
      "content": "Hope you'll love it.",
      "option": {
        "content": "Can I use it?",
        "reply": {
          "content": "Sure! It is open sourced, try it out <a href='https://github.com/bofeiw/InteractiveMessage'>here</a>",
          "option": {
            "content": "Thanks!",
            "reply": {
              "content": "No worries. Please help your self."
            }
          }
        }
      }
    }
  ]
}
```

# Featured Projects
Project | Repo | JSON
:-: | :-: | :-: 
[Personal Website](https://bofei.io) | View on [GitHub](https://github.com/bofeiw/bofeiw.github.io) | View [JSON for repo](https://github.com/bofeiw/bofeiw.github.io/blob/master/data/messages.json)

# Callbacks
At the moment, no callbacks are supported as this repo is just started. But feel free to request in issues if you want a particular feature, or pull requests if you are capable.  

# Browser support
- Apple Safari: supported
- Google Chrome: supported
- Microsoft Edge: supported
- Microsoft IE: not supported. If you want use it in IE, you need to use [Bable](https://babeljs.io) to translate all js files into compatible versions (i.e. string literals are not supported in IE).
- Other Browsers: to be tested

# TODO
- add some callbacks
- write gh pages (plan: representation of editable json data)
- add styles
- write a serious demo json file
- update docs (UML)
- add comments for codes

# Contribution
You are welcome to contribute! You can consider to kill some TODOs.  
Feel free to pull requests and discuss any issues.

# License
["Anti 996" License](LICENSE.txt), do whatever you want if you or your company does not exploit employees
