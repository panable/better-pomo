window.onload = () => {
  console.log("Hello world");
  console.log(performance.now());

  let button = document.getElementById("button");
  let timer = document.getElementById("timer");
  button.addEventListener("click", startTimer);
  timer.addEventListener("click", changePomo);

  let max_pomo_length = 1 * 60 * 1000;
  let remaining = max_pomo_length;
  let now = null;
  let timer_started = false;

  function renderTime(millis) {
    let seconds = Math.ceil(millis / 1000);
    let minutes = Math.floor(seconds / 60);

    let visible_seconds = String(seconds % 60).padStart(2, "0");
    let visible_minutes = String(minutes).padStart(2, "0");

    return `${visible_minutes}:${visible_seconds}`;
  }

  function changePomo() {
  }

  timer.innerHTML = renderTime(remaining);

  function tick() {
    if (!timer_started) return;
    // time elapsed since starting the timer
    current = Date.now() - now;

    remaining = max_pomo_length - current;
    timer.innerHTML = renderTime(remaining);
    requestAnimationFrame(tick);
  }

  function startTimer() {
    now = Date.now();
    timer_started = !timer_started;
    requestAnimationFrame(tick);
  }
};
