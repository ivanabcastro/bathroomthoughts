const bathroomFacts = [
  "the average person spends around 1.5 years of life in the bathroom.",
  "ancient romans used public baths as social hubs for gossip and politics.",
  "the first toilet paper roll patent was filed in 1891.",
  "a leaky toilet can waste over 6,000 gallons of water in a year.",
  "rubber ducks became popular worldwide after sesame street in the 1970s.",
  "the japanese have toilets with music settings to protect your privacy.",
  "a shower thought often happens because your brain is relaxed and unstuck.",
  "the blue color in bathrooms is linked with calm and cleanliness.",
  "the word toilet comes from french and originally meant a cloth or dressing room.",
  "bathroom mirrors fog because warm moist air condenses on the cooler glass."
];

const soapAffirmations = [
  "nobody actually knows why you're in here. keep it that way.",
  "if you forgot what you came for, that's a systems issue not a you issue.",
  "wash long enough for one verse. not the whole ep.",
  "your phone will still be boring when you get back.",
  "hot water is not free. worth it anyway.",
  "the mirror is doing its job. you're doing yours.",
  "flush when you're done. emotionally and literally.",
  "tiles have seen worse. statistically.",
  "soap can't fix your calendar. only your hands.",
  "small hydration win if you drink water after this.",
  "that cabinet slam at 2am haunts everyone. you're not alone.",
  "meetings end. this room doesn't charge overtime.",
  "your browser history and your face wash are separate problems.",
  "rubber ducks are witnesses. treat them accordingly.",
  "rinse the doubt. dry your hands before your phone.",
  "your outfit is fine. the lighting is the snitch.",
  "awkward silence is just loading time for the next sentence.",
  "wifi drops. you don't have to.",
  "brain buffering is normal. blame cache not character.",
  "boundaries include closing the door.",
  "wash hands. skip the spiral.",
  "another day without becoming a cryptid. baseline met.",
  "laugh loud enough that people assume the fan is loud.",
  "caffeine is a contract you renew every morning.",
  "gremlin energy is valid if you hydrate after.",
  "soft towels are a reasonable ask.",
  "reply-all shame washes off with soap. mostly.",
  "playlist taste is none of your ex's business.",
  "plants judge silently. ignore them.",
  "bubbles don't do therapy. they do soap.",
  "exhaust fans earn their keep.",
  "rest is allowed. the tile union approves.",
  "metaphorically cooked counts until dinner.",
  "awkward is a genre. you're in the cast.",
  "imposter syndrome isn't waterproof. soap helps hands only.",
  "public wi-fi is a choice. so is regret.",
  "close the tabs from 2021. start with one.",
  "patience should come with a stipend.",
  "fluorescent lights are not a personality assessment.",
  "lint rollers and vibes can coexist.",
  "group projects end. your dignity doesn't have to.",
  "humor that worries people is still humor.",
  "walk in here on purpose if you need the lie.",
  "crowns adjust in private. mirrors allow it.",
  "bubbles today. paperwork tomorrow.",
  "small talk survived = stamina unlocked.",
  "wash like you're about to eat chips with clean fingers.",
  "polish boundaries when you polish the mirror.",
  "chronic online is a lifestyle. water is still free-ish.",
  "prune fingers mean you've been scrolling. reset.",
  "cozy disaster is a valid aesthetic.",
  "shower thoughts are not tax advice.",
  "awkward exits are still exits.",
  "peace, moisturizer, mild chaos — pick two.",
  "at least one duck still believes in you. probably.",
  "five minutes here counts if you say it does.",
  "you don't owe anyone a performance in this mirror.",
  "cold water wakes you up faster than any meeting agenda.",
  "if the queue knocks, they can wait.",
  "toilet paper anxiety is universal. you're in good company.",
  "soap says: touch grass after you dry your hands.",
  "you're allowed to reset before you re-enter the simulation.",
  "this soap bar is green. your choices are yours.",
  "rinse. you're not on camera unless you brought one."
];

const feed = document.getElementById("feed");
const feedPagination = document.getElementById("feedPagination");
const form = document.getElementById("thoughtForm");
const input = document.getElementById("thoughtInput");
const usernameInput = document.getElementById("usernameInput");
const charCount = document.getElementById("charCount");
const factText = document.getElementById("factText");
const gameCanvas = document.getElementById("poopGame");
const gameLives = document.getElementById("gameLives");
const difficultySelect = document.getElementById("difficultySelect");
const playGameBtn = document.getElementById("playGameBtn");
const restartGameBtn = document.getElementById("restartGameBtn");
const leaderboardList = document.getElementById("leaderboardList");
const selfieGallery = document.getElementById("selfieGallery");
const selfieInput = document.getElementById("selfieInput");
const soapBtn = document.getElementById("soapBtn");
const soapDisplay = document.getElementById("soapDisplay");
const photoLightbox = document.getElementById("photoLightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
const SELFIE_STORAGE_KEY = "bathroomSelfieGallery_v1";
const MAX_SELFIES = 12;
const reactionTypes = ["❤️", "😂", "😮", "😢", "😡", "🦆", "🚽"];
const deletePasswords = new Set(["lunasafaera", "sushimercedescarota"]);
const FEED_STORAGE_KEY = "bathroomThoughtsFeed_v1";
const POSTS_PER_PAGE = 10;
let feedPage = 1;

function savedUsername() {
  return localStorage.getItem("bathroomThoughtsUser") || "";
}

usernameInput.value = savedUsername();

function formatPostTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getPosts() {
  try {
    const raw = localStorage.getItem(FEED_STORAGE_KEY);
    const list = JSON.parse(raw || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(posts));
}

function playFlushSound() {
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.82;
  master.connect(ctx.destination);

  const t0 = ctx.currentTime;

  function makeNoiseBuffer(seconds) {
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  const splash = ctx.createBufferSource();
  splash.buffer = makeNoiseBuffer(0.18);
  const splashFilter = ctx.createBiquadFilter();
  splashFilter.type = "bandpass";
  splashFilter.frequency.setValueAtTime(1600, t0);
  splashFilter.frequency.exponentialRampToValueAtTime(380, t0 + 0.14);
  splashFilter.Q.value = 1.1;
  const splashGain = ctx.createGain();
  splashGain.gain.setValueAtTime(0.0001, t0);
  splashGain.gain.exponentialRampToValueAtTime(0.13, t0 + 0.025);
  splashGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
  splash.connect(splashFilter);
  splashFilter.connect(splashGain);
  splashGain.connect(master);
  splash.start(t0);
  splash.stop(t0 + 0.18);

  const drain = ctx.createBufferSource();
  drain.buffer = makeNoiseBuffer(2.5);
  const drainLp = ctx.createBiquadFilter();
  drainLp.type = "lowpass";
  drainLp.frequency.setValueAtTime(720, t0);
  drainLp.frequency.exponentialRampToValueAtTime(85, t0 + 2.15);
  drainLp.Q.value = 0.65;
  const drainGain = ctx.createGain();
  drainGain.gain.setValueAtTime(0.0001, t0);
  drainGain.gain.exponentialRampToValueAtTime(0.095, t0 + 0.12);
  drainGain.gain.setValueAtTime(0.088, t0 + 0.35);
  drainGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.45);
  drain.connect(drainLp);
  drainLp.connect(drainGain);
  drainGain.connect(master);
  drain.start(t0);

  const gurgle = ctx.createOscillator();
  gurgle.type = "triangle";
  gurgle.frequency.setValueAtTime(62, t0 + 0.08);
  gurgle.frequency.exponentialRampToValueAtTime(48, t0 + 2);
  const gurgleGain = ctx.createGain();
  gurgleGain.gain.setValueAtTime(0.0001, t0 + 0.06);
  gurgleGain.gain.exponentialRampToValueAtTime(0.038, t0 + 0.18);
  gurgleGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.15);
  const gLp = ctx.createBiquadFilter();
  gLp.type = "lowpass";
  gLp.frequency.value = 180;
  gurgle.connect(gLp);
  gLp.connect(gurgleGain);
  gurgleGain.connect(master);
  gurgle.start(t0 + 0.06);
  gurgle.stop(t0 + 2.2);

  const refill = ctx.createBufferSource();
  refill.buffer = makeNoiseBuffer(3.2);
  const refillBp = ctx.createBiquadFilter();
  refillBp.type = "bandpass";
  refillBp.frequency.setValueAtTime(3800, t0 + 1.25);
  refillBp.frequency.exponentialRampToValueAtTime(900, t0 + 4.1);
  refillBp.Q.value = 0.5;
  const refillGain = ctx.createGain();
  refillGain.gain.setValueAtTime(0.0001, t0 + 1.15);
  refillGain.gain.exponentialRampToValueAtTime(0.048, t0 + 1.45);
  refillGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 4.15);
  refill.connect(refillBp);
  refillBp.connect(refillGain);
  refillGain.connect(master);
  refill.start(t0 + 1.15);

  const tankHum = ctx.createOscillator();
  tankHum.type = "sine";
  tankHum.frequency.setValueAtTime(118, t0 + 1.1);
  tankHum.frequency.exponentialRampToValueAtTime(96, t0 + 3.8);
  const tankGain = ctx.createGain();
  tankGain.gain.setValueAtTime(0.0001, t0 + 1.08);
  tankGain.gain.exponentialRampToValueAtTime(0.022, t0 + 1.35);
  tankGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 4);
  tankHum.connect(tankGain);
  tankGain.connect(master);
  tankHum.start(t0 + 1.08);
  tankHum.stop(t0 + 4.05);
}

function createPostElement(post) {
  const { user, text, badge, createdAt, reactions = {} } = post;
  const item = document.createElement("article");
  item.className = "post";
  item.dataset.postId = post.id;
  item.innerHTML = `
    <div class="post-header">
      <span class="post-user">@${user}</span>
      <span class="post-time">${formatPostTime(createdAt)}</span>
    </div>
    <p class="post-body"></p>
    <span class="post-badge">${badge}</span>
    <div class="post-actions">
      ${reactionTypes
        .map((emoji) => {
          const count = reactions[emoji] ?? 0;
          return `
            <button class="reaction-btn" type="button" data-emoji="${emoji}" data-count="${count}" aria-label="react with ${emoji}">
              <span>${emoji}</span><span class="reaction-count">${count}</span>
            </button>
          `;
        })
        .join("")}
      <button class="delete-btn" type="button">delete</button>
    </div>
  `;
  item.querySelector(".post-body").textContent = text;
  return item;
}

function renderFeed() {
  const all = getPosts();
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  if (feedPage > totalPages) feedPage = totalPages;
  if (feedPage < 1) feedPage = 1;

  const start = (feedPage - 1) * POSTS_PER_PAGE;
  const slice = all.slice(start, start + POSTS_PER_PAGE);

  feed.innerHTML = "";
  slice.forEach((post) => {
    feed.append(createPostElement(post));
  });

  renderPagination(totalPages, all.length);
}

function renderPagination(totalPages, totalItems) {
  feedPagination.innerHTML = "";
  if (totalItems <= POSTS_PER_PAGE) return;

  const wrap = document.createElement("div");
  wrap.className = "feed-pagination-inner";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "feed-page-btn";
  prev.textContent = "prev";
  prev.disabled = feedPage <= 1;

  const info = document.createElement("span");
  info.className = "feed-page-info";
  info.textContent = `page ${feedPage} of ${totalPages}`;

  const next = document.createElement("button");
  next.type = "button";
  next.className = "feed-page-btn";
  next.textContent = "next";
  next.disabled = feedPage >= totalPages;

  prev.addEventListener("click", () => {
    feedPage -= 1;
    renderFeed();
  });
  next.addEventListener("click", () => {
    feedPage += 1;
    renderFeed();
  });

  wrap.append(prev, info, next);
  feedPagination.append(wrap);
}

function postFromUser(user, text) {
  const newPost = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    user,
    text,
    badge: "just posted",
    createdAt: new Date().toISOString(),
    reactions: {}
  };
  const posts = getPosts();
  posts.unshift(newPost);
  savePosts(posts);
  feedPage = 1;
  renderFeed();
}

function rotateFact() {
  const fact = bathroomFacts[Math.floor(Math.random() * bathroomFacts.length)];
  factText.textContent = fact;
}

input.addEventListener("input", () => {
  charCount.textContent = `${input.value.length} / 240`;
});

usernameInput.addEventListener("input", () => {
  localStorage.setItem("bathroomThoughtsUser", usernameInput.value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = usernameInput.value.trim();
  const text = input.value.trim();
  if (!user || !text) return;

  localStorage.setItem("bathroomThoughtsUser", user);
  postFromUser(user, text.toLowerCase());
  playFlushSound();
  input.value = "";
  charCount.textContent = "0 / 240";
});

feed.addEventListener("click", (event) => {
  const button = event.target.closest(".reaction-btn");
  if (button) {
    const postEl = button.closest(".post");
    const postId = postEl && postEl.dataset.postId;
    if (!postId) return;

    const countSpan = button.querySelector(".reaction-count");
    const emoji = button.dataset.emoji;
    const currentCount = Number(button.dataset.count || "0");
    const isActive = button.classList.toggle("is-active");
    const newCount = isActive ? currentCount + 1 : Math.max(0, currentCount - 1);

    button.dataset.count = String(newCount);
    countSpan.textContent = String(newCount);

    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return;
    posts[idx].reactions = posts[idx].reactions || {};
    posts[idx].reactions[emoji] = newCount;
    if (posts[idx].reactions[emoji] === 0) delete posts[idx].reactions[emoji];
    savePosts(posts);
    return;
  }

  const deleteButton = event.target.closest(".delete-btn");
  if (!deleteButton) return;

  const entered = prompt("enter delete password");
  if (!entered) return;

  if (!deletePasswords.has(entered.trim().toLowerCase())) {
    alert("wrong password");
    return;
  }

  const post = deleteButton.closest(".post");
  const postId = post && post.dataset.postId;
  if (!postId) return;

  const posts = getPosts().filter((p) => p.id !== postId);
  savePosts(posts);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  if (feedPage > totalPages) feedPage = totalPages;
  renderFeed();
});

function getSelfies() {
  try {
    const raw = localStorage.getItem(SELFIE_STORAGE_KEY);
    const list = JSON.parse(raw || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveSelfies(list) {
  localStorage.setItem(SELFIE_STORAGE_KEY, JSON.stringify(list));
}

function openLightbox(src) {
  lightboxImg.src = src;
  photoLightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  photoLightbox.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

function renderSelfies() {
  const list = getSelfies();
  selfieGallery.innerHTML = "";
  if (!list.length) {
    selfieGallery.innerHTML = "<p class=\"game-help\">no selfies yet — be brave.</p>";
    return;
  }

  list.forEach((item) => {
    const wrap = document.createElement("article");
    wrap.className = "selfie-item";
    wrap.dataset.id = item.id;
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = "bathroom selfie — tap to enlarge";
    img.loading = "lazy";
    const footer = document.createElement("div");
    footer.className = "selfie-item-footer";
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "selfie-delete-btn";
    deleteBtn.dataset.id = item.id;
    deleteBtn.textContent = "remove";
    const heartBtn = document.createElement("button");
    heartBtn.type = "button";
    heartBtn.className = `selfie-heart-btn${item.hearts > 0 ? " is-active" : ""}`;
    heartBtn.dataset.id = item.id;
    heartBtn.dataset.count = String(item.hearts || 0);
    heartBtn.setAttribute("aria-label", "heart this selfie");
    heartBtn.textContent = `❤️ ${item.hearts || 0}`;
    footer.append(deleteBtn, heartBtn);
    wrap.append(img, footer);
    selfieGallery.append(wrap);
  });
}

function resizeImageFileToJpeg(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxW = 720;
        const scale = image.width > maxW ? maxW / image.width : 1;
        const w = Math.round(image.width * scale);
        const h = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const c = canvas.getContext("2d");
        c.drawImage(image, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

selfieInput.addEventListener("change", async () => {
  const file = selfieInput.files && selfieInput.files[0];
  selfieInput.value = "";
  if (!file || !file.type.startsWith("image/")) return;

  try {
    const dataUrl = await resizeImageFileToJpeg(file);
    const list = getSelfies();
    list.unshift({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      src: dataUrl,
      hearts: 0
    });
    saveSelfies(list.slice(0, MAX_SELFIES));
    renderSelfies();
  } catch {
    alert("could not load that image — try another photo.");
  }
});

selfieGallery.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".selfie-delete-btn");
  if (removeBtn) {
    const entered = prompt("enter delete password");
    if (!entered) return;
    if (!deletePasswords.has(entered.trim().toLowerCase())) {
      alert("wrong password");
      return;
    }
    const id = removeBtn.dataset.id;
    saveSelfies(getSelfies().filter((item) => item.id !== id));
    closeLightbox();
    renderSelfies();
    return;
  }

  const btn = event.target.closest(".selfie-heart-btn");
  if (btn) {
    const id = btn.dataset.id;
    const list = getSelfies();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) return;
    const count = Number(btn.dataset.count || "0");
    const next = count + 1;
    list[idx].hearts = next;
    btn.dataset.count = String(next);
    btn.classList.add("is-active");
    btn.textContent = `❤️ ${next}`;
    saveSelfies(list);
    return;
  }

  const thumb = event.target.closest(".selfie-item img");
  if (thumb) {
    openLightbox(thumb.src);
  }
});

lightboxCloseBtn.addEventListener("click", closeLightbox);
photoLightbox.addEventListener("click", (event) => {
  if (event.target === photoLightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !photoLightbox.hidden) closeLightbox();
});

soapBtn.addEventListener("click", () => {
  const pick = soapAffirmations[Math.floor(Math.random() * soapAffirmations.length)];
  soapDisplay.replaceChildren();
  const wrap = document.createElement("div");
  wrap.className = "soap-visual-wrap";
  const bubbles = document.createElement("div");
  bubbles.className = "soap-bubbles";
  bubbles.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 8; i += 1) {
    bubbles.append(document.createElement("span"));
  }
  const bar = document.createElement("div");
  bar.className = "soap-bar";
  const p = document.createElement("p");
  p.textContent = pick;
  bar.append(p);
  const foam = document.createElement("div");
  foam.className = "soap-foam";
  foam.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 5; i += 1) {
    foam.append(document.createElement("span"));
  }
  wrap.append(bubbles, bar, foam);
  soapDisplay.append(wrap);
});

rotateFact();
setInterval(rotateFact, 15000);

renderFeed();
renderSelfies();

const ctx = gameCanvas.getContext("2d");
const difficultySettings = {
  easy: { spawnChance: 0.014, minSpeed: 1.0, maxSpeed: 1.8 },
  medium: { spawnChance: 0.022, minSpeed: 1.2, maxSpeed: 2.2 },
  hard: { spawnChance: 0.032, minSpeed: 1.6, maxSpeed: 3.0 }
};

const game = {
  toiletX: 250,
  toiletWidth: 92,
  poop: [],
  lives: 3,
  score: 0,
  running: false,
  mode: "medium"
};

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem("bathroomThoughtsLeaderboard") || "[]");
  } catch {
    return [];
  }
}

function renderLeaderboard() {
  const board = getLeaderboard();
  leaderboardList.innerHTML = "";
  if (!board.length) {
    leaderboardList.innerHTML = "<li>no scores yet</li>";
    return;
  }

  board.slice(0, 3).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.user}: ${entry.score}`;
    leaderboardList.append(li);
  });
}

function addLeaderboardScore(user, score) {
  const board = getLeaderboard();
  board.push({ user, score });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem("bathroomThoughtsLeaderboard", JSON.stringify(board.slice(0, 3)));
  renderLeaderboard();
}

function resetGame() {
  game.toiletX = gameCanvas.width / 2 - game.toiletWidth / 2;
  game.poop = [];
  game.lives = 3;
  game.score = 0;
  gameLives.textContent = "lives: 3";
}

function spawnPoop() {
  const modeConfig = difficultySettings[game.mode];
  game.poop.push({
    x: Math.random() * (gameCanvas.width - 18),
    y: -20,
    speed: modeConfig.minSpeed + Math.random() * (modeConfig.maxSpeed - modeConfig.minSpeed)
  });
}

function drawToilet() {
  const y = gameCanvas.height - 56;
  const x = game.toiletX;
  const w = game.toiletWidth;
  ctx.fillStyle = "#f6fbff";
  ctx.fillRect(x + w - 24, y - 2, 18, 26);
  ctx.fillStyle = "#e4f0fb";
  ctx.fillRect(x + w - 18, y + 4, 10, 8);

  ctx.fillStyle = "#f8fcff";
  ctx.beginPath();
  ctx.ellipse(x + w / 2 - 6, y + 18, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d5e7f8";
  ctx.beginPath();
  ctx.ellipse(x + w / 2 - 6, y + 18, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f2f9ff";
  ctx.fillRect(x + 22, y + 24, 32, 14);
  ctx.fillStyle = "#d2e4f6";
  ctx.fillRect(x + 26, y + 38, 24, 8);
}

function scoreQualifiesForTopThree(score) {
  const board = getLeaderboard();
  if (board.length < 3) return score > 0;
  return score > board[board.length - 1].score;
}

function ensureUsernameForTopScore(score) {
  if (!scoreQualifiesForTopThree(score)) return usernameInput.value.trim() || null;
  let user = usernameInput.value.trim();
  while (!user) {
    const entered = prompt("top 3 score! enter a username to save:");
    if (!entered) return null;
    user = entered.trim();
  }
  usernameInput.value = user;
  localStorage.setItem("bathroomThoughtsUser", user);
  return user;
}

function drawPoop(item) {
  ctx.fillStyle = "#7a4a25";
  ctx.font = "20px serif";
  ctx.fillText("💩", item.x, item.y);
}

function updateGame() {
  if (!game.running) return;
  const modeConfig = difficultySettings[game.mode];
  if (Math.random() < modeConfig.spawnChance) spawnPoop();

  game.poop.forEach((item) => {
    item.y += item.speed;
  });

  game.poop = game.poop.filter((item) => {
    const toiletTop = gameCanvas.height - 34;
    const caught =
      item.y >= toiletTop &&
      item.x + 14 > game.toiletX &&
      item.x < game.toiletX + game.toiletWidth;
    if (caught) {
      game.score += 1;
      return false;
    }

    if (item.y > gameCanvas.height + 8) {
      game.lives -= 1;
      gameLives.textContent = `lives: ${Math.max(0, game.lives)}`;
      if (game.lives <= 0) {
        const user = ensureUsernameForTopScore(game.score);
        if (user && scoreQualifiesForTopThree(game.score)) {
          addLeaderboardScore(user, game.score);
        }
        alert(`game over! score: ${game.score}. press play to start again.`);
        game.running = false;
        resetGame();
      }
      return false;
    }

    return true;
  });
}

function drawGame() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let i = 0; i < gameCanvas.width; i += 14) {
    ctx.fillRect(i, 0, 1, gameCanvas.height);
  }

  ctx.fillStyle = "#f7dd88";
  ctx.font = "bold 14px monospace";
  ctx.fillText(`score ${game.score}`, 12, 20);
  ctx.fillText(`mode ${game.mode}`, 12, 40);

  if (!game.running) {
    ctx.fillStyle = "#c8dcf3";
    ctx.font = "bold 18px monospace";
    ctx.fillText("press play to start", gameCanvas.width / 2 - 105, gameCanvas.height / 2);
  }

  drawToilet();
  game.poop.forEach(drawPoop);
}

function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

gameCanvas.addEventListener("mousemove", (event) => {
  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const scaleX = gameCanvas.width / rect.width;
  game.toiletX = mouseX * scaleX - game.toiletWidth / 2;
  game.toiletX = Math.max(0, Math.min(gameCanvas.width - game.toiletWidth, game.toiletX));
});

gameCanvas.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  const rect = gameCanvas.getBoundingClientRect();
  const touchX = touch.clientX - rect.left;
  const scaleX = gameCanvas.width / rect.width;
  game.toiletX = touchX * scaleX - game.toiletWidth / 2;
  game.toiletX = Math.max(0, Math.min(gameCanvas.width - game.toiletWidth, game.toiletX));
  event.preventDefault();
}, { passive: false });

restartGameBtn.addEventListener("click", resetGame);
playGameBtn.addEventListener("click", () => {
  game.mode = difficultySelect.value;
  resetGame();
  game.running = true;
});
difficultySelect.addEventListener("change", () => {
  game.mode = difficultySelect.value;
});

resetGame();
renderLeaderboard();
gameLoop();
