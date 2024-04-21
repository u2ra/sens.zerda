// ゲームタイトルとドット当たりの距離の定義
const games = {
  "Aim Gods": { distancePerDot: 0.0023331 },
  "Aim Lab": { distancePerDot: 0.5 },
  "Apex Legends": { distancePerDot: 0.022 },
  "Back 4 Blood": { distancePerDot: 0.0023331 },
  "Battlefield 2042": { distancePerDot: 0.0146 },
  "Battlefield V": { distancePerDot: 0.022 },
  "Borderlands 2": { distancePerDot: 0.0055 },
  "Call of Duty: Black Ops 4": { distancePerDot: 0.00660568 },
  "Call of Duty: Modern Warfare II": { distancePerDot: 0.0065999997548 },
  "Call of Duty: Vanguard": { distancePerDot: 0.0066 },
  "Counter-Strike": { distancePerDot: 0.022 },
  "Cyberpunk 2077": { distancePerDot: 0.1 },
  "Dark and Darker": { distancePerDot: 0.17498230292 },
  "Destiny 2": { distancePerDot: 0.0066 },
  "Duke Nukem Forever": { distancePerDot: 1.714 },
  "Escape from Tarkov": { distancePerDot: 0.125 },
  "Far Cry4": { distancePerDot: 0.036 },
  "Far Cry5": { distancePerDot: 0.00184105 },
  Fortnite: { distancePerDot: 0.005555 },
  "Garry's Mod": { distancePerDot: 0.022 },
  "GTA 5": { distancePerDot: 0.022 },
  "GUNDAM EVOLUTION": { distancePerDot: 0.00038888889 },
  "Half-Life 1 & 2": { distancePerDot: 0.022 },
  "Hyper Scape": { distancePerDot: 0.00572 },
  "Left 4 Dead 1 & 2": { distancePerDot: 0.022 },
  "Natural Selection 2": { distancePerDot: 0.022 },
  "Overwatch 2": { distancePerDot: 0.0066 },
  Paladins: { distancePerDot: 0.00916 },
  "PlanetSide 2": { distancePerDot: 0.36 },
  "Portal 1 & 2": { distancePerDot: 0.022 },
  "PUBG (FPP)": { distancePerDot: 2.22222 },
  "PUBG (TPP)": { distancePerDot: 2.22222 },
  "Quake 3 Arena": { distancePerDot: 0.022 },
  "Quake Live": { distancePerDot: 0.022 },
  "Rainbow 6:siege": { distancePerDot: 0.00573 },
  RUST: { distancePerDot: 0.1125 },
  "SCP: Secret Laboratory": { distancePerDot: 0.1 },
  Spellbreak: { distancePerDot: 0.8 },
  Splitgate: { distancePerDot: 0.00937367 },
  "Team Fortress 2": { distancePerDot: 0.022 },
  "The Cycle: Frontier": { distancePerDot: 0.02777427 },
  "Titanfall 2": { distancePerDot: 0.022 },
  "Unreal Tournament": { distancePerDot: 0.0596 },
  Valheim: { distancePerDot: 0.5 },
  VALORANT: { distancePerDot: 0.07 },
  Warframe: { distancePerDot: 0.022 },
};

// ゲームタイトルの選択肢を動的に生成
const sourceGameSelect = document.getElementById("source-game");
const targetGameSelect = document.getElementById("target-game");

for (const game in games) {
  const option = document.createElement("option");
  option.value = game;
  option.textContent = game;
  sourceGameSelect.appendChild(option.cloneNode(true));
  targetGameSelect.appendChild(option);
}

// 検索機能
const sourceSearchInput = document.getElementById("source-search");
const targetSearchInput = document.getElementById("target-search");

function filterGameOptions(searchInput, gameSelect) {
  const searchTerm = searchInput.value.toLowerCase();
  const options = gameSelect.options;

  for (let i = 0; i < options.length; i++) {
    const game = options[i].value.toLowerCase();
    if (game.includes(searchTerm)) {
      options[i].style.display = "block";
    } else {
      options[i].style.display = "none";
    }
  }
}

sourceSearchInput.addEventListener("input", () => {
  filterGameOptions(sourceSearchInput, sourceGameSelect);
});

targetSearchInput.addEventListener("input", () => {
  filterGameOptions(targetSearchInput, targetGameSelect);
});

// FOV表示の切り替え
function toggleFovInput(gameSelect, fovElement) {
  const selectedGame = gameSelect.value;
  if (selectedGame === "PUBG (FPP)" || selectedGame === "PUBG (TPP)") {
    fovElement.style.display = "block";
  } else {
    fovElement.style.display = "none";
  }
}

sourceGameSelect.addEventListener("change", () => {
  toggleFovInput(sourceGameSelect, document.getElementById("source-fov"));
  calculateSensitivity();
});

targetGameSelect.addEventListener("change", () => {
  toggleFovInput(targetGameSelect, document.getElementById("target-fov"));
  calculateSensitivity();
});

// 感度計算
const sourceMouseDPI = document.getElementById("source-dpi");
const sourceMouseSensitivity = document.getElementById("source-sensitivity");
const sourceFOV = document.getElementById("source-fov-input");
const targetMouseSensitivity = document.getElementById("target-sensitivity");
const targetFOV = document.getElementById("target-fov-input");
const targetCM180 = document.getElementById("target-cm-per-180");

function calculateSensitivity() {
  const sourceGame = sourceGameSelect.value;
  const targetGame = targetGameSelect.value;
  const sourceDistancePerDot = games[sourceGame].distancePerDot;
  const targetDistancePerDot = games[targetGame].distancePerDot;
  const sourceDPI = parseFloat(sourceMouseDPI.value);
  let sourceSensitivity = parseFloat(sourceMouseSensitivity.value);

  // FOVに応じた感度の調整（PUBGの場合）
  if (sourceGame === "PUBG (FPP)") {
    sourceSensitivity = 0.00203 * Math.pow(10, sourceSensitivity / 50);
    sourceSensitivity *= parseFloat(sourceFOV.value) / 80;
  } else if (sourceGame === "PUBG (TPP)") {
    sourceSensitivity = 0.0016 * Math.pow(10, sourceSensitivity / 50);
    sourceSensitivity *= parseFloat(sourceFOV.value) / 80;
  }

  // ドット当たりの距離を合わせて感度を調整
  let targetSensitivity =
    sourceSensitivity * (sourceDistancePerDot / targetDistancePerDot);

  // FOVに応じた感度の調整（PUBGの場合）
  if (targetGame === "PUBG (FPP)") {
    targetSensitivity *= 80 / parseFloat(targetFOV.value);
    targetSensitivity = 50 * Math.log10(targetSensitivity / 0.00203);
  } else if (targetGame === "PUBG (TPP)") {
    targetSensitivity *= 80 / parseFloat(targetFOV.value);
    targetSensitivity = 50 * Math.log10(targetSensitivity / 0.0016);
  }

  // 計算結果の反映
  targetMouseSensitivity.value = targetSensitivity.toFixed(5);
  const cm180 =
    (180 / (sourceDPI * sourceDistancePerDot * sourceSensitivity)) * 2.54;
  targetCM180.value = cm180.toFixed(2);
}

sourceMouseDPI.addEventListener("input", calculateSensitivity);
sourceMouseSensitivity.addEventListener("input", calculateSensitivity);
sourceFOV.addEventListener("input", calculateSensitivity);

// ツイート機能
const tweetButton = document.getElementById("tweet-button");

tweetButton.addEventListener("click", () => {
  const targetGame = targetGameSelect.value;
  const sensitivity = targetMouseSensitivity.value;
  const dpi = sourceMouseDPI.value;
  const cm180 = targetCM180.value;

  const tweetText = `私の${targetGame}の振り向きは${cm180}cmです。(DPI:${dpi} 感度:${sensitivity}) #Zerda_jp #感度振り向き変換ツール #${targetGame.replace(
    /\s+/g,
    ""
  )}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=https://sens.zerda.jp/`;

  window.open(tweetUrl, "_blank");
});

// コピー機能
const clipboard = new ClipboardJS(".copy-button");

clipboard.on("success", (e) => {
  e.clearSelection();
  const originalText = e.trigger.innerHTML;
  e.trigger.innerHTML = "コピーしました";
  setTimeout(() => {
    e.trigger.innerHTML = originalText;
  }, 2000);
});

clipboard.on("error", (e) => {
  console.error("コピーに失敗しました:", e.action);
});

// モーダル機能
const infoModal = document.getElementById("info-modal");
const howtoModal = document.getElementById("howto-modal");

function openModal(modal) {
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

document.querySelectorAll('[data-bs-toggle="modal"]').forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    const modalId = element.getAttribute("data-bs-target");
    const modal = document.querySelector(modalId);
    openModal(modal);
  });
});

document.querySelectorAll('[data-bs-dismiss="modal"]').forEach((element) => {
  element.addEventListener("click", () => {
    const modal = element.closest(".modal");
    closeModal(modal);
  });
});

window.addEventListener("click", (event) => {
  if (event.target.matches(".modal")) {
    closeModal(event.target);
  }
});

// デフォルト設定
document.getElementById("source-game").value = "VALORANT";
document.getElementById("target-game").value = "Apex Legends";
calculateSensitivity();
