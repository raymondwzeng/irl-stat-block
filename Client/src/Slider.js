import React from "react";

class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.sliderName = props.sliderName
        this.state = {value: props.sliderValue} //Set initial value

        this.setNewValue = this.setNewValue.bind(this); //Still not exactly sure why this binding is necessary, but we'll keep it.
    }

    //Stupid React State Methods >:(
    setNewValue = (event) => {
        let value = event.target.value
        if(value >= 100) value = 100
        // this.setState({value: event.target.value})
        this.props.renderCanvas({
            name: this.sliderName,
            value: value
        })
    }

    render() {
        //Prop helper for value
        const sliderValue = this.props.sliderValue
        const sliderClass = "Slider " + (this.props.shouldRenderMobile ? "fullWidth" : "scaleWidth");
        return (
            <div className={sliderClass}>
                <div className="flex flexHorizontal centerVertSpaceBetween">
                    <span className="flexShrink2">{this.sliderName}: </span>
                    <input className="numberInput" type="number" min="0" max="100" value={sliderValue} onChange={this.setNewValue}/>
                </div>
                <input className="fullWidth" type="range" min="0" max="100" value={sliderValue} onChange={this.setNewValue}/>
            </div>
        )
    }
}

export default Slider