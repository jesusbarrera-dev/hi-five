//NPM NODE MODULES
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//DATABASE MODELS
const Schema = mongoose.Schema;

//User
const UserSchema = new Schema({
  name: { type: String, required: true },
  usertype: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Image
const ImageSchema = new mongoose.Schema({
  img: {
    data: Buffer,
    contentType: String
  }
});

const Image = mongoose.model("Image", ImageSchema);

//Product
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: Object
});

const Product = mongoose.model("Product", ProductSchema);

//DB config

mongoose.connect('mongodb+srv://admin-alex:hifive0598@hifive.bwchz.mongodb.net/hifive', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(db => console.log('database connected'))
.catch(err => console.error(err));

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


//static files
app.use('/public', express.static(path.join(__dirname, './public')));
// const app = config(express());

app.use(function (req, res, next) {
  console.log(req.files); // JSON Object
  next();
});

//body parser
app.use(bodyParser.urlencoded({ extended: true }));

//Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/uploads/')
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname + "/public/images/"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png") {

    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg"
      + " or png"), false);
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

// const upload = multer({
//   storage: storage
// });


//Routes

app.get('/', (req, res) => {
  res.render("./layouts/index");
});

app.get('/login', (req, res) => {
  res.render("./layouts/login");
});

app.post('/login',  urlencodedParser, (req, res) =>{
  const correo = req.body.correo;
  const contra = req.body.contra;

  User.findOne({email: correo}, (err, foundUser)=>{
    if(err){
      console.log(err);
    } else{
      if(foundUser){
        console.log("Encontro usuario");
        if(foundUser.password === contra){
          console.log("misma contra");
          res.render("./layouts/index");
        }
      }
    }
  });
});

app.get('/hombre', (req, res) => {
  res.render("./layouts/hombre");
});

app.get('/mujer', (req, res) => {
  res.render("./layouts/mujer");
});

app.get('/admin', (req, res) => {
  res.render("./layouts/admin");
});

app.get('/almacen', (req, res) => {
  res.render("./layouts/almacen");
});

app.get('/carrito', (req, res) => {
  res.render("./layouts/carrito");
});

app.get('/pago', (req, res) => {
  res.render("./layouts/pago");
});

app.get('/compras', (req, res) => {
  res.render("./layouts/compras");
});

app.get('/devolucion', (req, res) => {
  res.render("./layouts/devolucion");
});

app.post('/almacen', upload.single('image'), (req, res) => {
  const myfile = req.files;
  var f = new Image;

  f.img.data = fs.readFileSync(__dirname + "/public/images/" + req.file.originalname);

  f.img.contentType = "image/png";

  const product = new Product({
    name: req.body.product_name,
    description: req.body.product_desc,
    price: req.body.product_price,
    category: req.body.product_category,
    quantity: req.body.product_quantity,
    image: f
  });

  product.save(function (err) {
    if (!err) console.log("producto registrado")
    else if (err) {
      console.log(err);
    }
  });

});


app.listen(app.get('port'), () => {
  console.log('Server started on port', app.get('port'));
});
