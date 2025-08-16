class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.songs = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isLoading = false;
        this.volume = 0.7;
        this.isMuted = false;
        this.isShuffled = false;
        this.repeatMode = 'off';
        this.autoplay = true;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadSongs();
    }

    initializeElements() {
        // Player controls
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.repeatBtn = document.getElementById('repeat-btn');
        
        // Progress elements
        this.progressContainer = document.getElementById('progress-container');
        this.progressFill = document.getElementById('progress-fill');
        this.progressThumb = document.getElementById('progress-thumb');
        this.currentTimeEl = document.getElementById('current-time');
        this.totalDurationEl = document.getElementById('total-duration');
        
        // Volume elements
        this.muteBtn = document.getElementById('mute-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeFill = document.getElementById('volume-fill');
        this.volumeThumb = document.getElementById('volume-thumb');
        this.volumeIcon = document.getElementById('volume-icon');
        
        // Song info elements
        this.albumCover = document.getElementById('album-cover');
        this.songTitle = document.getElementById('song-title');
        this.songArtist = document.getElementById('song-artist');
        this.songAlbum = document.getElementById('song-album');
        this.songDuration = document.getElementById('song-duration');
        
        // Playlist elements
        this.playlistItems = document.getElementById('playlist-items');
        this.clearQueueBtn = document.getElementById('clear-queue-btn');
        this.autoplayToggle = document.getElementById('autoplay-toggle');
        
        // Icons
        this.playIcon = document.getElementById('play-icon');
        this.pauseIcon = document.getElementById('pause-icon');
        this.loadingSpinner = document.getElementById('loading-spinner');
        
        // Set initial volume
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }

    setupEventListeners() {
        // Audio events
        this.audio.addEventListener('loadstart', () => this.setLoading(true));
        this.audio.addEventListener('canplay', () => this.setLoading(false));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
        this.audio.addEventListener('error', () => this.handleError());
        
        // Control events
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Progress bar events
        this.progressContainer.addEventListener('click', (e) => this.seekTo(e));
        this.progressContainer.addEventListener('mousedown', (e) => this.startDragging(e, 'progress'));
        
        // Volume events
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('click', (e) => this.setVolume(e));
        this.volumeSlider.addEventListener('mousedown', (e) => this.startDragging(e, 'volume'));
        
        // Playlist events
        this.clearQueueBtn.addEventListener('click', () => this.clearQueue());
        this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Mouse events for dragging
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.stopDragging());
    }

   async loadSongs() {
   this.songs = [
    {
        title: "Silence",
        artist: "Young Sammy",
        album: "Silence",
        coverArt: "covers/Silence.png", 
        src: "music/Silence.mp3",        
        duration: 115                    
    },
    {
        title: "Millionaire",
        artist: "Honey Singh",
        album: "Glory",
        coverArt: "covers/Millionare.png",
        src: "music/Millionaire.mp3",
        duration: 199
    },
    {
        title: "STFU",
        artist: "AP Dillon",
        album: "Rush",
        coverArt: "covers/STFU.png",
        src: "music/STFU.mp3",
        duration: 174
    }
];


    this.renderPlaylist();
    this.loadSong(0); 
}


    loadTrack(index) {
        if (index < 0 || index >= this.songs.length) return;
        
        this.currentIndex = index;
        const song = this.songs[index];
        
        // Update UI
        this.updateSongInfo(song);
        this.updatePlaylistHighlight();
        
        // Load audio
        this.audio.src = song.src;
        this.audio.load();
    }

    updateSongInfo(song) {
        this.albumCover.src = song.coverArt;
        this.albumCover.alt = `${song.album} album artwork`;
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.songAlbum.textContent = `${song.album} • 2024`;
        this.songDuration.textContent = `⏱️ ${this.formatTime(song.duration)}`;
    }

    async togglePlayPause() {
        if (this.isLoading) return;
        
        try {
            if (this.isPlaying) {
                this.audio.pause();
                this.setPlaying(false);
            } else {
                await this.audio.play();
                this.setPlaying(true);
            }
        } catch (error) {
            console.error('Playback error:', error);
            this.handleError();
        }
    }

    setPlaying(playing) {
        this.isPlaying = playing;
        this.playIcon.style.display = playing ? 'none' : 'block';
        this.pauseIcon.style.display = playing ? 'block' : 'none';
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.loadingSpinner.style.display = loading ? 'block' : 'none';
        this.playIcon.style.display = loading ? 'none' : (this.isPlaying ? 'none' : 'block');
        this.pauseIcon.style.display = loading ? 'none' : (this.isPlaying ? 'block' : 'none');
    }

    previousTrack() {
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.songs.length - 1;
        }
        
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            setTimeout(() => this.audio.play(), 100);
        }
    }

    nextTrack() {
        let nextIndex = this.currentIndex + 1;
        
        if (nextIndex >= this.songs.length) {
            if (this.repeatMode === 'all') {
                nextIndex = 0;
            } else {
                this.setPlaying(false);
                return;
            }
        }
        
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            setTimeout(() => this.audio.play(), 100);
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        this.repeatBtn.classList.toggle('active', this.repeatMode !== 'off');
       
        const icon = this.repeatBtn.querySelector('svg');
        if (this.repeatMode === 'one') {
            icon.innerHTML = '<path d="M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z"/><text x="12" y="15" text-anchor="middle" font-size="8" fill="currentColor">1</text>';
        } else {
            icon.innerHTML = '<path d="M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z"/>';
        }
    }

    handleTrackEnd() {
        this.setPlaying(false);
        
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            if (this.autoplay) {
                this.audio.play();
                this.setPlaying(true);
            }
        } else if (this.autoplay) {
            this.nextTrack();
        }
    }

    seekTo(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audio.duration;
        
        if (!isNaN(newTime)) {
            this.audio.currentTime = newTime;
        }
    }

    updateProgress() {
        if (!this.audio.duration) return;
        
        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressFill.style.width = `${percentage}%`;
        this.progressThumb.style.left = `${percentage}%`;
        
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        this.totalDurationEl.textContent = this.formatTime(this.audio.duration);
    }

    setVolume(e) {
        const rect = this.volumeSlider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        this.volume = percentage;
        this.audio.volume = percentage;
        this.isMuted = false;
        this.updateVolumeDisplay();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this.updateVolumeDisplay();
    }

    updateVolumeDisplay() {
        const displayVolume = this.isMuted ? 0 : this.volume;
        this.volumeFill.style.width = `${displayVolume * 100}%`;
        this.volumeThumb.style.left = `${displayVolume * 100}%`;
        
        // Update volume icon
        if (this.isMuted || this.volume === 0) {
            this.volumeIcon.innerHTML = '<path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V4.18L21.86 12L14 19.82V16.02C15.48 15.29 16.5 13.77 16.5 12ZM3 9V15H7L12 20V4L7 9H3Z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
        } else if (this.volume < 0.5) {
            this.volumeIcon.innerHTML = '<path d="M11 5L6 9H2V15H6L11 19V5ZM15.54 8.46C16.5 9.42 16.5 10.88 15.54 11.84L14.12 10.42C14.32 10.22 14.32 9.88 14.12 9.68L15.54 8.46Z"/>';
        } else {
            this.volumeIcon.innerHTML = '<path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12S16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12S18.01 4.14 14 3.23Z"/>';
        }
    }

    startDragging(e, type) {
        this.isDragging = type;
        if (type === 'progress') {
            this.seekTo(e);
        } else if (type === 'volume') {
            this.setVolume(e);
        }
    }

    handleMouseMove(e) {
        if (this.isDragging === 'progress') {
            this.seekTo(e);
        } else if (this.isDragging === 'volume') {
            this.setVolume(e);
        }
    }

    stopDragging() {
        this.isDragging = null;
    }

    renderPlaylist() {
        this.playlistItems.innerHTML = '';
        
        this.songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <img src="${song.coverArt}" alt="${song.album}" class="playlist-item-cover">
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
                <div class="playlist-item-duration">${this.formatTime(song.duration)}</div>
            `;
            
            item.addEventListener('click', () => {
                this.loadTrack(index);
                if (this.isPlaying) {
                    setTimeout(() => this.audio.play(), 100);
                }
            });
            
            this.playlistItems.appendChild(item);
        });
    }

    updatePlaylistHighlight() {
        const items = this.playlistItems.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }

    clearQueue() {
        this.audio.pause();
        this.setPlaying(false);
        this.songs = [];
        this.currentIndex = 0;
        this.renderPlaylist();
        this.resetSongInfo();
    }

    resetSongInfo() {
        this.albumCover.src = '';
        this.songTitle.textContent = 'Select a song';
        this.songArtist.textContent = 'Unknown Artist';
        this.songAlbum.textContent = 'Unknown Album • 2024';
        this.songDuration.textContent = '⏱️ 0:00';
        this.progressFill.style.width = '0%';
        this.progressThumb.style.left = '0%';
        this.currentTimeEl.textContent = '0:00';
        this.totalDurationEl.textContent = '0:00';
    }

    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        this.autoplayToggle.setAttribute('data-active', this.autoplay);
    }

    handleKeyboard(e) {
        // Prevent default for space key
        if (e.code === 'Space') {
            e.preventDefault();
            this.togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            this.nextTrack();
        } else if (e.code === 'ArrowLeft') {
            this.previousTrack();
        } else if (e.code === 'ArrowUp') {
            e.preventDefault();
            this.volume = Math.min(1, this.volume + 0.1);
            this.audio.volume = this.volume;
            this.updateVolumeDisplay();
        } else if (e.code === 'ArrowDown') {
            e.preventDefault();
            this.volume = Math.max(0, this.volume - 0.1);
            this.audio.volume = this.volume;
            this.updateVolumeDisplay();
        } else if (e.code === 'KeyM') {
            this.toggleMute();
        }
    }

    handleError() {
        console.error('Audio playback error');
        this.setLoading(false);
        this.setPlaying(false);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});