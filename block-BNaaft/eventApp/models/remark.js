var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var remarkSchema=new Schema({
    title:{type:String},
    author:{type:String},
    likes:{type:Number,default:0},
    eventId:{type:Schema.Types.ObjectId,ref:"Event"}
});

var Remark=mongoose.model('Remark',remarkSchema);
module.exports=Remark;