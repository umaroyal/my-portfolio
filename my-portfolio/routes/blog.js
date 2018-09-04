var express = require('express');
var router = express.Router();
var Blog = require('../model/blogModel');


/*

/blog               GET   (list all blog)
/blog/alias         GET   (Get by alias)
/blog               POST  (Create a new blog)
/blog/alias         PUT   (Update the blog)
/blog/alias         DELETE (remove a blog)

*/

function urlify(str){
  var urlifyStr = str.trim().toLowerCase();
  urlifyStr = urlifyStr.replace(/ /g,'-');
  // handle for ? & - 
  return urlifyStr;
}

/* GET all blogss listing. */
router.get('/', function(req, res, next) {
  Blog.find({}, function(err, blog){
    console.log(JSON.stringify(blog));

    if(err){
        console.log(JSON.stringify(err));
        res.json({code: 500, message: 'Something went wrong'});
    }else if (blog){
      res.json({code: 200, data: blog});
    }
  });
});

/* GET project by alias. */
router.get('/:blogAlias', function(req, res, next) {
  Blog.findOne({alias: req.params.blogAlias}, function(err, blog){
    console.log(JSON.stringify(blog));

    if(err){
        console.log(JSON.stringify(err));
        res.json({code: 500, message: 'Something went wrong'});
    }else if (blog){
      res.json({code: 200, data: blog});
    }
  });
});

/* Create blog. */
router.post('/', function(req, res, next) {
  var blog = req.body;
  console.log('---create blog---');
  var blogModel = new blog();
  blogModel.name = blog.name;
  blogModel.alias = urlify(blog.name); 
  blogModel.githubUrl = blog.githubUrl;
  blogModel.image = blog.image;
  blogModel.description = blog.description;
  blogModel.tags = [];

  // var tags = blog.tags.trim();
  // tags = tags.split(',');
  // for(var i=0; i<tags.length; i++){
  //    blogModel.tags.push({'name':tags[i], 'class': 'info' });
  // }

  blogModel.imageSliders = blog.imageSliders;
  blogModel.relatedBlogs = blog.relatedBlogs;
  blogModel.createAt = new Date();
  blogModel.save(function(err, blog){
      console.log(JSON.stringify(blog));
      if(err){
        res.json({code: 500, message: 'Something went wrong'});
      }else{
        res.json({code: 200, data: blog}); 
      }
  });
});

/* Create blog. */
router.put('/:blogAlias', function(req, res, next) {
  var bObject = req.body;

  Blog.findOne({'alias': blogAlias}, function(err, blog){
    if(err){
        callback(err, null);
    }else{

        console.log(JSON.stringify(blog));
        if(bObject.name){
            blog.name = bObject.name;
        }
        if(bObject.image){
            blog.image = bObject.image;
        }
        if(bObject.description){
            blog.description = bObject.description;
        }
        if(bObject.githubUrl){
            blog.githubUrl = bObject.githubUrl;
        }
        
        blog.save(function(err, blog){
            console.log(JSON.stringify(blog));
            if(err){
              res.json({code: 500, message: 'Something went wrong'});
            }else{
              res.json({code: 200, data: blog}); 
            }
        });
    }
  });
});

/* Create blog. */
router.delete('/:blogAlias', function(req, res, next) {
    Blog.remove({'alias': req.params.blogAlias}, function(err, blog){
    if(err){
      res.json({code: 500, message: 'Something went wrong'});
    }else{
      res.json({code: 200, data: blog}); 
    }
  });
});

module.exports = router;
