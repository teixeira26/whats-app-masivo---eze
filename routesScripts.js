import { Router } from 'express';
import multer from 'multer'
import uploadedCsvToJsonParser from './uploadedCsvToJson.js';
import venom from 'venom-bot';
import sendMessages from './utils/sendMessages.js';

const routesScripts = Router();
const upload = multer({ dest: 'uploads/' });


let clientVenom;

venom
  .create({
    session: 'session-name' //name of session
  })
  .then((client) =>{
     clientVenom = client;
    })
  .catch((error) => {
    console.log(error);
  });



routesScripts.get('/', async (req, res)=>{
    try {
        const file = await new Promise((resolve, reject) => {
          upload.single('archive')(req, res, function (err) {
            if (err) {
              reject(new Error('Error: Has cargado varios archivos simultáneamente; por favor, carga únicamente un archivo a la vez.'));
            }
           resolve(req.file)
          })});

        if(req.file.mimetype !== 'text/csv')  throw new Error('Error: La estructura del archivo no es válida; por favor, asegúrate de cargar un archivo CSV.')
        const jsonWithMessages = await uploadedCsvToJsonParser(file.path);
      console.log(jsonWithMessages)
        if( jsonWithMessages === 'error') throw new Error(`Error: La ultima columna del archivo debe tener 'Texto' como nombre.`);
        if(!jsonWithMessages[0].Telefono || !jsonWithMessages[0].Texto) throw new Error('Error: Has proporcionado un archivo con un formato incorrecto; el archivo CSV cargado debe contener columnas tituladas "Telefono" y "Texto" para garantizar el correcto funcionamiento del sistema.')
        let text = jsonWithMessages[0].Texto


        const messages = await sendMessages(jsonWithMessages, clientVenom, text);
      

        res.send(messages);

    } catch (error) {
        res.status(400).send(error.message);
      }
})


export default routesScripts;
