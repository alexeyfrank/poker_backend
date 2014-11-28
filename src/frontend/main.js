var _ = require("lodash");
window.Models =  require ("../../swarm.js");

// 1. create local Host
var id = Math.round(Math.random() * 10000) + "";
var swarmHost = new Swarm.Host(id);

// 2. connect to your server
swarmHost.connect('ws://localhost:8000/');

function rid() {
  return  Math.round(Math.random() * 10000) + "";
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
    user.set({ name: name });
    users.addObject(user);
    return user;
  },

  createMessage: function(text, user) {
    var id = rid();
    var message = new Models.Message(id);
    message.set({ text: text, user: user });
    messages.addObject(message);
    return message;
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
