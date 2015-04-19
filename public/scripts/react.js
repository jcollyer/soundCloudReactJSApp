SC.initialize({
  client_id: "be2f745f816c1df784b23dc87a1fd65f"
  // redirect_uri: "file:///Users/jcollyer/Documents/projects/soundCloud/index.html",
});

songs = [{"title":"something"},{"title":"something2"}];

var MusicPlayerBox = React.createClass({
  render: function() {
    return (
      <div className="MusicPlayerBox">
        <h3>Music Player Box</h3>
        <Player />
        <MusicTable />
      </div>
    );
  }
});

var Player = React.createClass({
  render: function() {
    return (
      <div className="Player">
        <div id="target">
          <iframe id="soundcloud_widget" src="http://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/39804767&show_artwork=false&liking=false&sharing=false&auto_play=false" width="420" height="120" frameborder="no">
          </iframe>
        </div>

        <div id="current_time"></div>
        <button id="toggle">toggle</button>
        <button id="next">Next</button>
        <button id="prev">Prev</button>
        <button id="mute">Mute</button>

      </div>
    );
  }
});

var MusicTable = React.createClass({
  render: function() {
    return (
      <div className="MusicTable">
        <h3>Music Table</h3>
        <GenreList />
      </div>
    );
  }
});



var GenreList = React.createClass({
  getTracks: function(genre) {
    SC.get('/tracks', { genres: genre, limit: 5 }, function(tracks) {
      songs = [];
      tracks.map(function(track, index) {
        songs.push(track);
      });
    });
    this.setState({songs: songs});
  },
  handleClick: function(event) {
    var genre = event.target.getAttribute("data-genre");
    this.getTracks(genre);
      // debugger;

  },
  getInitialState: function() {
    return {songs: songs}
  },
  render: function() {
    return (
      <div>
        <li onClick={this.handleClick} data-genre="beats">Beats</li>
        <li onClick={this.handleClick} data-genre="rnb">RnB</li>
        <li onClick={this.handleClick} data-genre="house">House</li>
        <li onClick={this.handleClick} data-genre="hip-hop">Hip-Hop</li>
        <TrackList songs={songs} />
      </div>
    );
  }
});

TrackList = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.songs.map(function(song){
          return (
            <Song title={song.title} artwork={song.artwork_url} id={song.id} />
          )
        })}
      </div>
    );
  }
});

var Song = React.createClass({
  handleClick: function(event) {
    id = event.target.getAttribute("data-id");
    url = "https://api.soundcloud.com/tracks/"+id+"";
    // according to docs: https://developers.soundcloud.com/docs/api/html5-widget
    var iframe   = document.querySelector('iframe');
    var iframeID = iframe.id;
    var player   = SC.Widget(iframe);
    var player2  = SC.Widget(iframeID);
    // widget1 === widget2
    // debugger;
    player.load(url, {
      auto_play: true
    });
    player.bind(SC.Widget.Events.READY, function() {
      playerReady();
    });

    player.bind(SC.Widget.Events.FINISH, function() {
      console.log("track finished!");
    });

    player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
      var currentTime = e.relativePosition;

      setCurrentTime(currentTime);
      toHHMMSS(currentTime);
      // console.log( e.relativePosition*100);
       // $('.progress-bar').css('width', ( e.relativePosition*100)+"%");
    });
  },
  render: function() {
    return (
      <div className="Song">
        <p>{this.props.title}</p>
        <img src={this.props.artwork} data-id={this.props.id} onClick={this.handleClick} />
        <p>{this.props.id}</p>
      </div>
    );
  }
});


React.render(
  <MusicPlayerBox />,
  document.getElementById('react-music-player')
);



////////////////////////////////////////////////////////////////
// var converter = new Showdown.converter();

// var CommentBox = React.createClass({
//   loadCommentsFromServer: function() {
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   handleCommentSubmit: function(comment) {
//     var comments = this.state.data;
//     comments.push(comment);
//     this.setState({data: comments}, function() {
//       // `setState` accepts a callback. To avoid (improbable) race condition,
//       // `we'll send the ajax request right after we optimistically set the new
//       // `state.
//       $.ajax({
//         url: this.props.url,
//         dataType: 'json',
//         type: 'POST',
//         data: comment,
//         success: function(data) {
//           this.setState({data: data});
//         }.bind(this),
//         error: function(xhr, status, err) {
//           console.error(this.props.url, status, err.toString());
//         }.bind(this)
//       });
//     });
//   },
//   getInitialState: function() {
//     return {data: []};
//   },
//   componentDidMount: function() {
//     this.loadCommentsFromServer();
//     setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//   },
//   render: function() {
//     return (
//       <div className="commentBox">
//         <h1>Comments</h1>
//         <CommentList data={this.state.data} />
//         <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//       </div>
//     );
//   }
// });

// var CommentList = React.createClass({
//   render: function() {
//     var commentNodes = this.props.data.map(function(comment, index) {
//       return (
//         // `key` is a React-specific concept and is not mandatory for the
//         // purpose of this tutorial. if you're curious, see more here:
//         // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
//         <Comment author={comment.author} key={index}>
//           {comment.text}
//         </Comment>
//       );
//     });
//     return (
//       <div className="commentList">
//         {commentNodes}
//       </div>
//     );
//   }
// });

// var CommentForm = React.createClass({
//   handleSubmit: function(e) {
//     e.preventDefault();
//     var author = React.findDOMNode(this.refs.author).value.trim();
//     var text = React.findDOMNode(this.refs.text).value.trim();
//     if (!text || !author) {
//       return;
//     }
//     this.props.onCommentSubmit({author: author, text: text});
//     React.findDOMNode(this.refs.author).value = '';
//     React.findDOMNode(this.refs.text).value = '';
//   },
//   render: function() {
//     return (
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input type="text" placeholder="Your name" ref="author" />
//         <input type="text" placeholder="Say something..." ref="text" />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });

// var Comment = React.createClass({
//   render: function() {
//     var rawMarkup = converter.makeHtml(this.props.children.toString());
//     return (
//       <div className="comment">
//         <h2 className="commentAuthor">
//           {this.props.author}
//         </h2>
//         <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
//       </div>
//     );
//   }
// });

// React.render(
//   <CommentBox url="comments.json" pollInterval={2000} />,
//   document.getElementById('comment-box')
// );
