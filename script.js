window.onload = () => {
  let tasks = [];

  function makeTask(name, color, records, archived = false, deleted = false) {
    return {
      name,
      color,
      records,
      archived,
      deleted
    };
  }

  function makeRecord(startDate, stopDate) {
    return { startDate, stopDate };
  }

  1000 * 6 * 60 +  // 6 minutes
  1000 * 15; // 15 seconds

  tasks.push(makeTask("Leetcode", "#34c759", [makeRecord(Date.now() - (1000 * 6 * 60 + 1000 * 15), Date.now())]));

  console.log(JSON.stringify(tasks, null, 4));
  console.log(performance.now());

  let button = document.getElementById("button");
  let timer = document.getElementById("timer");
  let circle = document.getElementById("circle");

  let cs = getComputedStyle(circle);
  let c_fg = cs.getPropertyValue("--fg-color");
  let c_bg = cs.getPropertyValue("--bg-color");

  //button.addEventListener("click", startTimer);
  timer.addEventListener("click", changePomo);

  let max_pomo_length = 1 * 60 * 1000;
  let remaining = max_pomo_length;
  let now = null;
  let timer_started = false;

  function renderTime(millis) {
    let seconds = Math.ceil(millis / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    let visible_seconds = String(seconds % 60).padStart(2, "0");
    let visible_minutes = String(minutes).padStart(2, "0");
    let visible_hours = String(hours).padStart(2, "0");

    return `${visible_hours}:${visible_minutes}:${visible_seconds}`;
  }

  function changePomo() {}

  timer.innerHTML = renderTime(remaining);

  function tick() {
    if (!timer_started) return;
    elapsed = Date.now() - now;

    remaining = max_pomo_length - elapsed;
    timer.innerHTML = renderTime(remaining);

    let step = 360 / max_pomo_length;
    deg = step * elapsed;
    if (deg > 180) deg -= 180;
    set = (p, v) => {
      circle.style.setProperty(p, v);
    };
    set("--rotation", `${deg}deg`);
    remaining / max_pomo_length >= 0.5
      ? set("--cntrl-color", c_bg)
      : set("--cntrl-color", c_fg);

    requestAnimationFrame(tick);
  }

  function startTimer() {
    now = Date.now();
    timer_started = !timer_started;
    requestAnimationFrame(tick);
  }
};
