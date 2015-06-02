/* @flow */

import React from 'react'
import {addons} from 'react/addons'
var {TestUtils} = addons
var {createRenderer} = TestUtils

import Fluce from '../src/fluce-component'
import createFluce from '../src/create-fluce'



describe('<Fluce />', () => {


  it('Should throw when rendered with many children', () => {
    var renderer = createRenderer()
    var err: any
    try {
      renderer.render(<Fluce><div/><div/></Fluce>)
    } catch (e) {
      err = e
    }
    expect(err.message).toBe('Invariant Violation: onlyChild must be passed a children with exactly one child.')
  })


  it('Should pass `fluce` to the child', () => {
    var fluce = createFluce()

    var renderer = createRenderer()
    renderer.render(<Fluce fluce={fluce}><div foo='bar' /></Fluce>)
    var result = renderer.getRenderOutput()

    expect(result.type).toBe('div')
    expect(result.props).toEqual({foo: 'bar', fluce})
  })


})
