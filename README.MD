# create-elem [![Build Status](https://travis-ci.org/dvprz/create-elem.svg?branch=master)](https://travis-ci.org/dvprz/create-elem)

Create simple elements in one line of code versus the multi line approach using the native Document API. Influenced by [Pug's](https://pugjs.org/api/getting-started.html) templating syntax.

No more doing:
```js
const div = document.createElement('div')
div.classList.add('foo')
div.id = 'bar'
div.innerText = 'Hello, world!'
```
Instead you can do:
```js
const div = create('div(class="foo" id="bar") Hello, world!')
```

## Install

Via npm:

```
npm install create-elem
```

## Usage
Import into your files like:

```js
import { create } from 'create-elem'
```

It's pretty straightforward. We consume every character until we encounter a left paren "(" and assume everything before that is the HTML Element you wanted. Then we keep consuming characters until we come across a right paren ")" and assume everything inside is an attribute key and value pair. 

```js
create('div(class="card flex")')
create('div(id="hero" class="full-width")')
create('h1(class="bold") Hello, world!')
```
And once the element is appended to an html document:
```html
<div class="card flex"></div>
<div id="hero" class="full-width"></div>
<h1 class="bold">Hello, world!</h1>
```

Can also handle JSON data attributes
```js
create('div(data-user={"id":1,"name":"John Doe"})')
```
```html
<div data-user='{"id":1,"name":"John Doe"}'></div>
```

## Test

```js
npm test
```

## License

MIT © [Dave Perez](https://daveperez.io)