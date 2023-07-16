function loadTickets() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:7070/?method=allTickets");
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

function addTicket(shortDescription, fullDescription) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:7070/?method=createTicket");
    xhr.setRequestHeader("Content-Type", "application/json");
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
        name: shortDescription,
        description: fullDescription,
        status: false,
    };

    xhr.send(JSON.stringify(newTicket));
}

function updateTicketStatus(ticketId, isChecked) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "PUT",
        `http://localhost:7070/?method=checkTicket&ticketId=${ticketId}`
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const updatedTicket = JSON.parse(xhr.responseText);
                console.log("Ticket status updated:", updatedTicket);
            } catch (e) {
                console.error(e);
            }
        }
    });

    const updatedTicket = {
        id: ticketId,
        status: isChecked, // Use the updated checkbox state as a boolean
    };

    xhr.send(JSON.stringify(updatedTicket));
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
        checkbox.checked = ticket.status; // Set the checkbox status
        checkbox.dataset.ticketId = ticket.id;
        checkbox.addEventListener("change", () => {
            const ticketId = checkbox.dataset.ticketId;
            const isChecked = checkbox.checked; // Retrieve the updated checkbox state
            console.log(isChecked);
            updateTicketStatus(ticketId, isChecked);
        });
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
        editLink.addEventListener("click", () => {
            openEditModal(ticket);
        });

        const taskItemCancel = document.createElement("div");
        taskItemCancel.classList.add("task__item-cancel");
        const cancelLink = document.createElement("a");
        const cancelIcon = document.createElement("span");
        cancelIcon.classList.add("material-symbols-outlined");
        cancelIcon.textContent = "cancel";
        cancelLink.appendChild(cancelIcon);
        taskItemCancel.appendChild(cancelLink);
        cancelLink.addEventListener("click", () => {
            deleteTicket(ticket.id);
        });

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
    const shortDescriptionInput = document.getElementById("shortDescription");
    const fullDescriptionInput = document.getElementById("fullDescription");
    const editTicketIdInput = document.getElementById("editTicketId");

    modal.style.display = "block";

    // Reset form fields
    shortDescriptionInput.value = "";
    fullDescriptionInput.value = "";
    editTicketIdInput.value = "";
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

function openEditModal(ticket) {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    const shortDescriptionInput = document.getElementById("shortDescription");
    const fullDescriptionInput = document.getElementById("fullDescription");
    const editTicketIdInput = document.getElementById("editTicketId");

    shortDescriptionInput.value = ticket.name;
    fullDescriptionInput.textContent = ticket.description; 
    editTicketIdInput.value = ticket.id;
}

function editTicket(ticketId, shortDescription, fullDescription) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "PUT",
        `http://localhost:7070/?method=updateTicket&editTicketId=${ticketId}`
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const editedTicket = JSON.parse(xhr.responseText);
                console.log("Ticket edited:", editedTicket);
                loadTickets(); // Refresh the ticket list after editing
                closeModal();
            } catch (e) {
                console.error(e);
            }
        }
    });

    const editedTicket = {
        id: ticketId,
        name: shortDescription,
        description: fullDescription,
        status: false,
    };

    xhr.send(JSON.stringify(editedTicket));
}

function deleteTicket(ticketId) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "DELETE",
        `http://localhost:7070/?method=deleteTicket&deleteId=${ticketId}`
    );

    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const deletedTicket = JSON.parse(xhr.responseText);
                console.log("Ticket deleted:", deletedTicket);
                loadTickets(); // Refresh the ticket list after deletion
            } catch (e) {
                console.error(e);
            }
        }
    });
    xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
    const addTicketButton = document.getElementById("addTicketButton");
    const cancelButton = document.getElementById("cancelButton");
    const ticketForm = document.getElementById("ticketForm");

    addTicketButton.addEventListener("click", openModal);
    cancelButton.addEventListener("click", closeModal);
    ticketForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const shortDescriptionInput =
            document.getElementById("shortDescription");
        const fullDescriptionInput = document.getElementById("fullDescription");
        const editTicketIdInput = document.getElementById("editTicketId");

        if (editTicketIdInput.value) {
            // If editTicketIdInput has a value, call editTicket
            const editedTicketId = editTicketIdInput.value;
            editTicket(
                editedTicketId,
                shortDescriptionInput.value,
                fullDescriptionInput.value
            );
        } else {
            // If editTicketIdInput is empty, call addTicket
            addTicket(shortDescriptionInput.value, fullDescriptionInput.value);
        }

        closeModal();
    });

    loadTickets();
});
