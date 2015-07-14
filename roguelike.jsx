var BOARDSIZE = {x: 50, y: 20};


var getAtXY = function(x, y) {
  return "_";
};

var App = React.createClass({
  render: function() {
    return <table>{_.range(BOARDSIZE.y).map(function(y) {
      return <tr>{_.range(BOARDSIZE.x).map(function(x) {
        return <td>{getAtXY(x, y)}</td>;
      })}</tr>;
    })}</table>;

    // alternate implementation, more performant and more control
    // but more verbose and less natural
    //    let rows = [];
    //    for(var y = 0; y < BOARDSIZE.y; y++) {
    //      let row = [];
    //      for(var x = 0; x < BOARDSIZE.x; x++) {
    //        row.push(<td>{getAtXY(x, y)}</td>);
    //      }
    //      rows.push(<tr>{row}</tr>);
    //    }
    //    return <table>{rows}</table>;
  }
});

if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render(<App />, document.getElementById('root'));
  });
}
