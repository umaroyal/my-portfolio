var express = require('express');
var data = require('../mydata.json');
var path = require('path');
var fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();
var router = express.Router();



 
router.get('/', function (req, res, next) {
  res.render('admin/dashboard', { 
    layout: 'layout-admin', 
    title: 'Admin Dashboard',
    navDashboard: true
  });
});


router.get("/projects", function(req, res, next){
  client.get('http://localhost:3030/projects', function(response, error){
    res.render('admin/projects', {layout:"layout-admin", title:"Projects", showFooter:true, navProjects:true, projects:response.data});
  });
});


router.get('/projects/create', function (req, res, next) {
  console.log(".............................");
  res.render('admin/project-create', { 
    layout: 'layout-admin', 
    title: 'Projects Admin',
    navProjects: true
  });
});


router.get('/projects/:projectAlias', function (req, res, next) {
  client.get("http://localhost:3030/projects/"+ req.params.projectAlias, function (jsonData, response) {
      // parsed response body as js object
      // raw response
      // console.log(response);
      res.render('admin/project-detail', { 
        layout:"layout-admin",
          title: jsonData.data.name ,
          navProject: true, 
          showFooter: true, 
          project:  jsonData.data
        });
  });
});

//router.post('/projects/:projectAlias/update', function(req, res, next){
//   client.post('http://localhost:3030/admin/projects/'+req.params.projectAlias+'/update', function(jsonData, response){
//     if(jsonData.code === 200){
//       res.redirect('/admin/projects');
//     }else{
//       res.redirect('/admin/projects/'+req.params.projectAlias);
//     }
//   });
// });


router.post('/projects/create', function (req, res, next) {
  var callback = function(error, data){
    console.log(error);
    console.log(data);
    res.redirect('/admin/projects');
  };
  var inputData = req.body;
  projectService.create(inputData, callback);
});


router.post('/projects/:projectAlias/update', function (req, res, next) {
 var pAlias = req.params.projectAlias;
var args = {
  data:{
    name: req.body.name,
    alias: req.body.alias,
    description: req.body.description,
    githubUrl: req.body.githubUrl,
    tags: req.body.tags
  },
  headers:{"Content-Type":"application/json"}
};
console.log("update ",args.data);
  client.post('http://localhost:3030/projects/:'+pAlias+'/update', args, function(jsonData,response){
    console.log("Update-------------->"+ jsonData.data);
    if(jsonData.code === 200)
    res.redirect('/admin/projects');

  });
});



router.get('/media', function (req, res) {
res.render('admin/upload', { 
  layout: 'layout-admin', 
  title: 'Image Upload',
  navProjects: true
});
});

// router.post('/media', function (req, res) {
// // var dir = path.join(__dirname, '../public/projects/' 

// // mediaService.upload(req, res, '')
// // req, res, path, alias, callback
// // upload(req, res, function (err) {
// //   if (err) {
// //     return res.end("Error uploading file.");
// //   }
// //   res.end("File is uploaded");
// // });
// });

router.get("/blog", function(req, res, next){
  client.get('http://localhost:3030/blogs', function(response, error){
    res.render('admin/blog', {layout:"layout-admin", 
    title:"Blog", 
    showFooter:true, 
    navBlogs:true, 
    blogs:response.data
  });
  });
});


router.get('/blog/:blogAlias', function (req, res, next) {
  client.get("http://localhost:3030/blogs/"+ req.params.blogAlias, function (jsonData, response) {
      // parsed response body as js object
      // raw response
      // console.log(response)s;
      res.render('admin/blog-detail', { 
        layout:"layout-admin",
          title: jsonData.data.name ,
          navBlogs: true, 
          showFooter: true, 
          blogs:  jsonData.data
        });
  });
});

module.exports = router;