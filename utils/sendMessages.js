import sendMessage from "./sendMessage.js";

const sendMessages = async (json, clientVenom, text)=>{
    let errors = {cantidadDeMensajesConError: 0, numerosConError: [], errores:[]};
    let sendedMessagesWithSuccessStatus = 0;
    for (let element = 0; element<json.length; element++){
        const formattedText = text.split(' ').map(x=>{
          if(x.includes('}}')){
            return(`${json[element][x.split('{{')[1].split('}}')[0]]}${x.split('}}')[1]}`)
          }
            else return x
          }).join(' ');
  
          try {
              const sendedMessage = await sendMessage(clientVenom, json[element].Telefono, formattedText)
              sendedMessagesWithSuccessStatus = sendedMessagesWithSuccessStatus + 1
            } catch (error) {
              errors.numerosConError = [...errors.numerosConError, error.to.split('@c.us')[0].split('549')[1]]
              errors.errores = [...errors.errores, {numero:error.to.split('@c.us')[0].split('549')[1], error: error.text === 'The number does not exist'?'El numero es incorrecto o no existe':error.text}]
              errors.cantidadDeMensajesConError = errors.cantidadDeMensajesConError + 1
            }
    }
    return({'Mensajes enviados': sendedMessagesWithSuccessStatus, 'Cantidad de mensajescon error': errors.cantidadDeMensajesConError,'Telefonos con error': errors.numerosConError , 'Errores': errors.errores})

}

export default sendMessages;