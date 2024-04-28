const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");



const app = express();
require("dotenv").config()

app.use(express.json()); 
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    res.send("Bem vindo a nossa aplicação de Conversas")
}); //Primeiro parametro local,


const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URL;

app.listen(port, (req,res) =>{
    console.log(`Servidor web Js correndo na porta: ${port}`)
});

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("Conexao com a base de dado efectuada com ucesso"))
.catch((error) => console.log("Falha ao estabelecer a conexão com a base de dados: ",error.message));

