import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use("/api/v1", app);
main.use(bodyParser.json());
// eslint-disable-next-line object-curly-spacing
main.use(bodyParser.urlencoded({ extended: false }));

const db = admin.firestore();
const userCollection = "users";

export const webApi = functions.https.onRequest(main);

interface User {
  nome: string,
  email: string,
  telefone: string,
  id: string
}

// Criar um novo usuario
app.post("/users", async (req, res) => {
  try {
    const user: User = {
      nome: req.body["nome"],
      email: req.body["email"],
      telefone: req.body["telefone"],
      id: req.body["id"],
    };

    const newDoc = await db.collection(userCollection).add(user);
    res.status(201).send(`Criou um novo usuário: ${newDoc.id}`);
  } catch (error) {
    res.status(400).send("O usuário deve conter nome, email, telefone e id!!!");
  }
});

// Obter todos os usuários
app.get("/users", async (req, res) => {
  try {
    const userQuerySnapshot = await db.collection(userCollection).get();
    const users: any[] = [];
    userQuerySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obter um único usuário
app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  db.collection(userCollection)
      .doc(userId)
      .get()
      .then((user) => {
        if (!user.exists) throw new Error("Usuário não encontrado");
        res.status(200).json({id: user.id, data: user.data()});
      })
      .catch((error) => res.status(500).send(error));
});

// Excluir um usuário
app.delete("/users/:userId", (req, res) => {
  db.collection(userCollection)
      .doc(req.params.userId)
      .delete()
      .then(() => res.status(204).send("Usuário excluído com sucesso!"))
      .catch(function(error) {
        res.status(500).send(error);
      });
});

// Atualizar usuário
app.put("/users/:userId", async (req, res) => {
  await db
      .collection(userCollection)
      .doc(req.params.userId)
      .set(req.body, {merge: true})
      .then(() => res.json({id: req.params.userId}))
      .catch((error) => res.status(500).send(error));
});
