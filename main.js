
// Make it easier to query elements

function query(query) {
    return document.querySelector(query);
}

function queryAll(query){
    return document.querySelectorAll(query);
}

// Load Data in array

let songList = [
    {
        thumbnail:"vivaldi_thumbnail.jpg",
        audio:"John_Harrisson_Spring.mp3",
        songname:"Vivaldi",
        artistname:"Våren"
    },
    {
        thumbnail:"setec_thumbnail.jpg",
        audio:"Setec.mp3",
        songname:"Setec",
        artistname:"I'll be good"
    },
    {
        thumbnail:"jahzzar_thumbnail.jpg",
        audio:"Dummy.mp3",
        songname:"Jahzzar",
        artistname:"Dummy"
    }
];

// Set the songIndex 

let currentSongIndex = 0;


// Get the player element
let player = query(".player"),
    toggleSongList = query(".player .toggle-list");

// Find the elements in the playlist so we can use the elements
let main = {
    audio: query(".player .main audio"),
    thumbnail: query(".player .main img"),
    playbar: query(".player .main input"),
    songname: query(".player .main .details h2"),
    artistname: query(".player .main .details p"),
    prevControl: query(".player .main .controls .prev-control"),
    playPauseControl: query(".player .main .controls .play-pause-control"),
    nextControl: query(".player .main .controls .next-control")
}

// Set eventlistener on the songlist to show records of songs when clicked
    toggleSongList.addEventListener("click", function() {
        toggleSongList.classList.toggle("active");
        player.classList.toggle("activeSongList");
    }); 

    // Create song element and link the proper information to each song in the list in the player-list
  query(".player .player-list .list").innerHTML = (songList.map(function(song, songIndex){
        return `
                    <div class="item" songIndex="${songIndex}">
                            <div class="thumbnail">
                                <img src="./images/${song.thumbnail}">
                            </div>
                            <div class="details">
                                <h2>${song.songname}</h2>
                                <p>${song.artistname}</p>
                            </div>
                    </div>
                    
               `;
    }).join(""));


 // Looping over all the songs and get the id from each song in the list
 let songListItems = queryAll(".player .player-list .list .item");

 for(let i=0; i<songListItems.length; i++) {
     songListItems[i].addEventListener("click", function() {
        currentSongIndex = songListItems[i].getAttribute("songIndex");
        loadSong(currentSongIndex);
        player.classList.remove("activeSongList");
     });
 }

 //Load the correct information for each song with taking the value from songIndex

 function loadSong(songIndex) {
     let song = songList[songIndex];
     main.thumbnail.setAttribute("src","./images/"+song.thumbnail);
     document.body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)) url("./images/${song.thumbnail}") center no-repeat`;
     document.body.style.backgrundSize = "cover";
     main.songname.innerText = song.songname;
     main.artistname.innerText = song.artistname;
     main.audio.setAttribute("src","./music/"+song.audio);
     main.playbar.setAttribute("value", 0);
     main.playbar.setAttribute("min", 0);
     main.playbar.setAttribute("max", 0);

     // Add eventlistener when audio is played add duration aswell of song
     main.audio.addEventListener("canplay", function() {
        main.audio.play();
        if(!main.audio.paused){
            main.playPauseControl.classList.remove("paused");
        }
        main.playbar.setAttribute("max", parseInt(main.audio.duration));

        // When audio is ended it goes to next song
        main.audio.onended = function() {
            main.nextControl.click();
        }
     });
 }
 setInterval(function() {
    main.playbar.value=parseInt(main.audio.currentTime);
 }, 1000);

 // Previous control button eventlistener 
 main.prevControl.addEventListener("click", function() {
    currentSongIndex--;
    if(currentSongIndex < 0) {
        currentSongIndex = songList.length + currentSongIndex;
    }
    loadSong(currentSongIndex);
 });

 // Next control button eventlistener 
 main.nextControl.addEventListener("click", function() {
    currentSongIndex = (currentSongIndex+1) % songList.length;
    loadSong(currentSongIndex);
 });

 // Play pause button function eventlistener that change from play to paused if clicked
 main.playPauseControl.addEventListener("click", function() {
    if(main.audio.paused) {
        main.playPauseControl.classList.remove("paused");
        main.audio.play();
    }else {
        main.playPauseControl.classList.add("paused");
        main.audio.pause();
    }
 });

 // Makes the user able to jump into different parts in the song. I take the audios currentTime equal to the playbars value
 main.playbar.addEventListener("change", function() {
    main.audio.currentTime = main.playbar.value;
 });

 loadSong(currentSongIndex);