/* @flow */


import React from 'react'
import {FluceInstance} from './types'


class Fluce extends React.Component {

  render(): ReactElement {
    return this.wrapChild(React.Children.only(this.props.children))
  }

  wrapChild(child: ReactElement): ReactElement {
    return React.cloneElement(child, this.getChildProps())
  }

  getChildProps(): {} {
    return {
      fluce: this.getFluce()
    }
  }

  getFluce(): FluceInstance {
    // TODO: get from context
    return this.props.fluce;
  }

}

export default Fluce
