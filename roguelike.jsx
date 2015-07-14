var BoardObject = new Meteor.Collection("BoardObject");

if (Meteor.isClient) {
  window.BoardObject = BoardObject;
  var BOARDSIZE = {x: 60, y: 15};


  var Cell = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function() {
      return {
        player: BoardObject.findOne({position: this.props.position})
      }
    },
    render: function () {
      var player = this.data.player;
      return <td>{player ? player.display : '_'}</td>;
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



  Meteor.startup(function () {
    React.render(<App />, document.getElementById('root'));
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!BoardObject.findOne({})) {
      var entity_id = BoardObject.insert({
          position: {x: 2, y:2},
          display: 'A',
          display_color: "rgb(0,0,255)",
          name: 'Alexey',
          score: 0
      });
    }
  });
}