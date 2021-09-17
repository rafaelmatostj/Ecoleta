const express = require("express")
const server = express()

const db = require("./database/db")

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))


const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})


server.get("/", (req, res) => {
  return res.render("index.html", { title: "esse é um titulo" })
})

server.get("/create", (req, res) => {

  // req.query



  return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
  const query = `
    INSERT INTO places (
        image,
        name,
        adress,
        adress2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);`


  const values = [
    req.body.image,
    req.body.name,
    req.body.adress,
    req.body.adress2,
    req.body.state,
    req.body.city,
    req.body.items

  ]

  function afterInsertData(err) {
    if (err) {
      return console.log(err)
    }

    console.log("cadastro com sucesso")
    console.log(this)
    return res.render("create-point.html", {saved: true})
  }
  db.run(query, values, afterInsertData)
})



server.get("/search", (req, res) => {

  const search = req.query.search
  if(search == "") {
    return res.render("search-results.html", { total: 0 })
  }

  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err)
    }

    const total = rows.length

    return res.render("search-results.html", { places: rows, total })
  })

})

//ligar servidor
server.listen(3000)