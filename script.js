const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.body.classList.add("is-loaded");

const menuButton = $("#menuButton");
const nav = $("#nav");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuButton.textContent = open ? "×" : "☰";
});
$$("nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  if (menuButton) { menuButton.textContent = "☰"; menuButton.setAttribute("aria-label", "Open navigation"); }
}));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }), {threshold: 0.12, rootMargin: "0px 0px -35px 0px"});
  $$(".hero-copy, .hero-visual, .manifesto-grid > *, .section-head, .center-heading, .scrap, .observation, .field-card, .ragebait, .track, .envelope, .closing > *").forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
} else {
  $$(".reveal").forEach(el => el.classList.add("visible"));
}

const noteDialog = $("#noteDialog");
$("#noteOpen")?.addEventListener("click", () => noteDialog?.showModal());
$("#noteClose")?.addEventListener("click", () => noteDialog?.close());
$("#noteOkay")?.addEventListener("click", () => noteDialog?.close());
noteDialog?.addEventListener("click", event => { if (event.target === noteDialog) noteDialog.close(); });

const rageLines = [
  "You pressed it. So the research is already looking pretty conclusive. 😂",
  "Okay but genuinely: your taste is good. Your ragebait immunity? Still in beta.",
  "MINNIE HAS ENTERED THE CHAT. Please submit all complaints in triplicate. ✳",
  "This button said do not press it and you immediately became a scientist. Iconic."
];
let rageCount = 0;
$("#ragebait")?.addEventListener("click", () => {
  const result = $("#rageResult");
  result.textContent = rageLines[rageCount % rageLines.length];
  rageCount++;
  if (!reduceMotion) result.animate([{opacity:0,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}], {duration:320,easing:"ease-out"});
});

const letterCopy = {
  laugh: "Minnie. You are legally required to take a tiny break, unclench your jaw, and remember that somewhere out there is a person who will call you aesthetically dumb just to watch you write a whole rebuttal. (It is me. I am somewhere out there.) You are loved. Go drink some water, you dramatic little icon. ♡",
  heavy: "Hey, you. You do not have to turn every difficult day into a lesson or be productive to deserve rest. Take things one small piece at a time. Eat something, breathe, and let someone be kind to you. You do not need to have it all figured out today. I'm really glad you're here, Minnie.",
  reminder: "Just a reminder from your friend: you make life brighter by being exactly yourself. Your opinions, your music taste, your particular brand of chaos, even your extremely fast ragebait response time — all of it belongs to the person I am glad to know. I hope you give yourself some of the kindness you give the people around you. ♡"
};
$$("[data-letter]").forEach(button => button.addEventListener("click", () => {
  $("#letterBody").textContent = letterCopy[button.dataset.letter] || "";
  const paper = $("#letterPaper");
  paper.hidden = false;
  paper.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth",block:"nearest"});
  $("#letterClose")?.focus({preventScroll:true});
}));
$("#letterClose")?.addEventListener("click", () => {
  $("#letterPaper").hidden = true;
});

function confettiBurst(count = 48) {
  if (reduceMotion) return;
  const palette = ["#E9E2D0","#879078","#754B39","#C5B995","#F2E7D0","#354C3C"];
  for (let i=0;i<count;i++) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.setAttribute("aria-hidden","true");
    piece.style.setProperty("--x", Math.random()*100 + "vw");
    piece.style.setProperty("--c", palette[Math.floor(Math.random()*palette.length)]);
    piece.style.setProperty("--d", (2.4+Math.random()*2.4)+"s");
    piece.style.setProperty("--r", Math.random()*180+"deg");
    piece.style.setProperty("--drift", (Math.random()*200-100)+"px");
    piece.style.width = (4+Math.random()*5)+"px";
    piece.style.height = (6+Math.random()*8)+"px";
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), {once:true});
  }
}
function openGift() {
  const wish = $("#giftWish");
  const wasOpen = !wish.hidden;
  wish.hidden = false;
  $("#giftButton").textContent = wasOpen ? "Make another wish ↗" : "Your wish is here ♡";
  $("#giftArt").setAttribute("aria-label","Birthday wish revealed");
  confettiBurst();
}
$("#giftButton")?.addEventListener("click", openGift);
$("#giftArt")?.addEventListener("click", openGift);
$("#giftAgain")?.addEventListener("click", () => { confettiBurst(32); $("#giftWish p").textContent = "One more wish, because one is obviously not enough: may the year ahead bring soft days, chaotic laughs, great music, beautiful little surprises, and people who make you feel at home. Happy birthday, Minnie. ♡"; });

// Make external music links open safely; the in-page player streams only after an explicit click.
$$('a[target="_blank"]').forEach(a => a.setAttribute("rel","noopener noreferrer"));

// Birthday countdown: adapt to the visitor's local calendar and remain useful after the day.
const birthdayDate = new Date(2026, 9, 20);
const dateOnly = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const daysUntilBirthday = Math.round((dateOnly(birthdayDate) - dateOnly(new Date())) / 86400000);
const birthdayStatus = $("#birthdayStatus");
if (birthdayStatus) {
  if (daysUntilBirthday > 1) birthdayStatus.innerHTML = `<span>✳</span> ${daysUntilBirthday} DAYS UNTIL THE MINNIE HOLIDAY`;
  else if (daysUntilBirthday === 1) birthdayStatus.innerHTML = `<span>✳</span> TOMORROW IS MINNIE DAY`;
  else if (daysUntilBirthday === 0) birthdayStatus.innerHTML = `<span>✳</span> IT'S MINNIE DAY — LET'S CELEBRATE`;
  else birthdayStatus.innerHTML = `<span>✳</span> A BIRTHDAY KEEPSAKE TO REVISIT`;
}
if (dateOnly(new Date()).getTime() === dateOnly(birthdayDate).getTime()) {
  document.title = "Happy Birthday, Minnie! ✿";
}

// A slim page-progress line makes the long scrapbook feel guided, especially on mobile.
const progressBar = $("#scrollProgress");
let progressTicking = false;
const updateProgress = () => {
  if (!progressBar || progressTicking) return;
  progressTicking = true;
  requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    progressBar.style.width = progress + "%";
    progressTicking = false;
  });
};
window.addEventListener("scroll", updateProgress, {passive:true});
window.addEventListener("resize", updateProgress);
updateProgress();

// An extra birthday-only confetti moment, always user-triggered and reduced-motion aware.
$("#partyButton")?.addEventListener("click", () => {
  confettiBurst(72);
  const button = $("#partyButton");
  button.textContent = "MINNIE DAY ENERGY ✳";
  if (!reduceMotion && button.animate) button.animate(
    [{transform:"rotate(0) scale(1)"},{transform:"rotate(-2deg) scale(1.05)"},{transform:"rotate(2deg) scale(1)"},{transform:"none"}],
    {duration:420,easing:"ease-out"}
  );
});

// Minnieverse local soundtrack — custom controls, no external redirects.
const musicPlayer = $("#musicPlayer");
const audio = $("#localAudio");
const audioStatus = $("#audioStatus");
const playerSongTitle = $("#playerSongTitle");
const playerSongArtist = $("#playerSongArtist");
const playerTrackIndex = $("#playerTrackIndex");
const playerMode = $("#playerMode");
const playerPlayButton = $("#playerPlayButton");
const playerPlayIcon = $("#playerPlayIcon");
const playerPrevious = $("#playerPrevious");
const playerNext = $("#playerNext");
const playerMuteButton = $("#playerMuteButton");
const audioSeek = $("#audioSeek");
const audioElapsed = $("#audioElapsed");
const audioDuration = $("#audioDuration");
const audioVolume = $("#audioVolume");
const recordLabel = $("#recordLabel");
const recordLabelSymbol = $("#recordLabelSymbol");
let selectedTrack = null;
let previousVolume = 0.78;
const tracks = Array.from(document.querySelectorAll(".track[data-audio-src]"));

function setTrackMessage(message) {
  if (audioStatus) audioStatus.textContent = message;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
  const whole = Math.floor(seconds);
  return Math.floor(whole / 60) + ":" + String(whole % 60).padStart(2, "0");
}

function updatePlayState() {
  if (!audio || !musicPlayer) return;
  const playing = !audio.paused && !audio.ended;
  musicPlayer.classList.toggle("is-playing", playing);
  if (playerPlayButton) {
    playerPlayButton.setAttribute("aria-label", playing ? "Pause music" : "Play selected track");
    playerPlayButton.setAttribute("title", playing ? "Pause" : "Play");
  }
  if (playerPlayIcon) playerPlayIcon.textContent = playing ? "Ⅱ" : "▶";
  if (playerMode) playerMode.textContent = playing ? "NOW SPINNING" : selectedTrack ? "PAUSED, FOR DRAMATIC EFFECT" : "READY WHEN YOU ARE";
}

function updateSeekDisplay() {
  if (!audio) return;
  const duration = audio.duration;
  const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
  if (audioElapsed) audioElapsed.textContent = formatTime(current);
  if (audioDuration) audioDuration.textContent = formatTime(duration);
  if (audioSeek) {
    audioSeek.disabled = !Number.isFinite(duration) || duration <= 0;
    if (!audioSeek.matches(":active") && Number.isFinite(duration) && duration > 0) {
      audioSeek.value = String(Math.round((current / duration) * 1000));
    }
    audioSeek.style.setProperty("--seek-progress", Number.isFinite(duration) && duration > 0 ? (current / duration * 100) + "%" : "0%");
  }
}

function syncVolumeUI() {
  if (!audio || !audioVolume || !playerMuteButton) return;
  audioVolume.value = String(audio.muted ? 0 : audio.volume);
  playerMuteButton.textContent = audio.muted || audio.volume === 0 ? "×" : audio.volume < 0.45 ? "♪" : "♫";
  playerMuteButton.setAttribute("aria-label", audio.muted || audio.volume === 0 ? "Unmute audio" : "Mute audio");
  playerMuteButton.setAttribute("title", audio.muted || audio.volume === 0 ? "Unmute" : "Mute");
  audioVolume.style.setProperty("--volume-progress", ((audio.muted ? 0 : audio.volume) * 100) + "%");
}

function updateRecordLabel(track) {
  if (!track) return;
  const artwork = $(".track-art", track);
  if (recordLabelSymbol && artwork) recordLabelSymbol.textContent = artwork.textContent.trim();
  if (recordLabel) {
    recordLabel.classList.remove("art-cream", "art-sage", "art-rust", "art-dark");
    ["art-cream", "art-sage", "art-rust", "art-dark"].forEach(name => {
      if (artwork?.classList.contains(name)) recordLabel.classList.add(name);
    });
  }
}

function selectTrack(track, autoplay = true) {
  if (!audio || !musicPlayer || !track) return;
  const src = track.dataset.audioSrc;
  if (!src || !src.startsWith("./assets/audio/")) return;

  selectedTrack = track;
  const index = tracks.indexOf(track);
  const title = $(".track-text b", track)?.textContent.trim() || track.dataset.trackTitle || "Minnie soundtrack";
  const subtitle = $(".track-text small", track)?.textContent.trim() || track.dataset.trackTitle || "A song for Minnie";
  tracks.forEach((row, rowIndex) => {
    row.classList.toggle("is-playing", row === track);
    row.classList.remove("needs-file");
    row.setAttribute("aria-pressed", String(row === track));
    row.setAttribute("aria-current", row === track ? "true" : "false");
  });

  if (playerSongTitle) playerSongTitle.textContent = title;
  if (playerSongArtist) playerSongArtist.textContent = subtitle;
  if (playerTrackIndex) playerTrackIndex.textContent = String(index + 1).padStart(2, "0") + " / " + String(tracks.length).padStart(2, "0");
  updateRecordLabel(track);
  musicPlayer.classList.add("has-track");

  // A new source starts directly from the tap, preserving mobile playback activation.
  audio.pause();
  audio.src = src;
  audio.load();
  if (audioSeek) audioSeek.value = "0";
  if (audioElapsed) audioElapsed.textContent = "0:00";
  if (audioDuration) audioDuration.textContent = "--:--";
  setTrackMessage("Putting on · " + subtitle);
  updatePlayState();
  updateSeekDisplay();

  if (autoplay) {
    const request = audio.play();
    if (request && typeof request.then === "function") {
      request.then(() => {
        if (selectedTrack === track) {
          setTrackMessage("Now playing · " + subtitle);
          updatePlayState();
        }
      }).catch(error => {
        if (selectedTrack !== track) return;
        if (error?.name === "NotAllowedError") {
          setTrackMessage("Tap the large play button to start the record.");
        } else if (error?.name === "NotSupportedError") {
          setTrackMessage("This audio file format isn't supported. Check " + src.replace("./", "") + ".");
          track.classList.add("needs-file");
        } else {
          setTrackMessage("Couldn't start playback. Check the MP3 file and try again.");
          track.classList.add("needs-file");
        }
        updatePlayState();
      });
    }
  } else {
    setTrackMessage("Selected · " + subtitle);
  }
}

function togglePlayback() {
  if (!audio) return;
  if (!selectedTrack) {
    selectTrack(tracks[0], true);
    return;
  }
  if (audio.paused || audio.ended) {
    const request = audio.play();
    if (request && typeof request.then === "function") {
      request.then(() => {
        const subtitle = $(".track-text small", selectedTrack)?.textContent.trim() || selectedTrack.dataset.trackTitle;
        setTrackMessage("Now playing · " + subtitle);
        updatePlayState();
      }).catch(error => {
        setTrackMessage(error?.name === "NotAllowedError" ? "Tap play again to start the record." : "Couldn't play this track. Check the MP3 file.");
      });
    }
  } else {
    audio.pause();
    setTrackMessage("Paused · the record is taking a tiny breather.");
  }
  updatePlayState();
}

function moveTrack(direction) {
  if (!tracks.length) return;
  const currentIndex = selectedTrack ? tracks.indexOf(selectedTrack) : (direction > 0 ? -1 : 0);
  const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
  selectTrack(tracks[nextIndex], true);
}

tracks.forEach(track => {
  track.setAttribute("aria-controls", "localAudio");
  track.addEventListener("click", () => {
    if (selectedTrack === track && audio && !audio.paused) {
      audio.pause();
      setTrackMessage("Paused · " + ($(".track-text small", track)?.textContent.trim() || "Minnie soundtrack"));
      updatePlayState();
      return;
    }
    selectTrack(track, true);
  });
});

playerPlayButton?.addEventListener("click", togglePlayback);
playerPrevious?.addEventListener("click", () => moveTrack(-1));
playerNext?.addEventListener("click", () => moveTrack(1));

audioSeek?.addEventListener("input", () => {
  if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
  const fraction = Number(audioSeek.value) / 1000;
  audioSeek.style.setProperty("--seek-progress", (fraction * 100) + "%");
  if (audioElapsed) audioElapsed.textContent = formatTime(fraction * audio.duration);
});
audioSeek?.addEventListener("change", () => {
  if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = (Number(audioSeek.value) / 1000) * audio.duration;
  updateSeekDisplay();
});

audioVolume?.addEventListener("input", () => {
  if (!audio || !audioVolume) return;
  const value = Number(audioVolume.value);
  audio.volume = Math.max(0, Math.min(1, value));
  audio.muted = value === 0;
  if (value > 0) previousVolume = value;
  syncVolumeUI();
});
playerMuteButton?.addEventListener("click", () => {
  if (!audio) return;
  if (audio.muted || audio.volume === 0) {
    audio.muted = false;
    audio.volume = previousVolume || 0.78;
  } else {
    previousVolume = audio.volume;
    audio.muted = true;
  }
  syncVolumeUI();
});

audio?.addEventListener("loadedmetadata", updateSeekDisplay);
audio?.addEventListener("durationchange", updateSeekDisplay);
audio?.addEventListener("timeupdate", updateSeekDisplay);
audio?.addEventListener("play", updatePlayState);
audio?.addEventListener("pause", updatePlayState);
audio?.addEventListener("playing", () => {
  updatePlayState();
  if (selectedTrack) {
    const subtitle = $(".track-text small", selectedTrack)?.textContent.trim() || selectedTrack.dataset.trackTitle;
    setTrackMessage("Now playing · " + subtitle);
  }
});
audio?.addEventListener("ended", () => moveTrack(1));
audio?.addEventListener("volumechange", syncVolumeUI);
audio?.addEventListener("error", () => {
  if (!selectedTrack) return;
  musicPlayer?.classList.remove("is-playing");
  selectedTrack.classList.add("needs-file");
  if (playerMode) playerMode.textContent = "NEEDS A LITTLE HELP";
  setTrackMessage("Audio couldn't be loaded (error " + (audio.error?.code || "unknown") + "). Check " + selectedTrack.dataset.audioSrc + ".");
  updatePlayState();
});

if (audio) audio.volume = 0.78;
syncVolumeUI();
updatePlayState();
updateSeekDisplay();

// External links elsewhere on the page remain safe; soundtrack items are local buttons.
$$('a[target="_blank"]').forEach(a => a.setAttribute("rel","noopener noreferrer"));
