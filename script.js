window.onload = () => {
  console.log("Hello world");
  console.log(performance.now());

  let button = document.getElementById("button");
  let timer = document.getElementById("timer");
  button.addEventListener("click", startTimer);
  let secs = 0;
  let now = null;
  let timer_started = false;

  // Maybe I can use timestamp instead of calculating current?
  function tick(timestamp) {
    if (!timer_started) return;
    current = Date.now() - now;
    let seconds = Math.floor(current / 1000);
    let minutes = Math.floor(seconds / 60);

    let visible_seconds = String(seconds % 60).padStart(2, "0");
    let visible_minutes = String(minutes).padStart(2, "0");

    timer.innerHTML = `${visible_minutes}:${visible_seconds}`;
    requestAnimationFrame(tick);
  }

  function startTimer() {
    now = Date.now();
    timer_started = !timer_started;
    requestAnimationFrame(tick);
  }
};
