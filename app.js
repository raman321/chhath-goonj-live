/* ================= BLENDED ENTRY FLOW ================= */
(() => {
  const intro = document.getElementById("intro");
  const experience = document.querySelector(".screen");
  const tuneIn = document.getElementById("tuneIn");
  const dust = document.getElementById("introDust");
  let opened = false;

  const makeDust = () => {
    if (!dust) return;
    const count = innerWidth < 700 ? 34 : 62;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const el = document.createElement("i");
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.animationDelay = `${Math.random() * -8}s`;
      el.style.animationDuration = `${5 + Math.random() * 7}s`;
      el.style.opacity = `${0.12 + Math.random() * 0.35}`;
      frag.appendChild(el);
    }
    dust.replaceChildren(frag);
  };

  makeDust();
  addEventListener("resize", () => {
    if (!opened) makeDust();
  });

  const enterExperience = () => {
    if (opened || !intro || !experience) return;
    opened = true;
    document.body.classList.add("opening");
    intro.classList.add("leave");
    if (tuneIn) tuneIn.disabled = true;

    setTimeout(() => {
      experience.classList.add("entry-visible");
      experience.setAttribute("aria-hidden", "false");
      window.scrollTo({ top: 0, behavior: "instant" });
      // Notify screen-2 integrations after the experience is revealed.
      window.dispatchEvent(new CustomEvent("chhath:screen2-enter"));
    }, 520);

    setTimeout(() => {
      intro.remove();
      document.body.classList.remove("opening");
    }, 1350);
  };

  tuneIn?.addEventListener("click", enterExperience);
  intro?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      enterExperience();
    }
  });
})();

const DONATION_PAYMENT_MESSAGE =
  "आपका यह छोटा सा सहयोग इस डिजिटल घाट को रोशन रखेगा।\nJai Chhathi Maiya 🙏";
const CONFIG = {
  donateUrl:
    "upi://pay?pa=9583107283%40ybl&pn=CHHATH%20GOONJ&tn=" +
    encodeURIComponent(DONATION_PAYMENT_MESSAGE),
  supabaseUrl: window.CHATH_GOONJ_CONFIG?.supabaseUrl || "",
  supabaseKey: window.CHATH_GOONJ_CONFIG?.supabasePublishableKey || "",
};

// Clock is intentionally desktop-only through CSS.
const clock = document.getElementById("clock"),
  todayDate = document.getElementById("todayDate"),
  todayDay = document.getElementById("todayDay");
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  todayDate.textContent = now
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
  todayDay.textContent = now
    .toLocaleDateString("en-IN", { weekday: "long" })
    .toUpperCase();
}
updateClock();
setInterval(updateClock, 1000);

// Chhath countdowns: 2026 first, then roll forward to 2027 after Usha Arghya.
// Test modes (remove the query parameter to return to the real clock):
// ?festivalTest=before | ?festivalTest=sandhya | ?festivalTest=usha | ?festivalTest=after
const chhathDates = {
  2026: {
    sandhya: { date: new Date("2026-11-15T17:30:00+05:30"), title: "SANDHYA ARGHYA", dateLabel: "15 NOV 2026", when: "SUNSET" },
    morning: { date: new Date("2026-11-16T06:15:00+05:30"), title: "USHA ARGHYA", dateLabel: "16 NOV 2026", when: "SUNRISE" },
    festivalStart: new Date("2026-11-15T00:00:00+05:30"),
    festivalEnd: new Date("2026-11-16T10:00:00+05:30"),
  },
  2027: {
    sandhya: { date: new Date("2027-11-04T17:30:00+05:30"), title: "SANDHYA ARGHYA", dateLabel: "04 NOV 2027", when: "SUNSET" },
    morning: { date: new Date("2027-11-05T06:00:00+05:30"), title: "USHA ARGHYA", dateLabel: "05 NOV 2027", when: "SUNRISE" },
    festivalStart: new Date("2027-11-04T00:00:00+05:30"),
    festivalEnd: new Date("2027-11-05T10:00:00+05:30"),
  },
  2028: {
    sandhya: { date: new Date("2028-10-23T17:30:00+05:30"), title: "SANDHYA ARGHYA", dateLabel: "23 OCT 2028", when: "SUNSET" },
    morning: { date: new Date("2028-10-24T06:00:00+05:30"), title: "USHA ARGHYA", dateLabel: "24 OCT 2028", when: "SUNRISE" },
    festivalStart: new Date("2028-10-23T00:00:00+05:30"),
    festivalEnd: new Date("2028-10-24T10:00:00+05:30"),
  },
};
const els = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  title: document.getElementById("countdownTitle"),
  date: document.getElementById("countdownDate"),
  when: document.getElementById("countdownWhen"),
};
const countdownCard = document.querySelector(".countdown-card");
const greeting = document.getElementById("festivalGreeting");
const festivalScreenFallers = document.getElementById("festivalScreenFallers");
const testFestivalMode = new URLSearchParams(location.search).get("festivalTest");
let active = "sandhya";
let displayedYear = 2026;

function createFestivalFallers() {
  if (!festivalScreenFallers || festivalScreenFallers.childElementCount) return;
  // Petals first, with a few tiny golden glints for a soft devotional feel.
  const symbols = ["🌺", "🌼", "🌸", "✦", "✨", "🌼", "🌺", "✧"];
  const count = matchMedia("(max-width: 720px)").matches ? 20 : 38;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const item = document.createElement("i");
    item.className = "festival-screen-faller";
    item.dataset.petal = symbols[i % symbols.length].includes("🌺") || symbols[i % symbols.length].includes("🌼") || symbols[i % symbols.length].includes("🌸") ? "flower" : "sparkle";
    item.textContent = symbols[i % symbols.length];
    item.style.setProperty("--left", `${Math.random() * 100}%`);
    item.style.setProperty("--size", `${8 + Math.random() * 13}px`);
    item.style.setProperty("--duration", `${10 + Math.random() * 11}s`);
    item.style.setProperty("--delay", `${Math.random() * -19}s`);
    item.style.setProperty("--drift", `${Math.round(Math.random() * 170 - 85)}px`);
    item.style.setProperty("--spin", `${Math.round(Math.random() * 520 - 260)}deg`);
    item.style.setProperty("--sway", `${Math.round(Math.random() * 34 - 17)}px`);
    fragment.appendChild(item);
  }
  festivalScreenFallers.appendChild(fragment);
}
createFestivalFallers();

function getFestivalState(now = new Date()) {
  if (testFestivalMode === "sandhya" || testFestivalMode === "usha") return { festival: true, year: 2026, test: testFestivalMode, phase: testFestivalMode };
  if (testFestivalMode === "after") return { festival: false, year: 2027, test: testFestivalMode, phase: "" };
  if (testFestivalMode === "before") return { festival: false, year: 2026, test: testFestivalMode, phase: "" };
  for (const year of [2026, 2027, 2028]) {
    const data = chhathDates[year];
    if (now >= data.festivalStart && now < data.festivalEnd) {
      const phase = now >= data.morning.date ? "usha" : "sandhya";
      return { festival: true, year, test: "", phase };
    }
    if (now < data.festivalStart) return { festival: false, year, test: "" };
  }
  return { festival: false, year: 2028, test: "" };
}

function selectTarget(name) {
  active = name;
  const state = getFestivalState();
  displayedYear = state.year;
  const t = chhathDates[displayedYear][name];
  els.title.textContent = t.title;
  els.date.textContent = t.dateLabel;
  els.when.textContent = t.when;
  document.querySelectorAll(".countdown-tab").forEach((btn) => {
    const selected = btn.dataset.target === name;
    btn.classList.toggle("active", selected);
    btn.setAttribute("aria-pressed", String(selected));
  });
  updateCountdown();
}

function updateCountdown() {
  const now = new Date();
  const state = getFestivalState(now);
  displayedYear = state.year;
  countdownCard?.classList.toggle("is-festival-mode", state.festival);
  document.body.classList.toggle("is-chhath-festival", state.festival);
  document.body.classList.toggle("is-sandhya-arghya", state.festival && state.phase === "sandhya");
  document.body.classList.toggle("is-usha-arghya", state.festival && state.phase === "usha");
  if (greeting) greeting.hidden = !state.festival;
  if (festivalScreenFallers) festivalScreenFallers.hidden = !state.festival;
  if (state.festival) return;

  const target = chhathDates[displayedYear][active];
  if (els.title.textContent !== target.title || els.date.textContent !== target.dateLabel) {
    els.title.textContent = target.title;
    els.date.textContent = target.dateLabel;
    els.when.textContent = target.when;
    document.querySelectorAll(".countdown-tab").forEach((btn) => {
      const selected = btn.dataset.target === active;
      btn.classList.toggle("active", selected);
      btn.setAttribute("aria-pressed", String(selected));
    });
  }
  let diff = Math.max(0, target.date - now);
  const d = Math.floor(diff / 86400000);
  diff %= 86400000;
  const h = Math.floor(diff / 3600000);
  diff %= 3600000;
  const m = Math.floor(diff / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  els.days.textContent = String(d).padStart(2, "0");
  els.hours.textContent = String(h).padStart(2, "0");
  els.minutes.textContent = String(m).padStart(2, "0");
  els.seconds.textContent = String(sec).padStart(2, "0");
}
document.querySelectorAll(".countdown-tab").forEach((btn) =>
  btn.addEventListener("click", () => selectTarget(btn.dataset.target)),
);
selectTarget("sandhya");
setInterval(updateCountdown, 1000);

// Editorial marquee: short cultural lines, rotated like a radio ticker.
const stories = [
  [
    "🪔",
    "Chhath carries an ancient tradition of reverence for Surya, the source of light and life.",
  ],
  [
    "🌼",
    "The festival is deeply rooted in Bihar and eastern Uttar Pradesh, and is also widely observed in Jharkhand and Nepal’s Terai.",
  ],
  [
    "☀",
    "Beyond Purvanchal, Chhath is now a familiar sight in Delhi, Maharashtra, West Bengal, Chhattisgarh, Madhya Pradesh and many other Indian cities.",
  ],
  [
    "🪔",
    "Outside India, Chhath is observed by communities across Nepal, the United States, United Kingdom, Canada, Australia and the Gulf.",
  ],
  [
    "🌼",
    "Popular tradition remembers Karna, the son of Surya, as a devoted worshipper of the Sun.",
  ],
  [
    "🪔",
    "Devotional traditions also remember Sita Mata in connection with Sun worship and the observance of Chhath after her return to Ayodhya.",
  ],
  [
    "☀",
    "Chhath is distinctive for offering arghya to both the setting Sun and the rising Sun — gratitude for the whole cycle of light.",
  ],
  [
    "🌼",
    "Thekua, fruits and seasonal offerings express a simple idea: receive from nature, then return gratitude to nature.",
  ],
  [
    "🪔",
    "At sunset, devotees gather at the ghat with baskets of offerings, lamps and prayers for Sandhya Arghya.",
  ],
  [
    "🌼",
    "Before sunrise, the same devotion returns to the river for Usha Arghya — welcoming the first light of a new day.",
  ],
];
let storyIndex = 0;
function showStory() {
  const [icon, text] = stories[storyIndex];
  const track = document.getElementById("storyTrack");
  document.getElementById("storyIcon").textContent = icon;
  track
    .querySelectorAll("span")
    .forEach((span) => (span.textContent = text + "   •   "));
  track.classList.remove("in");
  void track.offsetWidth;
  track.classList.add("in");
  storyIndex = (storyIndex + 1) % stories.length;
}
showStory();
setInterval(showStory, 8500);

// YouTube IFrame playlist engine -------------------------------------------
// YouTube remains the playback source. The page supplies a compact custom
// controller while the actual iframe stays available to the API.
(function initYouTubePlaylist() {
  const card = document.getElementById("playlistCard");
  const host = document.getElementById("youtubePlayerHost");
  const playBtn = document.getElementById("ytPlay");
  const playIcon = document.getElementById("ytPlayIcon");
  const prevBtn = document.getElementById("ytPrev");
  const nextBtn = document.getElementById("ytNext");
  const backBtn = document.getElementById("ytBack");
  const forwardBtn = document.getElementById("ytForward");
  const titleEl = document.getElementById("ytSongTitle");
  const metaEl = document.getElementById("ytSongMeta");
  let timeEl = document.getElementById("ytTime");
  const progressEl = document.getElementById("ytProgress");
  if (!card || !host || !playBtn || !prevBtn || !nextBtn || !progressEl) return;
  if (!timeEl) {
    timeEl = document.createElement("b");
    timeEl.id = "ytTime";
    timeEl.className = "yt-time";
    const wrap = card.querySelector(".yt-progress-wrap");
    if (wrap) wrap.appendChild(timeEl);
  }

  const PLAYLIST_ID = "PLYQAtCJqa2Eg";
  let player = null,
    ready = false,
    progressTimer = null,
    suppressSeek = false,
    screen2EnteredAt = 0,
    autoplayTimer = null,
    songIds = [],
    songTitles = [],
    songArtists = [];

  const formatTime = (seconds) => {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(value / 60),
      secs = value % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };
  const setButtonState = (playing) => {
    card.classList.toggle("is-playing", playing);
    playIcon.textContent = playing ? "Ⅱ" : "▶";
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    playBtn.title = playing ? "Pause" : "Play";
  };
  const updateTrackInfo = (attempt = 0) => {
    if (!player || typeof player.getVideoData !== "function") return;
    const data = player.getVideoData() || {};
    const title = (data.title || "").trim();
    const author = (data.author || "YouTube").trim();
    if (title) {
      titleEl.textContent = title;
      metaEl.textContent = author || "Chhath Goonj";
      return;
    }
    if (attempt < 8) setTimeout(() => updateTrackInfo(attempt + 1), 250);
  };
  const updateProgress = () => {
    if (!player || !ready) return;
    const duration = Number(player.getDuration()) || 0;
    const current = Number(player.getCurrentTime()) || 0;
    timeEl.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    if (!suppressSeek)
      progressEl.value = duration
        ? String(Math.round((current / duration) * 1000))
        : "0";
  };
  const startProgress = () => {
    clearInterval(progressTimer);
    updateProgress();
    progressTimer = setInterval(updateProgress, 250);
  };
  const stopProgress = () => {
    clearInterval(progressTimer);
    progressTimer = null;
    updateProgress();
  };
  const seekBy = (delta) => {
    if (!player || !ready) return;
    const duration = Number(player.getDuration()) || 0;
    const current = Number(player.getCurrentTime()) || 0;
    player.seekTo(
      Math.max(0, Math.min(duration || Infinity, current + delta)),
      true,
    );
    updateProgress();
  };
  const playlistIndex = () => {
    if (!player || !ready) return 0;
    const ids = player.getPlaylist?.() || [];
    const current = Number(player.getPlaylistIndex?.());
    return current >= 0 ? current : 0;
  };
  const playIndex = (index) => {
    if (!player || !ready) return;
    const ids = player.getPlaylist?.() || [];
    if (!ids.length) return;
    const wrapped = ((index % ids.length) + ids.length) % ids.length;
    player.playVideoAt(wrapped);
    setTimeout(() => updateTrackInfo(), 180);
    setTimeout(() => updateTrackInfo(), 700);
  };
  const nextPlayable = () => {
    if (player && ready) playIndex(playlistIndex() + 1);
  };

  const songsModal = document.getElementById("songsModal");
  const openSongsButton = document.getElementById("openSongs");
  const songList = document.getElementById("songList");
  const songListStatus = document.getElementById("songListStatus");
  const openSongsModal = () => {
    if (!songsModal) return;
    songsModal.hidden = false;
    document.body.classList.add("modal-open");
    loadSongList();
  };
  const closeSongsModal = () => {
    if (songsModal) songsModal.hidden = true;
    document.body.classList.remove("modal-open");
  };
  openSongsButton?.addEventListener("click", openSongsModal);
  songsModal?.addEventListener("click", (event) => {
    if (event.target === songsModal) closeSongsModal();
  });
  document.querySelectorAll('[data-close="songsModal"]').forEach((button) =>
    button.addEventListener("click", closeSongsModal)
  );

  const cleanSongTitle = (rawTitle) => {
    return String(rawTitle || "छठ गीत")
      .replace(/\s*\|\s*(official|full|video|audio|lyrical).*$/i, "")
      .replace(/\s*[-–—]\s*(official music video|official video|full video|video song|audio song|lyrics|4k|hd).*$/i, "")
      .replace(/\s*\((official|full|video|audio|lyrics|4k|hd).*?\)\s*/ig, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const renderSongList = () => {
    if (!songList || !songIds.length) return;
    const fragment = document.createDocumentFragment();
    songIds.forEach((id, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "song-list-item";
      button.setAttribute("role", "listitem");
      button.innerHTML = `<span class="song-list-number">${String(index + 1).padStart(2, "0")}</span><span class="song-list-copy"><strong class="song-list-title"></strong><small class="song-list-artist"></small></span><span class="song-list-play" aria-hidden="true">▶</span>`;
      button.querySelector(".song-list-title").textContent = songTitles[index] || `छठ गीत ${index + 1}`;
      button.querySelector(".song-list-artist").textContent = songArtists[index] || "छठ गीत";
      button.addEventListener("click", () => {
        playIndex(index);
        closeSongsModal();
      });
      fragment.appendChild(button);
    });
    songList.replaceChildren(fragment);
    if (songListStatus) songListStatus.textContent = `${songIds.length} गीत`;
  };

  let songListLoading = false;
  const loadSongList = async () => {
    if (!player || !ready || !songList) {
      if (songListStatus) songListStatus.textContent = "प्लेयर तैयार हो रहा है…";
      return;
    }
    const currentIds = player.getPlaylist?.() || [];
    if (currentIds.length) songIds = currentIds.slice();
    if (!songIds.length) {
      if (songListStatus) songListStatus.textContent = "गीतों की सूची लोड हो रही है…";
      setTimeout(loadSongList, 700);
      return;
    }
    renderSongList();
    if (songListLoading || songTitles.length === songIds.length) return;
    songListLoading = true;
    if (songListStatus) songListStatus.textContent = "गीतों के नाम लोड हो रहे हैं…";
    songTitles = songIds.map((_, i) => `छठ गीत ${i + 1}`);
    songArtists = songIds.map(() => "छठ गीत");
    renderSongList();
    // Fetch metadata in small batches to avoid sending a burst of requests.
    for (let start = 0; start < songIds.length; start += 6) {
      const batch = songIds.slice(start, start + 6);
      await Promise.all(batch.map(async (videoId, offset) => {
        const index = start + offset;
        try {
          const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`);
          if (!response.ok) return;
          const info = await response.json();
          if (info.title) songTitles[index] = cleanSongTitle(info.title);
          if (info.author_name) songArtists[index] = info.author_name;
        } catch {
          // If YouTube doesn't provide metadata, keep the numbered song entry.
        }
      }));
      renderSongList();
    }
    songListLoading = false;
    renderSongList();
  };

  const scheduleAutoplay = () => {
    if (!screen2EnteredAt || !player || !ready) return;
    clearTimeout(autoplayTimer);
    const remaining = Math.max(0, 2300 - (Date.now() - screen2EnteredAt));
    autoplayTimer = setTimeout(() => {
      if (!player || !ready) return;
      try {
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) player.playVideo();
      } catch (error) {
        console.info("Autoplay may require a user tap in this browser.", error);
      }
    }, remaining);
  };
  window.addEventListener("chhath:screen2-enter", () => {
    screen2EnteredAt = Date.now();
    scheduleAutoplay();
  });

  const onReady = () => {
    const iframe = player.getIframe && player.getIframe();
    if (iframe)
      iframe.setAttribute(
        "allow",
        "autoplay; encrypted-media; picture-in-picture",
      );
    ready = true;
    player.cuePlaylist({
      listType: "playlist",
      list: PLAYLIST_ID,
      index: 0,
      startSeconds: 0,
    });
    setButtonState(false);
    setTimeout(() => updateTrackInfo(), 350);
    setTimeout(() => updateTrackInfo(), 1200);
    setTimeout(loadSongList, 500);
    updateProgress();
    scheduleAutoplay();
  };
  const onStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING) {
      setButtonState(true);
      updateTrackInfo();
      startProgress();
    } else if (event.data === YT.PlayerState.PAUSED) {
      setButtonState(false);
      stopProgress();
    } else if (event.data === YT.PlayerState.ENDED) {
      setButtonState(false);
      stopProgress();
      setTimeout(nextPlayable, 150);
    } else if (event.data === YT.PlayerState.CUED) {
      setButtonState(false);
      setTimeout(() => updateTrackInfo(), 120);
      setTimeout(() => updateTrackInfo(), 650);
      updateProgress();
    }
  };
  const onError = (event) => {
    console.warn("YouTube playlist item error:", event.data);
    // Some playlist entries can be unavailable, private, region-restricted,
    // or have embedding disabled. Skip only the failed item and continue.
    titleEl.textContent = "Song unavailable — trying next";
    metaEl.textContent = "This song cannot be played here";
    setButtonState(false);
    setTimeout(() => {
      if (player && ready) nextPlayable();
    }, 350);
  };

  window.onYouTubeIframeAPIReady = function () {
    if (player) return;
    player = new YT.Player("youtubePlayerHost", {
      width: 200,
      height: 200,
      playerVars: {
        playsinline: 1,
        controls: 0,
        rel: 0,
        iv_load_policy: 3,
        disablekb: 1,
        listType: "playlist",
        list: PLAYLIST_ID,
        origin: window.location.origin,
      },
      events: {
        onReady,
        onStateChange,
        onError,
        onAutoplayBlocked: () => setButtonState(false),
      },
    });
  };
  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  api.async = true;
  document.head.appendChild(api);

  playBtn.addEventListener("click", () => {
    if (!player || !ready) return;
    player.getPlayerState() === YT.PlayerState.PLAYING
      ? player.pauseVideo()
      : player.playVideo();
  });
  prevBtn.addEventListener("click", () => {
    if (player && ready) playIndex(playlistIndex() - 1);
  });
  nextBtn.addEventListener("click", () => {
    if (player && ready) playIndex(playlistIndex() + 1);
  });
  backBtn.addEventListener("click", () => seekBy(-10));
  forwardBtn.addEventListener("click", () => seekBy(10));
  progressEl.addEventListener("input", () => {
    if (!player || !ready) return;
    suppressSeek = true;
    const duration = Number(player.getDuration()) || 0;
    const target = duration * (Number(progressEl.value) / 1000);
    timeEl.textContent = `${formatTime(target)} / ${formatTime(duration)}`;
  });
  progressEl.addEventListener("change", () => {
    if (!player || !ready) return;
    const duration = Number(player.getDuration()) || 0;
    player.seekTo(duration * (Number(progressEl.value) / 1000), true);
    suppressSeek = false;
    updateProgress();
  });
})();

// REAL LIVE PRESENCE -------------------------------------------------------
// Add your Supabase URL + anon key in config.js (see README). Supabase
// Realtime Presence then counts active browser sessions across visitors.
// If credentials are not configured yet, this falls back to same-device tabs
// so the UI never shows a fake hard-coded number.
const listenerNumber = document.getElementById("listenerNumber");
const listenerLabel = document.getElementById("listenerLabel");
let presenceChannel = null,
  presenceTimer = null;
const sessionId = crypto.randomUUID
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random()}`;
function setListeners(n) {
  const count = Math.max(0, Number(n) || 0);
  listenerNumber.textContent = count.toLocaleString("en-IN");
  if (listenerLabel)
    listenerLabel.textContent = count === 1 ? "Devotee Live" : "Devotees Live";
  document.title = `CHHATH GOONJ — ${count} ${count === 1 ? "Devotee" : "Devotees"} Live`;
}
function localPresenceFallback() {
  const key = "chhath-goonj-presence";
  const now = Date.now();
  const id = sessionId;
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  };
  const write = () => {
    const users = read();
    users[id] = Date.now();
    for (const [k, t] of Object.entries(users))
      if (now - t > 20000) delete users[k];
    localStorage.setItem(key, JSON.stringify(users));
    setListeners(Object.keys(users).length);
  };
  write();
  const beat = () => {
    const users = read();
    users[id] = Date.now();
    for (const [k, t] of Object.entries(users))
      if (Date.now() - t > 20000) delete users[k];
    localStorage.setItem(key, JSON.stringify(users));
    setListeners(Object.keys(users).length);
  };
  presenceTimer = setInterval(beat, 5000);
  window.addEventListener("storage", beat);
  window.addEventListener("beforeunload", () => {
    const users = read();
    delete users[id];
    localStorage.setItem(key, JSON.stringify(users));
  });
}
async function initPresence() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
    localPresenceFallback();
    return;
  }
  try {
    const mod = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = mod.createClient(
      CONFIG.supabaseUrl,
      CONFIG.supabaseKey,
    );
    presenceChannel = supabase.channel("chhath-goonj-listeners", {
      config: { presence: { key: sessionId } },
    });
     const update=()=>{
      if(!presenceChannel)return;

      const state=
        presenceChannel.presenceState();

      setListeners(
        Object.keys(state).length
      );
    };

    presenceChannel
      .on(
        'presence',
        {event:'sync'},
        update
      )
      .on(
        'presence',
        {event:'join'},
        update
      )
      .on(
        'presence',
        {event:'leave'},
        update
      );

    await presenceChannel.subscribe(
      async status=>{

        if(status==='SUBSCRIBED'){

          await presenceChannel.track({
            online_at:new Date().toISOString(),
            page:'screen2'
          });

          update();

        }else if(
          status==='CHANNEL_ERROR' ||
          status==='TIMED_OUT' ||
          status==='CLOSED'
        ){

          console.warn(
            'Realtime Presence unavailable; using local fallback.'
          );

          localPresenceFallback();
        }
      }
    );

  }catch(error){

    console.warn(
      'Realtime presence unavailable; using local fallback.',
      error
    );

    localPresenceFallback();
  }
}

window.addEventListener(
  'chhath:screen2-enter',
  initPresence,
  {once:true}
);
// Share modal.
const shareModal = document.getElementById("shareModal"),
  donateModal = document.getElementById("donateModal"),
  pageUrl = window.location.href,
  shareText = "Listen to Chhath Goonj — Chhath ke geet, bina ruke.";
document.getElementById("shareUrl").value = pageUrl;
document.getElementById("whatsappShare").href =
  "https://wa.me/?text=" + encodeURIComponent(shareText + " " + pageUrl);
document.getElementById("xShare").href =
  "https://twitter.com/intent/tweet?text=" +
  encodeURIComponent(shareText) +
  "&url=" +
  encodeURIComponent(pageUrl);
document.getElementById("facebookShare").href =
  "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl);
document.getElementById("telegramShare").href =
  "https://t.me/share/url?url=" +
  encodeURIComponent(pageUrl) +
  "&text=" +
  encodeURIComponent(shareText);
document
  .getElementById("shareBtn")
  .addEventListener("click", () => (shareModal.hidden = false));
document
  .getElementById("footerDonateBtn")
  .addEventListener("click", () => (donateModal.hidden = false));
document
  .querySelectorAll("[data-close]")
  .forEach((btn) =>
    btn.addEventListener(
      "click",
      () => (document.getElementById(btn.dataset.close).hidden = true),
    ),
  );
[shareModal, donateModal].forEach((modal) =>
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.hidden = true;
  }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    shareModal.hidden = true;
    donateModal.hidden = true;
    const songsModal = document.getElementById("songsModal");
    if (songsModal) songsModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
});
document.getElementById("copyLink").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(pageUrl);
    document.getElementById("copyLink").textContent = "Copied";
    setTimeout(
      () => (document.getElementById("copyLink").textContent = "Copy"),
      1200,
    );
  } catch {}
});
document.getElementById("copyUpi").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("9583107283@ybl");
    document.getElementById("copyUpi").textContent = "✓";
    setTimeout(
      () => (document.getElementById("copyUpi").textContent = "▢"),
      1200,
    );
  } catch {}
});
document.getElementById("qrDownload").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = "assets/donation-qr.jpg";
  a.download = "chhath-goonj-phonepe-qr.jpg";
  a.click();
});
document.getElementById("donateLink").href = CONFIG.donateUrl;

// Subtle desktop parallax only.
if (
  window.matchMedia("(min-width:721px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  window.addEventListener(
    "mousemove",
    (e) => {
      const x = e.clientX / window.innerWidth - 0.5,
        y = e.clientY / window.innerHeight - 0.5;
      document.querySelector(".hero-media img").style.transform =
        `scale(1.02) translate(${x * -5}px,${y * -3}px)`;
      document
        .querySelectorAll(".cloud")
        .forEach(
          (el, i) => (el.style.translate = `${x * (i ? 8 : -5)}px ${y * 2}px`),
        );
    },
    { passive: true },
  );
}
window.addEventListener("load", () =>
  setTimeout(
    () => document.getElementById("loader").classList.add("hide"),
    500,
  ),
);
