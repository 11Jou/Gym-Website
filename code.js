var express = require("express")
var bodyParser = require("body-parser")
const fs = require("fs");
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

app.get('/index', (req, res) => {
    res.render('index.html')
  })
app.get('/signup', (req, res) => {
    res.render('form.html')
  })
app.post("/signup",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var gender = req.body.gender;
    var sub = req.body.sub;
     var data = email.toString() +" "+ password.toString()+" "
     var filename = email.toString()+".txt"
     if(fs.existsSync(filename)){
        console.log('This email is already exist')
        res.redirect('/signup')
     }
     else{
fs.writeFile(filename,data,function(err){
    if(err){
        console.log('Error')
    }
    else {
  
         res.redirect('/login')
        }
})
     }
});
app.get('/login',(req,res)=>{
    res.render('login.html')
})
app.post("/login",(req,res)=>{
     var email = req.body.email;
    var password = req.body.password;

    var data1 = email.toString() +" "+ password.toString()+" "
    var filename1 = email.toString()+".txt"
    fs.readFile(filename1, 'utf8', (err, data) => {
        if (err) {
          console.log("not found");
          res.redirect('/login')
        }
        else{
            if(data1 == data){
                res.redirect('/index')
            }
            else{
                console.log('Wrong Password')
                res.redirect('/login')
            }
        }    
      })
});
console.log("Listening on PORT 3000");
app.listen(3000)