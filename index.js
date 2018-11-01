'use strict'

const TYPES = {
  ATTRIBUTES: 'attributes',
  TEXT: 'text',
  TAG: 'tag'
}

const REGEX = /([\w-]*)=(([{[]|['"])([-\w :,'"]+)([\]}]|['"]))/g

const makeToken = (value, type = TYPES.TAG) => ({ value, type })

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

      if (peekAhead() === ' ') {
        consume(2)
        advanceLeft()
  
        while (!isDone()) {
          consume()
        }
  
        tokens.push(makeToken(extract(left, right), TYPES.TEXT))
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
      let preprocessed = token.value.replace(REGEX, '{"attribute":"$1", "value":$2},')
      let stringified = `[${preprocessed.slice(0, -1)}]`
      const options = JSON.parse(stringified)

      options.forEach(option => {
        const { attribute, value } = option

        if (attribute.includes('data') && typeof value !== 'string') {
          node.setAttribute(attribute, JSON.stringify(value))
        } else {
          node.setAttribute(attribute, value)
        }
      })
    } else if (token.type === TYPES.TEXT) {
      node.innerText = token.value
    }
  })

  return node
}