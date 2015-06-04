/* @flow */

import React from 'react'
import {addons} from 'react/addons'
var {TestUtils} = addons
var {createRenderer} = TestUtils

import Fluce from '../src/fluce-component'
import createFluce from '../src/create-fluce'

import {withDOM, cleanHtml, renderToHtml, removeProto} from './helpers'
import {storeCounter, storeCounter2} from './fixtures'



describe('<Fluce/>', () => {


  it('Should throw when rendered with many children', () => {
    var renderer = createRenderer()
    var err: any
    try {
      renderer.render(<Fluce fluce={createFluce()}><div/><div/></Fluce>)
    } catch (e) {
      err = e
    }
    expect(err.message).toBe('Invariant Violation: onlyChild must be passed a children with exactly one child.')
    renderer.unmount()
  })


  it('Should add `fluce` and `stores` to the child\'s props', () => {
    var fluce = createFluce()

    var renderer = createRenderer()
    renderer.render(<Fluce fluce={fluce}><div foo='bar' /></Fluce>)
    var result = renderer.getRenderOutput()
    renderer.unmount()

    expect(result.type).toBe('div')
    expect(result.props).toEqual({foo: 'bar', fluce, stores: Object.create(null)})
  })


  describe('Should transfer Fluce instance using context', () => {

    var fluce = createFluce()
    fluce.addStore('test', {
      initial() {
        return '123'
      },
      reducers: {}
    })

    class Test extends React.Component {
      render() {
        return <div>{this.props.fluce.stores.test}</div>
      }
    }

    // Here `fluce` also passed through props, so I'm not sure what works
    it('... without wrapper', () => {
      expect(renderToHtml(
        <Fluce fluce={fluce}>
          <Fluce>
            <Test/>
          </Fluce>
        </Fluce>
      )).toBe('<div>123</div>')
    })
    it('... all in wrapper', () => {
      class Wrap extends React.Component {
        render() {
          return <Fluce fluce={fluce}>
            <Fluce>
              <Test/>
            </Fluce>
          </Fluce>
        }
      }
      expect(renderToHtml(<Wrap/>)).toBe('<div>123</div>')
    })

    // This doesn't work in React 0.13, but will on 0.14
    //
    // it('... without wrapper, one layer deeper', () => {
    //   expect(renderToHtml(
    //     <Fluce fluce={fluce}>
    //       <div>
    //         <Fluce>
    //           <Test/>
    //         </Fluce>
    //       </div>
    //     </Fluce>
    //   )).toBe('<div><div>123</div></div>')
    // })
    // it('... all in wrapper, one layer deeper', () => {
    //   class Wrap extends React.Component {
    //     render() {
    //       return <Fluce fluce={fluce}>
    //         <div>
    //           <Fluce>
    //             <Test/>
    //           </Fluce>
    //         </div>
    //       </Fluce>
    //     }
    //   }
    //   expect(renderToHtml(<Wrap/>)).toBe('<div><div>123</div></div>')
    // })

    it('... in a wrapper', () => {
      class Wrap extends React.Component {
        render() {
          return <Fluce><Test/></Fluce>
        }
      }
      expect(renderToHtml(
        <Fluce fluce={fluce}>
          <Wrap />
        </Fluce>
      )).toBe('<div>123</div>')
    })

    it('... in a wrapper, one layer deeper', () => {
      class Wrap extends React.Component {
        render() {
          return <div><Fluce><Test/></Fluce></div>
        }
      }
      expect(renderToHtml(
        <Fluce fluce={fluce}>
          <Wrap />
        </Fluce>
      )).toBe('<div><div>123</div></div>')
    })

  })




  describe('should pass stores to props', () => {

    var fluce = createFluce()
    fluce.addStore('counter', storeCounter)
    fluce.addStore('counter2', storeCounter2)
    fluce.addStore('counter3', storeCounter)
    fluce.addStore('counter4', storeCounter2)

    it('should pass initial state', () => {
      var renderer = createRenderer()
      renderer.render(<Fluce fluce={fluce} stores={['counter', 'counter2']}><div/></Fluce>)
      expect(renderer.getRenderOutput().props.stores).toEqual(removeProto({counter: 0, counter2: 0}))
      renderer.unmount()
    })

    it('should pass updated state', () => {
      var renderer = createRenderer()
      renderer.render(<Fluce fluce={fluce} stores={['counter', 'counter2']}><div/></Fluce>)
      fluce.dispatch('add', 10)
      expect(renderer.getRenderOutput().props.stores).toEqual(removeProto({counter: 10, counter2: -10}))
      fluce.dispatch('add', -10)
      renderer.unmount()
    })

    it('should unsubscribe', () => {
      var renderer = createRenderer()
      var countBefore = fluce._countListeners()
      renderer.render(<Fluce fluce={fluce} stores={['counter', 'counter2']}><div/></Fluce>)
      var countAfter = fluce._countListeners()
      renderer.unmount()
      var countAfter2 = fluce._countListeners()
      expect([countBefore, countAfter, countAfter2]).toEqual([0, 1, 0])
    })

    it('should respect change of `stores` prop', () => {
      var renderer = createRenderer()
      renderer.render(<Fluce fluce={fluce} stores={['counter', 'counter2']}><div/></Fluce>)
      renderer.render(<Fluce fluce={fluce} stores={['counter']}><div/></Fluce>)
      expect(renderer.getRenderOutput().props.stores).toEqual(removeProto({counter: 0}))
      renderer.unmount()
    })

    it('should respect change of `stores` prop (should re-subscribe)', () => {
      var renderer = createRenderer()
      renderer.render(<Fluce fluce={fluce} stores={['counter']}><div/></Fluce>)
      renderer.render(<Fluce fluce={fluce} stores={['counter', 'counter2']}><div/></Fluce>)
      fluce.dispatch('add', 10)
      expect(renderer.getRenderOutput().props.stores).toEqual(removeProto({counter: 10, counter2: -10}))
      fluce.dispatch('add', -10)
      renderer.unmount()
      expect(fluce._countListeners()).toBe(0)
    })

    it('should respect change of `stores` prop (real DOM)', () => {
      class PrintStores extends React.Component {
        render() {
          return <div>{JSON.stringify(this.props.stores)}</div>
        }
      }
      withDOM(el => {
        React.render(<Fluce fluce={fluce} stores={['counter', 'counter2']}><PrintStores/></Fluce>, el)
        expect(cleanHtml(el.innerHTML)).toBe('<div>{"counter":0,"counter2":0}</div>')
        React.render(<Fluce fluce={fluce} stores={['counter']}><PrintStores/></Fluce>, el)
        expect(cleanHtml(el.innerHTML)).toBe('<div>{"counter":0}</div>')
      })
    })

  })





})
