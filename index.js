'use strict';

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
var mysql = require('mysql');
const server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 3001,
	routes: {
        "cors": true
    }

})

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "gstapp"
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Mysql Connected to demo_user!");
});

server.route([{
	method: 'GET',
	path: '/product/list',
	handler: function(req, res) {

		var sql = "SELECT * from products";
		con.query(sql, function(err, row) {
			if(err)
				throw err;
			res(row);
		});
	}
},
{
	method: 'POST',
	path: '/product/insert',
	handler: function(req, res) {
		let product_code = req.payload.product_code;
		let product_name = req.payload.product_name;
		let product_price = req.payload.product_price;
		let product_gst = req.payload.product_gst;
		var sql = "INSERT INTO products VALUES ('" + product_code + "','" + product_name + "','" + product_price + "','" + product_gst + "')";
		con.query(sql, function(err) {
			if(err)
				throw err;

			res({status: '1 row inserted'});
		});
	}
},
{
	method: 'POST',
	path: '/product/update',
	handler: function(req, res) {
		let product_code = req.payload.product_code;
		let product_name = req.payload.product_name;
		let product_price = req.payload.product_price;
		let product_gst = req.payload.product_gst;
		var sql = "UPDATE products set product_name= '"+ product_name + "',product_price= '" + product_price + "', product_gst= '"+product_gst+"' where product_code= '"+product_code+"'";
		con.query(sql, function(err) {
			if(err)
				throw err;

			res({status: '1 row inserted'});
		});
	}
},
{
	method: 'POST',
	path: '/product/delete',
	handler: function(req, res) {
		let product_code = req.payload.product_code;
		var sql = "DELETE from products where product_code = '"+product_code+"'";
		con.query(sql, function(err) {
			if(err)
				throw err;

			res({status: '1 row deleted'});
		});
	}
}])

server.start(err => {
	if(err)
		throw err;

	console.log('staeted server');
})