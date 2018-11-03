'use strict'

const TOKEN_ATTRIBUTES = 'attributes'
const TOKEN_TEXT = 'text'
const TOKEN_TAG = 'tag'
const WORD_REGEX = /[a-z\-]/i
const WHITESPACE_REGEX = /\s/
const ATTRIBUTE_VALUE_REGEX = /([\w-]*)=(([{[]|['"])([-\w :,'"]+)([\]}]|['"]))/g
const REPLACE_WITH = '{"attribute":"$1", "value":$2},'
const DATA_KEY = 'data'

const tokenizer = (string) => {
  let current = 0
  let tokens = []
  let length = string.length

  while (current < length) {
    let char = string[current]

    if (WORD_REGEX.test(char)) {
      let capture = ''

      while (char && WORD_REGEX.test(char)) {
        capture += char
        char = string[++current]
      }

      tokens.push({ type: TOKEN_TAG, value: capture })
    }

    if (WHITESPACE_REGEX.test(char)) {
      let capture = ''

      char = string[++current]

      while (char) {
        capture += char
        char = string[++current]
      }

      tokens.push({ type: TOKEN_TEXT, value: capture })      
    }

    if (char === '(') {
      let capture = ''

      char = string[++current]

      while (char && char !== ')') {
        capture += char
        char = string[++current]
      }

      tokens.push({ type: TOKEN_ATTRIBUTES, value: capture })
    }

    current++
  }

  return tokens
}

const transform = (tokens) => {
  let node

  tokens.forEach(token => {
    if (token.type === TOKEN_TAG) {
      node = document.createElement(token.value)
    } else if (token.type === TOKEN_ATTRIBUTES) {
      let preprocessed = token.value.replace(ATTRIBUTE_VALUE_REGEX, REPLACE_WITH)
      let stringified = `[${preprocessed.slice(0, -1)}]`
      let options = JSON.parse(stringified)

      options.forEach(option => {
        let { attribute, value } = option

        if (attribute.includes(DATA_KEY) && typeof value !== 'string') {
          node.setAttribute(attribute, JSON.stringify(value))
        } else {
          node.setAttribute(attribute, value)
        }
      })
    } else if (token.type === TOKEN_TEXT) {
      node.innerText = token.value
    }
  })

  return node
}

module.exports.create = (string) => {  
  let tokens = tokenizer(string.trim())
  return transform(tokens)
}