const http = require("http");
const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser")

const app = new Koa();

app.use(cors());
app.use(bodyParser())

app.use((ctx, next) => {
    console.log(ctx.headers);

    ctx.response.body = "server response";

    next();
});

const tickets = [];

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

app.use(async (ctx) => {
    const { method } = ctx.request.query;

    switch (method) {
        case "allTickets":
            ctx.response.body = tickets.map(({ description, ...rest }) => rest);
            return;
        case "ticketById":
            const { id } = ctx.request.query;
            const ticket = tickets.find((t) => t.id === id);
            if (ticket) {
                ctx.response.body = ticket;
            } else {
                ctx.response.status = 404;
            }
            return;
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
            return;
        default:
            ctx.response.status = 404;
            return;
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
