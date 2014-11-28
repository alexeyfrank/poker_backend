var Model =  require ("../../swarm.js");
var _ = require("lodash");

// 1. create local Host
var id = Math.round(Math.random() * 10000) + "";
console.log("ID: ", id)
var swarmHost = new Swarm.Host(id);

// 2. connect to your server
swarmHost.connect('ws://localhost:8000/');

// 3.a. create an object
var someMouse = new Model();
// OR swarmHost.get('/Mouse');
// OR new Mouse({x:1, y:2});

// 4.a. a locally created object may be touched immediately
//someMouse.set({x:1,y:2});

window.model = someMouse;
