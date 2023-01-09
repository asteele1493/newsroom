const express = require('express');
const { Sequelize } = require('sequelize');

const { Article } = require('../models/index');

const {ensureRole, checkToken } = require('../auth/routes');

const articleRoute = express();

articleRoute.use(checkToken);

//REST declarations

articleRoute.get('/article', ensureRole(['user', 'author', 'editor', 'manager']),
getArticles
);
articleRoute.get('/article/:id', ensureRole(['user', 'author', 'editor', 'manager']),
 getArticle);
articleRoute.post('/article', ensureRole(['author', 'editor']),
createArticle);
articleRoute.put('/article/:id', ensureRole(['author', 'editor']),
updateArticle);
articleRoute.delete('/article/:id', ensureRole(['manager', 'editor']),
deleteArticle);

//REST functions

async function getArticles(req, res) {
  const article = await Article.findAll();
  if(article == null){
    next();
  }
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
  const read = req.body.read;
  const article = await Article.create({
    title,
    author,
    pubDate,
    read,
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
    const read = req.body.read ?? article.read;

    let updatedArticle = {
      title,
      author,
      pubDate,
      read,
    }
    article = await article.update(updatedArticle);
    res.status(200).json(article);
  }
}

module.exports = { articleRoute }