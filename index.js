var mammoth = require('mammoth');
var fs = require("fs");
var path = require("path");
var htmlPaths = require("mammoth/lib/html-paths");
var promises = require('mammoth/lib/promises');
var config = require('./config')();
// mammoth.convertToHtml({
//   path: 't.docx'
// })
//   .then(function(result) {
//     var html = result.value; // The generated HTML
//     console.log(html);
//     var messages = result.messages; // Any messages, such as warnings during conversion
//   })
//   .done();
// console.log(config);
var docxPath = config.docPath;
var outputDir = config.outputDir;
var htmlName = config.htmlName;
var options = {};
var basename = path.basename(docxPath, ".docx");
var outputPath = path.join(outputDir, htmlName + ".html");
var imageIndex = 0;
options.convertImage = function(element, html, messages, callback) {
  imageIndex++;
  var extension = element.contentType.split("/")[1];
  var filename = imageIndex + "." + extension;

  element.read().then(function(imageBuffer) {
    var imagePath = path.join(outputDir,'images', htmlName, filename);
    return promises.nfcall(fs.writeFile, imagePath, imageBuffer);
  }).then(function() {
    var attributes = {
      src: path.join('images',htmlName, filename)
    };
    // if (element.altText) {
    //     attributes.alt = element.altText;
    // }
    html.selfClosing(htmlPaths.element("img", attributes));
    callback();
  }).fail(callback);
};
// mkpath(path.join(outputDir, 'js', 'jquery.js'))
fs.mkdir(outputDir, function(e) {
  // if (e) {
  //   console.log('目录' + outputDir + '已存在');
  //   return;
  // }
  fs.mkdir(path.join(outputDir, 'js'), function (e) {
    // if (e) throw e;
    // fs.writeFile('js/jquery.js', '',function (e) {
      fs.createReadStream('templates/jquery.js').pipe(fs.createWriteStream(path.join(outputDir, 'js','jquery.js')));
      fs.createReadStream('templates/indexjs.js').pipe(fs.createWriteStream(path.join(outputDir, 'js', htmlName + '.js')));
    // });
  });
  fs.mkdir(path.join(outputDir, 'css'), function (e) {
    fs.createReadStream('templates/index.css').pipe(fs.createWriteStream(path.join(outputDir, 'css', htmlName + '.css')));
  });
  fs.mkdir(path.join(outputDir, 'images'), function(e) {
    // if (e) {
    //   console.log('目录' + path.join(outputDir, 'images') + '已存在');
    //   return;
    // }
    fs.createReadStream('templates/hr.png').pipe(fs.createWriteStream(path.join(outputDir, 'images','hr.png')));
    fs.mkdir(path.join(outputDir, 'images', htmlName),function (e) {
      // body...
      mammoth.convertToHtml({
        path: docxPath
      }, options)
        .then(function(result) {
          var docStart = '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <title><\/title>\n  <link rel=\"stylesheet\" href=\"css\/' + htmlName + '.css\">\n<\/head>\n<body>\n  <div class=\"header\">\n    <div class=\"logo\">\n      IP Phone Docs\n    <\/div>\n  <\/div>\n  <ul id=\"menu\">\n  <\/ul>\n  <div class=\"content\">';
          var docEnd = '<\/div>\n  <script src=\"js\/jquery.js\"><\/script>\n  <script src=\"js\/' + htmlName + '.js\"><\/script>\n<\/body>\n<\/html>';
          var outputStream = outputPath ? fs.createWriteStream(outputPath) : process.stdout;

          outputStream.write(docStart + result.value + docEnd);
          var beautify_html = require('js-beautify').html;
          fs.readFile(outputPath, 'utf8', function (err, data) {
              if (err) {
                throw err;
              }
              fs.writeFile(outputPath, beautify_html(data, { indent_size: 2 }));
          });
        });
    });
  });

});