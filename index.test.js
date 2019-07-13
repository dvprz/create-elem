'use strict'

const { create } = require('./')

describe('create-element', () => {

  test('should create an empty div', () => {
    const div = create('div')

    expect(div.tagName.toLowerCase()).toBe('div')
  })

  test('should create a div with one class', () => {
    const selector = 'container'
    const single = create(`div(class="${selector}")`)

    expect(single.classList.contains(selector)).toBe(true)
  })

  test('should create a paragraph with one class and some text', () => {
    const p = create('p(class="container") Milk')

    expect(p.tagName.toLowerCase()).toBe('p')
    expect(p.innerText).toBe('Milk')
  })

  test('should create a div with multiple classes', () => {
    const selectors = ['card', 'flex']
    const multiple = create(`div(class="${selectors.join(' ')}")`)

    selectors.forEach(selector => expect(multiple.classList.contains(selector)).toBe(true))
  })

  test('should create an input with multiple attributes', () => {
    const type = 'text'    
    const placeholder = 'Enter your name'
    const name = 'name'
    const id = name
    const input = create(`input(type="${type}" placeholder="${placeholder}" name="${name}" id="${id}"`)

    expect(input.tagName.toLowerCase()).toBe('input')
    expect(input.type).toBe(type)
    expect(input.placeholder).toBe(placeholder)
    expect(input.name).toBe(name)
    expect(input.id).toBe(id)
  })

  test('should create a paragraph with the text `Hello, world!`', () => {
    const p = create('p Hello, world!')

    expect(p.tagName.toLowerCase()).toBe('p')
    expect(p.innerText).toBe('Hello, world!')
  })

  test('should handle JSON data-attributes', () => {
    const div = create('div(data-user={"id":1,"name":"John Doe"})')
    const user = JSON.parse(div.dataset.user)

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

})