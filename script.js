function timeToMillis(hr, min, sec) {
  return 1000 * 60 * 60 * hr + 1000 * 60 * min + 1000 * sec;
}

const State = {
  IDLE: "idle",
  PAUSED: "paused",
  TICKING: "ticking",
};

const Mode = {
  POMO: "pomo",
  BREAK: "break",
};

let timer = {
  state: State.IDLE,
  mode: Mode.POMO,
  break: timeToMillis(0, 5, 0),
  pomo: timeToMillis(0, 25, 0),
  elapsed: null,
  startTime: null,
};

function makeTask(name, color, records, archived = false, deleted = false) {
  return {
    name,
    color,
    records,
    archived,
    deleted,
    node: undefined,
  };
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

window.onload = () => {
  let tasks = [];
  let taskList = document.getElementById("task-list");
  let taskTemplate = document.getElementById("task-template");
  let totalTime = document.getElementById("time-total");
  let timerTxt = document.getElementById("timer");
  let timerWheel = document.getElementById("circle");
  let focusTxt = document.getElementById("focus");

  makeTimeRecord(0, timeToMillis(0, 3, 0));

  function appendTaskToDOM(task) {
    let newTask = taskTemplate.content.cloneNode(true);

    newTask
      .querySelectorAll("svg")
      .forEach((t) => (t.querySelector("path").style.fill = task.color));

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
    newTask
      .querySelector(".button")
      .addEventListener("click", () => startTaskTimer(task));

    taskList.appendChild(newTask);
    task.node = taskList.lastElementChild;
  }

  function startTaskTimer(task) {
    focusTxt.innerHTML = task.name;
    focusTxt.style.color = task.color;
    console.log(taskList.children);
    if (timer.state == State.TICKING) {
      Array.from(taskList.children)
        .filter((t) => t != task.node)
        .forEach((t) => {
          t.classList.remove("opacious");
          let button = t.querySelector(".button");
          button.classList.add("hoverfx");
          button.classList.remove("non-clickable");
        });
      task.node.querySelector(".pause").classList.add("deactive");
      task.node.querySelector(".play").classList.remove("deactive");
    } else {
      Array.from(taskList.children)
        .filter((t) => t != task.node)
        .forEach((t) => {
          t.classList.add("opacious");
          let button = t.querySelector(".button");
          button.classList.remove("hoverfx");
          button.classList.add("non-clickable");
        });
      task.node.querySelector(".pause").classList.remove("deactive");
      task.node.querySelector(".play").classList.add("deactive");
    }
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

  let cs = getComputedStyle(timerWheel);
  let c_fg = cs.getPropertyValue("--fg-color");
  let c_bg = cs.getPropertyValue("--bg-color");

  timerTxt.innerHTML = renderTime(timer.pomo);

  function renderTime(millis) {
    let seconds = Math.ceil(millis / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    let visible_seconds = String(seconds % 60).padStart(2, "0");
    let visible_minutes = String(minutes % 60).padStart(2, "0");
    let visible_hours = String(hours).padStart(2, "0");

    return `${visible_hours}:${visible_minutes}:${visible_seconds}`;
  }

  function tick() {
    console.log("Starting to tick...");
    if (timer.state !== State.TICKING) {
      return;
    }
    timer.elapsed = Date.now() - timer.startTime;

    let remaining = timer.pomo - timer.elapsed;
    timerTxt.innerHTML = renderTime(remaining);

    let step = 360 / timer.pomo;
    let deg = step * timer.elapsed;
    if (deg > 180) deg -= 180;
    set = (p, v) => {
      timerWheel.style.setProperty(p, v);
    };
    set("--rotation", `${deg}deg`);
    remaining / timer.pomo >= 0.5
      ? set("--cntrl-color", c_bg)
      : set("--cntrl-color", c_fg);

    requestAnimationFrame(tick);
  }

  function startTimer() {
    if (timer.state == State.TICKING) {
      stopTimer();
      return;
    }

    timer.startTime = Date.now();
    timer.state = State.TICKING;
    requestAnimationFrame(tick);
  }

  function resetWheel() {
    timerWheel.style.setProperty("--cntrl-color", c_bg);
    timerWheel.style.setProperty("--rotation", "0deg");
  }

  function stopTimer() {
    timer.state = State.IDLE;
    focusTxt.style.color = window
      .getComputedStyle(document.body)
      .getPropertyValue("--main-text-color");
    focusTxt.innerHTML = "Focus time";
    timer.startTime = null;
    timer.elapsed = null;
    resetWheel();
    timerTxt.innerHTML = renderTime(timer.pomo);
  }
};
