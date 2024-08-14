const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const connect = require('./database/connection');
const router = require('./router/route');
const bodyParser = require('body-parser');

const app = express();
// middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true, parameterLimit: 100000,limit: '50mb'}));
app.use(bodyParser.json());


const port = 8080;
app.get('/',(req,res)=>{
    res.status(201).json("Home Get request")
})

app.use('/api', router);

connect().then(()=>{
    try{
        app.listen(port,()=>{
            console.log(`server connected to : ${port}`)
        })
    }catch(error){
        console.log("Cannot connect to the server")
    }
}).catch(error => {
    console.log("Invalid Database connection")
})

