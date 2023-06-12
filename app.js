

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://shraddha229:<password>@cluster0.brbhrrq.mongodb.net/",{
  dbName: 'todolistDB',
},()=>{
  console.log("db is connected");
});

const itemsSchema={
  name:String
};
const Item= mongoose.model("Item",itemsSchema);
 
const item1 = new  Item ({
  name:"welcome"
});

const item2 = new  Item ({
  name:"+ to add"
});

const item3 = new  Item ({
  name:"-- to subtract"
});

const defaultItems =  [item1,item2,item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);




// IT WILL BE THE DEFAULT LIST IN WHICH ITEMS
// WILL BE ADD

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    
    if(foundItems.length==0)
    {
      Item.insertMany(defaultItems,function(err){
  if(err)
  {
    console.log(err);
  }else {
    console.log("Successfully saved all tht items in DB");
  }

});
res.redirect("/");
}
else{
  res.render("list", {listTitle: "Today", newListItems: foundItems});

}

    });
  });


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  // listname to get the extra route aur exta tido list page
 const listName=req.body.list; 
 //ADD ITEM IN THE TODO LIST DATABASE
  
 const item =new Item({
   name:itemName
 });
if(listName=="Today")
{
 item.save();
 res.redirect("/");
}
else 
{
  List.findOne({name:listName},function(err,foundList)
  {
   foundList.items.push(item);
   foundList.save();
   res.redirect("/"+listName);
  });
}});



// SCHEMA FOR NEW  LIST ITME JO KI HAM LIST MAIN DAALEGAY

// const listSchema={
//   name:String,
//   items:[itemsSchema]
// };

// const List = mongoose.model("List",listSchema);

/// TO ADD NEW ITEMS IN THE CIUSTOM LIST 
app.get("/:customListName",function(req,res)
{
  const customListName = _.capitalize(req.params.customListName);


  
   List.findOne({name:customListName},function(err,foundList)
   {
     if(!err)
     {
       if(!foundList)
       {
        const list = new List({
          name:customListName,
          items:defaultItems
        });
     list.save();
     res.redirect("/"+customListNameListName);
       }
       else
       {
         res.render("list" , {listTitle:foundList.name, newListItems:foundList.items});
       }

     }
   });
  });


  
//NEW ROUTE TO DELETER ITME IN THE TODOLIST

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

// app.post("/delete",function(req,res){
//   const id=req.body.checkbox;

//   const listName = req.body.listName;

//   if(listName==="Today")
//   {
//     Item.findByIdAndRemove(id,function(err)
//     {
//       if(!err)
//       {
//         console.log("Successfully deleted");
//         res.redirect("/");
//       }
     
//     });
//   }
//   else
//   {
//     List.findOneAndUpdate({name: listName},{$pull :{items:{_id: id}}},function(err,foundList){
//     if(!err)
//     {
//       res.redirect("/"+listName);
//     }
//   });
// }
// });





app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
}); 

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(2000, function() {
  console.log("Server started on port 2000");
});
