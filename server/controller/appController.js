const UserModel = require('../model/user');
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')
const env = require('../config.js')
const otpGenerator = require('otp-generator')

/* login verify - it's a middleware */
async function verifyUser(req, res, next){
    try{
        const {username} = req.method == "GET" ? req.query : req.body;
        let exists = await UserModel.findOne({username})
        if(!exists) return res.status(404).send({error: "Can't find the User!"})
        next();
    }catch(err){
        return res.status(404).send({error: "Authentication Error"})
    }
}

async function register(req,res){
    try {
        const { username, password, profile, email } = req.body;        

        // check the existing user
        let existUser =  await UserModel.findOne({ username });
        if (existUser) {
            return res.status(400).json({ msg: 'User Name already exists' });
        }

        // check for existing email
        let existEmail =  await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ msg: 'User Email already exists' });
        }

        const user = new UserModel({
                                    username,
                                    password,
                                    profile: profile || '',
                                    email
                                });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save()
            .then(result => res.status(201).send({ msg: "User Register Successfully"}))
            .catch(error => res.status(500).send({error}))

    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
}

function login(req,res){
    const { username, password } = req.body;
    try{
        UserModel.findOne({username})
            .then(user =>{
                bcrypt.compare(password, user.password)
                .then(pwdCheck => {
                    if(!pwdCheck) return res.status(400).send({error: "Don't have Password"})
                    const token = jwt.sign({
                                    userId: user._id,
                                    username: user.username
                                }, env.JWT_SECERT , {expiresIn: '24h'})
                    return res.status(200).send({
                        msg: "Login Successful..!",
                        username: user.username,
                        token
                    })
                })
                .catch(err => {
                    return res.status(400).send({error: "Password does not match"})
                })
            })
            .catch(error => {
                return res.status(400).send({error: "username not found"})
            })
    }catch(error){
        return res.status(500).send(error.message)
    }
}

async function getUser(req,res){
    const { username } = req.params;

    try{
        if(!username) return res.status.send({error: "Invalid username"})

        const user = await UserModel.findOne({username})
        if(!user){
            return res.status(501).send({err: "User not found"})
        } else {
            const {password, ...rest} = Object.assign({},user.toJSON())
            return res.status(200).send(rest)
        }
    }catch(err){
        return res.status(500).send({error: "Cannot find the Users"})
    }
}

async function updateUser(req,res){
    try{
        //const id = req.query._id;
        const {userId} = req.user;
        if(userId){
            const body = req.body;
            UserModel.findByIdAndUpdate({_id: userId}, body)
                .then(user => {
                    return res.json({msg: "Record Updated...!"})
                }).catch(err => res.json(err))
        }else{
            return res.status(401).send({err: "User Not Found...!"})
        }
    }catch(err){
        return res.status(401).send({err})
    }
}

async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets:false, specialChars:false, upperCaseAlphabets:false })
    res.status(201).send({code: req.app.locals.OTP})
}

function verifyOTP(req,res){
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(200).send({msg: "Verify Successfully"})
    }
    return res.status(400).send({error: "Invalid OTP"})
}

function createResetSession(req,res){
    if(req.app.locals.resetSession){
        //req.app.locals.resetSession = false;
        return res.status(201).send({flag: req.app.locals.resetSession})
    }
    return res.status(400).send({error: "Session expired!"})
}

async function resetPassword(req,res){
    try {
        if(!req.app.locals.resetSession){
            return res.status(400).send({error: "Session expired!"})
        }
        const {username, password} = req.body;
        try {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await UserModel.findOne({username})
                .then(user => {

                    UserModel.updateOne({username: user.username}, {password: hashedPassword})
                    user.save()
                        .then(result => res.status(200).send({ msg: "Record Updated...!"}))
                        .catch(error => res.status(500).send({error}))
                    // bcrypt.hash(password, 10)
                    //     .then(hashedPassword => {
                            
                    //     })
                    //     .catch(e => {
                    //         return res.status(500).send({
                    //             err: "Enable to hashed password"
                    //         })
                    //     })
                })
                .catch(err => {
                    return res.status(404).send({err: "Username not found"})
                })
        } catch (error) {
            return res.status(500).send({error})
        }
    } catch (error) {
        return res.status(400).send({error})
    }
}

module.exports = {  
    register, login, getUser,
    updateUser, generateOTP, verifyOTP,
    createResetSession, resetPassword, verifyUser
}