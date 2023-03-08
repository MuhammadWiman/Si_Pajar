const logger = require("./utils/logger");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

const mqtt = require("mqtt");

const rmq = mqtt.connect("ws://rmq2.pptik.id:15675/ws", {
  username: "/smkn1cimahi:smkn1cimahi",
  password: "qwerty",
  clientId: "Sensor-" + Math.random().toString(16).substr(2, 8) + "-punclut-",
  protocolId: "MQTT",
  keepalive: 1,
});

exports.publish = async (topic, message) => {
  logger.info(topic, message);
  rmq.publish(topic, message, () => {});
};

exports.consume = async () => {
  rmq.on("connect", () => {
    rmq.subscribe("sensordht11", () => {
      console.log("Sensor Connected");
    });
  });
  rmq.on("message", (topic, payload) => {
    if (topic == "sensordht11") {
      const cuaks = payload.toString().split("#");
      let serial_number = cuaks[0];
      let value = cuaks[1];
      let description = cuaks[2];
      console.log("Serial Number : " + serial_number);
      console.log("Data : " + value);
      console.log("Deskripsi : " + description);
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("sensor");
        var myobj = [
          {
            "Serial Number": serial_number,
            "Data": value,
            "deskripsi": description,
          },
        ];
        dbo.collection("customers").insertMany(myobj, function (err, res) {
          if (err) throw err;
          console.log("Data telah masuk database : " + res.insertedCount);
          db.close();
        });
      });
    }
  });
};
