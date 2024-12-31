const express =require('express')
const router = express.Router();
const Class = require('../Modal/CreateClass'); 
const Teacher=require("../Modal/Teacher")
router.use(express.json());

router.post('/create-class', async (req, res) => {
  const { className, section } = req.body; // Expecting className and section

  // Validation for missing fields
  if (!className || !section) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Create new class document
    const newClass = new Class({
      className,
      section,
    });

    // Save to database
    await newClass.save();
    res.status(201).json({ message: 'Class created successfully!', newClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

router.put('/update-class-addteacher/:id', async (req, res) => {
  try {
    const { teacher } = req.body;
    console.log("i am a req body"  + JSON.stringify(req.body))
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { teacher },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    const updatedteacher= await Teacher.findByIdAndUpdate(teacher,{class:req.params.id},{new:true})
    if (!updatedteacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: /Class/update-class/:id
router.put('/update-class/:id', async (req, res) => {
  const { className, section } = req.body;
  const { id } = req.params;

  // Validation for missing fields
  if (!className || !section) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { className, section },
      { new: true }  // This returns the updated document
    );

    if (!updatedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.status(200).json({ message: 'Class updated successfully!', updatedClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

//
// DELETE: /Class/delete-class/:id
router.delete('/delete-class/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.status(200).json({ message: 'Class deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});



  router.get('/get-all-classes', async (req, res) => {
    try {
      const classes = await Class.find(); // Fetch all classes
      res.status(200).json(classes); // Return the classes as an array
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the classes.' });
    }
  });
  
  module.exports = router;