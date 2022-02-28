import React, { Component } from "react";
import Slider from "./Slider";
import logo from "./logo512.png"
import {Buffer} from "buffer"

const discordLoginURL = "https://discord.com/api/oauth2/authorize?client_id=947633972576399400&redirect_uri=http%3A%2F%2Fraymondwzeng.github.io%2Firl-stat-block&response_type=token&scope=identify"

//Why must you do this to me JavaScript. You were the chosen one.
const downloadMagic = (URL) => {
    let element = document.createElement('a')
    element.setAttribute('href', URL)
    element.setAttribute('download', 'irl-stats')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}

//From DiscordJS website, may god have mercy on my soul if I ever use this in production outside of small projects
const generateState = () => {
    let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

class Canvas extends Component {

    constructor(props) {
        super(props)

        //Default Stats
        this.state = {
            Image: logo,
            Username: "",
            Health: 50,
            Strength: 50,
            Dexterity: 50,
            Intelligence: 50,
            Wisdom: 50,
            Charisma: 50,
            ScreenRender: "",
            DiscordID: ""
        }

        this.canvasRef = React.createRef()
        this.exportCanvas = this.exportCanvas.bind(this)
        this.updateStats = this.updateStats.bind(this)
        this.updateCanvas = this.updateCanvas.bind(this)
        this.updateName = this.updateName.bind(this) //Ohh...this actually binds the state to the function so that we can actually modify the state LOL
        this.updatePicture = this.updatePicture.bind(this)
        this.changeDiscordID = this.changeDiscordID.bind(this)
        // this.modifyComponents = this.modifyComponents.bind(this)

        if(localStorage.getItem('oath-state') == null) {
            localStorage.setItem('oath-state', generateState()); //Randomly generate on each load. Maybe overkill?
        }
    }

    updateStats(eventSnippet) {
        this.state[eventSnippet.name] !== null ? this.setState({[eventSnippet.name] : parseInt(eventSnippet.value)}) : console.warn("Oops, something went wrong")
        setTimeout(() => {this.updateCanvas()}, 1)  //This absolute 1Head of a line is due to the canvas updating before react can update itself. Too bad!
    }

    updateName(event) {
        if(this.state.Username !== event.target.value) {
            this.setState({Username : event.target.value})
            setTimeout(() => {this.updateCanvas()}, 1)  //This absolute 1Head of a line is due to the canvas updating before react can update itself. Too bad!
        }
    }

    drawHealthbar(context, xOffset, yOffset) {
        let HealthString
        if(this.state.Health >= 90) {
            HealthString = "💖"
        } else if (this.state.Health >= 25) {
            HealthString = "❤️"
        } else {
            HealthString = "💔"
        }
        context.fillStyle = "#000000"
        context.strokeRect(xOffset*1.1 + 128, yOffset*1.8, 400, 20) //Background of Health
        context.fillStyle = "#949492"
        context.fillRect(xOffset*1.1 + 129, yOffset*1.8+1, 398, 18) //Inner BG of Health
        context.fillStyle = "#FC5353"
        context.fillRect(xOffset*1.1 + 129, yOffset*1.8+1, 398*(this.state.Health/100), 18) //Inner fill of health
        context.fillStyle = "#ffffff"
        context.fillText(HealthString + " Health: " + this.state.Health, xOffset*1.1+128, yOffset + 66)
    }

    createLinearGradientBackground(context) {
        let gradient = context.createLinearGradient(0, 0, context.canvas.width, context.canvas.height)
        gradient.addColorStop(0, 'cyan')
        // gradient.addColorStop(0.5, 'cyan')
        gradient.addColorStop(1, 'blue')
        context.fillStyle = gradient
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = "#ffffff"
    }

    createInnerBackground(context, xOffset, yOffset) {
        context.fillStyle = "#00000033"
        context.fillRect(xOffset - 5, yOffset, context.canvas.width - 2*xOffset - 5, context.canvas.height/2 - 5)
        context.fillStyle = "#ffffff"
    }

    updatePicture(event) {
        this.setState({Image: URL.createObjectURL(event.target.files[0])})
        setTimeout(() => {this.updateCanvas()}, 0)
    }

    //Update canvas with new state.
    updateCanvas() {
        const xOffset = 50
        const yOffset = 90
        const canvas = this.canvasRef.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.textAlign = "start"
        this.createLinearGradientBackground(context)
        this.createInnerBackground(context, xOffset, yOffset)
        //Draw the picture
        let image = new Image()
        image.crossOrigin = "anonymous"
        image.onload = () => {
            context.save();
            context.beginPath();
            context.arc(xOffset+64, yOffset+56, 48, 0, 2*Math.PI)
            context.clip()
            context.drawImage(image, xOffset+16, yOffset+8, 96, 96)
            context.restore();
        }
        image.src = this.state.Image
        
        if(this.state.Username !== "") {
            context.font = '24pt Helvetica'
            context.fillText(this.state.Username, xOffset*1.1+128, 40+yOffset)
        }
        context.font = '12pt Helvetica'
        this.drawHealthbar(context, xOffset, yOffset)

        let omegaString = ""
        omegaString += "💪 Strength: " + this.state.Strength
        omegaString += "  |  💨 Dexterity: " + this.state.Dexterity
        omegaString += "  |  🧠 Intelligence: " + this.state.Intelligence
        omegaString += "  |  👴 Wisdom: " + this.state.Wisdom
        omegaString += "  |  💋 Charisma: " + this.state.Charisma

        context.textAlign = "center"
        context.fillText(omegaString, canvas.width/2, 90 + yOffset*1.4)
    }

    resizeCanvas(canvas) {
        canvas.width = 900
        canvas.height = 300
        this.updateCanvas()
    }

    componentDidMount() {
        const fragment = new URLSearchParams(window.location.hash.substring(1))
        const [token, type, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')]

        if(token && !state) {
            console.warn("[Warning] Invalid state - token exists without state. Aborting out of caution.")
        } else if (state !== Buffer.from(localStorage.getItem('oath-state')).toString("base64")) {
            console.warn("[Warning] Invalid state - does not match original local state. Aborting out of caution.")
        } else if(token && state) {
             //We did it reddit
            fetch('https://discord.com/api/v9/users/@me', {
                headers :{
                    authorization: `${type} ${token}`
                }
            }).then(result => result.json())
            .then(response => {
                this.setState({Username: response.username})
                this.setState({Image: "https://cdn.discordapp.com/avatars/" + response.id + "/" + response.avatar + ".png"})
                this.updateCanvas()
            })
        }

        const canvas = this.canvasRef.current
        this.resizeCanvas(canvas)
    }

    exportCanvas() {
        const image = this.canvasRef.current.toDataURL('image/png')
        downloadMagic(image)
    }

    changeDiscordID(event) {
        this.setState({DiscordID: event.target.value})
    }

    render() {
        //Bunch of silly helper methods to make the slider values change properly
        const Health = this.state.Health
        const Strength = this.state.Strength
        const Dexterity = this.state.Dexterity
        const Intelligence = this.state.Intelligence
        const Wisdom = this.state.Wisdom
        const Charisma = this.state.Charisma

        const sliderContainerClass = "flex centerFlex fullWidth " + (this.props.windowData.shouldRenderMobile ? "flexVertical" : "flexHorizontal")
        const topContainerClass = "flex centerFlex fullWidth smallVertMargin " + (this.props.windowData.shouldRenderMobile ? "flexVertical" : "flexHorizontal")

        return(
            <div id="motherComponent" className="centerFlex">
                <div>
                    <div id="topContainer" className={topContainerClass}>
                        <span>Enter your details manually: </span>
                        <input type='text' className="smallHorzMargin" placeholder="Enter your name..." onChange={this.updateName} value={this.state.Username} maxLength="20"/>
                        <label htmlFor="manualFileUpload" className="customButton">Upload a picture!</label>
                        <input id="manualFileUpload" type='file' onChange={this.updatePicture}/>
                    </div>
                    <div className={topContainerClass}>
                        <span className="smallHorzMargin">Or import from Discord directly: </span> 
                        <a href={discordLoginURL + "&state=" + Buffer.from(localStorage.getItem("oath-state")).toString("base64")} className="customButton">Import!</a>
                    </div>
                </div>

                <hr/>
                <div id="sliderContainer" className={sliderContainerClass}>
                    <Slider sliderName="Health" shouldRenderMobile={this.props.windowData.shouldRenderMobile} sliderValue={Health} renderCanvas={this.updateStats}/>
                    <Slider sliderName="Strength" shouldRenderMobile={this.props.windowData.shouldRenderMobile} sliderValue={Strength} renderCanvas={this.updateStats}/>
                    <Slider sliderName="Dexterity" shouldRenderMobile={this.props.windowData.shouldRenderMobile} sliderValue={Dexterity} renderCanvas={this.updateStats}/>
                    <Slider sliderName="Intelligence" shouldRenderMobile={this.props.windowData.shouldRenderMobile} sliderValue={Intelligence} renderCanvas={this.updateStats}/>
                    <Slider sliderName="Wisdom" shouldRenderMobile={this.props.windowData.shouldRenderMobile} sliderValue={Wisdom} renderCanvas={this.updateStats}/>
                    <Slider sliderName="Charisma" shouldRenderMobile={this.props.windowData.shouldRenderMobile} sliderValue={Charisma} renderCanvas={this.updateStats}/>
                </div>
                <canvas ref={this.canvasRef}/>
                
                <button onClick={this.exportCanvas} className="customButton smallVertMargin">Export as image!</button>
            </div>
        )
    }
    
}

export default Canvas