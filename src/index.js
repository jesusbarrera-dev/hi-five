//NPM NODE MODULES
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const fs = require('fs');

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//DB config

mongoose.connect('mongodb+srv://admin-alex:hifive0598@hifive.bwchz.mongodb.net/hifive', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(db => console.log('database connected'))
.catch(err => console.error(err));

autoIncrement.initialize(mongoose.connection);

//DATABASE MODELS
const Schema = mongoose.Schema;

//User
const UserSchema = new Schema({
  name: { type: String, required: true },
  usertype: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.plugin(autoIncrement.plugin, 'User');

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
  _id: {type: Number, required:true},
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: Object
});

ProductSchema.plugin(autoIncrement.plugin, 'Product');

const Product = mongoose.model("Product", ProductSchema);

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


//static files
app.use('/public', express.static(path.join(__dirname, './public')));
// const app = config(express());

app.use(function (req, res, next) {
  // console.log(req.files); // JSON Object
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
      if(foundUser && foundUser.password === contra){
        if(foundUser.usertype === "c"){//si el usuario es tipo cliente.
          res.redirect("/index");
        } else if(foundUser.usertype === "a"){//si el usuario es tipo admin.
          res.redirect("/almacen");
        }
      }
    }
  });
});

app.post("/modificarp", urlencodedParser, async (req, res) => {
  // const id = req.body.product_id;

  // const name = req.body.product_name;
  // const description = req.body.product_desc;
  // const price = req.body.product_price;
  // const category = req.body.product_category;
  // const quantity = req.body.product_quantity;

  // console.log("*****NOMBRE: " + name + "********ID:" +id);

  try {
    await Product.findOneAndUpdate({_id: req.body.product_id},{
      name: req.body.product_name,
      description: req.body.product_desc,
      price: req.body.product_price,
      category: req.body.product_category,
      quantity: req.body.product_quantity
    });
    res.redirect("/mostrarp");
    
  } catch (error) {
    console.log(error);
  }

});

app.post('/buscarp', urlencodedParser, (req, res) => {
  const id = req.body.product_id;

  Product.findOne({_id: id}, (err, foundProduct) =>{
    if(err){
      console.log(err);
    } else{
      if(foundProduct){
        res.render("./layouts/buscarp", {
          product : foundProduct
        });
      }
    }
  });

});

app.get("/buscarp", async (req, res) =>{
  res.render("./layouts/buscarp");
});

app.get("/mostrarp", async (req, res) => {
  try {
      const productos = await Product.find({});

      var size = productos.length;

      if (productos) {
          res.render("./layouts/mostrarp", {
              products: productos,
              size : size
          });
      }

  } catch (error) {
      console.log(error);
  }
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
    if (!err) {
      console.log("producto registrado");
      res.redirect("/almacen");
    }
    else if (err) {
      console.log(err);
    }
  });

});

app.listen(app.get('port'), () => {
  console.log('Server started on port', app.get('port'));
});
