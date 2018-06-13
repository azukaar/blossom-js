![alt text](https://github.com/azukaar/blossom-js/raw/master/doc-header.png "Blossom JS")
# Introduction

Blossom JS is introduced as a web framework allowing developper to provide fully featured application of small size, without the hassle of setting up a huge stack (sometime more complex than the app itself). Blossom is self contained (provides all you need: Server side rendering, router, testing, etc...) without needing additional tools, not even any build step. As your application grows, Blossom grows with it as it also allow you to create custom components to work with.

getting stated and full documentation here : https://azukaar.github.io/blossom-js/

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
Here a full exemple of a working Hello World. You can play with it on : https://jsfiddle.net/ez792m8k/2

```html
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <div>
        <l-set message="Hello World"></l-set>
        <l-get message></l-get>
    </div>
  </body>
</html>
```

See Advanced Usage for more information on possibilities.

# Features

## Web Components

You can think of Blossom either of a way to bring React/Angular's infamous concept to native web component, or a React without shadow DOM.
This position allow it to bring effortless components to play with.

Here is an example of component written in Blossom. Sounds familiar doesn't it ?

```javascript
class Hello extends Blossom.Component {
  render() {
    return `<div>Hello, ${this.props.name} !</div>`;
  }
}

Blossom.register({
  name: 'l-hello',
  element: Hello
})
```

More informations on writting components here : (...)

## Make custom element great ~~again~~

BlossomJS is a massive effort into making custom element work properly in the browser. It fixes a lot of issues, adds
a more intuitive API with a render() method, and a polyfill for older browsers.

here an example of native custom Element on Chrome 66 vs Blossom JS. As you can see, the native API is very limited and is stuck on simple code :

![alt text](https://github.com/azukaar/blossom-js/raw/master/docs/doc-issue1.png "Chrome Version")
![alt text](https://github.com/azukaar/blossom-js/raw/master/docs/doc-issue2.png "Blossom Version")

## Powerful to the core

BlossomJS brings to the DOM advanced features, like the core dependency management that won't let componenent try to load
before their parent are properly registered in the list of component (By default custom element load in an order that will
mess up your resulting application if your components depends on each others). it also implements a DOM merge algorithm similar to what React does (By only updating relevant piece of code instead of using innerHTML like you would with classic
Custom Elements).

## DOM powered

All informations in Blossom are self contained in the DOM itself. There is nothing else needed to run it! That makes Blossom a very good candidate for various technologies : Hot reloading (to come !), Server Side Rendering, it makes testing and debugging easier as nothing is hidden from you. Alternatively, it also allow you to write websites falling back to static rendered. And finally, if your grand'ma wants to see your new website, her Internet Explorer 6 will at least display what your server rendered instead of a white page ! 

# Disclaimer

Blossom JS is still an early stage framework and should not be considered if you're planning to write the next Facebook.
