const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');


const uri = "mongodb+srv://axel:gaMbetta19@cluster0.lmvrtes.mongodb.net/?retryWrites=true&w=majority"
const client  = new MongoClient(uri);

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.use((request, response, next) =>{
    console.log(`Requête reçu : ${request.method} ${request.url} ${JSON.stringify(request.body)}`);
    next();
});

client.connect(err =>{
    if(err){
        crossOriginIsolated.log('Erreur à la connexion à la base de donnée')
    } else {
        console.log('Connexion réussie')
    }
});

client.close();

app.post('/utilisateur', (request, response) => {
    const {nom, prenom} = request.body;

    if(!nom || !prenom){
        return response.status(400).json({erreur : "Veuillez fournir un nom et un prénom!"});
    }

    const nouvelUtilisateur ={nom, prenom};
    const collection = client.db("myDb").collection("Utilisateur");

    try{
        const result = collection.insertOne(nouvelUtilisateur);
        console.log(`Utilisateur ajouté avec succès`);
        response.status(201).json(nouvelUtilisateur);
    }
    catch{
        console.error("Erreur lors de l'ajout d'utilisateur", error)
        response.status(500).json({erreur  : `Erreur lors de l'ajout d'utilisateur`})
    }

});

app.delete('/utilisateur/:id', (request, response) =>{

});

app.get('/utilisateur', (request, response) =>{
    const collection = client.db("myDb").collection("Utilisateur");
    collection.find().toArray((err, utilisateurs)=>{
        if(err){
            console.error("Erreur lors de la recherche des utilisateurs", error);
            response.status(500).send("Erreur interne du server");
        } else{
            response.json(utilisateurs);
        }
    });
});

app.listen(port, ()=>{
    console.log(`Serveur en cours d'execution sur le port : ${port}`)
});