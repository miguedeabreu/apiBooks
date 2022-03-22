let express = require("express");
let app = express();
let cors = require('cors')
let mysql = require("mysql2");

let connection = mysql.createConnection(
    {
        host         : "localhost",
        user         : "root",
        password     : "21192601",
        database     : "appbooks"
    });

connection.connect(function(error){
    if(error){
       console.log(error);
    }else{
       console.log('Conexion correcta.');
    }
 });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

////////////////// USUARIO

app.post("/registro", 
        function(request, response)
        {
            console.log(request.body);

            let sql = "INSERT INTO usuario (nombre, apellido, correo, url, password) " +
            "VALUES ('" + request.body.nombre + "', '" + request.body.apellido + "', '" +
                    request.body.correo + "', '" + request.body.url + "', '" + request.body.password + "')"
                        
            console.log(sql);                      
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    console.log(result);
                    if (result.insertId)
                        response.send(String(result.insertId));
                    else
                        response.send("-1");
                }
            })
        }
        );


app.post("/login", 
        function(request, response)
        { 
            console.log(request.body)
            let sql;
            sql = `SELECT id_usuario, nombre, apellido, correo, url FROM usuario WHERE correo=  
            "${request.body.correo}" AND password= "${request.body.password}"`
            console.log(sql)
    
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );

////////////////// LIBROS

app.get("/libros", 
        function(request, response)
        { console.log(request.query.id_usuario)
            let sql;
            if (request.query.id_libro == null)
                sql = "SELECT * FROM libro WHERE id_usuario=" + request.query.id_usuario;
            else
                sql = `SELECT * FROM libro WHERE id_usuario=${request.query.id_usuario} AND 
                    id_libro=${request.query.id_libro};`
                console.log(sql)
    
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );

app.post("/libros", 
        function(request, response)
        {
            console.log(request.body);

            let sql = `INSERT INTO libro (id_usuario, titulo, tipoLibro, autor, precio, photo) VALUES 
                    (${request.body.id_usuario}, "${request.body.titulo}", "${request.body.tipoLibro}",
                     "${request.body.autor}",${request.body.precio}, "${request.body.photo}")`
                        
            console.log(sql);                      
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    console.log(result);
                    if (result.insertId)
                        response.send(String(result.insertId));
                    else
                        response.send("-1");
                }
            })
        }
        );

app.put("/libros", 
        function(request, response)
        {
            console.log(request.body);

            let sql =  `UPDATE libro SET id_usuario = ${request.body.id_usuario},
                        titulo= "${request.body.titulo}", 
                        tipoLibro= "${request.body.tipoLibro}", 
                        autor= "${request.body.autor}", 
                        precio= ${request.body.precio}, 
                        photo= "${request.body.photo}"
                         WHERE id_libro= ${request.body.id_libro}`     

            console.log(sql); 
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    response.send(result);
                }
            })
        }
        );

app.delete("/libros",
        function(request, response)
        {
            console.log(request.body);
            let sql =  `DELETE FROM libro WHERE id_libro= ${request.body.id_libro}`
            console.log(sql); 
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    response.send(result);
                }
            })
        }
        );
   
        
app.listen(3000);