// ==============================
// Matrix Rain Effect (Fully Configurable)
// ==============================

const canvas = document.getElementById('matrix-canvas');



const ctx = canvas.getContext('2d');

// ===== CONFIGURATION =====
const DEFAULT_CONFIG = {
  fontSize: 24,
  sideRatio: 0.30,
  initialDropOffset: -100,
  fadeOpacity: 0.2,
  textOpacity: 1.0,
  characterChangeSpeed: 1,
  trailLength: 20, // how many characters visible per column
  dropSpeed: 0.5,
  fontFamily: '"Courier New"',
  characterSet: (
    'ｦｩｨｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺﾀﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾜﾝ' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '0123456789'
  ),
  colors: [
    '#22568d',
    '#7ab4e6',
    '#8ac3ea',
    '#a8d5ba',
    '#5a8fd4',
    '#4a9fd8',
  ]
};

const CONFIG = {
  ...DEFAULT_CONFIG,
  ...(window.MATRIX_CONFIG || {})
};

// ===== STATE =====
let columns = 0;
let sideColumns = 0;
let drops = [];
let charChangeTimer = 0;

// ===== HELPERS =====
const randomFrom = (array) =>
  array[Math.floor(Math.random() * array.length)];

const randomChar = () =>
  CONFIG.characterSet[Math.floor(Math.random() * CONFIG.characterSet.length)];

const isSideColumn = (index) =>
  index < sideColumns || index >= columns - sideColumns;

// ===== INITIALIZATION =====
function initialize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  columns = Math.ceil(canvas.width / CONFIG.fontSize);
  sideColumns = Math.ceil(columns * CONFIG.sideRatio);

  drops = Array.from({ length: columns }, () =>
    Math.random() * CONFIG.initialDropOffset
  );

  charChangeTimer = 0;

  ctx.font = `${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
}

// ===== DRAW =====
function drawBackgroundFade() {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.globalAlpha = CONFIG.fadeOpacity;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#F7FAFD';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawColumns() {
  for (let i = 0; i < columns; i++) {
    if (!isSideColumn(i)) continue;

    for (let j = 0; j < CONFIG.trailLength; j++) {
      const y = (drops[i] - j) * CONFIG.fontSize;

      if (y < 0) continue;
      if (y > canvas.height) continue;

      // Fade older characters
      const opacity = 1 - j / CONFIG.trailLength;

      ctx.globalAlpha = opacity;
      ctx.fillStyle = randomFrom(CONFIG.colors);

      ctx.fillText(
        randomChar(),
        i * CONFIG.fontSize,
        y
      );
    }

    drops[i] += CONFIG.dropSpeed;

    if (drops[i] * CONFIG.fontSize > canvas.height + CONFIG.trailLength * CONFIG.fontSize) {
      resetColumn(i);
    }
  }

  ctx.globalAlpha = 1;
}

function resetColumn(index) {
  drops[index] = Math.random() * CONFIG.initialDropOffset;
}

// ===== LOOP =====
function loop() {
  drawBackgroundFade();
  drawColumns();
  requestAnimationFrame(loop);
}

// ===== START =====
initialize();
loop();
window.addEventListener('resize', initialize);