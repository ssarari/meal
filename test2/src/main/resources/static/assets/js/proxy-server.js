//// server.js
var express = require('express');
var { createProxyMiddleware } = require('http-proxy-middleware');

var app = express(); //Express 애플리케이션 생성
var PORT = 9098      // 사용할 포트 번호 정의

// 프록시 미들웨어 설정
app.use('/api',
  createProxyMiddleware({
  target: 'https://apihub.kma.go.kr',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove '/api' prefix when sending requests to the target
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
  }
}));



// 서버 실행
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});