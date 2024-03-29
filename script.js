let userCount = 0;
let intervalId = null;

fetch("player_info.txt")
  .then((response) => response.text())
  .then((data) => {
    const rows = data
      .trim()
      .split("\n")
      .map((row) => row.split(","))
      .slice(0, -1);

    const table = document.getElementById("user-table");

    rows.forEach((row) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><img src="${row[1]}" alt="${row[0]}'s Profile Picture">${row[0]}</td>
        <td>${row[3]}</td>
        <td>${row[2]}</td>
        <td></td>
      `;
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

      tr.children[0].addEventListener("click", (event) => {
        navigator.clipboard.writeText(event.target.textContent);
        showMessage(event);
      });
    });
    sortTable(2);

    const tableBody = document.querySelector("#user-table > tbody");
    const rowss = tableBody.getElementsByTagName("tr");

    // Get all names from the table
    const namesInTable = [];
    for (let i = 0; i < rowss.length; i++) {
      const row = rowss[i];
      const nameCell = row.getElementsByTagName("td")[0];
      const name = nameCell.textContent;
      namesInTable.push(name);
    }

    // Check for names in local storage that are not in the table
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!namesInTable.includes(key)) {
        // Name is not in the table, remove it from local storage
        localStorage.removeItem(key);
      }
    }

    for (let i = 0; i < rowss.length; i++) {
      const row = rowss[i];
      const nameCell = row.getElementsByTagName("td")[0];
      const name = nameCell.textContent;
      const newCell = row.getElementsByTagName("td")[3]; // Change index to match new column

      // Retrieve stored value from local storage
      const storedValue = localStorage.getItem(name);
      if (storedValue) {
        // Display stored value inside new cell
        newCell.textContent = storedValue;
      }

      // Make new cell editable when clicked
      newCell.setAttribute("contenteditable", true);

      // Remove the outline when the new cell is focused
      newCell.style.outline = "none";

      // Intercept paste event and only insert plain text
      newCell.addEventListener("paste", (event) => {
        // Prevent default paste behavior
        event.preventDefault();

        // Get text representation of clipboard data
        const text = event.clipboardData.getData("text/plain");

        // Insert text at cursor position
        document.execCommand("insertText", false, text);
      });

      // Save changes to local storage when user finishes editing
      newCell.addEventListener("blur", () => {
        localStorage.setItem(name, newCell.textContent);
      });
    }

    fetch("player_info.txt")
      .then((response) => response.text())
      .then((data) => {
        const lines = data.trim().split("\n");
        const lastLine = lines[lines.length - 1];
        const lastModified = new Date(lastLine);
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

let sortDirection = -1;

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
  typeWriter(`Søk igjennom ${userCount} spillere...`, null);
}, 550);

inputd.addEventListener("click", function () {
  // Clear the interval when the input field is focused
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  this.placeholder = "";
});

inputd.addEventListener("blur", function () {
  this.placeholder = "";
  typeWriter(`Søk igjennom ${userCount} spillere...`, null);
});

function typeWriter(text, callback) {
  let index = 0;
  inputd.placeholder = ""; // Clear the placeholder before starting the animation

  // Clear the previous interval before starting a new one
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    if (index < text.length) {
      inputd.placeholder += text.charAt(index);
      index++;
    } else {
      clearInterval(intervalId);
      intervalId = null; // Reset the interval ID when the animation is done
      if (callback) callback();
    }
  }, 100); // 100ms delay between characters
}