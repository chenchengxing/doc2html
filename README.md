doc2html
====================
将.docx转换成web工程，通常用于说明文档在web上展示。

## Feature,我没懂，具体是干嘛的
- 通过sax、mammoth工具分析.docx的xml结构，将其转化成dom，生成html。
- 如果.docx有图片，对应的还会生成图片，保存在images文件夹下。当然还有js、css文件，构成一个web工程。
- 这个工程可用，但可能会由于.docx格式不尽完善，一般需要进行微调才能达到最佳的效果。

## Usage
- 安装[node](http://nodejs.org/)
- npm install doc2html
- cd doc2html
- npm install
- 配置config.js
- node index.js 或 运行 run.bat

### 配置config.js
- `docPath`  源文档的相对路径
- `outputDir` 输出的文件夹路径
- `htmlName` 输出的html文件前缀，Default：`index`


## 实现
基于mammoth

## RoadMap
- 支持多个文件的转化
- 支持一个文件转化为多个页面展示
- 响应式的支持
