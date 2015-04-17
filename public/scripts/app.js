


$(document).ready(function(){

  var toggle = document.getElementById('toggle');
  var tracks = document.getElementsByClassName("tracks");
  var results = document.getElementById('results');
  var target = document.getElementById('target');
  var playlist = [];


  // var iframe = document.getElementById('soundcloud_widget');
  // var player = SC.Widget(iframe);

  function showTrackList(genre) {
    SC.get('/tracks', { genres: genre }, function(tracks) {
      tracks.forEach(function(track, index) {
        results.innerHTML = results.innerHTML + '<li onclick="playTrack('+track.id+')"><img src="'+track.artwork_url+'" /><p>'+track.title+'</p>  </li>';
        playlist.push(track.id);
      });
    });
  };




  playTrack = function(id) {
    // var src = 'http://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/'+id+'&show_artwork=false&liking=false&sharing=false&auto_play=false" width="420" height="120" frameborder="no"'
    // iframe.setAttribute("src", src);
    url = "https://api.soundcloud.com/tracks/"+id+"";

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

    // player.bind(SC.Widget.Events.LOAD_PROGRESS, function() {
    //   console.log("loaded: " player.getLoaded());
    // });
  };


  // toggle.onclick = function(e) {
  //   e.preventDefault();
  //   player.toggle();
  // };

  showList = function(genre) {
    results.innerHTML = "";
    console.log(genre);
    showTrackList(genre);
  };

  playerReady = function() {
    console.log("track ready!");
  };

  setCurrentTime = function(currentTime) {
    time = currentTime;
  };

  getCurrentTime = function() {
    return time;
  };



  toHHMMSS = function(seconds) {
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    // This line gives you 12-hour (not 24) time
    if (hh > 12) {hh = hh - 12;}
    // These lines ensure you have two-digits
    if (hh < 10) {hh = "0"+hh;}
    if (mm < 10) {mm = "0"+mm;}
    if (ss < 10) {ss = "0"+ss;}

    return (hh > 1 && (hh + ":")) || "" + mm + ":" + ss;
  };



  // window.onload = function() {
  //   SC.initialize({
  //     client_id: "be2f745f816c1df784b23dc87a1fd65f"
  //     // redirect_uri: "file:///Users/jcollyer/Documents/projects/soundCloud/index.html",
  //   });

  // };

})
