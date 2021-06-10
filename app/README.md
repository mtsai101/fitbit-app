# app/index.js

## Sensor initialization
We use [Device API](https://dev.fitbit.com/build/reference/device-api/) to control the watch sensor.

First, we need to initialize and start all the sensors. We use *document.getElementById("XXX")* to interact with the presentation layer. 

```javascript
import { HeartRateSensor } from "heart-rate";
import { Accelerometer } from "accelerometer";
import { OrientationSensor } from "orientation";
import { Gyroscope } from "gyroscope";

const hrmData = document.getElementById("hrm-data");
const accelData = document.getElementById("accel-data");
const gyroData = document.getElementById("gyro-data");
const orientationData = document.getElementById("orientation-data");
```


```javascript
if (Accelerometer) {
  const accel = new Accelerometer({ frequency: SamplingRate });
  accel.addEventListener("reading", () => {
    acc_x = accel.x ? accel.x.toFixed(1) : 0;
    acc_y = accel.y ? accel.y.toFixed(1) : 0;
    acc_z = accel.z ? accel.z.toFixed(1) : 0;
    AccData[0] = acc_x; AccData[1] = acc_y; AccData[2] = acc_z; 
    accelData.text = recording ? JSON.stringify({
      x: acc_x,
      y: acc_y,
      z: acc_z
    }) : defaultDisplayValue;
  });
  sensors.push(accel);
  accel.start();
  console.log("Open Acc Sensor");
} else {
  accelLabel.style.display = "none";
  accelData.style.display = "none";
}
```

We set the *data frequency* at this step. The frequency is 0.5 by default, which means that the watch generates a data sample every 0.5 sec. Note that there is limitation on minimal data frequency, 0.5 is the available one we have tried.

## Data Communication
The following diagram demonstrates an application running on the Fitbit app, communicating with it's associated companion (mobile phone), which provides access to resources on the internet.

<img width="802" alt="Screen Shot 2021-06-10 at 1 28 42 PM" src="https://user-images.githubusercontent.com/15339223/121469838-c8503b00-c9ef-11eb-9328-d4960af02e86.png">

The [Messaging API](https://dev.fitbit.com/build/guides/communications/messaging/) provides a synchronous socket based communications channel for sending and receiving simple messages while the app is running on the device.

```javascript
// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message is received
messaging.peerSocket.onmessage = evt => {
  setSensor(evt);
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};
```

**setSensor(evt):** is triggered whenever a event (control message) comes. Note that the *evt* probably comes from settings or companion. For example, *evt.data.key==="record"* results from <Toggle> in settings/index.jsx, while *evt.data.key==="idle"* is set by companion/index.js.

```javascript
function setSensor(evt){
  console.log("setSensor!!");
  if (evt.data.key === "record"){
      if(evt.data.value==="true"){
          startRecord();
          console.log("start to record");
      } else {
        hrmData.text = "Waiting & Saving...";
        console.log("stop to record");
        stopRecord();
        sendVal({key:"saving", value:"true"});
      }
  }else if (evt.data.key==="idle"){
    hrmData.text = defaultDisplayValue;
    accelData.text = defaultDisplayValue;
    gyroData.text = defaultDisplayValue;
    orientationData.text = defaultDisplayValue;
  }else{
    console.log("Device gets Unknown message!!!");
  }
}
```

**startRecord(evt):** is triggered whenever the (key, value) of coming event (control message) is (record, true). Note that *RecordInterval* is the data sampling interval (the default is 1000 ms, which means we send the newest data sample to companion every second). As a result, the API server receive one data sample every *RecordInterval* millisecond, not every *data frequency* second.
  
```javascript
function startRecord(){
  recording = true;
  SampleInstance = setInterval(function () {
    sendVal(
      {key:'data', value:JSON.stringify({
      timestamp: new Date().getTime(),
      heartRate: HRdata,
      accelerator: AccData,
      gryoData: GyroData,
      orient: Orient
    })})
  }, RecordInterval);
}
```


