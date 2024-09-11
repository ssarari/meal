const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const PORT = 9098;

app.use(cors({
    origin: '*', // 모든 도메인 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
    '/api',
    createProxyMiddleware({
        target: 'https://apihub.kma.go.kr',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '', // Remove '/api' prefix when sending requests to the target
        },
        onProxyReq: (proxyReq) => {
            // Add API key to request URL
            const url = new URL(proxyReq.path, 'https://apihub.kma.go.kr');
            url.searchParams.append('authKey', '4xxl_HhFRSScZfx4RWUkCw');
            proxyReq.path = url.pathname + url.search;
        }
    })
);

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
