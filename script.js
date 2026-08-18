window.onload = () => {
  let tasks = [];
  let taskList = document.getElementById("tasks");
  let taskTemplate = document.getElementById("task-template");
  let totalTime = document.getElementById("time-total");

  // We won't delete anything because we will use the index of the array to identify
  // the tasks. Actually deleting something will completely ruin everything probably.
  function makeTask(name, color, records, archived = false, deleted = false) {
    return {
      name,
      color,
      records,
      archived,
      deleted,
    };
  }

  function timeToMillis(hr, min, sec) {
    return 1000 * 60 * 60 * hr + 1000 * 60 * min + 1000 * sec;
  }

  function makeTimeRecord(
    startDateOffset,
    timeWorked,
    hoursOffset = 0,
    minutesOffset = 0,
    secondsOffset = 0,
  ) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + startDateOffset);
    startDate.setHours(hoursOffset);
    startDate.setMinutes(minutesOffset);
    startDate.setSeconds(secondsOffset);

    let endDate = new Date(startDate);
    endDate.setTime(endDate.getTime() + timeWorked);
    return { startDate, endDate };
  }

  makeTimeRecord(0, timeToMillis(0, 3, 0));

  function appendTaskToDOM(task) {
    let newTask = taskTemplate.content.cloneNode(true);

    newTask.querySelector("svg").querySelector("path").style.fill = task.color;

    newTask.querySelector(".task_name").innerHTML = task.name;

    // calculate time here:
    let timeSpentToday = task.records
      .filter(
        // get today's records only
        (record) => record.startDate.getDate() == new Date().getDate(),
      )
      .map(
        // calculate time spent
        (record) => record.endDate - record.startDate,
      )
      .reduce(
        // add up all the time spent
        (acc, record) => acc + record,
        0, // set inital value to 0 - so we don't error when arr is empty
      );

    newTask.querySelector(".time2").innerHTML = renderTime(timeSpentToday);
    newTask.querySelector(".button").addEventListener("click", () => startTaskTimer(task));

    taskList.appendChild(newTask);
  }

  function startTaskTimer(task) {
    console.log(task);
    startTimer();
  }

  function calculateTotalTime(date) {
    return tasks
      .map((t) => t.records)
      .flat()
      .filter((record) => record.startDate.getDate() == date)
      .map((record) => record.endDate - record.startDate)
      .reduce((acc, record) => acc + record);
  }

  // this will eventually be taken from the localStorage
  // we are creating tasks here in situ for testing purposes only.
  // we will use a similar method as this to actually create new tasks.
  tasks.push(
    makeTask("LeetCode", "#34c759", [
      makeTimeRecord(-1, timeToMillis(0, 25, 2)),
      makeTimeRecord(0, timeToMillis(1, 30, 2)),
      makeTimeRecord(0, timeToMillis(2, 30, 2), 4),
    ]),
  );
  tasks.push(
    makeTask("Signals", "#cb30e0", [
      makeTimeRecord(-2, timeToMillis(3, 6, 2)),
      makeTimeRecord(0, timeToMillis(0, 6, 2)),
    ]),
  );
  tasks.push(makeTask("C++", "#ff8d28", []));
  tasks.push(makeTask("Better Pomo", "#ff383c", []));

  tasks.forEach((t) => appendTaskToDOM(t));
  totalTime.innerHTML = renderTime(calculateTotalTime(new Date().getDate()));

  // let button = document.getElementById("button");
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
    let visible_minutes = String(minutes % 60).padStart(2, "0");
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
