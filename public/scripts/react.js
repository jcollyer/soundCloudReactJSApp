SC.initialize({
  client_id: "51b52c948e268a19b58f87f3d47861ad",
  redirect_uri: "http://localhost:3000/callback.html"
});


$('button.connect').click(function(e) {
  e.preventDefault();
  SC.connect(function() {
    SC.get('/me', function(me) {
      $('#username').html(me.username);
    });
  });
});

songs = [{"title":"something"},{"title":"something2"}];
tracks = [{"title":"track1"},{"title":"track2"}];
var player;
playerReady = function() {
  console.log("track ready!");
};

var MyTracksButton = React.createClass({
  getInitialState: function() {
    return {tracks:tracks};
  },
  handleClick: function() {
    $.ajax({
      // url: this.props.url,
      url: 'https://api.soundcloud.com/users/143543661/playlists.json?client_id=51b52c948e268a19b58f87f3d47861ad',
      dataType: 'json',
      success: function(tracks) {
        this.setState({tracks: tracks[0].tracks});
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
        console.error('http://api.soundcloud.com/playlists/405726.json?client_id=51b52c948e268a19b58f87f3d47861ad', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <button onClick={this.handleClick}>My Tracks</button>
        <MyTracks tracks={this.state.tracks} />
      </div>
    );
  }
});

var MyTracks = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.tracks.map(function(track){
          return (
            <Song title={track.title} artwork={track.artwork_url} id={track.id} />
          )
        })}
      </div>
    );
  }
});

var MusicPlayerBox = React.createClass({
  render: function() {
    return (
      <div className="MusicPlayerBox">
        <Player />
        <MusicTable />
      </div>
    );
  }
});

var Player = React.createClass({
  getInitialState: function() {
    return {url: "http://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/39804767&show_artwork=false&liking=false&sharing=false&auto_play=false"};
  },
  toggleTrack: function() {
    var player = player || this.getPlayer();
    player.toggle();
  },
  nextTrack: function() {
    var player = player || this.getPlayer();
    player.next();
  },
  prevTrack: function() {
    var player = player || this.getPlayer();
    player.prev();
  },
  muteToggleTrack: function() {
    var player = player || this.getPlayer();
    player.getVolume(function(vol){
      if(vol == 0 ) {
        player.setVolume(1);
      } else {
        player.setVolume(0);
      }
    });
  },
  getPlayer: function() {
    iframe   = document.querySelector('iframe');
    iframeID = iframe.id;
    return SC.Widget(iframe);
  },
  render: function() {
    return (
      <div>
        <div id="current_time"></div>
        <button id="toggle" onClick={this.toggleTrack}>toggle</button>
        <button id="next" onClick={this.nextTrack}>Next</button>
        <button id="prev" onClick={this.prevTrack}>Prev</button>
        <button id="mute" onClick={this.muteToggleTrack}>Mute</button>

        <iframe id="soundcloud_widget" src={this.state.url} width="420" height="120" frameborder="no">
        </iframe>
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


// http://stackoverflow.com/questions/16394100/order-by-playbacks-when-fetching-tracks-from-soundcloud
// https://api-v2.soundcloud.com/explore/metal?limit=5&offset=0

var GenreList = React.createClass({
  getTracks: function(genre) {
    SC.get('/tracks', { genres: genre, limit: 5, order: 'created_at' }, function(tracks) {
      songs = [];
      tracks.map(function(track, index) {
        songs.push(track);
      });
    });
  },
  handleClick: function(event) {
    var genre = event.target.getAttribute("data-genre");
    this.getTracks(genre);
    this.setState({songs: songs});
  },
  getInitialState: function() {
    return {songs: songs}
  },
  render: function() {
    return (
      <div>
        <button onClick={this.handleClick} data-genre="beats">Beats</button>
        <button onClick={this.handleClick} data-genre="rnb">RnB</button>
        <button onClick={this.handleClick} data-genre="house">House</button>
        <button onClick={this.handleClick} data-genre="hip-hop">Hip-Hop</button>
        <TrackList songs={this.state.songs} />
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

    // player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
    //   var currentTime = e.relativePosition;

    //   setCurrentTime(currentTime);
    //   toHHMMSS(currentTime);
    //   // console.log( e.relativePosition*100);
    //    // $('.progress-bar').css('width', ( e.relativePosition*100)+"%");
    // });
  },
  addTrackToPlaylist: function() {
    id = event.target.getAttribute("data-id");
    // var tracks = ["21778201", "22448500", "21928809"];
    var tracks = ["21778201", "22448500", "21928809"].map(function(id) { return { id: id }; });
    // debugger;
    SC.connect(function() {
      SC.get('/me/playlists', { limit: 1 }, function(playlist) {
        SC.put(playlist[0].uri, { playlist: { tracks: tracks } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            console.log("tracks added to playlist!");
          }
        });
      });
    });
  },
  favoriteTrack: function() {
    id = event.target.getAttribute("data-id");
    SC.connect(function() {
      SC.put('/me/favorites/'+id, function(status, error) {
        if (error) {
          alert("Error: " + error.message);
        } else {
          alert("Favorite:  " + id);
        }
      });
    });
  },
  render: function() {
    return (
      <div className="Song">
        <p>{this.props.title}</p>
        <img src={this.props.artwork} data-id={this.props.id} onClick={this.handleClick} />
        <p>{this.props.id}</p>
        <button onClick={this.favoriteTrack} data-id={this.props.id}>Favorite</button>
        <button onClick={this.addTrackToPlaylist} data-id={this.props.id}>+Playlist</button>
      </div>
    );
  }
});


React.render(
  <MusicPlayerBox />,
  document.getElementById('react-music-player')
);

React.render(
  <MyTracksButton />,
  document.getElementById('track-button')
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
