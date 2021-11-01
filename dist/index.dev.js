"use strict";

var http = require('http');

var fs = require('fs');

var requests = require('requests');

var homeFile = fs.readFileSync("home.html", "utf-8");

var replaceVal = function replaceVal(tempVal, orgVal) {
  var temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  return temperature;
};

var server = http.createServer(function (req, res) {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=d72afe94a678159205e657f0bbec5bdf").on("data", function (chunk) {
      var objData = JSON.parse(chunk);
      var arrData = [objData]; // console.log(objData[0].main.temp);

      var realTimeData = arrData.map(function (val) {
        return replaceVal(homeFile, val);
      }).join("");
      res.write(realTimeData); // console.log(realTimeData);
    }).on('end', function (err) {
      if (err) return console.log('connection closed due to errors', err);
      res.end();
    });
  }
});
server.listen(8080, "127.0.0.1");