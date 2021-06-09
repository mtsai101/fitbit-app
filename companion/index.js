import * as messaging from "messaging";
import { settingsStorage } from "settings";



function initialize() {
  //make sure the stored settings are up to date
  settingsStorage.clear();
  resetSettings();
}

// function sendSettingsToWatch() {
//   outbox.enqueue('settings.cbor', cbor.encode(settings))
//         .then(ft => console.log('settings sent'))
//         .catch(error => console.log("Error sending settings: " + error));
// }

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

messaging.peerSocket.onmessage = evt => {

  let path = '/sensor';
  let url = `http://172.20.10.6:3000${path}`;

  let msg = JSON.parse(evt.data.value);
  if(evt.data.key==="saving"){
    console.log("saving...");
    fetch(url, {
      method: "GET"
    })
    .then(function(response) {
      console.log("Record done");
      sendVal({key:"idle",value:"true"});
    })
  }else{
    let data = {
      "timestamp":msg.timestamp,
      "accelerator":msg.accelerator,
      "heartRate": msg.heartRate,
      "gryoscope": msg.gryoData,
      "orientation": msg.orient
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      console.log("save log");
    })
  }
  

}

// A user changes settings
settingsStorage.onchange = evt => {
  sendVal({
      key: evt.key,
      value: evt.newValue
    });
  // settings[evt.key] = JSON.parse(evt.newValue);
  // sendSettingsToWatch();
};

function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

// Restore any previously saved settings
// function setSettings() {
//   for (let index = 0; index < settingsStorage.length; index++) {
//     let key = settingsStorage.key(index);
//     if (key) {
//       var value = settingsStorage.getItem(key);
//       try {
//         settings[key] = JSON.parse(value);
//         console.log(key);
//       }
//       catch(ex) {
//         settings[key] = value;
//       }
//     }
//   }
// }

function resetSettings(){
  sendVal({key:'record', value:"false"});
}


//restore old previous settings on load
initialize();
