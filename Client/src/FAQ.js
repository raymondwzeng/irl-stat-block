import React from "react"

function FAQ() {
    return(
        <div id="FAQ">
            <h1>FAQ</h1>
            <h3>Why does this exist?</h3>
            <p>Long story short, this was inspired after seeing someone else's "IRL stats" on the <a target="_blank" rel="noreferrer" href="https://www.healthygamer.gg/">HGG</a> Discord server. I had an idea to fuse this idea with those "level cards" that seem to be so popular on the platform, as well as those cool microservices that let you create some beautiful code blocks to display, such as <a target="_blank" rel="noreferrer" href="https://carbon.now.sh/">Carbon</a>.</p>
            <h3>Why doesn't the canvas scale?</h3>
            <p>As a static image, it doesn't really make sense for the canvas to scale - that would mean that some cards would be larger than others. So I made the decision to intentionally <b>not</b> scale the canvas, so the resulting image will be identical no matter where you edit.</p>
            <p>Unfortunately, this also means that folks on mobile devices may not have the best user experience. I apologize.</p>
        </div>

    )
}

export default FAQ