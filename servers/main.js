const express = require('express');
const path = require('path');
const app = express();

// 设置静态资源目录
const dir_path = path.dirname(__dirname, '..');
app.use(express.static(path.join(dir_path, 'dist')));
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});