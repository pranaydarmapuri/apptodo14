import mongoose from "mongoose";
const TodosSchema=new mongoose.Schema({
   id:{ type:String,
    required:true,
    unique:true,
},
desc : {
    type:String,
    required:true,
},
completed:{
    type:Boolean,
    default:false,

},


});
const Todo= mongoose.model("todos",TodosSchema)

export default Todo;