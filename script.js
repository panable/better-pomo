window.onload = () => {
  console.log("Hello world");
  console.log(performance.now());

  timer = document.getElementById("timer");
  button = document.getElementById("button");
  button.addEventListener("click", startTimer);
  secs = 0;

  function startTimer() {
    setTimeout(() => {
      timer.innerHTML = `00:${secs++}`;
      startTimer();
    }, 1000);
  }
};
