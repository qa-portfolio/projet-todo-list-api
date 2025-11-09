const formulaire = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasks");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if(!title.trim() || title.trim().length == 0) {
    return;
  }

  const res = await fetch("http://localhost:3000/api/v1/createTodo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  });

  if (!res.ok) {
    console.log("erreur !");
  } else {
    console.log("success!");
  }
  afficherTaches();
});

async function afficherTaches() {
  const res = await fetch("http://localhost:3000/api/v1/getTodos");

  const data = await res.json();

  tasksContainer.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const div = document.createElement("div");

    div.innerHTML = `
        <h3>Title: ${data[i].title}</h3>
        ${data[i].description ? `<p>Description: ${data[i].description}</p>` : ''} 
        <p>Status : <strong>${
          data[i].completed ? "Terminé" : "En cours"
        } </strong></p>
        ${
          !data[i].completed
            ? `<button onclick="markAsComplete('${data[i].id}')">Terminer la tache</button>`
            : ""
        }
        ${
          !data[i].completed
            ? `<button onclick="updateTodo('${data[i].id}')">Modifier Todo</button>`
            : ""
        }
        ${
            `<button onclick="deleteTodo('${data[i].id}')">Supprimer Todo</button>`
        }
    `;
    tasksContainer.appendChild(div);
    formulaire.reset();
  }
}

async function markAsComplete(id) {
  const res = await fetch(`http://localhost:3000/api/v1/markTodoAsComplete/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.log("Erreur de mise a jour");
  }
  afficherTaches();
}

async function updateTodo(id) {
  let newTitle;
  let newDescription;

  do{
    newTitle = prompt('Enter a new title');
   } while(newTitle !== null && newTitle === "")

  if(newTitle) {
    newDescription = prompt('Enter new description');
  }

  if(newTitle) {
    const res = await fetch(`http://localhost:3000/api/v1/updateTodo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: newTitle,
            description: newDescription,
        }),
    });

    if (!res.ok) {
        console.log("Erreur de mise a jour");
    }
    afficherTaches();
  }
}

async function deleteTodo(id) {
  const res = await fetch(`http://localhost:3000/api/v1/deleteTodo/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.log("Erreur lors de la suppression");
  }
  afficherTaches();
}

afficherTaches();