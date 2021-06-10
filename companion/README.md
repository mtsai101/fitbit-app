# companion/index.js

### Controll by settings
In our companion, we use the [Settings API](https://dev.fitbit.com/build/reference/companion-api/settings/) to control on/off of our data collection.
At the beginning, we initialize *messaging.peerSocket* and make it keep listening, which is responsible for communicating with Fitbit app. 
The url is the private address and port of the API server. You can change it according to you network configuration.
Companion makes http **post** request right after one data sample comes from the app (watch), while it sends http **get** to notify API to pack all the data which is just sent.

```javascript
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
```

After the storing on API server complete, our companion would send "idle" message to the app (watch).

