let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let context = ctx;

let width = window.innerWidth;
let height = window.innerHeight;

let centerX = width * 0.5;
let centerY = height * 0.5;
let mainColor = '#0F76E6';
let secondaryColor = '#008f03';

canvas.width = width;
canvas.height = height;

const MAX_VELOCITY = 10;
const MAX_LINE_WIDTH = 1;

const MAX_SIZE = Math.max(centerX + 300, centerY + 300);

let objsNum = 250;
let objs = [];

function init() {
  if (!objs.length) {
    for (var i = 0; i < objsNum; i++) {
      objs.push(newObj(i))
    }
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

function render() {
  ctx.clearRect(0, 0, width, height);

    for (var i = 0, l = objs.length; i < l; i++) {
      let o = objs[i];

      if (o.s > MAX_SIZE && !o.locked) {
        o.c = mainColor;
        o.d = -1;
        o.locked = true;
      } else if (o.s < 0) {
        o.c = secondaryColor;
        o.d = 1;
        o.locked = false;
      }

      drawHex(o);
      ctx.beginPath();
      ctx.rect(o.x + random(-o.s, o.s), o.y + random(-o.s, o.s), 5 * Math.sin(o.s * 2 * Math.PI / o.nS), 5);
      ctx.stroke();
     
      o.s += o.v * o.d;
    }
}

function drawHex(o) {
  ctx.beginPath();
  ctx.moveTo(o.x + o.s * Math.cos(o.r), o.y + o.s * Math.sin(o.r));

  for (let i = 1; i <= o.nS; i += 1) {
    let angle = (i * 2 * Math.PI / o.nS) + o.r;
    
    ctx.lineTo(o.x + o.s * Math.cos(angle), o.y + o.s * Math.sin(angle));
  }

  ctx.strokeStyle = o.c;
  ctx.lineWidth = o.lW;
  ctx.stroke();
}

function newObj(i) {
  return {
    i,
    nS: random(8, 15),
    s: random(5, 50),
    x: centerX,
    y: centerY,
    c: secondaryColor,
    r: random(0, MAX_SIZE + 1),
    v: random(0.5, MAX_VELOCITY),
    lW: random(1, MAX_LINE_WIDTH),
    d: 1
  }
}


animate();
init();

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}