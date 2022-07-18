var express=require('express');
var router=express.Router();
var Remark=require('../models/remark');
var Event=require('../models/event');

/*Routes*/

router.get('/:id/like',(req,res,next)=>{
    var id=req.params.id;
    Remark.findById(id,(err,remark)=>{
        var likes=remark.likes;
        Remark.findByIdAndUpdate(id,{likes:likes+1},(err,updatedRemark)=>{
            res.redirect('/events/'+updatedRemark.eventId);
        })
    })
});

router.get('/:id/dislike',(req,res,next)=>{
    var id=req.params.id;
    Remark.findById(id,(err,remark)=>{
        if(err) return next(err);
        var likes=remark.likes;
        Remark.findByIdAndUpdate(id,{likes:likes-1},(err,updatedRemark)=>{
            if(err) return next(err);
            res.redirect('/events/'+updatedRemark.eventId);
        })
    })
});

router.get('/:id/edit',(req,res,next)=>{
    var id=req.params.id;
    Remark.findById(id,(err,remark)=>{
        if(err) return next(err);
        res.render('remarkEditForm.ejs',{remark:remark});
    });   
});

router.post('/:id',(req,res,next)=>{
    var id=req.params.id;
    Remark.findByIdAndUpdate(id,req.body,(err,updatedRemark)=>{
        if(err) return next(err);
        res.redirect('/events/'+updatedRemark.eventId);
    })
});

router.get('/:id/delete',(req,res,next)=>{
    var id=req.params.id;
    Remark.findByIdAndDelete(id,(err,remark)=>{
        if(err) return next(err);
        Event.findByIdAndUpdate(remark.eventId,{$pull:{remarks:remark._id}},(err,updatedEvent)=>{
            if(err) return next(err);
            res.redirect('/events/'+updatedEvent._id);
        });
    })
});



module.exports=router;