Piece = new Meteor.Collection("Piece");
BOARDSIZE = {x: 40, y: 15};

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
        return <tr>{_.range(BOARDSIZE.x).map(function(x) {
          return <Cell position={{x: x, y: y}} />
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

  Meteor.startup(function () {
    document.addEventListener('keydown', function(e) {
      change = KEYS_TO_XY_CHANGE[e.keyCode];
      var user = Meteor.user();
      if (change && user) {
        Piece.update({_id: user.profile.board_object},
                     {$inc: change});
      }
    });

    React.render(<App />, document.getElementById('root'));
  });
}

if (Meteor.isServer) {
  var randomEmptyPosition = function() {
    var guess = {
      x: Math.floor(Math.random() * BOARDSIZE.x),
      y: Math.floor(Math.random() * BOARDSIZE.y)
    };

    if (!Piece.findOne({position: guess})) {
      return guess;
    } else {
      return randomEmptyPosition();  // try again
    }
  }

  Accounts.onCreateUser(function(options, user) {
    var entity_id = Piece.insert({
      position: randomEmptyPosition(),
      ownerId: user._id,
      display_photourl:
        "http://graph.facebook.com/" + user.services.facebook.id + "/picture",
    });

    user.profile = options.profile;
    user.profile.board_object = entity_id;
    return user;
  });
}
