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

window.ChatApi = {
  getUsers: function() {
    return users;
  },

  getUser: function(id) {
    return swarmHost.get("/User#" + id);
  },

  createUser: function(name) {
    var id = rid();

    var user = new Models.User(id);
    user.set({ name: name });
    users.addObject(user);
    return user;
  },

  onUsersChange: function(cb) {
    this.getUsers().on(cb);
  },

  onUserChange: function(id, cb) {
    this.getUser(id).on(cb);
  }
};
