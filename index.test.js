'use strict'

const assert = require('assert')
const { create } = require('./')

describe('create-element', () => {

  test('should create an empty div', () => {
    const div = create('div')
    assert.equal(div.tagName.toLowerCase(), 'div')
  })

  test('should create a div with one class', () => {
    const selector = 'container'
    const single = create(`div(class="${selector}")`)

    assert.equal(single.classList.contains(selector), true)
  })

  test('should create a paragraph with one class and some text', () => {
    const p = create('p(class="container") Milk')

    assert.equal(p.tagName.toLowerCase(), 'p')
    assert.equal(p.innerText, 'Milk')
  })

  test('should create a div with multiple classes', () => {
    const selectors = ['card', 'flex']
    const multiple = create(`div(class="${selectors.join(' ')}")`)

    selectors.forEach(selector => assert.equal(multiple.classList.contains(selector), true))
  })

  test('should create an input with multiple attributes', () => {
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

  test('should create a paragraph with the text `Hello, world!`', () => {
    const p = create('p Hello, world!')
    assert.equal(p.tagName.toLowerCase(), 'p')
    assert.equal(p.innerText, 'Hello, world!')
  })

  test('should handle JSON data-attributes', () => {
    const div = create('div(data-user={"id":1,"name":"John Doe"})')
    const user = JSON.parse(div.dataset.user)
    assert.equal(user.id, 1)
    assert.equal(user.name, "John Doe")
  })

})