import pg from 'pg';
import express from 'express';
import Cursor from 'pg-cursor';



const app  = express();
const {Pool} = pg;
const pool = new Pool({
    host:"localhost",
    user:"susanamunoz",
    password:"",
    database: "ercompleto",
    port :5432,
});

pool.connect();


app.get("/datos", async (req, res)=>{
    const resultado =  await pool.query("select * from usuarios");
    console.table(resultado.rows);
    res.json(resultado.rows);
});


app.get("/cursor",  (req, res)=>{
    pool.connect((err, client, done) => {
        if (err) throw err;
        const query = 'SELECT * FROM usuarios';
        const resultado =  client.query(new Cursor(query));
        resultado.read(1, (err, rows)=>{
            if(err) throw err;
            resultado.close((err)=>{
                if(err) throw err;
                done();
                res.send(rows);
            });  
    });
});
    //res.send("hola");
})


app.get('/usuarios', (req, res) => {
    pool.connect((err, client, done) => {
      if (err) throw err;
  
      const query = 'SELECT * FROM usuarios';
      const cursor = client.query(new Cursor(query));
      let data = [];
      cursor.read(2, (err, rows) => {
        if (err) throw err;
        data.push(rows);
        cursor.read(3, (err, rows) => {
          if (err) throw err;
          data.push(rows);
          cursor.close((err) => {
            if (err) throw err;
            done();
            res.send(data);
          });
        });
      });
    });
  });

app.listen(3000, console.log("Servicio puerto 3000"))
