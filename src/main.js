import { GameEngine } from "./gameEngine.js";
import { bindInput } from "./input.js";
import { Renderer } from "./renderer.js";

const canvas = document.querySelector("#game");
const engine = new GameEngine({ width: canvas.width, height: canvas.height });
const renderer = new Renderer(canvas, engine);

const elements = {
  score: document.querySelector("#score"),
  bestScore: document.querySelector("#best-score"),
  state: document.querySelector("#state"),
  velocity: document.querySelector("#velocity"),
  obstacles: document.querySelector("#obstacles"),
  startButton: document.querySelector("#start-button"),
  jumpButton: document.querySelector("#jump-button"),
  restartButton: document.querySelector("#restart-button")
};

bindInput(engine, elements);

let lastTime = performance.now();

function updateHud(state) {
  elements.score.textContent = String(state.score);
  elements.bestScore.textContent = String(state.bestScore);
  elements.state.textContent = state.status;
  elements.velocity.textContent = String(Math.round(state.player.velocityY));
  elements.obstacles.textContent = String(state.obstacles.length);
}

function frame(now) {
  const delta = (now - lastTime) / 1000;
  lastTime = now;
  const state = engine.tick(delta);
  renderer.draw();
  updateHud(state);
  requestAnimationFrame(frame);
}

renderer.draw();
updateHud(engine.getState());
requestAnimationFrame(frame);

window.__QA_AUTOMATION__ = {
  engine,
  getState: () => engine.getState(),
  start: () => engine.start(),
  jump: () => engine.jump(),
  restart: () => engine.restart(),
  tick: (seconds) => engine.tick(seconds),
  forceObstacle: (rect) => engine.forceObstacle(rect)
};
