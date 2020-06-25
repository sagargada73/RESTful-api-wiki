const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// configs
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
// databse connnection
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// schema
const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model('Article', articleSchema);

//routes
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, docs) {
      if (!err) {
        res.send(docs);
      }
    })
  })
  .post(function(req, res) {
    const newArticle = Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err, doc) {
      if (!err) {
        res.send("accepted");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("deleted all articles successfully");
      } else {
        res.send(err);
      }
    })
  });

// specific article routes
app.route("/articles/:title")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.title
    }, function(err, doc) {
      if (!doc) {
        res.send("article not found");
      } else {
        res.send(doc);
      }
    })
  })
  .put(function(req,res){
      Article.update({title:req.params.title},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err,doc){
          if(err){
            console.log(err);
          }
          else{
            res.send("updated article");
          }
        }
      )
  })
  .patch(function(req,res){
    Article.update({title:req.params.title},{$set:req.body},function(err,doc){
      if(!err){
        res.send("patched article");
      }
      else{
        res.send(err);
      }
    })
  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.title},function(err,doc){
      if(!err){
        res.send("article deleted");
      }
    })
  });
// port
app.listen(3000, function() {
  console.log("server started");
});
