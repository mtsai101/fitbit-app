# Fitbit-app

This is the app for collection sensor by Fitbit smartwatch

## Requirements
1. Node.js 8+ on macOS, Linux, or Windows
2. Ensure your smartphone sync up with the smartwatch. (Fitbit account registration is needed, follow the guidance on your phone app)
## Installation
### Command Line Interface

If you are creating your own new project by:
```
npx create-fitbit-app <project-name>
```

If you are using this existing project, just use:
```
npm install
```
to install all the required packages. For more detail information, find [Fitbit Command Line Interface Guide](https://dev.fitbit.com/build/guides/command-line-interface/)

  
## Build & Run
### Clone the project
```
git clone https://github.com/mtsai101/fitbit-app.git
```

### Build
Whenever you write something and want to deploy it on watch, you need to build it first:
``` 
npx fitbit-build
```
or you can direct enter the fitbit-cli and then build: 
```
npx fitbit && build
```

### App Installation :
The installation would be on the phone and watch both.
1. On Phone: Use fitbit official app to sync phone and watch: Account (Icon) > Choose your device > "Sync". Life get easier if you sync before you do anything on this project.
2. On Phone: Wifi Setting > Select your Wifi. This step is important. The phone and watch should be under the same subnet. If the connection is successful, you will see the following thing:

<div style="align: center">
  <img src="https://user-images.githubusercontent.com/15339223/121379807-f9405980-c976-11eb-872e-67315bcb59a6.PNG" width="20%" height="20%">
  <img src="https://user-images.githubusercontent.com/15339223/121380304-56d4a600-c977-11eb-9afd-28ab29b20403.jpg" width="20%" height="20%">
  <img src="https://user-images.githubusercontent.com/15339223/121380361-60f6a480-c977-11eb-8511-67661926ccc1.jpg" width="20%" height="20%">
</div>

5. On Phone: "Developer Menu" > Turn on "Developer Bridge"
6. On Watch: "Settings" > "Developer bridge" > On
7. On Terminal: 
```
npx fitbit && install
```

If all the things work well, you will see the following things:

<div style="align: center">
  <img src="https://user-images.githubusercontent.com/15339223/121382838-92706f80-c979-11eb-99b6-ece2fa9cba4f.PNG" width="20%" height="20%">
  <img src="https://user-images.githubusercontent.com/15339223/121382718-766cce00-c979-11eb-8897-31ef0b49ce27.jpg" width="20%" height="20%">
  <img src="https://user-images.githubusercontent.com/15339223/121383060-bdf35a00-c979-11eb-95db-ebd566ffee5f.png" width="50%" height="50%">
</div>

Now the app will be lauched automatically and our app shows in the sideloaded apps.

### How to use:
Because our app is based on the setting project from Fitbit sample project, we access our app through fitbit official app:
(Note that wifi connection is optional here, only reinstallation needs to set wifi.)

1. Install [fitbit-server](https://github.com/mtsai101/fitbit-server) and launch API server. (Note that the phone, watch, server shold under the same subnet)
2. On Watch: Launch app
3. On Phone: "Developer Menu" > Select our app > Settings:Included > Start Record
4. On Watch: Turn off the toggle to stop record

The sensor data is sent to the API server. 


### Trouble Shooting

#### 1. Fail to sync:
Close the fitbit official app and relaunch

#### 2. Watch cannot connect to wifi
a. Make sure you have sync the watch and phone before the connection.

b. If you use Mac and iPhone personal hotspot, do not connect the laptop (API server) to hotspot before the watch connect to wifi

c. The wifi you connect need Internet anyway, the device will also sync with the cloud

#### 3. Unable to turn on "Developer bridge" in watch or install app
The wifi need Internet 


### App structure
A fitbit app typically contains the following folder:
```
/app
/common
/companion
/resource
/settings
```

**/app:** application logics that executes on watch. Applying [Device API](https://dev.fitbit.com/build/reference/device-api/) is capable of interacting with the presentation layer, communicating with *companion* (phone), and writing the setting. A file *index.js* must be in this folder.

**/companion: (optional):** companion logics the executes on phone. Applying [Companion API](https://dev.fitbit.com/build/reference/companion-api/) is capable of making direct requests to the internet, and communicating with the application. If a file *index.js* in the folder, the companion would be built.

**/common (optional):** Files within this folder can be shared between the application and companion to minimize duplication.

**/resource:** 
  - **/resource/index.view:** appearance of app on watch. SVG file
  - **/resource/XXX.css:** control the style of <link> in index.view
  - **/resource/icon.png:** app icon
  - **/resource/widget.defs:** control which system widget to use. SVG file

**/settings (optional):** ReactJSX file. User configurable (e.g., button, toggle, text) widgets. Code within this file access to the  [Settings API](https://dev.fitbit.com/build/reference/settings-api/).
