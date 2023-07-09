function loadTickets() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "localhost:7070/?method=allTickets");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const tickets = JSON.parse(xhr.responseText);
                displayTickets(tickets);
            } catch (e) {
                console.error(e);
            }
        }
    });
    xhr.send();
}

function displayTickets(tickets) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tickets.forEach((ticket) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("tasks__item");

        const checkboxLabel = document.createElement("label");
        checkboxLabel.classList.add("container");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkmark);

        const taskItemMessage = document.createElement("div");
        taskItemMessage.classList.add("task__item-message");
        const shortDescription = document.createElement("p");
        shortDescription.textContent = ticket.name;
        taskItemMessage.appendChild(shortDescription);

        const dateTime = document.createElement("div");
        dateTime.classList.add("date-time");
        const date = new Date(ticket.created);
        dateTime.textContent = date.toLocaleString();

        const taskItemEdit = document.createElement("div");
        taskItemEdit.classList.add("task__item-edit");
        const editLink = document.createElement("a");
        const editIcon = document.createElement("span");
        editIcon.classList.add("material-symbols-outlined");
        editIcon.textContent = "draft_orders";
        editLink.appendChild(editIcon);
        taskItemEdit.appendChild(editLink);

        const taskItemCancel = document.createElement("div");
        taskItemCancel.classList.add("task__item-cancel");
        const cancelLink = document.createElement("a");
        const cancelIcon = document.createElement("span");
        cancelIcon.classList.add("material-symbols-outlined");
        cancelIcon.textContent = "cancel";
        cancelLink.appendChild(cancelIcon);
        taskItemCancel.appendChild(cancelLink);

        taskItem.appendChild(checkboxLabel);
        taskItem.appendChild(taskItemMessage);
        taskItem.appendChild(dateTime);
        taskItem.appendChild(taskItemEdit);
        taskItem.appendChild(taskItemCancel);

        taskList.appendChild(taskItem);
    });
}

function openModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

function addTicket(event) {
    event.preventDefault();

    const shortDescriptionInput = document.getElementById("shortDescription");
    const fullDescriptionInput = document.getElementById("fullDescription");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "localhost:7070/?method=createTicket");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const ticket = JSON.parse(xhr.responseText);
                loadTickets();
                closeModal();
            } catch (e) {
                console.error(e);
            }
        }
    });

    const newTicket = {
        name: shortDescriptionInput.value,
        description: fullDescriptionInput.value,
        status: false,
    };

    xhr.send(JSON.stringify(newTicket));
}

document.addEventListener("DOMContentLoaded", () => {
    const addTicketButton = document.getElementById("addTicketButton");
    const cancelButton = document.getElementById("cancelButton");
    const ticketForm = document.getElementById("ticketForm");

    addTicketButton.addEventListener("click", openModal);
    cancelButton.addEventListener("click", closeModal);
    ticketForm.addEventListener("submit", addTicket);

    loadTickets();
});
