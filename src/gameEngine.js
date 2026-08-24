export class GameEngine {
  constructor(options = {}) {
    this.width = options.width ?? 960;
    this.height = options.height ?? 360;
    this.groundY = options.groundY ?? 292;
    this.rng = options.rng ?? Math.random;
    this.reset();
  }

  reset() {
    this.status = "ready";
    this.score = 0;
    this.bestScore = this.bestScore ?? 0;
    this.elapsed = 0;
    this.spawnTimer = 1;
    this.speed = 315;
    this.gravity = 1900;
    this.jumpVelocity = -720;
    this.player = {
      x: 86,
      y: this.groundY - 54,
      width: 44,
      height: 54,
      velocityY: 0,
      isGrounded: true
    };
    this.obstacles = [];
  }

  start() {
    if (this.status === "ready") {
      this.status = "running";
    }
  }

  restart() {
    this.reset();
    this.start();
  }

  jump() {
    if (this.status === "ready") {
      this.start();
    }

    if (this.status !== "running" || !this.player.isGrounded) {
      return false;
    }

    this.player.velocityY = this.jumpVelocity;
    this.player.isGrounded = false;
    return true;
  }

  tick(deltaSeconds) {
    if (this.status !== "running") {
      return this.getState();
    }

    const dt = Math.min(deltaSeconds, 0.05);
    this.elapsed += dt;
    this.score += dt * 12;
    this.speed = 315 + Math.min(210, this.elapsed * 8);
    this.updatePlayer(dt);
    this.updateObstacles(dt);
    this.spawnTimer -= dt;

    if (this.spawnTimer <= 0) {
      this.spawnObstacle();
      this.spawnTimer = 1.05 + this.rng() * 0.85;
    }

    if (this.obstacles.some((obstacle) => this.intersects(this.player, obstacle))) {
      this.status = "gameOver";
      this.bestScore = Math.max(this.bestScore, Math.floor(this.score));
    }

    return this.getState();
  }

  updatePlayer(dt) {
    this.player.velocityY += this.gravity * dt;
    this.player.y += this.player.velocityY * dt;

    const floorY = this.groundY - this.player.height;
    if (this.player.y >= floorY) {
      this.player.y = floorY;
      this.player.velocityY = 0;
      this.player.isGrounded = true;
    }
  }

  updateObstacles(dt) {
    for (const obstacle of this.obstacles) {
      obstacle.x -= this.speed * dt;
    }

    this.obstacles = this.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -10);
  }

  spawnObstacle(x = this.width + 20) {
    const height = 34 + Math.floor(this.rng() * 28);
    const width = 22 + Math.floor(this.rng() * 16);
    const obstacle = {
      id: `obs-${Date.now()}-${Math.floor(this.rng() * 100000)}`,
      x,
      y: this.groundY - height,
      width,
      height
    };
    this.obstacles.push(obstacle);
    return obstacle;
  }

  forceObstacle(rect) {
    const obstacle = {
      id: rect.id ?? `forced-${this.obstacles.length + 1}`,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    };
    this.obstacles.push(obstacle);
    return obstacle;
  }

  intersects(a, b) {
    const padding = 5;
    return (
      a.x + padding < b.x + b.width &&
      a.x + a.width - padding > b.x &&
      a.y + padding < b.y + b.height &&
      a.y + a.height - padding > b.y
    );
  }

  getState() {
    return {
      status: this.status,
      score: Math.floor(this.score),
      bestScore: this.bestScore,
      speed: Math.round(this.speed),
      groundY: this.groundY,
      player: { ...this.player },
      obstacles: this.obstacles.map((obstacle) => ({ ...obstacle }))
    };
  }
}
