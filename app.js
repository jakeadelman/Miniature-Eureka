const express = require("express")
const path = require("path")
const PORT = 3000

const fs = require("fs")
const bodyParser = require('body-parser')
const app = express()
// app.use(express.static('public'))

app.use('/public', express.static(path.join(__dirname, 'public')))


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})

app.get("/notes",(req,res)=>{
    res.sendFile(__dirname+"/public/notes.html")
})

app.get("/api/notes",(req,res)=>{
    console.log(`${req.method} recieved request for new note`)

    fs.readFile("./db/db.json","utf8", function  (err, data){
        if(err){
            throw err;
        }
        const content = data;
        res.send(content)
    })

})

app.post("/api/notes",(req,res)=>{
    console.log(`${req.method} recieved request to post new note`)
    console.log(req.body)
    console.log(req.status)
    const { title, text }= req.body;

    if (title && text){

        const newNote = {
            title,
            text
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              // Convert string into JSON object
              const parsedNotes = JSON.parse(data);
      
              // Add a new review
              parsedNotes.push(newNote);
      
              // Write updated reviews back to the file
              fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated reviews!')
              );
            }
          });
      
          const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);
          res.json(response);

    } else{
        res.json('error in posting new note')
    }

})

app.delete("/api/notes/:id",(req,res)=>{
   
    if(req.params.id){
        const title = req.params.id.replace("&"," ")
        console.log(title)

        fs.readFile("./db/db.json", "Utf8",function(err,response){
            if(err){
                throw err;
            }
            const json = JSON.parse(response)
            console.log(json)
            for(let i=0;i<json.length;i++){
                if(json[i].title == title){
                    json.splice(i, 1)
                    console.log(json, "new arr")

                    fs.writeFile("./db/db.json",JSON.stringify(json),(err,res)=>{
                        if (err){
                            throw err
                        }
                    })
                    res.send("deleted")
                }
            }
        })

    }
})

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})