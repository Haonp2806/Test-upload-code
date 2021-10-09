var express = require('express');
const path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var sql = require("mssql/msnodesqlv8");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

function executeSQL(strSQl,cb) {
    // config for your database
    var config = { 
        server: "LAPTOP-776LDUIE\\NHATHAO",
        user: "sa",
        password: "123456",
        database: "Product",
        driver: "msnodesqlv8"
    }
    const conn = new sql.ConnectionPool(config).connect().then(pool=>{
        return pool;
    });
    module.exports = {    
        conn: conn,
        sql: sql
    }
   // connect to your database
   sql.connect(config, function (err, db) {
       //console.log(db);
       if (err) console.log(err);
       // create Request object
       var request = new sql.Request();
       // query to the database and get the records
       request.query(strSQl, function (err, recordset) {
           if (err) console.log(err)
           cb(recordset);
       });
       
   });
}

app.get('/', function (req, res) {
    executeSQL("select * from SanPham", (recordset) => {
        var result = "";
        recordset.recordsets[0].forEach(row => {
            result += `
                <div class="p1">
                <a href="/Page-1/${row['id']}"><img class="u-expanded-width-lg u-expanded-width-xl u-image u-image-default u-image-1" src='/images/${row['ProductImage']}'/></a>
                <div class="u-align-center-lg u-align-center-sm u-align-center-xl u-align-center-xs u-text u-text-2"><b>${row['ProductName']}</b></div>
                <a class="u-border-none u-btn u-button-style u-hover-custom-color-1 u-palette-3-base u-text-body-alt-color u-btn-2" href="">ADD TO CART</a>
                <div class="u-align-center-sm u-align-center-xs u-text u-text-custom-color-1 u-text-3"><span> ${row['Price']}$</span></div>
                </div>
            `;
        });
        res.send(result);
    });   
});
app.get('/index', function (req, res) {
    res.sendFile(__dirname+"/index.html");
});
var server = app.listen(6969, function () {
    console.log('Server is running..');
});
// app.get('/getDetailData/:id', function (req, res) {
//     executeSQL(`select * from SanPham where id = ${req.params.id}`, (recordset) => {
//          var row = recordset.recordsets[0][0];
//             res.send(row);
//      });
// });
// app.get('/Page-1/:id', function (req, res) {
//     res.sendFile(__dirname+"/Page-1.html");
// });
