# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Fitbit smartwatch application for collecting sensor data (heart rate, accelerometer, gyroscope, orientation) and transmitting it to an external API server. The app uses the Fitbit SDK and follows the standard Fitbit application architecture with three main components running on different platforms.

## Build and Development Commands

### Build the application
```bash
npx fitbit-build
# or
npm run build
```

### Enter Fitbit CLI and build
```bash
npx fitbit
# then run: build
```

### Install application to watch
```bash
npx fitbit
# then run: install
```

Note: Installation requires the Fitbit phone app, watch, and development machine to be on the same subnet with WiFi connected. The Developer Bridge must be enabled on both phone and watch.

## Architecture

### Three-Component System

The application follows Fitbit's standard architecture with three distinct execution environments:

1. **app/** - Device code (runs on Fitbit watch)
   - Entry point: `app/index.js`
   - Initializes sensors: HeartRateSensor, Accelerometer, Gyroscope, OrientationSensor
   - Collects sensor data at configurable frequency (default: 0.5 Hz sampling, 1000ms transmission interval)
   - Uses Messaging API to communicate with companion (phone)
   - Updates UI elements via `document.getElementById()` to display sensor readings

2. **companion/** - Companion code (runs on phone)
   - Entry point: `companion/index.js`
   - Receives sensor data from watch via Messaging API
   - Makes HTTP POST requests to external API server with sensor data
   - Makes HTTP GET request when recording stops to trigger data packaging
   - Hardcoded API server URL: `http://172.20.10.6:3000/sensor` (update for your network)

3. **settings/** - Settings UI (ReactJSX, runs in Fitbit mobile app)
   - Entry point: `settings/index.jsx`
   - Provides Toggle control to start/stop recording
   - Changes propagate through companion to watch via settingsStorage events

### Communication Flow

Watch (app) <--Messaging API--> Phone (companion) <--Settings API--> Settings UI

Phone (companion) --HTTP POST/GET--> External API Server

### Data Flow

1. User toggles "Start Record" in Fitbit app settings
2. Settings change propagates to companion via `settingsStorage.onchange`
3. Companion sends message to watch via `messaging.peerSocket.send()`
4. Watch receives message, starts/stops recording via `setSensor(evt)`
5. When recording, watch sends sensor data every `RecordInterval` (1000ms) to companion
6. Companion forwards data to API server via HTTP POST
7. When recording stops, companion sends GET request to finalize data storage

### Key Configuration Constants

Located in `app/index.js`:
- `RecordInterval`: 1000ms - interval for sending data samples to companion
- `SamplingRate`: 0.5 Hz - sensor reading frequency (minimum supported)

### Resources

- `resources/index.view` - SVG-based UI layout for watch display
- `resources/styles.css` - UI styling
- `resources/widget.defs` - System widget definitions
- `resources/icon.png` - Application icon

## Development Requirements

- Node.js 8+ on macOS, Linux, or Windows
- Fitbit account with registered smartwatch
- Device targets: atlas, vulcan (Fitbit Sense, Versa 3)
- API server must be running on same subnet (see companion URL configuration)

## Network Configuration

The companion hardcodes the API server address at `companion/index.js:23`. Update this URL based on your network:
```javascript
let url = `http://172.20.10.6:3000${path}`;
```

All devices (watch, phone, development machine, API server) must be on the same subnet for proper communication.
