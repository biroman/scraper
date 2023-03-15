let userCount = 0;

fetch("https://raw.githubusercontent.com/biroman/scraper/main/player_info.txt")
  .then((response) => response.text())
  .then((data) => {
    const rows = data.split("\n").map((row) => row.split(","));

    const table = document.getElementById("user-table");

    rows.forEach((row) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><img src="${row[1]}" alt="${row[0]}'s Profile Picture">${row[0]}</td>
        <td>${row[3]}</td>
        <td>${row[2]}</td>
      `;
      //   <td>${row[4]}</td>
      //   <td>${row[5]}</td>
      //   <td>${row[6]}</td>
      //   <td>${row[7]}</td>

      if (row[0] !== "") {
        userCount++;
        table.querySelector("tbody").appendChild(tr);
      }
      tr.children[0].style.color = "white";
      tr.children[0].style.fontSize = "14px";

      if (tr.children[2].textContent === " Gudfar") {
        tr.children[2].style.color = "rgb(97, 172, 255)";
      } else if (tr.children[2].textContent === " Capo Crimini") {
        tr.children[2].style.color = "rgb(162, 99, 215)";
      } else if (tr.children[2].textContent === " Capo de tutti Capi") {
        tr.children[2].style.color = "rgb(255, 165, 0, 1)";
      } else if (tr.children[2].textContent === " Boss") {
        tr.children[2].style.color = "#1db32e";
      }

      tr.addEventListener("click", (event) => {
        navigator.clipboard.writeText(row[0]);
        showMessage(event);
      });
    });
    fetch("https://api.github.com/repos/biroman/scraper/commits?path=player_info.txt")
      .then((response) => response.json())
      .then((data) => {
        const lastModified = new Date(data[0].commit.committer.date);
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        const lastModifiedDate = lastModified.toLocaleDateString("nb-NO", options);
        const lastModifiedTime = `${lastModified.getHours()}:${lastModified.getMinutes().toString().padStart(2, "0")}:${lastModified.getSeconds().toString().padStart(2, "0")}`;
        const div = document.createElement("div");
        div.classList.add("updated");
        div.innerText = `${lastModifiedDate} ${lastModifiedTime}`;
        document.querySelector("#user-table").appendChild(div);
      });
  });

function showMessage(event) {
  const existingMessage = document.querySelector(".message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const message = document.createElement("div");
  message.classList.add("message");
  message.innerText = "Brukernavn kopiert";

  const rowRect = event.target.closest("tr").getBoundingClientRect();

  message.style.position = "absolute";

  message.style.color = "#00ff8d";
  message.style.userSelect = "none";
  message.style.backgroundColor = "rgba(255,255,255,.1)";
  message.style.borderRadius = "5px";
  message.style.padding = "5px";
  message.style.marginTop = "15px";
  message.style.marginright = "5px";
  message.style.pointerEvents = "none";

  message.style.transitionProperty = "opacity, left, top";
  message.style.transitionDuration = "0.3s";
  message.style.transitionTimingFunction = "ease-in-out";

  document.body.appendChild(message);

  const leftEdgeOfScreen = document.documentElement.getBoundingClientRect().left;
  message.style.left = leftEdgeOfScreen - (message.offsetWidth + rowRect.width) + "px";
  message.style.top = rowRect.top + window.scrollY + "px";

  message.style.left = rowRect.left - message.offsetWidth - 10 + "px";
  setTimeout(() => {
    const leftEdgeOfScreen = document.documentElement.getBoundingClientRect().left;
    message.style.left = leftEdgeOfScreen - (message.offsetWidth + rowRect.width) + "px";
  }, 2000);
}

let sortDirection = 1;

const ascendingIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path fill="none" d="M0 0H24V24H0z"/><path d="M19 3l4 5h-3v12h-2V8h-3l4-5zm-5 15v2H3v-2h11zm0-7v2H3v-2h11zm-2-7v2H3V4h9z"fill="rgba(255,255,255,1)"/></svg>';
const descendingIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path fill="none" d="M0 0H24V24H0z"/><path d="M20 4v12h3l-4 5-4-5h3V4h2zm-8 14v2H3v-2h9zm2-7v2H3v-2h11zm0-7v2H3V4h11z"fill="rgba(255,255,255,1)"/></svg>';

const nameTh = document.querySelector("#th > th:nth-child(1)");
nameTh.addEventListener("click", () => {
  sortTable(0);
  nameTh.innerHTML = "SPILLER " + (sortDirection === -1 ? ascendingIcon : descendingIcon);
});

const statusTh = document.querySelector("#th > th:nth-child(2)");
statusTh.addEventListener("click", () => {
  sortTable(1);
  statusTh.innerHTML = "STATUS " + (sortDirection === -1 ? ascendingIcon : descendingIcon);
});

const rankTh = document.querySelector("#th > th:nth-child(3)");
rankTh.addEventListener("click", () => {
  sortTable(2);
  rankTh.innerHTML = "RANK " + (sortDirection === -1 ? ascendingIcon : descendingIcon);
});

const ranks = [" Ingen", " Kriminell", " Associate", " Amico", " Button", " Sgarrista", " Caporegime", " Enforcer", " Capo", " Contabile", " Capo Bastone", " Consigliere", " Boss", " Gudfar", " Capo Crimini", " Capo de tutti Capi"];

function sortTable(column) {
  const table = document.querySelector("#user-table > tbody");
  const rows = Array.from(table.querySelectorAll("tr")).slice(0);
  rows.sort((a, b) => {
    const aValue = a.cells[column].textContent;
    const bValue = b.cells[column].textContent;
    if (column === 2) {
      return (ranks.indexOf(aValue) - ranks.indexOf(bValue)) * sortDirection;
    } else if (column === 1) {
      if (aValue === "Inaktiv" && bValue === "Pålogget siste uke") return -sortDirection;
      if (aValue === "Pålogget siste uke" && bValue === "Inaktiv") return sortDirection;
      return aValue.localeCompare(bValue) * sortDirection;
    } else {
      return aValue.localeCompare(bValue) * sortDirection;
    }
  });
  rows.forEach((row) => table.appendChild(row));
  sortDirection *= -1;
}

var input = document.querySelector("body > div > div > input");

input.addEventListener("keyup", function () {
  var filter = input.value.toUpperCase();

  var tableBody = document.querySelector("#user-table > tbody");

  var rows = tableBody.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var name = row.getElementsByTagName("td")[0];
    if (name) {
      var text = name.textContent || name.innerText;
      if (text.toUpperCase().indexOf(filter) > -1) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  }
});

const inputd = document.querySelector("body > div > div > input");

setTimeout(() => {
  inputd.placeholder = `Søk igjennom ${userCount} spillere...`;
}, 100);

input.addEventListener("click", function () {
  this.placeholder = "";
});
input.addEventListener("blur", function () {
  this.placeholder = `Søk igjennom ${userCount} spillere...`;
});
