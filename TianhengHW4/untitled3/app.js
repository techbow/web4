  var express = require("express");
  var cheerio = require("cheerio");
  var url = require("url");
  var request = require("request");
  var app = express();

  app.get('/', function(req, res){
    myModule.sayBye();
    myModule.hello(" techbow");
    console.log(myModule.sayBye.toString());
    res.sendFile(__dirname + "/index.html");
  });

  app.get('/amazon/:name', function(req, res){
    var name = req.params.name;
    var options = {
      protocol: "http:",
      host: "www.amazon.com",
      pathname: "/s/ref=nb_sb_noss_2",
      query: {"field-keywords": name}
    };
    var amazonUrl = url.format(options);


    request(amazonUrl, function(err,response, body){
      var $ = cheerio.load(body);
      var items = [];
      var blocks = [];
      $('li.s-result-item').each(function (k,e){
       // console.log($(e).html());
        var c = $(e).find("div.s-item-container>div:nth-child(3)>div.a-row:first-child>a>span.a-size-base").text();
        //console.log(c);
        //console.log(typeof(c.slice(1)));
        if (items.length == 0){
          items.push(c.slice(1));
          blocks.push(e);
        }
        else{
          if (parseFloat(c.slice(1))<parseFloat(items[0])){
            items[0]= c.slice(1);
            blocks[0]=e;
          }
        }
        });
      //console.log(blocks[0].tagName);
      //console.log($(blocks[0]).parent().html());
      $(blocks[0]).insertBefore('#result_0');
     // $('#s-results-list-atf').prepend($(blocks[0]).html());
      //console.log($('#s-results-list-atf').html())
      res.send($.html());
      })

    });


  app.listen(1234);
