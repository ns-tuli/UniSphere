import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  RemoveCircleOutline as RemoveIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClassId, setCurrentClassId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    department: "",
    courseCode: "",
    name: "",
    description: "",
    credits: "",
    days: [],
    time: "",
    location: "",
    professor: "",
    email: "",
    officeHours: "",
    officeLocation: "",
    learningOutcomes: [""],
    materials: [""],
    textbooks: [
      {
        title: "",
        author: "",
        isbn: "",
        required: true,
      },
    ],
    assignments: [
      {
        name: "",
        dueDate: null,
        points: "",
        status: "upcoming",
      },
    ],
    gradeBreakdown: {
      assignments: "30",
      midterm: "30",
      final: "40",
    },
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchClasses();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const filtered = classes.filter(
      (classItem) =>
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.courseCode
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        classItem.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [searchQuery, classes]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/class");
      setClasses(response.data);
      setFilteredClasses(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      showNotification("Error fetching classes", "error");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      showNotification("Error fetching departments", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDaysChange = (day) => {
    const newDays = formData.days.includes(day)
      ? formData.days.filter((d) => d !== day)
      : [...formData.days, day];
    setFormData((prev) => ({ ...prev, days: newDays }));
  };

  const handleGradeBreakdownChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      gradeBreakdown: {
        ...prev.gradeBreakdown,
        [category]: value,
      },
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleTextbookChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      textbooks: prev.textbooks.map((book, i) =>
        i === index ? { ...book, [field]: value } : book
      ),
    }));
  };

  const addTextbook = () => {
    setFormData((prev) => ({
      ...prev,
      textbooks: [
        ...prev.textbooks,
        { title: "", author: "", isbn: "", required: true },
      ],
    }));
  };

  const removeTextbook = (index) => {
    setFormData((prev) => ({
      ...prev,
      textbooks: prev.textbooks.filter((_, i) => i !== index),
    }));
  };

  const handleAssignmentChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((assignment, i) =>
        i === index ? { ...assignment, [field]: value } : assignment
      ),
    }));
  };

  const addAssignment = () => {
    setFormData((prev) => ({
      ...prev,
      assignments: [
        ...prev.assignments,
        {
          name: "",
          dueDate: null,
          points: "",
          status: "upcoming",
        },
      ],
    }));
  };

  const removeAssignment = (index) => {
    setFormData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index),
    }));
  };

  const openCreateForm = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setFormData({
      department: "",
      courseCode: "",
      name: "",
      description: "",
      credits: "",
      days: [],
      time: "",
      location: "",
      professor: "",
      email: "",
      officeHours: "",
      officeLocation: "",
      learningOutcomes: [""],
      materials: [""],
      textbooks: [
        {
          title: "",
          author: "",
          isbn: "",
          required: true,
        },
      ],
      assignments: [
        {
          name: "",
          dueDate: null,
          points: "",
          status: "upcoming",
        },
      ],
      gradeBreakdown: {
        assignments: "30",
        midterm: "30",
        final: "40",
      },
    });
  };

  const openEditForm = async (classId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/class/${classId}`
      );
      setFormData(response.data);
      setCurrentClassId(classId);
      setIsFormOpen(true);
      setIsEditing(true);
    } catch (err) {
      showNotification("Error fetching class details", "error");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentClassId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/class/${currentClassId}`,
          formData
        );
        showNotification("Class updated successfully", "success");
      } else {
        await axios.post("http://localhost:5000/api/class", formData);
        showNotification("Class created successfully", "success");
      }
      fetchClasses();
      closeForm();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Error saving class",
        "error"
      );
    }
  };

  const handleDelete = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axios.delete(`http://localhost:5000/api/class/${classId}`);
        showNotification("Class deleted successfully", "success");
        fetchClasses();
      } catch (err) {
        showNotification("Error deleting class", "error");
      }
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      {notification.show && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Search Classes"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Add New Class
        </Button>
      </Box>

      {isFormOpen && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">
              {isEditing ? "Edit Class" : "Add New Class"}
            </Typography>
            <IconButton onClick={closeForm}>
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept._id} value={dept.name}>
                            {dept.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Course Code"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Credits"
                      name="credits"
                      type="number"
                      value={formData.credits}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Schedule Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Schedule Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormGroup row>
                      {daysOfWeek.map((day) => (
                        <FormControlLabel
                          key={day}
                          control={
                            <Checkbox
                              checked={formData.days.includes(day)}
                              onChange={() => handleDaysChange(day)}
                            />
                          }
                          label={day}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Instructor Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Instructor Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Professor Name"
                      name="professor"
                      value={formData.professor}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Office Hours"
                      name="officeHours"
                      value={formData.officeHours}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Office Location"
                      name="officeLocation"
                      value={formData.officeLocation}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Learning Outcomes */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Learning Outcomes
                </Typography>
                {formData.learningOutcomes.map((outcome, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Learning Outcome ${index + 1}`}
                      value={outcome}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          "learningOutcomes",
                          index,
                          e.target.value
                        )
                      }
                    />
                    {index > 0 && (
                      <IconButton
                        color="error"
                        onClick={() =>
                          removeArrayField("learningOutcomes", index)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addArrayField("learningOutcomes")}
                >
                  Add Learning Outcome
                </Button>
              </Grid>

              {/* Materials */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Required Materials
                </Typography>
                {formData.materials.map((material, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Material ${index + 1}`}
                      value={material}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          "materials",
                          index,
                          e.target.value
                        )
                      }
                    />
                    {index > 0 && (
                      <IconButton
                        color="error"
                        onClick={() => removeArrayField("materials", index)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addArrayField("materials")}
                >
                  Add Material
                </Button>
              </Grid>

              {/* Textbooks */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Textbooks
                </Typography>
                {formData.textbooks.map((textbook, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Title"
                          value={textbook.title}
                          onChange={(e) =>
                            handleTextbookChange(index, "title", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Author"
                          value={textbook.author}
                          onChange={(e) =>
                            handleTextbookChange(
                              index,
                              "author",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="ISBN"
                          value={textbook.isbn}
                          onChange={(e) =>
                            handleTextbookChange(index, "isbn", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={textbook.required}
                              onChange={(e) =>
                                handleTextbookChange(
                                  index,
                                  "required",
                                  e.target.checked
                                )
                              }
                            />
                          }
                          label="Required Textbook"
                        />
                      </Grid>
                    </Grid>
                    {index > 0 && (
                      <Button
                        color="error"
                        startIcon={<RemoveIcon />}
                        onClick={() => removeTextbook(index)}
                        sx={{ mt: 1 }}
                      >
                        Remove Textbook
                      </Button>
                    )}
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addTextbook}>
                  Add Textbook
                </Button>
              </Grid>

              {/* Assignments */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Assignments
                </Typography>
                {formData.assignments.map((assignment, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Assignment Name"
                          value={assignment.name}
                          onChange={(e) =>
                            handleAssignmentChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Due Date"
                            value={
                              assignment.dueDate
                                ? dayjs(assignment.dueDate)
                                : null
                            }
                            onChange={(date) =>
                              handleAssignmentChange(
                                index,
                                "dueDate",
                                date ? date.toDate() : null
                              )
                            }
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Points"
                          type="number"
                          value={assignment.points}
                          onChange={(e) =>
                            handleAssignmentChange(
                              index,
                              "points",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={assignment.status}
                            onChange={(e) =>
                              handleAssignmentChange(
                                index,
                                "status",
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="upcoming">Upcoming</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {index > 0 && (
                      <Button
                        color="error"
                        startIcon={<RemoveIcon />}
                        onClick={() => removeAssignment(index)}
                        sx={{ mt: 1 }}
                      >
                        Remove Assignment
                      </Button>
                    )}
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addAssignment}>
                  Add Assignment
                </Button>
              </Grid>

              {/* Grade Breakdown */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Grade Breakdown
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(formData.gradeBreakdown).map(
                    ([category, percentage]) => (
                      <Grid item xs={12} sm={4} key={category}>
                        <TextField
                          fullWidth
                          label={
                            category.charAt(0).toUpperCase() + category.slice(1)
                          }
                          type="number"
                          value={percentage}
                          onChange={(e) =>
                            handleGradeBreakdownChange(category, e.target.value)
                          }
                          InputProps={{
                            endAdornment: <Typography>%</Typography>,
                          }}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button onClick={closeForm}>Cancel</Button>
                  <Button type="submit" variant="contained" color="primary">
                    {isEditing ? "Update Class" : "Create Class"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      <Grid container spacing={2}>
        {filteredClasses.map((classItem) => (
          <Grid item xs={12} sm={6} md={4} key={classItem._id}>
            <Card sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={classItem.courseCode}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    {classItem.department}
                  </Typography>
                </Box>
                <Typography variant="h6">{classItem.name}</Typography>
                <Typography variant="body2">
                  Professor: {classItem.professor}
                </Typography>
                <Typography variant="body2">
                  Schedule: {classItem.days.join(", ")} at {classItem.time}
                </Typography>
                <Typography variant="body2">
                  Location: {classItem.location}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => openEditForm(classItem._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(classItem._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClassManagement;
