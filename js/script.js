fetch("https://randomuser.me/api/?results=12")
  .then((res) => res.json())
  .then((data) => iteratePeople(data.results))
  .catch((error) => console.error(error));

function iteratePeople(data) {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    getData(data[i], i);
  }
}

function getData(person, index) {
  const name = person.name.first + " " + person.name.last;
  const email = person.email;
  const phone = person.cell;
  const address =
    person.location.street.number + " " + person.location.street.name;
  const city = person.location.city;
  const country = person.location.country;
  const birthday = person.dob.date;
  console.log(index + 1, birthday);
}
