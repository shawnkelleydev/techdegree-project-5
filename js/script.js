fetch("https://randomuser.me/api/?results=12")
  .then((res) => res.json())
  .then((data) => console.log(data.results))
  .catch((error) => console.error(error));
