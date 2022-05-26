var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var cons = require('consolidate');
const req = require("express/lib/request");
const app = express()
app.engine('html', cons.swig)
app.set('view engine', 'html');
app.use(bodyParser.json())
app.use(express.static('views'))
app.use(bodyParser.urlencoded({
    extended:true
}))
mongoose.connect('mongodb://0.0.0.0:27017/Mydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))
app.get('/index', (req, res) => {
    res.render('index.html')
  })
app.get('/signup', (req, res) => {
    res.render('form.html')
  })
  app.get('/about', (req, res) => {
    res.render('about_us.html')
  })
app.post("/signup",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var gender = req.body.gender;
    var sub = req.body.sub;

    var data = {
        "name": name,
        "email" : email,
        "password" : password,
        "gender" : gender,
        'sub' : sub }

    db.collection('customers').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
     });
     return res.redirect('/login')
})

app.get('/login',(req,res)=>{
    res.render('login.html')
})
app.post('/login',(req,res)=>{
    var email1 = req.body.email;
    var password1 = req.body.password;

    db.collection('customers').findOne({'email':email1 , 'password':password1},(err,result)=>{
        if(err){
            throw err;
        }
        if(result){
            res.redirect('/index')
            console.log('log in success')
        }
        else{
            res.redirect('/login')
            console.log('Failed to log in ')
        }
     });
})

console.log("Listening on PORT 8080");
app.listen(8080)