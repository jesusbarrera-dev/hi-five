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

//Cart

const CartSchema = new Schema({
  // _id: { type: Number, required: true },
  user: { type: Schema.ObjectId, ref: "User" },
  products: [{ type: Schema.ObjectId, ref: "Product" }]
});

CartSchema.plugin(autoIncrement.plugin, 'Cart');

const Cart = mongoose.model('Cart', CartSchema);

//Sale

const SaleSchema = new Schema({
  // _id: { type: Number, required: true },
  client: { type: Schema.ObjectId, ref: "User" },
  info: { type: Schema.ObjectId, ref: "Saleinfo" }
});

SaleSchema.plugin(autoIncrement.plugin, 'Sale');

const Sale = mongoose.model('Sale', SaleSchema);

//Payment

const PaymentSchema = new Schema({
  // _id: { type: Number, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  cardnum: { type: Number, required: true },
  cvv: { type: Number, required: true },

});

PaymentSchema.plugin(autoIncrement.plugin, 'Payment');

const Payment = mongoose.model('Payment', PaymentSchema);

//Sale info

const SaleinfoSchema = new Schema({
  // _id: { type: Number, required: true },
  products: [{ type: Schema.ObjectId, ref: "Product" }],
  payment: { type: Schema.ObjectId, ref: "Payment" },
  date: { type: Date, default: Date.now() },
});

SaleinfoSchema.plugin(autoIncrement.plugin, 'Saleinfo');

const Saleinfo = mongoose.model('Saleinfo', SaleinfoSchema);

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

//Global variables
let theUser = new User;
let theDate = new Date();
let theCartArray = new Array();

//Routes

app.get('/', (req, res) => {

  // const su = new User({
  //   name: "alejandro",
  //   usertype: "s",
  //   email: "alejandro@admin.com",
  //   password: "0000"
  // });

  // su.save(function(err){
  //   if(!err){
  //     console.log("SU registrado.");
  //   } else if(err){
  //     console.log(err);

  //   }
  // });

  res.render("./layouts/index",{
    theUser: theUser,
    theDate: theDate
  });
});

app.get('/login', (req, res) => {
  res.render("./layouts/login");
});

let theCart = new Cart;

app.post('/login',  urlencodedParser, (req, res) =>{
  const correo = req.body.correo;
  const contra = req.body.contra;

  User.findOne({email: correo}, (err, foundUser)=>{
    if(err){
      console.log(err);
    } else{
      if(foundUser && foundUser.password === contra){
        theUser = foundUser;
        if(foundUser.usertype === "c"){//si el usuario es tipo cliente.
          var userid = foundUser._id;
          theCart.user = userid;
          res.redirect("/");
        } else if(foundUser.usertype === "a"){//si el usuario es tipo admin.
          res.redirect("/almacen");
        } else if(foundUser.usertype === "s"){
          res.redirect("/admin");
        }
      }
    }
  });
});

app.post("/modificarp", urlencodedParser, async (req, res) => {

  try {
    await Product.findOneAndUpdate({_id: req.body.product_id},{
      useFindAndModify: false
    },{
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
          product : foundProduct,
          theUser: theUser,
          theDate: theDate
        });
      }
    }
  });

});


app.post('/eliminarp', urlencodedParser, async (req, res) => {

  const id = req.body.product_id;

  try {
    await Product.findOneAndDelete({_id: id}, {useFindAndModify: false});
    res.redirect('/almacen');
  } catch (error) {
    console.log(error);
  }

});

app.get("/buscarp", async (req, res) =>{
  res.render("./layouts/buscarp",);
});

app.get("/mostrarp", async (req, res) => {
  try {
      const productos = await Product.find({});

      var size = productos.length;

      if (productos) {
          res.render("./layouts/mostrarp", {
              products: productos,
              size : size,
              theUser: theUser,
              theDate: theDate
          });
      }

  } catch (error) {
      console.log(error);
  }
});


app.get('/hombre', async (req, res) => {
  
  try {
    const productos = await Product.find({
      "category": 'Hombre',
    });

    var size = productos.length;

    if(productos){
      res.render("./layouts/hombre", {
        products: productos,
        size: size,
        theUser: theUser,
        theDate: theDate
      });
    }

  } catch (error) {
      console.log(error);
  }
  
});

app.get('/mujer', async (req, res) => {
  try {
    const productos = await Product.find({
      "category": 'Mujer'
    });

    var size = productos.length;

    if(productos){
      res.render("./layouts/mujer", {
        products: productos,
        size: size,
        theUser: theUser,
        theDate: theDate
      });
    }

  } catch (error) {
      console.log(error);
  }
});


app.get('/admin', (req, res)=>{
  res.render('./layouts/admin',{
    theUser:theUser,
    theDate:theDate
  });
});

app.post('/admin', urlencodedParser, async (req, res)=>{

  const user = new User({
    name: req.body.name,
    usertype: req.body.usertype,
    email: req.body.email,
    password: req.body.password
  });

  await user.save(function (err) {
    if (!err) {
      console.log("usuario registrado");
      res.redirect("/admin");
    }
    else if (err) {
      console.log(err);
    }
  });

});

app.post('/buscaru', urlencodedParser, async (req, res)=>{
  const id = req.body.id;

  User.findOne({_id: id}, (err, foundUser) =>{
    if (err) {
      console.log(err);
    } else {
      if(foundUser){
        res.render("./layouts/buscaru",{
          user: foundUser,
          theUser: theUser,
          theDate: theDate
        });
      }
    }
  });

});

app.post('/modificaru', urlencodedParser, async (req, res)=>{

  try {
    await User.findOneAndUpdate({_id: req.body.id},{
      useFindAndModify: false
    },{
      name: req.body.name,
      usertype: req.body.usertype,
      email: req.body.email,
      password: req.body.password
    });
    res.redirect("/admin");
    
  } catch (error) {
    console.log(error);
  }

});

app.post('/eliminaru', urlencodedParser, async (req, res) => {

  const id = req.body.id;

  try {
    await User.findOneAndDelete({_id: id}, {useFindAndModify: false});
    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }

});

app.get("/mostraru", async (req, res) => {
  try {
      const usuarios = await User.find({});

      var size = usuarios.length;

      if (usuarios) {
          res.render("./layouts/mostraru", {
              users: usuarios,
              size : size,
              theUser: theUser,
              theDate: theDate
          });
      }

  } catch (error) {
      console.log(error);
  }
});
 

app.get('/almacen', (req, res) => {
  res.render("./layouts/almacen",{
    theUser: theUser,
    theDate: theDate
  });
});

let cantidadCart = new Array();

app.get('/carrito', async (req, res) => {

  let arrHelper = foo(theCartArray);
  const idsCart = arrHelper[0];
  cantidadCart = arrHelper[1];
  const size = idsCart.length;

  const products = await Product.find().where('_id').in(idsCart).exec();
  theCart.products = products;

  res.render("./layouts/carrito",{
    products: products,
    size: size,
    cantidad: cantidadCart,
    theUser: theUser,
    theDate: theDate
  });
});

app.post('/carrito/:idProducto', async (req, res) =>{
  try {
    const id = req.params.idProducto;

    const producto = await Product.findOne({
      _id: id
    });

    if(producto){
      theCartArray.push(id);
      // theCartArray =[]; //vacia el arreglo
      console.log(theCartArray);
    }
    res.redirect('/carrito');

  } catch (error) {
    console.log(error);
  }
});

//Funcion que regresa arreglo sin duplicados y arreglo con cantidad. Para el carrito
function foo(arr) {
  var a = [],
    b = [],
    prev;

  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  return [a, b];
}

app.get('/pago', (req, res) => {

  const sub = req.body.sub;
  const iva = req.body.iva;
  const total = req.body.total;

  // const cart = new Cart({
  //   user: theUser._id,
  //   products: req.body.products,
  //   quantities: req.body.quantities
  // });

  // console.log("PRODUCTSSSSSS: " + req.body.products);

  res.render("./layouts/pago",{
    sub: sub,
    iva: iva,
    total: total,
  });

});

app.post('/pago', async (req, res) =>{

  await theCart.save(function(err){
    if(!err){
      console.log("Carrito salvado!!!!!!!!!!!");
    } else if(err){
      console.log(err);
    }
  });

  const payment = new Payment({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    country: req.body.country,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zipcode,
    cardnum: req.body.cardnum,
    cvv: req.body.cvv
  });

  await payment.save(function (err) {
    if (!err) {
      console.log("payment registrado");
    }
    else if (err) {
      console.log(err);
    }
  });

  const saleinfo = new Saleinfo({
    products: theCart.products,
    quantities: cantidadCart,
    payment: payment._id,
  });

  await saleinfo.save(function (err) {
    if (!err) {
      console.log("salesinfo registrado");
    }
    else if (err) {
      console.log(err);
    }
  });

  const sale = new Sale({
    client: theUser._id,
    info: salesinfo._id
  });

  await sale.save(function (err) {
    if (!err) {
      console.log("sales registrado");
    }
    else if (err) {
      console.log(err);
    }
  });

  res.redirect('/');


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
