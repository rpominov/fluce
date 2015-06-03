/* @flow */

import React from 'react'


export function withDOM<T>(cb: (el: Element) => T): T {
  var div = document.createElement('div')
  document.body.appendChild(div)
  var result = cb(div)
  document.body.removeChild(div)
  return result
}

export function cleanHtml(html: string): string {
  return html.replace(/ data\-reactid=".*?"/g, '')
}

export function renderToHtml(tree: ReactElement): string {
  return withDOM(el => {
    React.render(tree, el)
    return cleanHtml(el.innerHTML)
  })
}


type map = {[key: string]: any}

// Converts Object({...}) to null({...})
export function removeProto(source: map): map {
  var result = Object.create(null)
  var keys = Object.keys(source)
  var i
  for (i = 0; i < keys.length; i++) {
    result[keys[i]] = source[keys[i]]
  }
  return result
}
