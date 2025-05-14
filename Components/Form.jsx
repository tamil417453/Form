import React, { useState } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Style.css";

function App() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [hasExperience, setHasExperience] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(8, "Min 8 characters")
      .matches(/[A-Z]/, "At least one uppercase")
      .matches(/[a-z]/, "At least one lowercase")
      .matches(/[0-9]/, "At least one number")
      .matches(/[@,_,$,#,&,*]/, "At least one special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    gender: Yup.string().required("Gender is required"),
    location: Yup.string().required("Location is required"),
    education: Yup.string().required("Education is required"),
    skills: Yup.array()
      .of(Yup.string().required("Skill cannot be empty"))
      .min(1, "Please enter at least one skill")
      .required("Skill is required"),
    experienceDetails: Yup.string().when([], {
      is: () => hasExperience,
      then: () => Yup.string().required("Experience details required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      gender: "",
      location: "",
      education: "",
      skills: [],
      experienceDetails: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const finalData = {
        ...values,
        skills: [...skills],
        hasExperience,
        file: selectedFile?.name || "No file uploaded",
      };

      setSubmittedData((prev) => [...prev, finalData]);
      resetForm();
      setSkills([]);
      setSkillInput("");
      setHasExperience(false);
      setSelectedFile(null);
    },
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        const updatedSkills = [...skills, skillInput.trim()];
        setSkills(updatedSkills);
        formik.setFieldValue("skills", updatedSkills);
        formik.setFieldError("skills", "");
      }
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToDelete);
    setSkills(updatedSkills);
    formik.setFieldValue("skills", updatedSkills);
  };

  return (
    <div
      style={{
        backgroundImage: `url('/overhead-view-yellow-grey-cardboard-papers-blue-surface.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="page-container">
        <div className="animated-card">
          <h2>✨ Fill this Form</h2>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mobile"
              {...formik.getFieldProps("mobile")}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              {...formik.getFieldProps("confirmPassword")}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              margin="normal"
            />

            {/* Gender */}
            <FormControl margin="normal">
              <FormLabel>Gender</FormLabel>
              <RadioGroup row {...formik.getFieldProps("gender")}>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <div className="error">{formik.errors.gender}</div>
              )}
            </FormControl>

            {/* Location and Education */}
            <TextField
              fullWidth
              label="Location"
              {...formik.getFieldProps("location")}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Education"
              {...formik.getFieldProps("education")}
              error={
                formik.touched.education && Boolean(formik.errors.education)
              }
              helperText={formik.touched.education && formik.errors.education}
              margin="normal"
            />

            {/* Skills Input */}
            <div className="skill-chip-container">
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                  style={{ margin: "5px" }}
                  color="primary"
                  variant="outlined"
                />
              ))}
              <TextField
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                error={Boolean(formik.errors.skills)}
                helperText={formik.errors.skills}
                fullWidth
                margin="normal"
              />
            </div>

            {/* Experience */}
            <label className="experience-checkbox">
              <input
                type="checkbox"
                checked={hasExperience}
                onChange={(e) => setHasExperience(e.target.checked)}
              />{" "}
              Do you have work experience?
            </label>

            {hasExperience && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Experience Details"
                {...formik.getFieldProps("experienceDetails")}
                error={
                  formik.touched.experienceDetails &&
                  Boolean(formik.errors.experienceDetails)
                }
                helperText={
                  formik.touched.experienceDetails &&
                  formik.errors.experienceDetails
                }
                margin="normal"
              />
            )}

            {/* File Upload */}
            <div style={{ margin: "1rem 0" }}>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              {selectedFile && <p>Selected: {selectedFile.name}</p>}
            </div>

            <Button
              type="submit"
              variant="contained"
              className="submit-button"
              disabled={!formik.isValid || !formik.dirty}
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Submit
            </Button>
          </form>
        </div>

        {/* Submitted Table */}
        {submittedData.length > 0 && (
          <div className="submitted-table">
            <h3>📝 Submitted Data</h3>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submittedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.gender}</TableCell>
                      <TableCell>{row.skills.join(", ")}</TableCell>
                      <TableCell>{row.file}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
