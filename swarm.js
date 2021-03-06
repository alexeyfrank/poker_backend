var Swarm = require('swarm');

var User = Swarm.Model.extend('User', {
    defaults: {
        name: 'Mickey',
        time: 0,
    }
});

var Users = Swarm.Set.extend('Users', {
  objectType: User
});

var Message = Swarm.Model.extend('Message', {
    defaults: {
        text: 'Mickey',
        user: "",
        time: ""
    }
});

var Messages = Swarm.Set.extend('Messages', {
  objectType: Message
});


var models = {
  User: User,
  Users: Users,
  Message: Message,
  Messages: Message
};

module.exports = models;
