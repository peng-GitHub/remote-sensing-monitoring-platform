/**
 * Created by Administrator on 2015/11/25.
 */
var fs = require('fs');

var http=require('http');

var express=require('express');

fs.readFile('content', 'UTF-8',function(err, res,data) {
    if (err) {
        console.error(err);
    } else {
        res.json(data);
    }
});