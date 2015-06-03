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
