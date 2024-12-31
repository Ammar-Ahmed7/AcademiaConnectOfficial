const mongoose =require('mongoose');
const createClassSchema=new mongoose.Schema({
    className: {
        type: Number,
        required: true,
      },
      section: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D'], // Allow only these sections
      },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', // Reference to the Teacher model
        required: false, // Set to false if not every class will have a teacher assigned immediately
      },
      students:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Teacher model
        required: false, // Set to false if not every class will have a teacher assigned immediately
      }]

})
module.exports=mongoose.model('Class',createClassSchema)