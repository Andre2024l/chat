const chatModel = require("../models/chatModel");

const createChat = async(req, res) =>{
    const {firstId, secondId} = req.body

    try{
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]} //all: funcao do mongoDB
        });

        if(chat) return res.status(200).json(chat);
        const newChat = new chatModel({
            members: [firstId, secondId]
        });
        const response = await newChat.save();
        res.status(200).json(response);

    }catch(err){
        consele.log(err);
        res.status(500).json(err);
    }
};

const findUserChats = async(req, res) => {
    const userId = req.params.userId;

    try{
        const chats = await chatModel.find({
            members: {$in: [userId]} // IN palavra reservada do mongoDB   
        });
        res.status(200).json(chats);

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const findChat = async(req, res) => {
    const {firstId, secondId } = req.params;

    try{
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]} // IN palavra reservada do mongoDB   
        });
        res.status(200).json(chat);

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {createChat, findUserChats, findChat}
//Controlador responsavel por guardar os apis de criar conversa, e buscar, incluindo informacao dos utlizadores