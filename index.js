'use strict'

const TYPES = {
  ATTRIBUTES: 'attributes',
  TEXT: 'text',
  TAG: 'tag'
}

const makeToken = (value, type = TYPES.TAG) => ({ value, type })

// const create = (string) => {
module.exports.create = (string) => {
  string = string.trim()
  let left, right, tokens = [], node, end = string.length
  left = right = 0

  const isDone = () => right > end

  const peekAhead = () => {
    let next = right
    next++
    return string[next]
  }

  const consume = (chars = 1) => chars === 1 ? right++ : right+= chars

  const advanceLeft = () => left = right

  const extract = (start, end) => string.slice(start, end)  

  while (!isDone()) {
    const char = peekAhead()

    if (char === '(') {
      tokens.push(makeToken(extract(left, right + 1)))
      consume(2)
      advanceLeft()

      while (!isDone() && peekAhead() !== ')') {
        consume()
      }

      tokens.push(makeToken(extract(left, right + 1), TYPES.ATTRIBUTES))
      consume()
      advanceLeft()

      if (char === ' ') {
        consume(2)
        advanceLeft()
  
        while (!isDone()) {
          consume()
        }
  
        tokens.push(makeToken(extract(left, right), TYPES.ATTRIBUTES))
        advanceLeft()
      }
    } else if (char === ' ') {
      tokens.push(makeToken(extract(left, right + 1)))      
      consume(2)
      advanceLeft()

      while (!isDone()) {
        consume()
      }

      tokens.push(makeToken(extract(left, right), TYPES.TEXT))
      consume()
      advanceLeft()
    } else {
      consume()
    }
  }

  if (left === 0) {
    tokens.push(makeToken(extract(left, right)))
  }

  tokens.forEach(token => {
    if (token.type === 'tag') {
      node = document.createElement(token.value)
    } else if (token.type === TYPES.ATTRIBUTES) {
      const regex = /([\w-]+)=["|']([\w\s\[{":}\]]+)["|']/g
      const stringified = `[${token.value.replace(regex, '{"attribute":"$1","value":"$2"},').slice(0, -1)}]`
      const configurers = JSON.parse(stringified)

      configurers.forEach(configure => node.setAttribute(configure.attribute, configure.value))
    } else if (token.type === TYPES.TEXT) {
      node.innerText = token.value
    }
  })

  return node
}


// const body = document.querySelector('body')
// const attributes = {
//   name: "dave",
//   type: 'text'
// }

// const input = create(`input(...attributes)`)
// console.log(input)
// const container = create('div(class="foo bar" id="main" data-name="Dave") Hello, world!')
// body.appendChild(container)
// body.appendChild(input)
// console.log(container)
// console.log()

// todo add support for json in data attributes
// todo add support for empty attribues