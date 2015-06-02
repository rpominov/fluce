/* @flow */


import React from 'react/addons'
import {FluceInstance} from './types'


class Fluce extends React.Component {

  componentWillMount() {
    if (!this.getFluce()) {
      throw new Error('Could not find `fluce` on `this.props` or `this.context` of <Fluce />')
    }
  }

  render(): ReactElement {
    return this.wrapChild(React.Children.only(this.props.children))
  }

  wrapChild(child: ReactElement): ReactElement {
    return React.addons.cloneWithProps(child, this.getChildProps())
  }

  getFluce(): FluceInstance {
    return this.props.fluce || this.context.fluce
  }

  getChildProps(): {} {
    return {
      fluce: this.getFluce()
    }
  }

  getChildContext(): {} {
    return {
      fluce: this.getFluce()
    }
  }

}

Fluce.propsTypes = {
  fluce: React.PropTypes.object
}

Fluce.contextTypes = {
  fluce: React.PropTypes.object
}

Fluce.childContextTypes = {
  fluce: React.PropTypes.object
}



export default Fluce
