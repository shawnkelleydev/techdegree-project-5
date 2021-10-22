const gallery = document.querySelector("#gallery");
const modalDiv = document.querySelector("#modal-div");

fetch("https://randomuser.me/api/?nat=us&results=12")
  .then((res) => res.json())
  .then((data) => handlePeople(data.results))
  .catch((error) => console.error(error));

/* ===================

    FETCH CALLBACK

==================== */

function handlePeople(data) {
  const people = makePeopleObjects(data);
  writeGalleryHTML(people);
  displayModals(people);
  search(people);
}

/* ===================

    OBJECT BUILDER

==================== */

function makePeopleObjects(data) {
  let people = [];
  for (let i = 0; i < data.length; i++) {
    let person = data[i];
    const name = person.name.first + " " + person.name.last;
    const email = person.email;
    const phone = fixPhone(person.cell);
    const address =
      person.location.street.number + " " + person.location.street.name;
    const city = person.location.city;
    const state = person.location.state;
    const country = person.location.country;
    const postcode = person.location.postcode;
    const birthday = fixDOB(person.dob.date);

    const picture = person.picture.large;
    person = {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      postcode,
      birthday,
      picture,
    };
    people.push(person);
  }
  return people;
}

function fixDOB(dob) {
  dob = dob.split("T")[0];
  dob = dob.split("-");
  dob = dob[1] + "/" + dob[2] + "/" + dob[0];
  return dob;
}

function fixPhone(n) {
  n = n.split("-");
  n = n[0] + " " + n[1] + "-" + n[2];
  return n;
}

/* ===========

    GALLERY

============ */

//writes gallery and dynamically assigns numbers to each person object
//this is important for modal navigation

function writeGalleryHTML(people) {
  gallery.innerHTML = ``;
  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    person["n"] = i; //dynamically numbers objects
    const html = `
      <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.picture}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.city}, ${person.state}</p>
        </div>
      </div>
    `;

    gallery.insertAdjacentHTML("beforeend", html);
  }
}

/* ===========

    MODALS

============ */

//adds event listeners to each card
function displayModals(people) {
  const cards = gallery.children;
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", () => {
      writeModal(people[i], people);
    });
  }
}

//writes html
function writeModal(person, people) {
  const html = `
    <div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${person.picture}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${person.name}</h3>
              <p class="modal-text">${person.email}</p>
              <p class="modal-text cap">${person.city}</p>
              <hr>
              <p class="modal-text">${person.phone}</p>
              <p class="modal-text">${person.address} ${person.city}, ${person.state} ${person.postcode}</p>
              <p class="modal-text">Birthday: ${person.birthday}</p>
          </div>
      </div>

      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>
  `;
  modalDiv.innerHTML = html;
  const close = document.querySelector("#modal-close-btn");
  closeModal(close); //adds close window functionality

  const last = document.querySelector("#modal-prev");
  const next = document.querySelector("#modal-next");
  switchModal(last, next, person, people);
}

//close modal
function closeModal(btn) {
  btn.addEventListener("click", () => (modalDiv.innerHTML = ``));
}

//previous / next buttons
function switchModal(prev, next, person, people) {
  const id = person.n;
  if (id > 0) {
    prev.addEventListener("click", () => {
      writeModal(people[id - 1], people);
    });
  }
  if (id < people.length - 1) {
    next.addEventListener("click", () => {
      writeModal(people[id + 1], people);
    });
  }
}

/* ===========

    SEARCH

============ */

//parent function
function search(people) {
  writeSearchHTML();
  queryPeople(people);
}

//writes searchbox html
function writeSearchHTML() {
  const searchHTML = `
  <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;
  const searchDiv = document.querySelector(".search-container");
  searchDiv.innerHTML = searchHTML;
}

//adds input listener
function queryPeople(people) {
  const searchField = document.querySelector("#search-input");
  searchField.addEventListener("input", () => {
    const input = searchField.value;
    filterGallery(input, people);
  });
}

//input call back / rewrites gallery html
function filterGallery(input, people) {
  let newArr = [];
  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    const name = person.name.toLowerCase();
    if (name.includes(input.toLowerCase())) {
      newArr.push(person);
    }
  }
  //love these callbacks
  writeGalleryHTML(newArr);
  displayModals(newArr);
}

/* =================

    CUSTOM STYLES

================== */

const body = document.querySelector("body");
body.style.backgroundColor = "rgb(30,50,80)";

const h1 = document.querySelector("h1");
h1.style.color = "white";

/* ==================

    ESC LISTENER

=================== */

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "Escape") {
    modalDiv.innerHTML = ``;
  }
});
