const express = require('express');
const { Sequelize } = require('sequelize');

const { Article } = require('../models/index');

const articleRoute = express();

//REST declarations

articleRoute.get('/article', getArticle);
articleRoute.get('/article/:id', getArticle);
articleRoute.post('/article', createArticle);
articleRoute.put('/article/:id', updateArticle);
articleRoute.delete('/article/:id', deleteArticle);

//REST functions

async function getArticle(req, res) {
  const allArticles = await Article.findAll();
  res.json(allArticles);
}

async function getArticle(req, res, next) {
  const id = req.params.id;
  const article = await Article.findOne( { where: { id : id }});
  if (article == null) {
    next();
  }
  res.json(article);
}

async function createArticle(req, res) {
  const title = req.body.title;
  const author = req.body.author;
  const pubDate = Date.parse(req.body.pubDate);
  const article = await Article.create({
    title,
    author,
    pubDate,
  });
  res.json(article);
}

async function deleteArticle(req, res, next) {
  const id = req.params.id;
  const article = await Article.findOne( { where: { id: id }});
  if (article == null) {
    next();
  } else {
    await Article.destroy( {where: { id: id }});
    res.json({});
  }
}

async function updateArticle (req, res) {
  const id = req.params.id;
  let article = await Article.findOne({ where: { id: id }});
  if (article == null ) {
    next();
  } else {
    const title = req.body.title ?? article.title;
    const author = req.body.author ?? article.author;
    const pubDate = req.body.pubDate ?? article.pubDate;

    let updatedArticle = {
      title,
      author,
      pubDate,
    }
    article = await article.update(updatedArticle);
    res.status(200).json(article);
  }
}

module.exports = { articleRoute }