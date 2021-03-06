var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
    user : 'amolgaykhe',
    database : 'amolgaykhe',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one':{
    title:'Article One | Amol Gaykhe',
    heading:'Article One',
    date:'Jan 5, 2017',
    content:`
        <p>
            This is the content for my first article. This is the content for my first article.This is the content for my first article.This is the content for my first article.
        </p>
        <p>
            This is the content for my first article. This is the content for my first article.This is the content for my first article.This is the content for my first article.
        </p>
        <p>
            This is the content for my first article. This is the content for my first article.This is the content for my first article.This is the content for my first article.
        </p>`
    },
    'article-two':{
    title:'Article Two | Amol Gaykhe',
    heading:'Article Two',
    date:'Jan 10, 2017',
    content:`
        <p>
            This is the content for my second article.
        </p>`
    },
    'article-three':{
    title:'Article Three | Amol Gaykhe',
    heading:'Article Three',
    date:'Jan 15, 2017',
    content:`
        <p>
            This is the content for my third article.
        </p>`
    }
};

function createTemplate(data){
    //var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmlTemplate=`<html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                <a href="/">Home</a>
                </div>
                <hr/>
                <h3>${heading}</h3>
                <div>${date.toDateString()}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test', function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/articles/:articleName', function (req, res) {
  
  pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'", function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          if(result.rows.length === 0){
              res.status(404).send('Article Not Found');
          }else{
              var articleData = result.rows[0];
              res.send(createTemplate(articles[articleData]));
          }
      }
  });
  
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
