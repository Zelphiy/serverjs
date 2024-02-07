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
        console.log('Erreur à la connexion à la base de donnée')
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

app.delete('/utilisateur', (request, response) =>{
    const {nom, prenom} = request.body;

    if(!nom || !prenom){
        return response.status(400).json({erreur : `Veuillez fournir un nom et un prénom!`});
    };

    const supprUtilisateur = {nom, prenom};
    const collection = client.db("myDb").collection("Utilisateur");

    try{
        const result = collection.deleteOne(supprUtilisateur);
        console.log(`Utilisateur supprimé avec succès`);
        response.status(201).json(supprUtilisateur)
    }
    catch{
        console.error(`Erreur lors de la suppression`, error)
        response.status(500).json({erreur : `Erreur lors de la suppression d'utilisateur`})
    }
});

// app.delete('/utilisateur/:name',(request,response)=>{
//     const supprUtilisateur = request.params.name;
//     if(!supprUtilisateur){
//         res.status(400).send("Veuillez fournir un nom!");
//     }else{
//         const collection = client.db("myDb").collection("Utilisateur");
//         collection.deleteOne({nom : supprUtilisateur}, (err,resultat)=>{
//             if(err){
//                 response.status(500).send("erreur serveur");
//             }else{
//                 response.status(200).send("utilisateur supprimer ");
//             };
//         });
//     };
// });

app.get(`/utilisateur/:name`, (request, response)=>{
    const getUtilisateur = request.params.name;
    if(!getUtilisateur){
        res.status(400).send("Veuillez fournir un nom!");
    }else{
        const collection = client.db("myDb").collection("Utilisateur");
        collection.find({nom : getUtilisateur}).toArray((err, resultat)=>{
            if(err){
                response.status(500).send(`Erreur serveur`);
            }else{
                response.status(200).json(resultat);
            };
        });
    };
});

app.patch(`/utilisateur/:name`, (request, response)=>{
    const name = request.params.name;
    const {nom, prenom} = request.body;
    const collection = client.db("myDb").collection("Utilisateur");
    const updateUtilisateur = {nom, prenom};

    collection.update({nom: name}, updateUtilisateur, (err, resultat) =>{
        if (err){
            console.log(`Erreur lors de la mise à jour de l'utilisateur`);
            response.status(500).send("Erreur interne du serveur")
        }else{
            response.json(resultat);
            console.log(`Utilisateur mis à jour`);
        }
    });

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