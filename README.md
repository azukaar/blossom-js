![alt text](https://github.com/azukaar/blossom-js/raw/master/text.png "Blossom JS")

# Introduction

Blossom JS is introduced as a web framework allowing developper to provide fully featured application of small size, without the hassle of setting up a huge stack (sometime more complex than the app itself). Blossom is self contained (provides all you need: Server side rendering, router, testing, etc...) without needing additional tools, not even any build step. As your application grows, Blossom grows with it as it also allow you to create custom components to work with.

getting stated and full documentation here : ...

# Installation and basic usage

If you're using NPM, install Blossom with : 

```
npm install blossom-js
```

And then you can import what you need to use Blossom. Note that this is compatible with in-Browser ES6 modules.

```javascript
import { Component } from 'blossom-js';
```

If you're not, simply using a `<script>` tag in the head of your document pointing to the dist file of Blossom is enough (unpkg.com/blossom-js/umd).
Here a full exemple of a working Hello World. You can play with it on : https://jsfiddle.net/ez792m8k/

```html
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <div>
      <l-ctx message="Hello world"
             changemessage="() => this.ctx.message += ' and the universe'">
        <l-js>this.ctx.message</l-js>
        <button l-onclick="() => this.ctx.changemessage()">change</button>
      </l-ctx>
    </div>
  </body>
</html>
```

See Advanced Usage for more information on possibilities.

# Features

# Server side Rendering

# Disclaimer

Blossom JS is still an early stage framework and should not be considered if you're planning to write the next Facebook.
