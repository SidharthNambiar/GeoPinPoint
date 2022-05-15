const mapSelect = document.querySelector("#mapSelect");
const maps = document.querySelectorAll(".maps");
const locationLabel = document.querySelector("#location");
const gameStatus = document.querySelector("#status");
const reset = document.querySelector("#reset");
const hint = document.querySelector("#hint");
const cheat = document.querySelector("#cheat");
const body = document.querySelector("body");
const hintBeacon = document.createElement("span");
const modal = document.querySelector(".modal");

let allLocations = [];
let clickedLocation = null;
let chosenLocationIdx = null;
let locationToSelect = null;
let count = null;
let clickedLocations = [];
let mapSelected = "usa";
let toggle = 1;
let map = document.querySelectorAll(`#${mapSelected} path`);
let hintLocation = null;

gameStatus.style.display = "none";

reset.disabled = true;
hint.disabled = true;
cheat.disabled = true;
let timerCnt = 5;
let timerIntervalId = null;
let timeoutId = null

// Get ms left to timeout

hint.addEventListener("click", (e) => {
  hint.disabled = true;

  for (let location of map) {
    if (locationToSelect === location.dataset.name) {
      hintLocation = location.getBoundingClientRect();

      hintBeacon.style.left = hintLocation.left + "px";
      hintBeacon.style.right = hintLocation.right + "px";
      hintBeacon.style.top = hintLocation.top + "px";
      hintBeacon.style.bottom = hintLocation.bottom + "px";
      hintBeacon.style.x = hintLocation.x + "px";
      hintBeacon.style.y = hintLocation.y + "px";
      hintBeacon.classList.add("beacon");

      // location.style.fill = "#ffe08a";
      gameStatus.style.display = "";
      gameStatus.classList.value = "notification is-link";
      gameStatus.textContent = `HINT COUNTDOWN: ${timerCnt}`;
      timerCnt--;
      toggle = 0;

      body.append(hintBeacon);

      timeoutId = setTimeout(() => {
        hint.disabled = false;
        hintBeacon.classList.remove("beacon");
        hintLocation = "";
        hintBeacon.style.left = "";
        hintBeacon.style.right = "";
        hintBeacon.style.top = "";
        hintBeacon.style.bottom = "";
        hintBeacon.style.x = "";
        hintBeacon.style.y = "";

        gameStatus.style.display = "none";
        clearInterval(timerIntervalId);
        timerCnt = 5;
        toggle = 1;
      }, 5000);

     

      timerIntervalId = setInterval(() => {
        gameStatus.style.display = "";
        gameStatus.classList.value = "notification is-link";
        gameStatus.textContent = `HINT COUNTDOWN: ${timerCnt}`;
        timerCnt--;
      }, 1000);
    }
  }
});

mapSelect.addEventListener("change", (e) => {
  reset.disabled = false;
  hint.disabled = false;
  cheat.disabled = false;
  locationLabel.textContent = "";
  mapSelected = mapSelect.value;
  mapSelect.disabled = true;

  //Only display the selected map; hide the others
  for (let map of maps) {
    if (map.id !== mapSelected) {
      map.hidden = true;
    } else {
      map.hidden = false;
    }
  }

  // Given the large size of the world, in order to display it completely, bulma is-flex is used
  if (mapSelected === "world") {
    const div = document.querySelector("#world");
    div.classList.add("is-flex");
  }

  // querying all the paths(locations) within the selected map
  map = document.querySelectorAll(`#${mapSelected} path`);

  // extracting the names of all the locations and putting them in a an array called allLocations
  allLocations = [];
  for (let location of map) {
    allLocations.push(location.dataset.name);
    location.style.fill = "white";
    location.classList.add("js-modal-trigger");
    // location.setAttribute("data-target","modal-js-example")
  }

  clickedLocation = null;
  chosenLocationIdx = Math.floor(Math.random() * allLocations.length - 1);
  locationToSelect = allLocations[chosenLocationIdx];

  locationLabel.textContent = locationToSelect.toUpperCase();
  hint.textContent = "LOCATE " + locationToSelect.toUpperCase();

  gameStatus.style.display = "none";

  locationLabel.style.color = "dark-grey";
  count = allLocations.length;

  for (let location of map) {
    location.addEventListener("click", (e) => {
      e.stopPropagation();

      clickedLocation = location.dataset.name;

      if (clickedLocation === locationToSelect) {
        hintBeacon.classList.remove("beacon");
        clearInterval(timerIntervalId)
        clearTimeout(timeoutId)
        hint.disabled = false;
        timerCnt = 5;
        hintLocation = "";
        hintBeacon.style.left = "";
        hintBeacon.style.right = "";
        hintBeacon.style.top = "";
        hintBeacon.style.bottom = "";
        hintBeacon.style.x = "";
        hintBeacon.style.y = "";
        toggle = 1;
        gameStatus.style.display = "none";
        if (clickedLocations.length !== 0) {
          for (let location of clickedLocations) {
            if (location.style.fill === "rgb(255, 224, 138)") {
              location.style.fill = "white";
            }
          }
          clickedLocations = [];
        }
        location.style.fill = "mediumseagreen";
        count = count - 1;

        if (count === 0) {
          modal.classList.add("is-active");
          // hint.disabled && cheat.disabled;
          hint.disabled = true;
          cheat.disabled = true;
          locationLabel.textContent = "";
          gameStatus.style.display = "none";

          // gameStatus.classList.value = "notification is-success";
          // gameStatus.textContent =
          //   "Great Job! You found all locations! Click on RESET to select another map.";
        } else {
          allLocations.splice(chosenLocationIdx, 1);
          chosenLocationIdx = Math.floor(Math.random() * count);
          locationToSelect = allLocations[chosenLocationIdx];
          locationLabel.textContent = locationToSelect.toUpperCase();
          hint.textContent = "LOCATE " + locationToSelect.toUpperCase();
        }
      } else {
        if (location.style.fill !== "mediumseagreen") {
          location.style.fill = "#ffe08a";
          gameStatus.style.display = "";
          gameStatus.classList.value = "notification is-warning";
          gameStatus.textContent = `Incorrect! You selected ${location.dataset.name.toUpperCase()}. Try Again`;
          clickedLocations.push(location);
        }
      }
    });
  }
});

let keyCount = 0;
body.addEventListener("keyup", (e) => {
  if (
    e.key === "h" &&
    !Object.values(modal.classList).includes("is-active") &&
    !cheat.disabled &&
    !hint.disabled
  ) {
    keyCount++;
  } else {
    keyCount = 0;
  }

  if (keyCount === 5 && !hint.disabled) {
    keyCount = 0;
    hint.disabled = true;
    cheat.disabled = true;
    clearInterval(timerIntervalId);
    // clearTimeout(timeoutId)
    timerCnt = 5;

    while (count !== 0) {
      for (let location of map) {
        if (location.dataset.name === locationToSelect) {
          location.style.fill = "mediumseagreen";
        }
      }
      count = count - 1;
      allLocations.splice(allLocations.indexOf(locationToSelect), 1);
      chosenLocationIdx = Math.floor(Math.random() * count);
      locationToSelect = allLocations[chosenLocationIdx];
      if (count !== 0)
        locationLabel.textContent = locationToSelect.toUpperCase();
      // hint.textContent = "LOCATE " + locationToSelect.toUpperCase();
    }
    modal.classList.add("is-active");

    locationLabel.textContent = "";
    gameStatus.style.display = "none";
    // gameStatus.classList.value = "notification is-success";
    // gameStatus.textContent = "Great Job! You found all locations!";
  }
});

body.addEventListener("click", (e) => {
  if (Object.values(modal.classList).includes("is-active")) {
    modal.classList.remove("is-active");
  }
});

cheat.addEventListener("click", (e) => {
  e.stopPropagation();
  gameStatus.style.display = "none";
  clearInterval(timerIntervalId)
  clearTimeout(timeoutId)
  hint.disabled = false;
  timerCnt = 5;

  count = count - 1;
  for (let location of map) {
    if (location.dataset.name === locationToSelect) {
      location.style.fill = "mediumseagreen";
    }
    if (location.style.fill === "rgb(255, 224, 138)") {
      location.style.fill = "white";
    }
  }

  if (count === 0) {
    cheat.disabled = true;
    hint.disabled = true;
    locationLabel.textContent = "";
    gameStatus.style.display = "none";
    modal.classList.add("is-active");
    // gameStatus.classList.value = "notification is-success";
    // gameStatus.textContent = "Great Job Cheating! You found all locations!";
    
  } else {
    allLocations.splice(allLocations.indexOf(locationToSelect), 1);
    chosenLocationIdx = Math.floor(Math.random() * count);
    locationToSelect = allLocations[chosenLocationIdx];
    if (count !== 0) {
      locationLabel.textContent = locationToSelect.toUpperCase();
      hint.textContent = "LOCATE " + locationToSelect.toUpperCase();
    }
  }

  if (!toggle) {
    hintBeacon.classList.remove("beacon");
    hintLocation = "";
    hintBeacon.style.left = "";
    hintBeacon.style.right = "";
    hintBeacon.style.top = "";
    hintBeacon.style.bottom = "";
    hintBeacon.style.x = "";
    hintBeacon.style.y = "";
    toggle = 1;
  }
});

reset.addEventListener("click", (e) => {
  allLocations = allLocations.slice();
  clickedLocation = null;
  clickedLocations = [];

  locationLabel.textContent = "";
  gameStatus.textContent = "";
  gameStatus.style.display = "none";

  for (let location of map) {
    location.style.fill = "white";
  }
  mapSelect.disabled = false;
  for (let map of maps) {
    map.hidden = true;
  }
  reset.disabled = true;
  hint.disabled = true;
  cheat.disabled = true;
  mapSelect.value = "";

  if (mapSelected === "world") {
    const div = document.querySelector("#world");
    div.classList.remove("is-flex");
  }
  hintBeacon.classList.remove("beacon");
  hintLocation = "";
  hintBeacon.style.left = "";
  hintBeacon.style.right = "";
  hintBeacon.style.top = "";
  hintBeacon.style.bottom = "";
  hintBeacon.style.x = "";
  hintBeacon.style.y = "";

  hintBeacon.remove();
});
