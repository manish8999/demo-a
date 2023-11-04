const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;
const HOST = "localhost";
const API_URL = "http://localhost:3001";
const proxyOptions = {    target: API_URL,    changeOrigin: true,  }
const proxy = createProxyMiddleware(proxyOptions);app.use('/', proxy);
app.listen(PORT, HOST, () => {    console.log(`Proxy Started at ${HOST}:${PORT}`);});