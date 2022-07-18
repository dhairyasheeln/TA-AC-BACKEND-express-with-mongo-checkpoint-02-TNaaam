const e = require('express');
var express = require('express');
var router = express.Router();
var Event=require('../models/event');
var Remark=require('../models/remark');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.url);
  Event.find({},(err,events)=>{
    if(err) return next(err);
    res.render('events.ejs',{events:events});
  });
});

router.get('/new',(req,res,next)=>{
  res.render('eventForm.ejs');
});

router.post('/',(req,res,next)=>{
  req.body.event_category=req.body.event_category.trim().split(',');
  Event.create(req.body,(err,event)=>{
    if(err) return next(err);
    res.redirect('/events');
  });
});

router.get('/sort/tags',(req,res,next)=>{
  console.log(req.query);
});


/*............................................*/
// router.get('/:id',(req,res,next)=>{
//   var id=req.params.id;
//   Event.findById(id,(err,event)=>{
//     if(err) return next(err);
//     console.log(event);
//     Remark.find({eventId:id},(err,remark)=>{
//       res.render('eventDetail.ejs',{event:event,remark:remark});
//     })
      
//     });
//   });

  router.get('/:id',(req,res,next)=>{
    var id=req.params.id;
    Event
    .findById(id)
    .populate('remarks')
    .exec((err,event)=>{
      if(err) return next(err);
      res.render('eventDetail.ejs',{event:event});
    })
    });




router.get('/:id/like',(req,res)=>{
  var id=req.params.id;
  Event.findById(id,(err,event)=>{
    if(err) return next(err);
    var likes=event.likes;
    Event.findByIdAndUpdate(id,{likes:likes+1},(err,updatedEvent)=>{
      if(err) return next(err);
      res.redirect('/events/'+updatedEvent._id);
    })
  })
});

router.get('/:id/dislike',(req,res)=>{
  var id=req.params.id;
  Event.findById(id,(err,event)=>{
    if(err) return next(err);
    var likes=event.likes;
    Event.findByIdAndUpdate(id,{likes:likes-1},(err,updatedEvent)=>{
      if(err) return next(err);
      res.redirect('/events/'+updatedEvent._id);
    })
  })
});

router.get('/:id/edit',(req,res,next)=>{
  var id=req.params.id;
  Event.findById(id,(err,event)=>{
    if(err) return next(err);
    res.render('eventEditForm.ejs',{event:event});
  });
  
});

router.post('/:id',(req,res,next)=>{
  var id=req.params.id;
  Event.findByIdAndUpdate(id,req.body,(err,updatedEvent)=>{
    res.redirect('/events/'+updatedEvent._id);
  });
});

router.get('/:id/delete',(req,res,next)=>{
  var id=req.params.id;
  Event.findByIdAndDelete(id,(err,event)=>{
    if(err) return next(err); 
    Remark.deleteMany({eventId:event.id},(err,info)=>{
      if(err) return next(err);
      res.redirect('/events');
    });
  });
});

router.post('/:id/remark',(req,res,err)=>{
  var id=req.params.id;
  console.log('Event ID:'+id);
  req.body.eventId=id;
  Remark.create(req.body,(err,remark)=>{
    if(err) return next(err);
    Event.findByIdAndUpdate(id,{$push:{remarks:remark._id}},(err,updatedEvent)=>{
      if(err) return next(err);
      res.redirect('/events/'+id);
    });
  })
});



module.exports = router;
