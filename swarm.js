var Swarm = require('swarm');

var User = Swarm.Model.extend('User', {
    defaults: {
        name: 'Mickey',
    }
});

var Users = Swarm.Set.extend('Users', {
  objectType: User
});


var models = {
  User: User,
  Users: Users
};

module.exports = models;
