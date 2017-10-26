var app = new Vue({
  el: '#app', //start vue here
  data: {
    showID: 'foo-bar',
    show: '',
    episodes: ''
  },
  mounted: function() {
    axios.get('https://api.spreaker.com/v2/shows/'+ this.showID)
    .then(response => {this.show = response.data.response.show})
    .catch(function(error){console.log(error)});
    
    axios.get('https://api.spreaker.com/v2/shows/'+ this.showID +'/episodes')
    .then(response => {this.episodes = response.data.response.items})
    .catch(function(error){console.log(error)});
  },
  methods: {
    getAudio: function(episode) {
      var url = 'https://api.spreaker.com/v2/episodes/' + episode.episode_id;
      var audio = url + '/play.mp3';
      var download = url + '/download.mp3';
      var image = '<img src="'+ episode.image_url +'"/>';
      var title = '<h2>'+ episode.title +'</h2>';
      var author = '<div class="pub-author">Pubblicato da <strong>'+ this.show.author.fullname +'</strong></div>';
      var publishedDate = '<div class="pub-date">il '+ episode.published_at +'</div>';
      var showName = '<div class="pub-show">in <strong>'+ this.show.title +'</strong></div>';
      var downloadBtn = '<div class="pub-download"><a href="'+ download +'" target="_blank">Download</a></div>';
      var audioPlayer = '<audio preload controls id="podcast"><source src="'+ audio +'" type="audio/mpeg"></audio>';
    
      var modal = new tingle.modal({
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        onOpen: function() {
          console.log('player started');
          // Start player on open
          var ply = document.getElementById('podcast');
          ply.play();
        },
        onClose: function() {
          console.log('player closed');
          // Stop player on close
          var ply = document.getElementById('podcast');
          ply.src = "";
        }
      });
      
      modal.setContent( image + title + author + publishedDate + showName + downloadBtn + audioPlayer );
      
      modal.open();
    },
    msToMinSec: function (ms) {
      var minutes = Math.floor(ms / 60000);
      var seconds = ((ms % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
  }
});