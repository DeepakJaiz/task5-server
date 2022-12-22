let express=require("express")
let app=express();
app.use(express.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next();
});
const port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Node App Listening on port ${port}!`));

const {furnitureData}=require("./furnitureData.js")
let fs= require("fs");
let fname="furniture.json"

app.get("/resetData",function(req,res){
    let data= JSON.stringify(furnitureData)
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err)
        else res.send("Data in file is reset")
    })
})

app.post("/login",async function(req,res){
    try{
        let body = req.body;
        let user = await fs.promises.readFile(fname,"utf8")
        let data1 = JSON.parse(user)
        let userData = data1.user.find((u)=>u.email===body.email&&u.password===body.password)
        if (userData === undefined) res.status(500).send("Invalid username or password");
        else{
            res.send(userData);
        }
    }
    catch(error){
        res.status(404).send(error)
    }
})

app.get("/products",async function(req,res){
    try{
        let product = await fs.promises.readFile(fname,"utf8")
        let data1 = JSON.parse(product)
        console.log("products",data1)
        res.send(data1.furnitures)
    }
    catch(error){
        res.status(404).send(error)
    }
})

app.get("/product/:id", async function(req,res){
    try{
        const {id}=req.params
        let product = await fs.promises.readFile(fname,"utf8")
        let data1 = JSON.parse(product)
        console.log("product by id",data1)
        let product1 = data1.furnitures.find((st)=>st.prodCode===id)
        res.send(product1)
    }
    catch(error){
        res.status(404).send(error)
    }
})

app.get("/products/:category", async function(req,res){
    try{
        const {category}=req.params
        let product = await fs.promises.readFile(fname,"utf8")
        let data1 = JSON.parse(product)
        console.log("product by id",data1)
        let product1 = data1.furnitures.filter((st)=>st.category===category)
        res.send(product1)
    }
    catch(error){
        res.status(404).send(error)
    }
})

app.post("/products",async function(req,res){
    try{
        const body=req.body
        let product = await fs.promises.readFile(fname,"utf8")
        let data1 = JSON.parse(product)
        let newProduct = {...body}
        data1.furnitures.push(newProduct);
        let data2 = JSON.stringify(data1);
        await fs.promises.writeFile(fname,data2)
        res.send(newProduct)
    }
    catch(error){
        res.status(404).send(error)
    }
})
app.put("/products/:id",async function(req,res){
    try{
        const body=req.body
        const {id}=req.params
        let product = await fs.promises.readFile(fname,"utf8")
        let data1 = JSON.parse(product)
        let index = data1.furnitures.findIndex((st)=>st.prodCode===id) 
        if(index>=0){
            let updatedProduct = {...data1.furnitures[index],...body}
            data1.furnitures[index]=updatedProduct
            let data2 = JSON.stringify(data1);
        await fs.promises.writeFile(fname,data2)
            res.send(updatedProduct)
            }
         else{
                res.status(404).send("No Product Found")
             }
    }
    catch(error){
        res.status(404).send(error)
    }
})
app.delete("/products/:id",async function(req,res){
    try{
        const {id}=req.params
        let product = await fs.promises.readFile(fname,"utf8")
        let data1 = JSON.parse(product)
        let index = data1.furnitures.findIndex((st)=>st.prodCode===id) 
        if(index>=0){
            let deletedProduct = data1.furnitures.splice(index,1)
            let data2 = JSON.stringify(data1);
            await fs.promises.writeFile(fname,data2)
            res.send(deletedProduct)
            }
            else{
                res.status(404).send("No Product Found")
             }
    }
    catch(error){
        res.status(404).send(error)
    }
})