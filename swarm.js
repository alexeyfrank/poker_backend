var Swarm = require('swarm');

var User = Swarm.Model.extend('User', {
    defaults: {
        name: 'Mickey',
    }
});

var Users = Swarm.Set.extend('Users', {
  objectType: User
});

var Message = Swarm.Model.extend('Message', {
    defaults: {
        text: 'Mickey',
        user: ""
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
