//jshint esversion:6


const express = require("express");  //creating four constant, and requiring the modules
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));    //public directory to store static files

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });    // connect to local database

const articleSchema = {    //created article schema
  title: String,
  content: String
};


const Article = mongoose.model("Article", articleSchema);   //created article model

//Requests Targetting all Articles

app.route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {      //search through articles and send to client
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });
  })

  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: (req.body.title),
      content: (req.body.content)
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }

    });
  })

  .delete(function (req, res) {       //delete all entries
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Succesfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });


///request targeting a specific article/////////////////


app.route("/articles/:articleTitle")   // match request parameters

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found");
        }
      });
  })

  .put((req, res) => {             
    const { requestedArticle } = req.params;
    const { title, content } = req.body;
    Article.updateOne(
      { title: requestedArticle },
      { $set: { title, content } },
      err => {
        if (!err) {
          res.send("Article updated!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    const { requestedArticle } = req.params;
    Article.updateOne({ title: requestedArticle }, { $set: req.body }, err => {
      if (!err) {
        res.send("Article updated!");
      } else {
        res.send(err);
      }
    });
  })


  .delete(function(req, res){           //delete specific article
   Article.deleteOne(
     {title: req.params.articleTitle},
     function(err){
       if(!err){
         res.send("Successfully deleted the correspending article")
       } else{
         res.send(err);
       }
     }
   );
  });


app.listen(3000, function () {
  console.log("Server started on port 3000");  //listen on port
});