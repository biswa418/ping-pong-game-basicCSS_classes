import "./styles.css";

var ball = document.querySelector("#ball");
var message = document.querySelector("h1");
var rod1 = document.getElementById("upper");
var rod2 = document.getElementById("lower");
var app = document.getElementById("container");
var collsion = document.getElementById("collision");
var collsion2 = document.getElementById("collision2");

var step = 50; // pixel step to move
var gameStart = false; // game starting status

//score maintain
var score = {
  first: 0,
  second: 0
};

//current situation store
var action = {
  lowScore: "",
  lost: false
};

window.addEventListener("resize", function () {
  reset(rod1);
  reset(rod2);
  reset(ball);
});

function reset(element) {
  element.style.left =
    document.documentElement.clientWidth / 2 - element.offsetWidth / 2 + "px";
  element.style.left =
    document.documentElement.clientWidth / 2 - element.offsetWidth / 2 + "px";
  if (element == ball) {
    if (action.lost) {
      if (action.lowScore == "first") {
        ball.style.top = rod1.clientHeight + 4 + "px";
      } else {
        ball.style.top =
          document.documentElement.clientHeight -
          rod2.clientHeight -
          ball.clientHeight -
          4 +
          "px";
      }
    } else element.style.top = document.documentElement.clientHeight / 2 + "px";
  }
}

function moveRods() {
  window.addEventListener("keydown", function (event) {
    let code = event.key;
    if (code == "d") {
      let leftPos = parseInt(
        rod1.style.left.substring(0, rod1.style.left.length - 2)
      );
      leftPos += step;

      if (leftPos + rod1.offsetWidth > document.documentElement.clientWidth) {
        leftPos = document.documentElement.clientWidth - rod1.offsetWidth;
      }

      rod1.style.left = leftPos + "px";
      rod2.style.left = leftPos + "px";
    } else if (code == "a") {
      let leftPos = parseInt(
        rod1.style.left.substring(0, rod1.style.left.length - 2)
      );
      leftPos -= step;

      if (leftPos < 0) {
        leftPos = 0;
      }

      rod1.style.left = leftPos + "px";
      rod2.style.left = leftPos + "px";
    }
  });
}

function upperBoundary() {
  let ball_top_Pos = ball.getBoundingClientRect().top;
  let ball_left_Pos = ball.getBoundingClientRect().left;

  let bar_left_Pos = parseInt(
    rod1.style.left.substring(0, rod1.style.left.length - 2)
  );
  if (
    ball_top_Pos <= rod1.clientHeight &&
    ball_left_Pos + ball.clientWidth / 2 > bar_left_Pos &&
    ball_left_Pos + ball.clientWidth / 2 < bar_left_Pos + rod1.clientWidth
  ) {
    if (!gameStart) {
      gameStart = true;
      collsion.play();

      setTimeout(function () {
        score.first++;
        // collsion.pause();
        gameStart = false;
        console.log("first", score.first);
      }, 200);
    }
    return true;
  }
  return false;
}

function lowerBoundary() {
  let ball_top_Pos = ball.getBoundingClientRect().top;
  let ball_left_Pos = ball.getBoundingClientRect().left;

  let bar_left_Pos = parseInt(
    rod2.style.left.substring(0, rod2.style.left.length - 2)
  );

  if (
    ball_top_Pos + ball.clientHeight + rod2.clientHeight >=
      document.documentElement.clientHeight &&
    ball_left_Pos + ball.clientWidth / 2 > bar_left_Pos &&
    ball_left_Pos + ball.clientWidth / 2 < bar_left_Pos + rod2.clientWidth
  ) {
    if (!gameStart) {
      gameStart = true;
      collsion2.play();

      setTimeout(function () {
        score.second++;
        gameStart = false;
        console.log("second", score.second);
      }, 200);
    }
    return true;
  }
  return false;
}

function intervalSet() {
  let id = setInterval(function () {
    let numeric_left = ball.getBoundingClientRect().left;
    let numeric_top = ball.getBoundingClientRect().top;
    if (numeric_left <= 0) {
      //hit left
      //current direction
      let class_present = ball.classList[0];

      // if going top-left -> bounce to top-right
      if (class_present == "animate-top-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-right");
      } else if (class_present == "animate-bottom-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-right");
      }
    } else if (
      numeric_left + ball.offsetWidth >=
      document.documentElement.clientWidth
    ) {
      //hit right
      let class_present = ball.classList[0];
      if (class_present == "animate-top-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-left");
      } else if (class_present == "animate-bottom-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-left");
      }
    } else if (
      numeric_top <= 0 ||
      numeric_top + ball.offsetHeight >= document.documentElement.clientHeight
    ) {
      //game over
      ball.classList.remove(ball.classList[0]);
      if (numeric_top <= 0) {
        action.lowScore = "first";
        action.lost = true;
      } else if (
        numeric_top + ball.offsetHeight >=
        document.documentElement.clientHeight
      ) {
        action.lowScore = "second";
        action.lost = true;
      }
      reset(ball);
      reset(rod1);
      reset(rod2);

      window.alert("GG");
      clearInterval(id);

      if (score.first > localStorage.getItem("first")) {
        localStorage.setItem("first", score.first);
      }
      if (score.second > localStorage.getItem("second")) {
        localStorage.setItem("second", score.second);
      }
      score.first = 0;
      score.second = 0;
      show_score();
    } else if (lowerBoundary()) {
      //touched lower bar
      let class_present = ball.classList[0];
      if (class_present == "animate-bottom-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-right");
      } else if (class_present == "animate-bottom-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-left");
      }
    } else if (upperBoundary()) {
      //touched upper bar
      let class_present = ball.classList[0];
      if (class_present == "animate-top-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-right");
      } else if (class_present == "animate-top-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-left");
      }
    }
  }, 1);
}

// current score from storage
function show_score() {
  if (localStorage.getItem("first") == null) {
    localStorage.setItem("first", 0);
    localStorage.setItem("second", 0);
    window.alert("First time, eh?");
  } else {
    window.alert(
      "Rod 1 top score: " +
        localStorage.getItem("first") +
        "\n" +
        "Rod 2 top score: " +
        localStorage.getItem("second")
    );
  }
}

reset(rod1);
reset(rod2);
reset(ball);
show_score();
moveRods();
intervalSet();

document.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    if (action.lost) {
      if (action.lowScore == "first") {
        ball.classList.add("animate-bottom-right");
      } else {
        ball.classList.add("animate-top-right");
      }
    } else ball.classList.add("animate-bottom-right");

    intervalSet();
  }
});
