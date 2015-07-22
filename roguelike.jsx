if (Meteor.isClient) {
  window.Piece = Piece;


  var Cell = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function() {
      return {
        player: Piece.findOne({position: this.props.position})
      }
    },
    render: function () {
      var player = this.data.player;
      var display;

      if (!player) {
        display = '_';
      } else if (player.display_photourl) {
        display = <img className="fb_profilephoto" src={player.display_photourl} />;
      } else {
        display = player.display;
      }

      return <td><span>{display}</span></td>;
    }
  });


  var App = React.createClass({
    render: function() {
      return <table>{_.range(BOARDSIZE.y).map(function(y) {
        return <tr key={"row_"+y}>{_.range(BOARDSIZE.x).map(function(x) {
          return <Cell key={"cell_"+x+"_"+y} position={{x: x, y: y}} />
        })}</tr>;
      })}</table>;
    }
  });

  var KEYS_TO_XY_CHANGE = {
    37: {'position.x':-1, 'position.y': 0}, // left
    39: {'position.x': 1, 'position.y': 0}, // right
    38: {'position.x': 0, 'position.y': -1}, // up
    40: {'position.x': 0, 'position.y': 1}, // down
  };

  var onKeyDown = function(e) {
    change = KEYS_TO_XY_CHANGE[e.keyCode];
    var user = Meteor.user();
    if (change && user) {
      Piece.update({_id: user.profile.board_object},
        {$inc: change}
      );
    }
  };

  document.addEventListener('keydown', onKeyDown);

  Meteor.startup(function () {
    React.render(<App />, document.getElementById('root'));
  });
}

if (Meteor.isServer) {
  var random_empty_position = function() {
    var guess = {
      x: Math.floor(Math.random() * BOARDSIZE.x),
      y: Math.floor(Math.random() * BOARDSIZE.y)
    };

    if (!Piece.findOne({position: guess})) {
      return guess;
    } else {
      return random_empty_position();  // try again
    }
  }

  Accounts.onCreateUser(function(options, user) {
    var entity_id = Piece.insert({
      position: random_empty_position(),
      ownerId: user._id,
      display_photourl:
        "http://graph.facebook.com/" + user.services.facebook.id + "/picture",
    });

    user.profile = options.profile;
    user.profile.board_object = entity_id;
    return user;
  });

  Meteor.startup(function () {
    // This only works on localhost
    if (!Accounts.loginServiceConfiguration.findOne({service: "facebook"})) {
      Accounts.loginServiceConfiguration.insert({
        service: "facebook",
        appId: "162346983924869",
        secret: "a844ee020723050bafed7926e7322765"
      });
    }
  });
}
