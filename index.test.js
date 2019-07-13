'use strict'

const assert = require('assert')
const { create } = require('./')

describe('create-element', function () {

  it('should create an empty div', function () {
    const div = create('div')
    assert.equal(div.tagName.toLowerCase(), 'div')
  })

   it('should create a div with one class', function () {
    const selector = 'container'
    const single = create(`div(class="${selector}")`)

    assert.equal(single.classList.contains(selector), true)
  })

  it('should create a paragraph with one class and some text', function () {
    const p = create('p(class="container") Milk')

    assert.equal(p.tagName.toLowerCase(), 'p')
    assert.equal(p.innerText, 'Milk')
  })

  it('should create a div with multiple classes', function () {
    const selectors = ['card', 'flex']
    const multiple = create(`div(class="${selectors.join(' ')}")`)

    selectors.forEach(selector => assert.equal(multiple.classList.contains(selector), true))
  })

  it('should create an input with multiple attributes', function () {
    const type = "text"    
    const placeholder = "Enter your name"
    const name = "name"
    const id = name
    const input = create(`input(type="${type}" placeholder="${placeholder}" name="${name}" id="${id}"`)

    assert.equal(input.tagName.toLowerCase(), 'input')
    assert.equal(input.type, type)
    assert.equal(input.placeholder, placeholder)
    assert.equal(input.name, name)
    assert.equal(input.id, id)
  })

  it('should create a paragraph with the text `Hello, world!`', function () {
    const p = create('p Hello, world!')
    assert.equal(p.tagName.toLowerCase(), 'p')
    assert.equal(p.innerText, 'Hello, world!')
  })

  it('should handle JSON data-attributes', function() {
    const div = create('div(data-user={"id":1,"name":"John Doe"})')
    const user = JSON.parse(div.dataset.user)
    assert.equal(user.id, 1)
    assert.equal(user.name, "John Doe")
  })

})