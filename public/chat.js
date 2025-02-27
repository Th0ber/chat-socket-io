const socket = io(`http://localhost:3000/`);

socket.on("update_messages", (message) => {
    updateMessagesOnScreen(message);
});

function updateMessagesOnScreen(messages) {
    console.log(messages);

    const div_messages = document.querySelector("#messages");

    let list_messages = "<ul>";

    messages.forEach(message => {
        list_messages += `<li>${message.name}: ${message.msg}</li>`;
    });

    list_messages += "</ul>";

    div_messages.innerHTML = list_messages;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#message_form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if(!user) {
            alert("Define a user!");
            return
        }

        const messageInput = document.forms["message_form_name"]["msg"];
        const message = messageInput.value.trim();

        if (message) {
            messageInput.value = "";
            socket.emit("new_messages", { user: user, msg: message });
        } else {
            console.log("Empty message not sent");
        }
    });


    const userForm = document.querySelector("#user_form");

    userForm.addEventListener("submit", (e) => {
        e.preventDefault();
        user = document.forms["user_form_name"]["user"].value;
        userForm.parentNode.removeChild(userForm);
    })
})