const express = require("express");
const app = express();
const path = require("path");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./Message");

mongoose.connect("mongodb://localhost:27017/")
.then(() => console.log("Connected to MongoDB!"));

let storedResult;

let getMessages = async function getMessages() {
    try {
        const messages = await Message.find({}, "name msg -_id");
        return messages;
    } catch (error) {
        console.log("Error at search messages:", error);
        return { error: "Error at search messages" };
    }
}

app.use("/", express.static(path.join(__dirname, "public")));

const server = app.listen(3000, () => {
    console.log("Server Running");
})

const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("New Connection");

    getMessages().then(messages => {
        storedResult = messages;
    });
    socket.emit("update_messages", storedResult);

    socket.on("new_messages", (data) => {
        const message = new Message({
            name: data.user,
            msg: data.msg
        });
        message.save().then(() => {
            console.log("Message saved in the database!");

            getMessages().then(messages => {
                storedResult = messages;
                io.emit("update_messages", storedResult);
            })

            .catch(error => {
                console.error("Error at search messages:", error);
            });
        })
        .catch(error => {
            console.error("Error at save messages:", error);
        });
    });
})