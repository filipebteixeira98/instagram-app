const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const Post = require('../models/Post');

module.exports = {
  async index(req, res) {
    const posts = await Post.find().sort('-createdAt');

    return res.json(posts);
  },

  async store(req, res) {
    const { author, place, description, hashtags } = req.body;

    const { filename: image } = req.file;

    // const [name, ext] = image.split('.');

    const name = path.parse(image).name;

    const fileName = `${name}.jpg`;

    const resizedImagePath = path.resolve(req.file.destination, 'resized', fileName)

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(resizedImagePath);

    fs.unlinkSync(req.file.path);

    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
      image: fileName
    });

    req.io.emit('post', post);

    return res.json(post);
  }
};