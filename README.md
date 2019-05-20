# Interactive Message
Static interactive message with predefined data.  
It uses [Floating Circle](http://bofei.io/floatingCircle/) for circle simulation.  
And uses [Anime.js](https://animejs.com) for animation.

# Demo 
Try here: 

![demo.gif]()

# How to use
1. Include `css` and `js` in your HTML.
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
You can also wrap your container inside another `div` for styles.

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
You can also see the complete example [here](samples/helloWorld.html).  
Another Two examples: [basic messages only](samples/basic.html) and [messages with reply](samples/reply.html).  

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

# Contribution
You are welcome to contribute! You can consider to kill some TODOs.  
Feel free to pull requests and discuss any issues.

# License
["Anti 996" License](LICENSE.txt), do whatever you want if you or your company does not exploit employees
