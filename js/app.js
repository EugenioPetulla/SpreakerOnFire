var app = new Vue({
  el: '#app', //start vue here
  data: {
    showID: 'foo-bar',
    show: '',
    episodes: '',
    episodesCount: '',
    episodesDuration: '',
    actualEpisode: ''
  },
  mounted: function() {
    axios.get('https://api.spreaker.com/v2/shows/'+ this.showID)
    .then(response => {this.show = response.data.response.show})
    .catch(function(error){console.log(error)});
    
    axios.get('https://api.spreaker.com/v2/shows/'+ this.showID +'/episodes')
    .then(response => {this.episodes = response.data.response.items, this.episodesCount = Object.keys(response.data.response.items).length})
    .catch(function(error){console.log(error)});

  },
  methods: {
    getEpisode: function(episode_id) {
      axios.get('https://api.spreaker.com/v2/episodes/'+ episode_id)
      .then(response => {this.getAudio(response.data.response.episode);})
      .catch(function(error){console.log(error)});
    },
    getAudio: function(episode) {
      var url = 'https://api.spreaker.com/v2/episodes/' + episode.episode_id;
      var audio = url + '/play.mp3';
      var download = url + '/download.mp3';
      var image = '<img src="'+ episode.image_url +'"/>';
      var showName = '<h1 class="pub-show">'+ episode.show.title +'</h1>';
      var title = '<h2 class="pub-title">'+ episode.title +'</h2>';
      var author = '<div class="pub-author">Published by <strong>'+ episode.author.fullname +'</strong></div>';
      var publishedDate = '<div class="pub-date">&middot; '+ episode.published_at +'</div>';
      var downloadBtn = '<div class="pub-download"><a href="'+ download +'" target="_blank">Download</a></div>';
      var audioPlayer = '<audio preload autoplay="false" controls id="podcast"><source src="'+ audio +'" type="audio/mpeg"></audio>';
      var description = '<div class="description"><h3>Episode description</h5><p>' + episode.description + '</p></div>';

      var modal = new tingle.modal({
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['audio-modal'],
        onOpen: function() {
          console.log('player started');
          // Start player on open
          var player = document.getElementById('podcast');
          player.play();
        },
        onClose: function() {
          console.log('player closed');
          // Stop player on close
          var player = document.getElementById('podcast');
          player.src = "";
        }
      });
      
      modal.setContent( image + showName + title + author + publishedDate + downloadBtn + audioPlayer + description);
      
      modal.open();
    },
    getAuthor: function() {
      var facebook = '';
      var twitter = '';
      var itunes = '';
      var link = '';
      var email = '';
      var skype = '';

      if(this.show.facebook_url) {
        facebook = '<a href="' + this.show.facebook_url + '" target="_blank"><i class="ion-social-facebook"></i></a>';
      }
      if(this.show.twitter_name) {
        twitter = '<a href="https://twitter.com/' + this.show.twitter_name + '" target="_blank"><i class="ion-social-twitter"></i></a>';
      }
      if(this.show.itunes_url) {
        itunes = '<a href="' + this.show.itunes_url + '" target="_blank"><i class="ion-social-apple"></i></a>';
      }
      if(this.show.website_url) {
        link = '<a href="' + this.show.website_url + '" target="_blank"><i class="ion-earth"></i></a>';
      }
      if(this.show.email) {
        email = '<a href="' + this.show.email + '" target="_blank"><i class="ion-email"></i></a>';
      }
      if(this.show.skype_name) {
        skype = '<a href="' + this.show.skype_name + '" target="_blank"><i class="ion-social-skype"></i></a>';
      }

      var image = '<img src="' + this.show.author.image_url + '" class="align-left" />';
      var name = '<h1>' + this.show.author.fullname + '</h1>';
      var description = '<p>' + this.show.author.description + '</p>';
      var authorLinks = '<div class="author-links">' + link + facebook + twitter + itunes + email + skype + '</div>';
      
      var modal = new tingle.modal({
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['author-modal'],
        onOpen: function() {
          console.log('author opened');
        },
        onClose: function() {
          console.log('author closed');
        }
      });
      
      modal.setContent( image + name + description + authorLinks );
      
      modal.open();
    },
    msToHouMinSec: function (ms) {
      	var seconds = (ms / 1000).toFixed(0);
		var minutes = Math.floor(seconds / 60);
		var hours = "";
		if (minutes > 59) {
		    hours = Math.floor(minutes / 60);
		    hours = (hours >= 10) ? hours : "0" + hours;
		    minutes = minutes - (hours * 60);
		    minutes = (minutes >= 10) ? minutes : "0" + minutes;
		}

		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		if (hours != "") {
		    return hours + ":" + minutes + ":" + seconds;
		}
		return minutes + ":" + seconds;
    },
    totalDuration: function() {
  		var durations = 0;
  		var ep = this.episodes;

  		for(var j = 0; j < ep.length; j++) {
  			durations = durations + ep[j].duration;
  		}

  		return this.msToHouMinSec(durations);
  	}
  }
});