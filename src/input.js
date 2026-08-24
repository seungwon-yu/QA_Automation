export function bindInput(engine, elements) {
  const jump = () => engine.jump();
  const restart = () => engine.restart();

  elements.startButton.addEventListener("click", () => engine.start());
  elements.jumpButton.addEventListener("click", jump);
  elements.restartButton.addEventListener("click", restart);

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault();
      jump();
    }

    if (event.code === "Enter" && engine.getState().status === "gameOver") {
      restart();
    }
  });
}
