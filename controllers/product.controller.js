const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;
const constants = require("../constants");
const formidable = require("formidable");
const fs = require("fs");
const fse = require("fs-extra");

const { v4: uuidv4 } = require("uuid");

// Upload Image
const uploadImage = async (imageType, oldpath, newpath) => {
  if (imageType == "image") {
    // fs.renameSync(oldpath, newpath);
    fse.moveSync(oldpath, newpath);
  }
};

const removeImage = async (path) => {
  await fs.unlinkSync(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      const image = files.p_image;
      const imageType = image.mimetype.substr(0, 5).trim();
      const oldpath = image.filepath;
      const imagePath = `${__dirname}/../uploads/images/`;
      const uuidName = uuidv4(Date.now());
      const newImageName = `${uuidName}${image.originalFilename}`;
      const newpath = `${imagePath}${newImageName}`;
      const { p_name, p_price, p_count } = fields;
      const p_image = newImageName;
      // Create a Product
      const product = {
        p_name,
        p_price,
        p_count,
        p_image,
      };

      const result = await Product.create(product);
      if (result) {
        uploadImage(imageType, oldpath, newpath);
        res.json({
          result: constants.kResultOk,
          message: JSON.stringify(result),
        });
      }
    });
  } catch (error) {
    res.json({ result: constants.kResultNok, message: JSON.stringify(error) });
  }
};

// Retrieve all Products from the database.
exports.findAll = async (req, res) => {
  try {
    const result = await Product.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      result: constants.kResultNok,
      message: JSON.stringify(error),
    });
  }
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByPk(id);
    if (result) {
      res.json(result);
    } else {
      res.json({});
    }
  } catch (error) {
    res.json({});
  }
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByPk(id);
    const ImgPath = result.p_image;
    const pathRemove = `./uploads/images/${ImgPath}`;

    if (result) {
      const form = new formidable.IncomingForm();
      form.parse(req, async (error, fields, files) => {
        const { p_name, p_price, p_count } = fields;

        if (files.p_image !== undefined) {
          // console.log("มีไฟล์");
          // res.send("มีไฟล์");

          const image = files.p_image;
          const imageType = image.mimetype.substr(0, 5).trim();
          const oldpath = image.filepath;
          const imagePath = `${__dirname}/../uploads/images/`;
          const uuidName = uuidv4(Date.now());
          const newImageName = `${uuidName}${image.originalFilename}`;
          const newpath = `${imagePath}${newImageName}`;

          const p_image = newImageName;

          const product = {
            p_name,
            p_price,
            p_count,
            p_image,
          };

          Product.update(product, {
            where: { id: id },
          });
          if (result) {
            uploadImage(imageType, oldpath, newpath);
            removeImage(pathRemove);
            res.json({
              result: constants.kResultOk,
              message: JSON.stringify(result),
            });
          }
        } else {
          // console.log("ไม่มีไฟล์");

          const { p_image } = fields;
          const product = {
            p_name,
            p_price,
            p_count,
            p_image,
          };

          Product.update(product, {
            where: { id: id },
          });

          res.json({
            result: constants.kResultOk,
            message: JSON.stringify(result),
          });
        }
      });
    } else {
      res
        .status(500)
        .json({ result: constants.kResultNok, message: "Internal error" });
    }
  } catch (error) {
    res.json({ result: constants.kResultNok, message: JSON.stringify(error) });
  }
};

// Delete a Product with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByPk(id);
    const ImgPath = result.p_image;
    const imagePath = `./uploads/images/${ImgPath}`;
    if (result) {
      const product = await Product.destroy({ where: { id: id } });
      if (product) {
        await removeImage(imagePath);
        res.json({
          result: constants.kResultOk,
          message: JSON.stringify(product),
        });
      }
    } else {
      res
        .status(500)
        .json({ result: constants.kResultNok, message: "Internal error" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ result: constants.kResultNok, message: "Internal error" });
  }
};
