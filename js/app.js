const INSTRUCTIONS_RO = [
  "Toți jucătorii mai puțin unul primesc același cuvânt.",
  "Acesta se va preface că știe și el cuvântul.",
  "Pe rând, fiecare spune UN CUVÂNT legat de subiect.",
  "Nu fi prea evident – impostorul ascultă atent 👀",
  "După 3 runde, discutați și votați cine este impostorul.",
  "Impostorul poate vorbi, minți sau crea îndoială.",
  "Dacă este prins, începe primul în runda următoare.",
];

const INSTRUCTIONS_EN = [
  "All players except one see the same word.",
  "That player will pretend to know the word as well.",
  "Each round, everyone says ONE word related to the topic.",
  "Don’t be too obvious – the impostor is listening 👀",
  "After 3 rounds, discuss and vote the impostor.",
  "The impostor may speak, lie, or create doubt.",
  "If discovered, the impostor starts the next game.",
];

let LANG = "ro";

const STORAGE_CUSTOM_WORD = "impostor_customWord";
const STORAGE_CUSTOM_UI = "impostor_customWordUI";

let customWord = localStorage.getItem(STORAGE_CUSTOM_WORD) || "";
let useCustomWordUI =
  localStorage.getItem(STORAGE_CUSTOM_UI) === "1" || !!customWord.trim();

const STORAGE_IMPOSTORS = "impostor_impostorCount";

let impostorCount = Number(localStorage.getItem(STORAGE_IMPOSTORS) || 1);
let impostorsTouched = localStorage.getItem(STORAGE_IMPOSTORS) != null;

impostorCount =
  Number.isFinite(impostorCount) && impostorCount >= 1 ? impostorCount : 1;

let impostorSet = new Set();

const STORAGE_PLAYERS = "impostor_playerCount";

let N = Number(localStorage.getItem(STORAGE_PLAYERS) || 5);
N = clampPlayersValue(N);

const UI = {
  ro: {
    title: "Impostor",
    subtitle: "Un joc de deducție, suspiciune și bluff.",
    start: "Începe jocul",
    how: "Cum se joacă",
    back: "Rundă nouă",
    players: "Jucători",
    setupSubtitle:
      "Alege numărul de jucători, citește cuvântul apoi paseaza telefonul. Unul dintre voi va fi impostor. Îl vei descoperi?",
    startRound: "Start",
    player: "Jucător",
    restart: "Rundă nouă",
    nextPlayerTap: "Vezi cuvântul",
    tapPass: "Apasă pentru a ascunde",
    doneTitle: "Succes!",
    newRound: "Rundă nouă",
    goodLuck: "Spor la descoperit impostorul!",
    impostor: "Impostor",
    passOverlayTitle: "Pasează telefonul",
    passOverlaySeconds: "secunde",
    kofiPitch: "Joc gratuit, fără reclame — o cafea e binevenită ☕",
    kofiAlt: "Susține cu o cafea",

    vote: "Votează",
    voteTitle: "Pe cine suspectezi?",
    voteSubtitle: "Scrie numele persoanei pe care o suspectezi",
    votePlaceholder: "Scrie numele aici",
    voteSubmit: "Votează",
    voteProgress: "Jucător",
    resultsTitle: "Rezultat",
    resultsSubtitle: "Top voturi (mai multe voturi = mai suspect).",
    playAgain: "Rundă nouă",
    backSetup: "Meniu",
    impostors: "Impostori",
  },
  en: {
    title: "Impostor",
    subtitle: "A game of deduction, suspicion and bluff.",
    start: "Start game",
    how: "How to play",
    back: "Back",
    players: "Players",
    setupSubtitle:
      "Choose the number of players, read the word then pass the phone. One of you will be the impostor. Will you find him?",
    startRound: "Start round",
    player: "Player",
    restart: "Back",
    nextPlayerTap: "Tap to reveal the word",
    tapPass: "Tap to hide the word",
    doneTitle: "Good luck!",
    newRound: "New round",
    goodLuck: "Good luck finding the impostor!",
    impostor: "Impostor",
    passOverlayTitle: "Pass the phone",
    passOverlaySeconds: "seconds",
    kofiPitch: "Free game, zero ads — coffee appreciated ☕",
    kofiAlt: "Buy me a coffee",

    vote: "Vote",
    voteTitle: "Who Do You Suspect?",
    voteSubtitle: "Type the name of who you suspect",
    votePlaceholder: "Type name here",
    voteSubmit: "Submit vote",
    voteProgress: "Player",
    resultsTitle: "Results",
    resultsSubtitle: "Top votes (more votes = more suspicious).",
    playAgain: "New round",
    backSetup: "Menu",
    impostors: "Impostors",
  },
};

function requestFullscreen() {
  const el = document.body;
  const fn = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!fn) return Promise.resolve();
  try {
    return fn.call(el);
  } catch {
    return Promise.resolve();
  }
}

function updateCreatorMark() {
  const mark = document.getElementById("creatorMark");
  if (!mark) return;
  mark.classList.toggle("visible", phase === "setup");
}

function normalizeWordInput(s) {
  s = (s || "").trim();
  if (!s) return "";
  s = s.replace(/\s+/g, " ");
  return toTitleCase(s);
}

function t(key) {
  return UI[LANG][key];
}

const app = document.getElementById("app");

let word = "";
let impostorIndex = 0;
let currentPlayer = 1;
let phase = "setup";

let voteIndex = 1;
let votes = [];

function normalizeVoteName(s) {
  s = (s || "").trim();
  s = s.replace(/\s+/g, " ");
  s = s.toUpperCase();
  return s;
}

function startVoting() {
  voteIndex = 1;
  votes = [];
  phase = "vote";
  render();
}

function tallyVotes(list) {
  const map = new Map();
  for (const raw of list) {
    const name = normalizeVoteName(raw);
    if (!name) continue;
    map.set(name, (map.get(name) || 0) + 1);
  }
  const arr = Array.from(map.entries()).map(([name, count]) => ({
    name,
    count,
  }));
  arr.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return arr;
}

function renderVote() {
  app.className = "screen";
  app.innerHTML = `
					${renderTopbar()}
					<div class="wrap">
						<div class="card voteCard">
							<div class="brand">
								<div class="title">${t("voteTitle")}</div>
							</div>

							<div class="voteForm">
								<input id="voteInput" class="voteInput" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false"
									placeholder="${t("votePlaceholder")}" />
								<button id="voteSubmit" class="btn">${t("voteSubmit")}</button>
							</div>

						</div>
					</div>
				`;

  wireTopbar();

  const input = document.getElementById("voteInput");
  const submit = document.getElementById("voteSubmit");

  const submitVote = () => {
    const name = normalizeVoteName(input.value);
    if (!name) {
      input.focus();
      return;
    }

    votes.push(name);

    if (voteIndex >= N) {
      phase = "results";
      render();
      return;
    }

    voteIndex += 1;
    showPassOverlayAndAdvanceVote();
  };

  input.addEventListener("input", () => {
    input.value = normalizeVoteName(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitVote();
  });

  submit.onclick = submitVote;

  setTimeout(() => input.focus(), 0);
}

function showPassOverlayAndAdvanceVote() {
  const durationSec = 3;

  const overlay = document.createElement("div");
  overlay.className = "passOverlay";

  const title = document.createElement("div");
  title.className = "passOverlayTitle";
  title.textContent = t("passOverlayTitle");

  const countdown = document.createElement("div");
  countdown.className = "passOverlayCountdown";

  overlay.appendChild(title);
  overlay.appendChild(countdown);
  document.body.appendChild(overlay);

  let remaining = durationSec;
  countdown.textContent = `${remaining} ${t("passOverlaySeconds")}`;

  const interval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(interval);
      overlay.remove();
      render();
      return;
    }
    countdown.textContent = `${remaining} ${t("passOverlaySeconds")}`;
  }, 1000);
}

function renderResults() {
  const rows = tallyVotes(votes);
  const top = rows.slice(0, 6);
  const max = top.length ? top[0].count : 1;

  app.className = "screen";
  app.innerHTML = `
					<div class="wrap">
						<div class="card">
							<div class="brand">
								<div class="logo"></div>
								<div class="title">${t("resultsTitle")}</div>
							</div>

							<div class="resultsList">
								${top
                  .map((r, idx) => {
                    const pct = Math.round((r.count / max) * 100);
                    const isWinner = idx === 0;

                    return `
                            <div class="resultRow ${isWinner ? "winner" : ""}">
                                <div class="rankBadge ${isWinner ? "winner" : ""}">${idx + 1}</div>
                                <div class="resultMain">
                                    <div class="resultName">${r.name}</div>
                                    <div class="resultBar">
                                        <div class="resultBarFill" style="width:${pct}%;"></div>
                                    </div>
                                </div>
                                <div class="resultVotes">${r.count}</div>
                            </div>
                        `;
                  })
                  .join("")}
							</div>

							<div class="doneGrid" style="margin-top:18px;">
								<button id="back" class="btn">${t("playAgain")}</button>
							</div>
						</div>
					</div>
					`;

  document.getElementById("back").onclick = () => {
    phase = "setup";
    render();
  };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let lastWord = "";

function pickWord() {
  const list = (window.IMPOSTOR_WORDS && window.IMPOSTOR_WORDS[LANG]) || [];
  if (!list.length) return "";

  let w = list[randInt(0, list.length - 1)];
  if (list.length === 1) return w;

  let tries = 0;
  while (w === lastWord && tries < 20) {
    w = list[randInt(0, list.length - 1)];
    tries++;
  }

  lastWord = w;
  return w;
}

function toTitleCase(s) {
  s = (s || "").trim();
  if (!s) return s;
  if (s.includes(" ")) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function startGame() {
  N = clampPlayersValue(N || 5);

  const cw = normalizeWordInput(customWord);
  word = cw ? cw : toTitleCase(pickWord());

  impostorSet = new Set();
  impostorCount = clampImpostorsValue(impostorCount);

  while (impostorSet.size < impostorCount) {
    impostorSet.add(randInt(1, N));
  }

  currentPlayer = 1;
  phase = "hide";
  render();
}

function updateLangButton() {
  const img = document.getElementById("langImg");
  if (!img) return;
  img.src = LANG === "ro" ? "/ro.png" : "/en.png";
  img.alt = LANG === "ro" ? "RO" : "EN";
}

function isMobileDevice() {
  return (
    matchMedia("(pointer:coarse)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}

function clampPlayersValue(n) {
  n = Number(n || 0);
  if (!Number.isFinite(n)) n = 5;
  if (n < 3) n = 3;
  if (n > 99) n = 99;
  return n;
}

function renderPlayersControl() {
  const wrap = document.getElementById("playersWrap");
  if (!wrap) return;

  localStorage.setItem(STORAGE_PLAYERS, String(N));

  const current = clampPlayersValue(N || 5);
  N = current;

  wrap.innerHTML = `
					<input
						id="playersInput"
						type="number"
						inputmode="numeric"
						min="3"
						max="99"
						step="1"
						value="${current}"
						aria-label="Players"
					/>
				`;

  const input = document.getElementById("playersInput");

  input.oninput = () => {
    let v = (input.value || "").replace(/[^\d]/g, "");
    if (v.length > 2) v = v.slice(0, 2);
    if (v && Number(v) > 99) v = "99";
    input.value = v;
    N = clampPlayersValue(v);
    localStorage.setItem(STORAGE_PLAYERS, String(N));
  };

  input.onblur = () => {
    N = clampPlayersValue(input.value);
    input.value = String(N);
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      N = clampPlayersValue(input.value);
      input.value = String(N);
      input.blur();
    }
  };
}

function setPlayers(delta) {
  N = clampPlayersValue((N || 5) + delta);

  localStorage.setItem(STORAGE_PLAYERS, String(N));

  const input = document.getElementById("playersInput");
  if (input) input.value = String(N);

  const num = document.getElementById("playersNumber");
  if (num) num.textContent = String(N);
}

function clampImpostorsValue(k) {
  k = Number(k || 0);
  if (!Number.isFinite(k)) k = 1;
  if (k < 1) k = 1;

  const players = clampPlayersValue(N || 5);
  const max = Math.max(1, players - 1);
  if (k > max) k = max;

  return k;
}

function renderImpostorsControl() {
  const wrap = document.getElementById("impostorsWrap");
  if (!wrap) return;

  impostorCount = clampImpostorsValue(impostorCount);

  wrap.innerHTML = `
                    <input
                        id="impostorsInput"
                        type="number"
                        inputmode="numeric"
                        min="1"
                        max="${Math.max(1, (N || 5) - 1)}"
                        step="1"
                        value="${impostorCount}"
                        aria-label="Impostors"
                    />
                `;

  const input = document.getElementById("impostorsInput");

  input.oninput = () => {
    impostorsTouched = true;
    let v = (input.value || "").replace(/[^\d]/g, "");
    input.value = v;
    impostorCount = clampImpostorsValue(v);
    localStorage.setItem(STORAGE_IMPOSTORS, String(impostorCount));
  };

  input.onblur = () => {
    impostorCount = clampImpostorsValue(input.value);
    input.value = String(impostorCount);
    localStorage.setItem(STORAGE_IMPOSTORS, String(impostorCount));
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      impostorCount = clampImpostorsValue(input.value);
      input.value = String(impostorCount);
      localStorage.setItem(STORAGE_IMPOSTORS, String(impostorCount));
      input.blur();
    }
  };
}

function setImpostors(delta) {
  impostorsTouched = true;
  impostorCount = clampImpostorsValue((impostorCount || 1) + delta);

  const input = document.getElementById("impostorsInput");
  if (input) input.value = String(impostorCount);

  localStorage.setItem(STORAGE_IMPOSTORS, String(impostorCount));
}

function renderInstructions() {
  const list = LANG === "ro" ? INSTRUCTIONS_RO : INSTRUCTIONS_EN;

  app.className = "screen";
  app.innerHTML = `
				<div class="wrap">
					<div class="card">
						<div class="title">${t("how")}</div>

						<ul style="text-align:left; margin-top:16px; line-height:1.6;">
							${list.map((i) => `<li>${i}</li>`).join("")}
						</ul>

						<div class="row" style="margin-top:20px">
							<button id="back" class="btn btn2">${t("back")}</button>
						</div>
					</div>
				</div>
			`;

  document.getElementById("back").onclick = () => {
    phase = "setup";
    render();
  };
}

function renderSetup() {
  customWord = "";
  localStorage.removeItem(STORAGE_CUSTOM_WORD);

  if (!impostorsTouched) {
    impostorCount = 1;
    localStorage.removeItem(STORAGE_IMPOSTORS);
  }

  useCustomWordUI = false;
  localStorage.setItem(STORAGE_CUSTOM_UI, "0");

  app.className = "screen";
  app.innerHTML = `
					<div class="wrap">
						<div class="card tapArea" id="tapArea">
							<div class="brand">
								<div class="logo"></div>
								<div class="title">${t("title")}</div>
							</div>

							<p class="subtitle">${t("setupSubtitle")}</p>

							<div class="column">
								<div class="field">
									<label>${t("players")}</label>

									<div class="playerControl">
										<button id="decPlayers" class="stepBtn" type="button" aria-label="Decrease players">−</button>
										<div id="playersWrap"></div>
										<button id="incPlayers" class="stepBtn" type="button" aria-label="Increase players">+</button>
									</div>
								</div>

								<div class="field">
									<label>${t("impostors")}</label>

									<div class="playerControl">
										<button id="decImpostors" class="stepBtn" type="button" aria-label="Decrease impostors">−</button>
										<div id="impostorsWrap"></div>
										<button id="incImpostors" class="stepBtn" type="button" aria-label="Increase impostors">+</button>
									</div>
								</div>

								<div style="width:100%; display:flex; justify-content:center; margin-top:10px;">
									<div class="wordInputWrap">
										<input id="customWordInput" class="wordInput" type="text" inputmode="text"
											autocomplete="off" autocapitalize="words" spellcheck="false"
											placeholder="${LANG === "ro" ? "Cuvânt aleator" : "Random word"}"
											value="${(customWord || "").replace(/"/g, "&quot;")}" />
										<button id="randomWordBtn" class="randomBtn" type="button" aria-label="Random word">🎲</button>
									</div>
								</div>
								

							<div class="row startRow">
							<button id="vote" class="btn btn2">${t("vote")}</button>
							<button id="start" class="btn">${t("startRound")}</button>
							</div>				
							</div>
						</div>

						<div class="bottomControls">
							<div class="topRow">
								<button id="how" class="btn btn2">${t("how")}</button>
								<button id="lang" class="btn btn2 flagBtn" aria-label="Switch language">
									<img id="langImg" class="flagImg" src="${LANG === "ro" ? "/ro.png" : "/en.png"}" alt="${LANG === "ro" ? "RO" : "EN"}" />
								</button>
							</div>

							<div class="kofiPitch">${t("kofiPitch")}</div>
							<div class="kofiWrap">
							<a href="https://ko-fi.com/s/1bd08ce885" target="_blank" rel="noopener noreferrer">
								<img src="https://storage.ko-fi.com/cdn/kofi5.png" alt="${t("kofiAlt")}" />
							</a>
							</div>

						</div>

						<a id="creatorMark" href="https://cristiangabriel.dev" target="_blank" rel="noopener noreferrer">∘⊙∘</a>
					</div>
				`;

  renderPlayersControl();
  renderImpostorsControl();

  document.getElementById("decImpostors").onclick = () => setImpostors(-1);
  document.getElementById("incImpostors").onclick = () => setImpostors(1);

  document.getElementById("decPlayers").onclick = () => {
    setPlayers(-1);
    renderImpostorsControl();
  };
  document.getElementById("incPlayers").onclick = () => {
    setPlayers(1);
    renderImpostorsControl();
  };

  //   document.getElementById("start").onclick = () => startGame();
  document.getElementById("how").onclick = () => {
    phase = "instructions";
    render();
  };

  const startBtn = document.getElementById("start");
  if (startBtn) {
    startBtn.onpointerup = (e) => {
      e.preventDefault();
      e.stopPropagation();
      requestFullscreen().finally(() => startGame());
    };
  }

  const voteBtn = document.getElementById("vote");
  if (voteBtn)
    voteBtn.onclick = () => {
      N = clampPlayersValue(
        N || document.getElementById("playersInput")?.value || 5,
      );
      localStorage.setItem(STORAGE_PLAYERS, String(N));
      startVoting();
    };

  document.getElementById("lang").onclick = () => {
    LANG = LANG === "ro" ? "en" : "ro";
    renderSetup();
  };

  const customBtn = document.getElementById("customWordBtn");
  if (customBtn) {
    customBtn.onclick = () => {
      useCustomWordUI = true;
      localStorage.setItem(STORAGE_CUSTOM_UI, "1");
      renderSetup();
      const input = document.getElementById("customWordInput");
      if (input) input.focus();
    };
  }

  const input = document.getElementById("customWordInput");

  const randBtn = document.getElementById("randomWordBtn");
  if (randBtn && input) {
    const stop = (e) => {
      e.stopPropagation();
    };

    const run = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const w = toTitleCase(pickWord());
      input.value = w;
      customWord = w;
      localStorage.setItem(STORAGE_CUSTOM_WORD, customWord);

      input.blur();
    };

    randBtn.addEventListener("pointerdown", stop, { passive: true });
    randBtn.addEventListener("pointerup", run, { passive: false });

    randBtn.addEventListener("touchstart", stop, { passive: true });
    randBtn.addEventListener("touchend", run, { passive: false });
  }

  if (input) {
    input.oninput = () => {
      customWord = input.value;
      localStorage.setItem(STORAGE_CUSTOM_WORD, customWord);
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter") startGame();
      if (e.key === "Escape") {
        useCustomWordUI = false;
        customWord = "";
        localStorage.removeItem(STORAGE_CUSTOM_WORD);
        localStorage.setItem(STORAGE_CUSTOM_UI, "0");
        renderSetup();
      }
    };
  }

  updateCreatorMark();
}

function renderTopbar() {
  let leftText = "";

  if (phase === "vote") leftText = `${t("voteProgress")} ${voteIndex} / ${N}`;
  else if (phase === "results") leftText = `${t("resultsTitle")}`;
  else leftText = `${t("player")} ${currentPlayer} / ${N}`;

  return `
				<div class="topbar">
				<div class="pill">${leftText}</div>
				<div style="display:flex; gap:10px; pointer-events:auto;">
					<div class="link" id="restart">${t("restart")}</div>
				</div>
				</div>
			`;
}

function wireTopbar() {
  const restartEl = document.getElementById("restart");
  if (restartEl) {
    restartEl.onclick = (e) => {
      e.stopPropagation();
      phase = "setup";
      render();
    };
  }
}

function renderHide() {
  app.className = "screen";
  app.innerHTML = `
					${renderTopbar()}
					<div class="wrap tapArea" id="tapArea">
						<div class="card">
							<div class="big word"> </div>
							<div class="sub">${t("nextPlayerTap")}</div>
						</div>
					</div>
				`;
  wireTopbar();

  const tap = document.getElementById("tapArea");
  if (tap) {
    tap.onpointerdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      pressFXStart(tap);
    };

    tap.onpointerup = (e) => {
      e.preventDefault();
      e.stopPropagation();
      pressFXEnd(tap);
      guardedTap();
    };

    tap.onpointercancel = () => pressFXEnd(tap);
    tap.onpointerleave = () => pressFXEnd(tap);
  }
}

function renderReveal() {
  const isImp = impostorSet.has(currentPlayer);
  const text = isImp ? t("impostor") : word;
  const cls = "word";

  app.className = "screen";
  app.innerHTML = `
				${renderTopbar()}
				<div class="wrap tapArea" id="tapArea">
					<div class="card">
						<div class="big ${cls}">${text}</div>
						<div class="sub">${t("tapPass")}</div>
					</div>
				</div>
			`;
  wireTopbar();

  const tap = document.getElementById("tapArea");
  if (tap) {
    tap.onpointerdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      pressFXStart(tap);
    };

    tap.onpointerup = (e) => {
      e.preventDefault();
      e.stopPropagation();
      pressFXEnd(tap);
      guardedTap();
    };

    tap.onpointercancel = () => pressFXEnd(tap);
    tap.onpointerleave = () => pressFXEnd(tap);
  }
}

function renderDone() {
  app.className = "screen";
  app.innerHTML = `
					<div class="wrap">
						<div class="card finishCard">
							<div class="finishBadge" aria-hidden="true">
								<svg viewBox="0 0 64 64" role="img" aria-label="Done">
									<path d="M16 34 L28 46 L50 20"></path>
								</svg>
							</div>

							<div class="finishTitle">${t("doneTitle")}</div>

							<div class="doneGrid" style="margin-top:18px;">
								<button id="vote" class="btn">${t("vote")}</button>
								<button id="backSetup" class="btn btn2">${t("back")}</button>
								
							</div>
						</div>

						<div class="bottomControls">
							<div class="kofiPitch">${t("kofiPitch")}</div>
							<div class="kofiWrap">
								<a href="https://ko-fi.com/s/1bd08ce885" target="_blank" rel="noopener noreferrer">
									<img src="https://storage.ko-fi.com/cdn/kofi5.png" alt="${t("kofiAlt")}" />
								</a>
							</div>
						</div>
					</div>
				`;

  const newRoundBtn = document.getElementById("newRound");
  if (newRoundBtn)
    newRoundBtn.onclick = () => {
      useCustomWordUI = false;
      customWord = "";
      localStorage.removeItem(STORAGE_CUSTOM_WORD);
      localStorage.setItem(STORAGE_CUSTOM_UI, "0");
      startGame();
    };

  const backSetupBtn = document.getElementById("backSetup");
  if (backSetupBtn)
    backSetupBtn.onclick = () => {
      useCustomWordUI = false;
      customWord = "";
      localStorage.removeItem(STORAGE_CUSTOM_WORD);
      localStorage.setItem(STORAGE_CUSTOM_UI, "0");
      phase = "setup";
      render();
    };

  const voteBtn = document.getElementById("vote");
  if (voteBtn) voteBtn.onclick = () => startVoting();
}

function showPassOverlayAndAdvance() {
  const durationSec = 3;

  const overlay = document.createElement("div");
  overlay.className = "passOverlay";

  const title = document.createElement("div");
  title.className = "passOverlayTitle";
  title.textContent = t("passOverlayTitle");

  const countdown = document.createElement("div");
  countdown.className = "passOverlayCountdown";

  overlay.appendChild(title);
  overlay.appendChild(countdown);
  document.body.appendChild(overlay);

  let remaining = durationSec;
  countdown.textContent = `${remaining} ${t("passOverlaySeconds")}`;

  const interval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(interval);
      overlay.remove();
      nextPhase();
      return;
    }
    countdown.textContent = `${remaining} ${t("passOverlaySeconds")}`;
  }, 1000);
}

function render() {
  if (phase === "intro") renderIntro();
  else if (phase === "instructions") renderInstructions();
  else if (phase === "setup") renderSetup();
  else if (phase === "hide") renderHide();
  else if (phase === "reveal") renderReveal();
  else if (phase === "done") renderDone();
  else if (phase === "vote") renderVote();
  else if (phase === "results") renderResults();

  updateCreatorMark();
}

function nextPhase() {
  if (phase === "hide") {
    phase = "reveal";
    render();
    return;
  }
  if (phase === "reveal") {
    if (currentPlayer >= N) phase = "done";
    else {
      currentPlayer += 1;
      phase = "hide";
    }
    render();
    return;
  }
}

let lastTap = 0;

function guardedTap() {
  const now = Date.now();
  if (now - lastTap < 250) return;
  lastTap = now;

  const PRESS_DELAY_MS = 90;

  setTimeout(() => {
    if (phase === "reveal") {
      showPassOverlayAndAdvance();
      return;
    }
    nextPhase();
  }, PRESS_DELAY_MS);
}

let clickSound;

function initClickSound() {
  if (clickSound) return;
  clickSound = new Audio("/click.mp3");
  clickSound.preload = "auto";
  clickSound.volume = 0.6;
}

function playClick() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

function installClickSound() {
  if (installClickSound._done) return;
  installClickSound._done = true;

  document.addEventListener(
    "pointerdown",
    (e) => {
      const el = e.target.closest(
        "button, .btn, .link, .tapArea, .tapArea .card",
      );

      if (!el) return;
      initClickSound();
      playClick();
    },
    { passive: true },
  );
}

function hapticStrong() {
  if (navigator.vibrate) navigator.vibrate([18, 12, 22]);
}

function hapticLight() {
  if (navigator.vibrate) navigator.vibrate(12);
}

function pressFXStart(el) {
  if (!el) return;
  el.classList.add("is-pressing");
  hapticStrong();
}

function pressFXEnd(el) {
  if (!el) return;
  el.classList.remove("is-pressing");
}

window.addEventListener("DOMContentLoaded", () => {
  installClickSound();
  render();
});
