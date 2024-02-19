function sendMessage(client, cellphone, text) {
    return client
      .sendText(`549${cellphone}@c.us`, text)
      
}

export default sendMessage;