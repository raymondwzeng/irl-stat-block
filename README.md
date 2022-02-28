# MacAndSwiss' IRL Stats Generator

Hey there! Welcome to the public repository of my IRL Stats Generator web app.

![](/Screenie.jpg)

## Libraries & Tech:
- React
- NodeJS
- Canvas API (rendering the image and exporting)
- Discord API (OAuth 2)

### To Run Locally (without Discord integration):
Clone the repository, cd into the `Client` folder, and run `npm start` to deploy the web app locally.

### To Run Locally (with Discord integration):
1. Register an account on Discord, go through the bureaucracy, and hop over to https://discord.com/developers/applications to register a new application. 
2. Under the **Oath2** tab, add the URL to your web app in the "Redirects" section.
3. Under the *URL Generator* sub-tab, select the "Identity" scope, and copy the generated URL.
4. Replace `discordLoginURL` inside `Client/src/Canvas.js` with the copied URL.
5. Replace the `response_type` in the copied URL with "token" (should be "code" by default)

After that, your web app should have full Discord integration after a quick refresh. Enjoy!
