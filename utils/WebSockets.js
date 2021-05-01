class WebSockets {
  connection(client) {
    // event fired when the chat room is disconnected
    client.on('disconnect', () => {
      console.log(client.id);
      console.log('disconnect');
      // this.users = this.users.filter((user) => user.socketId !== client.id);
    });
  }
}

module.exports = new WebSockets();
