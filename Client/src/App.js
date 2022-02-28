//App.js
//Base of the app, where everything else will derive from.

import React from "react"
import Canvas from "./Canvas"
import FAQ from "./FAQ"

class App extends React.Component {

    //From https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react

    // state = { width: 0, height: 0}

    constructor(props) {
      super(props)
      this.setState({width: 0, height: 0, shouldRenderMobile: false})
    }

    updateDimentions = () => {
      this.setState({width: window.innerWidth, height: window.innerHeight, shouldRenderMobile: window.innerWidth <= 500})
    }

    componentDidMount() {
      window.addEventListener('resize', this.updateDimentions)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateDimentions)
    }

    render() {
      
      return (
        <div className='App'>
          <div id="githubLink">
            <a href="https://github.com/raymondwzeng/irl-stat-block" target="_blank" rel="noreferrer" className="floatRight">View the project on GitHub</a>
          </div>
          <div id="titleCard">
            <h1 className="nomargin">MacAndSwiss' IRL Stat Card Maker</h1>
          </div>
          <Canvas windowData={this.state == null ? false : this.state}/>
          <FAQ/>
        </div>
      )
    }
  }

export default App