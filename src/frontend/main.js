var _ = require("lodash");
window.Models =  require ("../../swarm.js");

// 1. create local Host
var id = Math.round(Math.random() * 10000) + "";
var swarmHost = new Swarm.Host(id);

// 2. connect to your server
//
swarmHost.connect('ws://codewhale.in:8181/');

function rid() {
  return  Math.round(Math.random() * 10000) + "";
}

function time() {
  return Math.round(new Date().getTime() / 1000);
}

window.h = swarmHost;

var users = swarmHost.get("/Users#all");
var messages = swarmHost.get("/Messages#all");

window.ChatApi = {
  getUsers: function() {
    return users;
  },

  getMessages: function() {
    return messages;
  },

  getUser: function(id) {
    return swarmHost.get("/User#" + id);
  },

  getMessage: function(id) {
    return swarmHost.get("/Message#" + id);
  },

  createUser: function(name) {
    var id = rid();

    var user = new Models.User(id);
    user.set({ name: name, time: time() });
    users.addObject(user);
    return user;
  },

  createMessage: function(text, time, user) {
    var id = rid();
    var message = new Models.Message(id);
    message.set({ text: text, time: time, user: user._id });
    messages.addObject(message);
    return message;
  },

  activeUser: function(user) {
    user.set({ time: time() });
  },

  removeUser: function(user) {
    this.getUsers().removeObject(user);
  },

  onUsersChange: function(cb) {
    this.getUsers().on(cb);
  },

  onUserChange: function(id, cb) {
    this.getUser(id).on(cb);
  },

  onMessagesChange: function(cb) {
    this.getMessages().on(cb);
  },

  onMessageChange: function(id, cb) {
    this.getMessage(id).on(cb);
  }
};

setInterval(function(){
  var t = time();
  window.ChatApi.getUsers().forEach(function(u) {
    var diff = t - u.time;
    if (diff > 5 * 60 * 1000) {
      console.log("Removing user " + u.name + " diff " + diff);
      window.ChatApi.removeUser(u);
    }
  });
}, 3000);
