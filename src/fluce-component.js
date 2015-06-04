/* @flow */


import React from 'react/addons'
import {FluceInstance} from './types'
import {pick, eqArrays} from './_'


class Fluce extends React.Component {

  _unsubscribe: ?Function;

  constructor(props: {}) {
    super(props)
    this.state = {
      partialStoresState: Object.create(null)
    }
  }

  componentWillMount() {
    if (!this.getFluce()) {
      throw new Error('Could not find `fluce` on `this.props` or `this.context` of <Fluce />')
    }
    this.subscribe(this.props.stores || [])
    this.updateLocalState(this.props.stores || [])
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentWillReceiveProps(nextProps: {stores: ?Array<string>}) {
    var curStores = this.props.stores || []
    var nextStores = nextProps.stores || []

    if (!eqArrays(curStores, nextStores)) {
      this.unsubscribe()
      this.subscribe(nextStores)
      this.updateLocalState(nextStores)
    }
  }

  subscribe(stores: Array<string>) {
    if (stores.length > 0) {
      this._unsubscribe = this.getFluce().subscribe(stores, () => this.updateLocalState(stores))
    }
  }

  unsubscribe() {
    if (this._unsubscribe) {
      this._unsubscribe()
      this._unsubscribe = undefined
    }
  }

  updateLocalState(stores) {
    var fluce = this.getFluce()
    this.setState({
      partialStoresState: pick(stores, fluce.stores)
    })
  }

  render(): ReactElement {
    return this.wrapChild(React.Children.only(this.props.children))
  }

  wrapChild(child: ReactElement): ReactElement {
    // `React.cloneElement` doesn't preserve `context`.
    // See https://github.com/facebook/react/issues/4008
    return React.addons.cloneWithProps(child, this.getChildProps())
  }

  getFluce(): FluceInstance {
    return this.props.fluce || this.context.fluce
  }

  getChildProps(): {} {
    return {
      fluce: this.getFluce(),
      stores: this.state.partialStoresState
    }
  }

  getChildContext(): {} {
    return {
      fluce: this.getFluce()
    }
  }

}

Fluce.propsTypes = {
  fluce: React.PropTypes.object,
  stores: React.PropTypes.array
}

Fluce.contextTypes = {
  fluce: React.PropTypes.object
}

Fluce.childContextTypes = {
  fluce: React.PropTypes.object
}



export default Fluce
