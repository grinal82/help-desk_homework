const http = require("http");
const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");

const app = new Koa();

app.use(cors());
app.use(bodyParser());

const tickets = [];

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

app.use(async (ctx, next) => {
    console.log(ctx.headers);
    await next();
});

app.use(async (ctx) => {
    const { method } = ctx.request.query;

    switch (method) {
        case "allTickets":
            ctx.response.body = tickets.map(({ description, ...rest }) => rest);
            break;
        case "ticketById":
            const { id } = ctx.request.query;
            const ticket = tickets.find((t) => t.id === id);
            if (ticket) {
                ctx.response.body = ticket;
            } else {
                ctx.response.status = 404;
            }
            break;
        case "createTicket":
            const { name, description, status } = ctx.request.body;
            const newTicket = {
                id: generateId(),
                name,
                description,
                status,
                created: Date.now(),
            };
            tickets.push(newTicket);
            ctx.response.body = newTicket;
            break;
        case "checkTicket":
            const { ticketId } = ctx.request.query;
            const { status: newStatus } = ctx.request.body;
            const matchedTicket = tickets.find((t) => t.id === ticketId);
            if (matchedTicket) {
                matchedTicket.status = newStatus; // Convert the string to a boolean
                ctx.response.body = matchedTicket;
            } else {
                ctx.response.status = 404;
            }
            break;
        case "updateTicket":
            const { editTicketId } = ctx.request.query;
            const { name: editName, description: editDescription, status: editStatus } = ctx.request.body;
            const editTicket = tickets.find((t) => t.id === editTicketId);
            if (editTicket) {
                editTicket.name = editName;
                editTicket.description = editDescription;
                editTicket.status = editStatus;
                ctx.response.body = editTicket;
            } else {
                ctx.response.status = 404;
            }
            break;
        case "deleteTicket":
            const { deleteId } = ctx.request.query;
            const deleteIndex = tickets.findIndex((t) => t.id === deleteId);
            if (deleteIndex !== -1) {
                const deletedTicket = tickets.splice(deleteIndex, 1)[0];
                ctx.response.body = deletedTicket;
            } else {
                ctx.response.status = 404;
            }
            return;
        default:
            ctx.response.status = 404;
            break;
    }
});

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Server is listening to port: " + port);
});
