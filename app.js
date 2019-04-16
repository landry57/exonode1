//modules
let http = require('http')
let Throw = require('throw')
let express = require('express')
let session = require('express-session')
let cookieParser = require('cookie-parser');
let expressValidator = require('express-validator')
let bodyParser = require('body-parser')
let morgan = require('morgan')('dev')
let mysql = require('mysql')
let io = require('socket.io')


//les variables
let app = express()
let port =8091

const server =  http.createServer(app)



 //middlewares
 app.use(morgan)
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({extended:true}))
 app.use(expressValidator())
 app.use(express.static(__dirname + '/public'));
 app.use(express.static(__dirname+'/views'))
 app.use(express.static(__dirname+'/model'))
 app.use(cookieParser())
 app.use(session({
    key: 'id',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
//connexion db
const db = mysql.createConnection({
    'host':'localhost',
    'database':'exbd',
    'user':'root',
    'password':''
})
db.connect((err)=>{
if(!err)
    console.log('vous etes connecte')
else
    console.log(err.message)

})
//routages
app.set('view engin','twig')

app.get('/',(req,res)=>{
 res.render('index.twig')
})

app.get('/inscription',(req,res)=>{
    res.render('inscription.twig')
})
app.get('/connexion',(req,res)=>{
     if(req.session.email)
     {
        res.redirect('/profil')
     }
    else{
        res.render('connexion.twig')
    }
   // res.render('connexion.twig')
})
app.get('/profil',(req,res)=>{
    if(req.session.email)
     {
        res.render('profil.twig')
     }
    else{
        res.redirect('/connexion')
    }
       // res.render('profil.twig')\

}) 
//post inscription
app.post('/inscription',(req,res)=>{
   // console.log(req.body)
    let data =req.body
    db.connect(function(err) {
        if (!err) console.log( err);
        console.log("Connected!");
       
        req.check('name','le nom ne doit pas être vide').notEmpty(); 
        req.check('lastname','le prenoms ne doit pas être vide').notEmpty(); 
        req.check('email','ce champ doit être un email et ne doit pas être vide').notEmpty().isEmail(); 
        req.check('tel','le téléphone  ne doit pas être vide').notEmpty().isNumeric(); 
        req.check('password','le mot de passe ne doit pas être vide et doit etre numerique').notEmpty(); 
        req.check('repeatpassword','le mot de passe  ne doit pas être vide et doit etre numerique').notEmpty();
        var error = req.validationErrors();
        
       if(error){
           let val=error
            res.render('inscription.twig',{error:val})
          
       }else
       {
           if(req.body.password.length!=6)
           {
            res.render('inscription.twig',{bderror:"le password doit contenir 6 caracteres"})
           }
           else
           {
               if(req.body.password!=req.body.repeatpassword)
               {
                res.render('inscription.twig',{bderror:"je veux des password identique"})
               }
               else
               {
                var records = [
                    [req.body.name,req.body.lastname,req.body.email,req.body.tel,req.body.password]
                ]
            
                db.query("SELECT * FROM user WHERE email=?",[req.body.email] ,(err, result, fields) =>{ 

                    if(result!=""){

                        res.render('inscription.twig',{bderror:"le mail est deja pris"})
                        
                    }
                    else
                    {
                        
                db.query("INSERT INTO user (name, lastname,email,tel,password) VALUES ?", [records],  (err, result, fields)=> {
                    // if any error while executing above query, throw error
                    if (err) 
                    {
                        var erreur= 'pas pris'
                    }else
                    {
                        res.render('inscription.twig',{suc:"Enregistrement effectu2 avec succes"})
                    }
                    
                    });

                }
                });
                 
               }
           }
              
           }
      });

  
   
})
   
   
//post connexion
app.post('/connexion',(req,res)=>{
    //console.log(req.body)
    let data =req.body
    db.connect(function(err) {
        if (!err) console.log( err);
        console.log("Connected!");

        req.check('email','ce champ doit être un email et ne doit pas être vide').notEmpty().isEmail(); 
        req.check('password','le mot de passe ne doit pas être vide ').notEmpty(); 
        var error = req.validationErrors();
        
       if(error){
           let val=error
            res.render('connexion.twig',{error:val})
          
       }else
       {
           if(req.body.password.length!=6)
           {
            res.render('connexion.twig',{bderror:"le password doit contenir 6 caracteres"})
           }
           else
           {
               
                var records = [
                    [req.body.email,req.body.password]
                ]
               
                db.query("SELECT * FROM user WHERE email=? AND password=?",[req.body.email,req.body.password] ,(err, result, fields) =>{ 
                   
                    if(result!=""){
                        var id
                        sess = req.session;
                        req.session.email = req.body.email;
                      
                        //req.session.id =  result.id
                        if(req.session.email)
                        {
                            console.log(result)
                            res.render('profil.twig',{data: result})
                             
                       // res.redirect('/profil')
                        
                        }
                        else
                        {
                           
                            res.render('/connexion')
                        }
                        
                    }
                    else
                    {
                        res.render('connexion.twig',{bderror:req.body.email+ "  n existe pas "})   
                     
                    }
                });
                 
               
           }
              
           }
      });

  
   
})
//deconnexion
app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});





server.listen(port, (err)=>{
    if(!err)
    console.log('server operationnel')
    else
    console.log(err.message)
   
}) 