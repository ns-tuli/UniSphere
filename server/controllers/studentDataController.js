import StudentData from "../models/studentData.js";

export const getStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentData = await StudentData.findOne({ studentId });

    if (!studentData) {
      return res.status(404).json({ message: "Student data not found" });
    }

    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudentData = async (req, res) => {
  try {
    const newStudentData = new StudentData(req.body);
    await newStudentData.save();
    res.status(201).json(newStudentData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updatedData = await StudentData.findOneAndUpdate(
      { studentId },
      { ...req.body, lastUpdated: Date.now() },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Student data not found" });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const deletedData = await StudentData.findOneAndDelete({ studentId });

    if (!deletedData) {
      return res.status(404).json({ message: "Student data not found" });
    }

    res.status(200).json({ message: "Student data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
