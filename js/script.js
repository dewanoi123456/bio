// =========================
// Audio + UI state
// =========================
const songs = [
  { file: 'media/song1.mp3', name: 'DIAMOND MQT - Victorias Secret Prodby NINESIXTSOUL' },
  { file: 'media/song2.mp3', name: 'P6ICK - STORY FTSURIYA MQT  YUNGTARR' },
  { file: 'media/song3.mp3', name: 'P6ICK X SURIYA MQT - 1 OF 1 Remix' },
  { file: 'media/song4.mp3', name: 'SURIYA MQT - หนุ่มบ้านนอก' },
  { file: 'media/song5.mp3', name: 'SURIYA MQT - YUNG TONY STARK Feat YUNGTARR' },
  { file: 'media/song6.mp3', name: 'SURIYA MQT X P6ICK - BODY Ft DIAMOND MQT  FATBOII MQT' },
  { file: 'media/song7.mp3', name: 'SURIYA MQT X P6ICK - BU' },
  { file: 'media/song8.mp3', name: 'DAOKO × 米津玄師『打上花火』MUSIC VIDEO' },
  { file: 'media/song9.mp3', name: '『貴方の恋人になりたい』(อยากเป็นแฟนเธอ) - ChoQMay  Thai ver. Cover by Astella Rieka' },
  { file: 'media/song10.mp3', name: '[Genshin Impact] Furina - Daughter of the Seas feat. AKA' },
];

let currentSongIndex = 0;
let isPlaying = false;

const overlay = document.getElementById('overlay');
const audio = document.getElementById('background-music');
const profileContainer = document.querySelector('.profile-container');
const muteToggleButton = document.getElementById('mute-toggle');
const volumeSlider = document.getElementById('volume-slider');
const muteIcon = document.getElementById('mute-icon');

const currentSongNameEl = document.getElementById('current-song-name');
const playPauseBtn = document.getElementById('play-pause-song');
const playPauseIcon = document.getElementById('play-pause-icon');
const prevSongBtn = document.getElementById('prev-song');
const nextSongBtn = document.getElementById('next-song');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const progressFill = document.getElementById('progress-fill');
const progressContainer = document.getElementById('progress-container');

let isMuted = false;
let previousVolume = 1;

muteToggleButton.style.display = 'none';
volumeSlider.style.display = 'none';

// Mute / Unmute
muteToggleButton.addEventListener('click', function () {
  if (isMuted) {
    audio.muted = false;
    isMuted = false;
    audio.volume = previousVolume > 0 ? previousVolume : 1;
    volumeSlider.value = audio.volume;
    muteIcon.classList.remove('fa-volume-mute');
    muteIcon.classList.add('fa-volume-up');
  } else {
    previousVolume = audio.volume;
    audio.muted = true;
    isMuted = true;
    audio.volume = 0;
    volumeSlider.value = 0;
    muteIcon.classList.remove('fa-volume-up');
    muteIcon.classList.add('fa-volume-mute');
  }
});

// Volume slider
volumeSlider.addEventListener('input', function () {
  audio.volume = parseFloat(this.value);
  audio.muted = false;
  if (audio.volume === 0) {
    muteIcon.classList.remove('fa-volume-up');
    muteIcon.classList.add('fa-volume-mute');
    isMuted = true;
  } else {
    muteIcon.classList.remove('fa-volume-mute');
    muteIcon.classList.add('fa-volume-up');
    isMuted = false;
    previousVolume = audio.volume;
  }
});

// Overlay click
overlay.addEventListener('click', function() {
  const currentOverlay = this;
  currentOverlay.classList.add('fade-out');
  
  setTimeout(() => {
    toggleProfileContainer();
  }, 100);

  const welcomeAudio = new Audio('media/welcome01.mp3'); 
  welcomeAudio.volume = 0; 
  
  welcomeAudio.play().then(() => {
    const welcomeTargetVolume = 1.0;
    const welcomeFadeDuration = 500; 
    const intervalTime = 50;
    const welcomeStep = welcomeTargetVolume / (welcomeFadeDuration / intervalTime);

    const welcomeFadeInterval = setInterval(() => {
      if (welcomeAudio.volume < welcomeTargetVolume) {
        welcomeAudio.volume = Math.min(welcomeTargetVolume, welcomeAudio.volume + welcomeStep);
      } else {
        welcomeAudio.volume = welcomeTargetVolume;
        clearInterval(welcomeFadeInterval);
      }
    }, intervalTime);

    welcomeAudio.onended = function() {
      audio.volume = 0;
      playRandomSong(); 
      
      const musicTargetVolume = 1.0;
      const musicFadeDuration = 6500; 
      const musicStep = musicTargetVolume / (musicFadeDuration / intervalTime);

      const musicFadeInterval = setInterval(() => {
        if (audio.volume < musicTargetVolume) {
          audio.volume = Math.min(musicTargetVolume, audio.volume + musicStep);
          volumeSlider.value = audio.volume;
          previousVolume = audio.volume;
        } else {
          audio.volume = musicTargetVolume;
          volumeSlider.value = musicTargetVolume;
          previousVolume = audio.volume;
          clearInterval(musicFadeInterval);
        }
      }, intervalTime);
    };
  }).catch((err) => {
    console.log('Welcome audio play blocked or error:', err);
    audio.volume = 1.0;
    playRandomSong();
  });

  const volumeControl = document.querySelector('.volume-control');
  if (volumeControl) {
      volumeControl.classList.remove('hidden'); 
      volumeControl.classList.add('show');
      muteToggleButton.style.display = '';
      volumeSlider.style.display = '';
  }

  setTimeout(() => {
    currentOverlay.remove();
  }, 6499); 
});

// Audio helpers & Controls
function getRandomSongIndex() {
  return Math.floor(Math.random() * songs.length);
}

function playRandomSong() {
  currentSongIndex = getRandomSongIndex();
  playSong();
}

function playSong() {
  const song = songs[currentSongIndex];
  audio.src = song.file;
  
  let displayName = song.name ? song.name : song.file.split('/').pop().replace('.mp3', '');
  if (currentSongNameEl) {
    currentSongNameEl.textContent = displayName;
  }

  audio.load();
  audio.play()
    .then(() => {
      isPlaying = true;
      if (playPauseIcon) {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
      }
    })
    .catch((err) => {
      console.error('Play blocked or error:', err);
      isPlaying = false;
      if (playPauseIcon) {
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
      }
    });
}

if (playPauseBtn) {
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
    } else {
      audio.play().then(() => {
        isPlaying = true;
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
      }).catch(err => console.log(err));
    }
  });
}

if (nextSongBtn) {
  nextSongBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong();
  });
}

if (prevSongBtn) {
  prevSongBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong();
  });
}

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
  }
});

if (progressContainer) {
  progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('ended', function () {
  playRandomSong();
});

// Profile container toggle
function toggleProfileContainer() {
  if (profileContainer.classList.contains('active')) {
    closeProfileContainer();
  } else {
    openProfileContainer();
  }
}

function openProfileContainer() {
  profileContainer.style.transition = 'max-height 0.5s ease-out';
  profileContainer.style.maxHeight = '0px';
  setTimeout(() => {
    profileContainer.style.transition = 'max-height 1s ease-out';
    profileContainer.style.maxHeight = '750px';
  }, 2000);
  profileContainer.classList.add('active');
}

function closeProfileContainer() {
  profileContainer.style.transition = 'max-height 0.5s ease-out';
  profileContainer.style.maxHeight = '0';
  profileContainer.classList.remove('active');
}

// =========================
// Sparkle effect (เอฟเฟกต์ตามเมาส์)
// =========================
const colour = '#ffffff';
const sparkles = 120;
let x = 400,
  y = 300,
  ox = 400,
  oy = 300,
  swide = 800,
  shigh = 600,
  sleft = 0,
  sdown = 0;
const tiny = [],
  star = [],
  starv = [],
  starx = [],
  stary = [];
const tinyx = [],
  tinyy = [],
  tinyv = [];

window.onload = () => {
  if (document.getElementById) {
    for (let i = 0; i < sparkles; i++) {
      let rats = createDiv(3, 3);
      rats.style.visibility = 'hidden';
      document.body.appendChild((tiny[i] = rats));
      starv[i] = 0;
      tinyv[i] = 0;

      rats = createDiv(5, 5);
      rats.style.backgroundColor = 'transparent';
      rats.style.visibility = 'hidden';
      const rlef = createDiv(1, 5);
      const rdow = createDiv(5, 1);
      rats.appendChild(rlef);
      rats.appendChild(rdow);
      rlef.style.top = '2px';
      rlef.style.left = '0px';
      rdow.style.top = '0px';
      rdow.style.left = '2px';
      document.body.appendChild((star[i] = rats));
    }
    set_width();
    sparkle();
  }
};

function sparkle() {
  if (x !== ox || y !== oy) {
    ox = x;
    oy = y;
    for (let c = 0; c < sparkles; c++) {
      if (!starv[c]) {
        star[c].style.left = (starx[c] = x) + 'px';
        star[c].style.top = (stary[c] = y) + 'px';
        star[c].style.clip = 'rect(0px, 5px, 5px, 0px)';
        star[c].style.visibility = 'visible';
        starv[c] = 50;
        break;
      }
    }
  }
  for (let c = 0; c < sparkles; c++) {
    if (starv[c]) update_star(c);
    if (tinyv[c]) update_tiny(c);
  }
  setTimeout(sparkle, 25);
}

function update_star(i) {
  if (--starv[i] === 25) star[i].style.clip = 'rect(1px, 4px, 4px, 1px)';
  if (starv[i]) {
    stary[i] += 1 + Math.random() * 3;
    if (stary[i] < shigh + sdown) {
      star[i].style.top = stary[i] + 'px';
      starx[i] += (i % 15 - 0) / 5;
      star[i].style.left = starx[i] + 'px';
    } else {
      star[i].style.visibility = 'hidden';
      starv[i] = 0;
    }
  } else {
    tinyv[i] = 50;
    tiny[i].style.top = (tinyy[i] = stary[i]) + 'px';
    tiny[i].style.left = (tinyx[i] = starx[i]) + 'px';
    tiny[i].style.width = '2px';
    tiny[i].style.height = '2px';
    star[i].style.visibility = 'hidden';
    tiny[i].style.visibility = 'visible';
  }
}

function update_tiny(i) {
  if (--tinyv[i] === 25) {
    tiny[i].style.width = '1px';
    tiny[i].style.height = '1px';
  }
  if (tinyv[i]) {
    tinyy[i] += 1 + Math.random() * 3;
    if (tinyy[i] < shigh + sdown) {
      tiny[i].style.top = tinyy[i] + 'px';
      tinyx[i] += (i % 5 - 2) / 5;
      tiny[i].style.left = tinyx[i] + 'px';
    } else {
      tiny[i].style.visibility = 'hidden';
      tinyv[i] = 0;
    }
  } else tiny[i].style.visibility = 'hidden';
}

function createDiv(height, width) {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.height = height + 'px';
  div.style.width = width + 'px';
  div.style.overflow = 'hidden';
  div.style.backgroundColor = colour;
  return div;
}

// Mouse move & Profile 3D Tilt Effect
document.addEventListener('mousemove', mouse);
window.onresize = set_width;

function mouse(e) {
  set_scroll();
  y = e ? e.pageY : event.y + sdown;
  x = e ? e.pageX : event.x + sleft;

  if (profileContainer) {
    let xAxis = (x - window.innerWidth / 2) / 25;
    let yAxis = (window.innerHeight / 2 - y) / 25;
    profileContainer.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  }
}

document.addEventListener('mouseleave', () => {
  if (profileContainer) {
    profileContainer.style.transition = 'transform 0.5s ease-out';
    profileContainer.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  }
});

if (profileContainer) {
  profileContainer.addEventListener('mouseenter', () => {
    profileContainer.style.transition = 'transform 0.1s ease-out';
  });
}

function set_scroll() {
  if (typeof self.pageYOffset == 'number') {
    sdown = self.pageYOffset;
    sleft = self.pageXOffset;
  } else if (document.body.scrollTop || document.body.scrollLeft) {
    sdown = document.body.scrollTop;
    sleft = document.body.scrollLeft;
  } else if (document.documentElement && document.documentElement.scrollTop) {
    sleft = document.documentElement.scrollLeft;
    sdown = document.documentElement.scrollTop;
  } else {
    sdown = 0;
    sleft = 0;
  }
}

function set_width() {
  if (typeof self.innerWidth == 'number') {
    swide = self.innerWidth;
    shigh = self.innerHeight;
  } else if (document.documentElement && document.documentElement.clientWidth) {
    swide = document.documentElement.clientWidth;
    shigh = document.documentElement.clientHeight;
  }
}

// ==========================================
// เอฟเฟกต์หิมะตก (โหลดรูปภาพจากโฟลเดอร์ images/snow/)
// ==========================================
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const snowImageFiles = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']; 
let snowImages = [];

snowImageFiles.forEach((fileName) => {
  const img = new Image();
  img.src = `images/snow/${fileName}`;
  img.onerror = () => {
    console.warn(`Could not load snow image: ${fileName}`);
  };
  snowImages.push(img);
});

let snowflakes = [];
const numSnowflakes = 25;

for (let i = 0; i < numSnowflakes; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 25 + 25,
    speed: Math.random() * 0.5 + 0.2,
    density: Math.random() * 10,
    imageIndex: Math.floor(Math.random() * snowImageFiles.length),
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 2
  });
}

let angle = 0;
function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < snowflakes.length; i++) {
    let sf = snowflakes[i];
    let img = snowImages[sf.imageIndex];

    ctx.save();
    ctx.translate(sf.x, sf.y);
    ctx.rotate((sf.rotation * Math.PI) / 180);

    if (img && img.complete && img.naturalWidth !== 0) {
      ctx.drawImage(img, -sf.size / 2, -sf.size / 2, sf.size, sf.size);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(0, 0, sf.size / 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
  updateSnow();
}

function updateSnow() {
  angle += 0.01;
  for (let i = 0; i < snowflakes.length; i++) {
    let sf = snowflakes[i];
    sf.y += sf.speed;
    sf.x += Math.sin(angle + sf.density) * 0.5;
    sf.rotation += sf.rotSpeed;

    if (sf.y > canvas.height + sf.size) {
      sf.y = -sf.size;
      sf.x = Math.random() * canvas.width;
    }
  }
}

function loopSnow() {
  drawSnow();
  requestAnimationFrame(loopSnow);
}
loopSnow();

// Title animation
const originalTitle = 'Bio | dewanoi1234';
let index = 0;
let forward = true;

function animateTitle() {
  if (forward) {
    document.title = originalTitle.slice(0, index + 1);
    index++;
    if (index < originalTitle.length) {
      setTimeout(animateTitle, 200);
    } else {
      forward = false;
      setTimeout(animateTitle, 1000);
    }
  } else {
    document.title = originalTitle.slice(0, index);
    index--;
    if (index > 0) {
      setTimeout(animateTitle, 200);
    } else {
      forward = true;
      setTimeout(animateTitle, 1000);
    }
  }
}
animateTitle();

// Menu Icon
function toggleMenu() {
  const menu = document.getElementById("extra-links");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// DevTools deterrent
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key))) {
    e.preventDefault();
  }
});