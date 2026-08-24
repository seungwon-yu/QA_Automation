export class Renderer {
  constructor(canvas, engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.engine = engine;
  }

  draw() {
    const state = this.engine.getState();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawSky(ctx);
    this.drawGround(ctx, state);
    this.drawPlayer(ctx, state.player);
    for (const obstacle of state.obstacles) {
      this.drawObstacle(ctx, obstacle);
    }
    this.drawOverlay(ctx, state);
  }

  drawSky(ctx) {
    ctx.fillStyle = "#eef7ff";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#d8e7f4";
    ctx.fillRect(110, 68, 52, 8);
    ctx.fillRect(640, 92, 74, 8);
    ctx.fillRect(760, 54, 42, 8);
  }

  drawGround(ctx, state) {
    ctx.strokeStyle = "#31343a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, state.groundY + 1);
    ctx.lineTo(this.canvas.width, state.groundY + 1);
    ctx.stroke();

    ctx.fillStyle = "#9ca3af";
    const offset = Math.floor(state.score * 2) % 36;
    for (let x = -offset; x < this.canvas.width; x += 36) {
      ctx.fillRect(x, state.groundY + 18, 18, 3);
    }
  }

  drawPlayer(ctx, player) {
    ctx.fillStyle = "#23262b";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(player.x + 30, player.y + 10, 22, 20);
    ctx.clearRect(player.x + 35, player.y + 16, 5, 5);
    ctx.fillStyle = "#23262b";
    ctx.fillRect(player.x + 8, player.y + player.height, 12, 13);
    ctx.fillRect(player.x + 29, player.y + player.height, 12, 13);
  }

  drawObstacle(ctx, obstacle) {
    ctx.fillStyle = "#2f7d5b";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillRect(obstacle.x - 10, obstacle.y + 12, 10, 8);
    ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + 20, 10, 8);
  }

  drawOverlay(ctx, state) {
    if (state.status === "running") {
      return;
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#16171a";
    ctx.textAlign = "center";
    ctx.font = "700 28px Arial";
    const text = state.status === "gameOver" ? "Game Over" : "Ready";
    ctx.fillText(text, this.canvas.width / 2, 150);
    ctx.font = "16px Arial";
    ctx.fillText("Space 또는 Jump 버튼으로 시작", this.canvas.width / 2, 184);
  }
}
