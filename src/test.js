"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = require("path");
var url_1 = require("url");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
var app = (0, express_1.default)();
// serve up production assets
//app.use(express.static('app/dist'));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.get("/", function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname, 'client', 'build', 'index.html'));
});
app.get("/status", function (request, response) {
    var status = {
        "Status": "Running"
    };
    response.send(status);
});
app.get('*', function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname, 'client', 'build', 'index.html'));
});
// if not in production use the port 5000
var PORT = process.env.PORT || 5000;
console.log('server started on port:', PORT);
app.listen(PORT);
