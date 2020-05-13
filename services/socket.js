module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected");
        // add new socket methods here 
        socket.on("disconnect", () => {
          console.log("Client disconnected");
        });
    });
}