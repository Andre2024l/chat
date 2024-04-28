const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) =>{
   const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id
    }, jwtkey, {expiresIn: "3d"} );
}

const registerUser = async(req, res) =>{
    try{
    const {name, email, password} = req.body;
    let user = await userModel.findOne({ email });
    //Verificacao da existencia do user

    if(user) return res.status(400).json("Email já cadastrado");

    if(!name || !email || !password) return res.status(400).json("Os campos são de preenchimento obrigatório<br> Por favor verifique...");

    if(!validator.isEmail(email)) return res.status(400).json("Por favor informe um email válido...");
    
    if(!validator.isStrongPassword(password)) return res.status(400).json("Por favor informe uma senha com pelomenos 8 caracteres, uma letra maiúscula e pelomenos um númeno...");

    user = new userModel({name, email, password});
    
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = createToken(user._id);
    res.status(200).json({_id: user._id, name, email, token});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    try{
        let user = await userModel.findOne({ email });

        if(!user) return res.status(400).json("Email ou Senha incorrecto, por favor verifique...");

        const isVaidPassword = await bcrypt.compare(password, user.password);
        if(!isVaidPassword) return res.status(400).json("Email ou Senha incorrecto, por favor verifique...");

        const token = createToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, email, token});

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const findUser = async(req, res) =>{
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        if(!user) return res.status(400).json("Nenhum usuário encontrado com esse ID...");
        res.status(200).json(user);

    }catch(err){
        console.log(err);
        res.status(500).json(err); 
    }
}

const getUsers = async(req, res) =>{
    try{
        const user = await userModel.find();
        if(!user) return res.status(400).json("Não existem usuários cadastrados....");
        res.status(200).json(user);

    }catch(err){
        console.log(err);
        res.status(500).json(err); 
    }
}
module.exports = {registerUser, loginUser, findUser, getUsers};
