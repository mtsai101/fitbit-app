import { HeartRateSensor } from "heart-rate";
import { Accelerometer } from "accelerometer";
import { OrientationSensor } from "orientation";
import { Gyroscope } from "gyroscope";


import document from "document";
import * as messaging from "messaging";



const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const accelLabel = document.getElementById("accel-label");
const accelData = document.getElementById("accel-data");
const gyroLabel = document.getElementById("gyro-label");
const gyroData = document.getElementById("gyro-data");
const orientationLabel = document.getElementById("orientation-label");
const orientationData = document.getElementById("orientation-data");

const sensors = [];
const defaultDisplayValue = "{...}";
let HRdata = 0;
let AccData = new Array(0, 0, 0);
let GyroData = new Array(0, 0, 0);
let Orient = new Array(0, 0, 0, 0);
let RecordInterval = 1000 //ms;
let SamplingRate = 0.5;
let recording = false;
let SampleInstance;
let acc_x, acc_y, acc_z;
let gyro_x, gyro_y, gyro_z;


if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: SamplingRate });
  hrm.addEventListener("reading", () => {
    HRdata = hrm.heartRate;
    hrmData.text = JSON.stringify({
      heartRate: recording ? hrm.heartRate : defaultDisplayValue
    });
  });
  sensors.push(hrm);
  hrm.start();
  console.log("Open Heart Rate Sensor");
} else {
  hrmLabel.style.display = "none";
  hrmData.style.display = "none";
}

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

if (Gyroscope) {
  const gyro = new Gyroscope({ frequency: SamplingRate });
  gyro.addEventListener("reading", () => {
    gyro_x = gyro.x ? gyro.x.toFixed(1) : 0;
    gyro_y = gyro.y ? gyro.y.toFixed(1) : 0;
    gyro_z = gyro.z ? gyro.z.toFixed(1) : 0;
    GyroData[0] = gyro_x; GyroData[1] = gyro_y; GyroData[2] = gyro_z; 
    gyroData.text = JSON.stringify({
      x: gyro_x,
      y: gyro_y,
      z: gyro_z,
    });
  });
  sensors.push(gyro);
  gyro.start();
  console.log("Open gyro Sensor");
} else {
  gyroLabel.style.display = "none";
  gyroData.style.display = "none";
}

if (OrientationSensor) {
  const orientation = new OrientationSensor({ frequency: SamplingRate });
  orientation.addEventListener("reading", () => {
    Orient = orientation.quaternion ? orientation.quaternion.map(n => n.toFixed(1)) : null
    orientationData.text = JSON.stringify({
      quaternion: Orient
    });
  });
  sensors.push(orientation);
  orientation.start();

} else {
  orientationLabel.style.display = "none";
  orientationData.style.display = "none";
}

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

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } 
}
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
function stopRecord(){
  clearInterval(SampleInstance);
}


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




