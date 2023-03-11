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
        table.querySelector("tbody").appendChild(tr);
      }
      tr.children[0].style.color = "white";
      tr.children[0].style.fontSize = "14px";
      // Add these lines
      if (tr.children[2].textContent === " Gudfar") {
        tr.children[2].style.color = "rgb(97, 172, 255)";
      } else if (tr.children[2].textContent === " Capo Crimini") {
        tr.children[2].style.color = "rgb(162, 99, 215)";
      } else if (tr.children[2].textContent === " Capo de tutti Capi") {
        tr.children[2].style.color = "rgb(255, 165, 0, 1)";
      }

      tr.addEventListener("click", (event) => {
        navigator.clipboard.writeText(row[0]);
        showMessage(event);
      });
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

  // Add transition properties for top and left
  message.style.transitionProperty = "opacity, left, top";
  message.style.transitionDuration = "0.3s";
  message.style.transitionTimingFunction = "ease-in-out";

  document.body.appendChild(message);

  // Set initial position off-screen
  const leftEdgeOfScreen = document.documentElement.getBoundingClientRect().left;
  message.style.left = leftEdgeOfScreen - (message.offsetWidth + rowRect.width) + "px";
  message.style.top = rowRect.top + window.scrollY + "px";

  message.style.left = rowRect.left - message.offsetWidth - 10 + "px";
  setTimeout(() => {
    // Slide out to left
    const leftEdgeOfScreen = document.documentElement.getBoundingClientRect().left;
    message.style.left = leftEdgeOfScreen - (message.offsetWidth + rowRect.width) + "px";
    setTimeout(() => {
      document.body.removeChild(message);
    }, 2000);
  }, 2000);
}
