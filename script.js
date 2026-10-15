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
$('a[target="_blank"]').forEach(a => a.setAttribute("rel","noopener noreferrer"));

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

// Stream through YouTube's official embed player in-page; never download or bundle copyrighted audio.
// No iframe loads until Minnie (or the visitor) taps a track.
const musicPlayer = $("#musicPlayer");
const playerFrame = $("#playerFrame");
Array.from(document.querySelectorAll(".track[data-video-id]")).forEach(track => {
  track.setAttribute("aria-label", "Play " + track.dataset.trackTitle + " in the page");
  track.addEventListener("click", event => {
    event.preventDefault();
    const id = track.dataset.videoId;
    const title = track.dataset.trackTitle || "Minnie soundtrack";
    if (!playerFrame || !/^[A-Za-z0-9_-]{11}$/.test(id || "")) return;
    Array.from(document.querySelectorAll(".track")).forEach(row => {
      row.classList.toggle("is-playing", row === track);
      if (row === track) row.setAttribute("aria-current", "true");
      else row.removeAttribute("aria-current");
    });
    if (musicPlayer) musicPlayer.classList.add("has-track");
    playerFrame.innerHTML = "";
    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&modestbranding=1";
    frame.title = "Now playing: " + title;
    frame.loading = "eager";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allowFullscreen = true;
    playerFrame.appendChild(frame);
    const placeholder = $(".player-placeholder", musicPlayer);
    if (placeholder) {
      placeholder.innerHTML = '<span class="player-icon">♫</span><div><small>NOW PLAYING IN MINNIEVERSE</small><p></p></div><button class="player-stop" type="button" aria-label="Stop music">×</button>';
      $("p", placeholder).textContent = title;
      $(".player-stop", placeholder)?.addEventListener("click", () => {
        playerFrame.innerHTML = "";
        musicPlayer.classList.remove("has-track");
        Array.from(document.querySelectorAll(".track")).forEach(row => { row.classList.remove("is-playing"); row.removeAttribute("aria-current"); });
        placeholder.innerHTML = '<span class="player-icon">♫</span><div><small>MINNIE\'S VERY PERSONAL RADIO</small><p>Pick a track above and let it play right here.</p></div><span class="player-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>';
      });
    }
    if (!reduceMotion) musicPlayer?.scrollIntoView({behavior:"smooth",block:"nearest"});
  });
});
