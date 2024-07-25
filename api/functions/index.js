const express = require('express');
const admin = require('firebase-admin')
const functions = require('firebase-functions');
const { v4: uuidv4 } = require('uuid'); // Importar el generador de UUID

const app = express();
admin.initializeApp({
    credential: admin.credential.cert('./credentials.json'),
    databaseURL: ''
})
const db = admin.firestore();
app.use(express.json());

app.get("/hello-word", (req, res) => {
    return res.status(200).json({ message: "hello world" });
});

app.post('/api/tareas', async (req, res) => {
    try{
        const id = req.body.id || uuidv4(); // Generar un ID único si no se proporciona
        await db.collection('tareas').doc(id).set({ // Cambiado a set() para crear o actualizar el documento
            name: req.body.name, 
            description: req.body.description,
            creationDate: req.body.creationDate,
            priority: req.body.priority,
            status: req.body.status
        });
        return res.status(200).json();
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get('/api/tareas/:tarea_id', async (req,res)=>{
    try {
        const doc = db.collection('tareas').doc(req.params.tarea_id);
        const tarea = await doc.get();
        const response = tarea.data();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get('/api/tareas', async (req, res)=>{
    try {
        const query = db.collection('tareas');
        const querySnapshot = await query.get(); // querySnapshot es la respuesta de los datos, un arreglo de todos los datos
        const docs = await querySnapshot.docs;
        const response = docs.map(doc =>({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            creationDate: doc.data().creationDate,
            priority: doc.data().priority,
            status: doc.data().status
        }))
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json();
    }
})


app.delete('/api/tareas/:tarea_id', async(req, res) =>{
    try {
        const document = db.collection('tareas').doc(req.params.tarea_id);
        await document.delete();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
});

app.put('/api/tareas/:tarea_id', async(req,res) =>{
    try {
        const document = db.collection('tareas').doc(req.params.tarea_id);
        await document.update({
            name:req.body.name,
            description:req.body.description,
            creationDate:req.body.creationDate,
            priority:req.body.priority,
            status:req.body.status
        });
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
});
exports.app = functions.https.onRequest(app);
