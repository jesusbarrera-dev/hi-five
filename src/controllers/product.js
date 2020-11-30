const crtl = {}

const path = require('path');
// const { imageSchema } = require('../models/image');
const { productSchema } = require('../models/product');

crtl.create = (req, res) => {
  const saveProduct = async () => {
    const file = req.file;
    // var im = new Image;
    // im.img.data = file;
    // im.img.contentType = "image/png";

    const product = new Product({
      name: req.body.product_name,
      description: req.body.product_desc,
      price: req.body.product_price,
      category: req.body.product_category,
      quantity: req.body.product_quantity,
      // image: {
      //   img: {
      //     data: file,
      //     contentType: "image/png"
      //   }
      // }
    });

    await product.save(function (err) {
      if (!err) console.log("producto registrado")
      else if (err) {
        console.log(err);
      }
    });

  }
}