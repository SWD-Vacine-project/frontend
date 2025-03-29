import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UpdateChild = ({ open, handleClose, selectedChild, setChildren }) => {
  const [childData, setChildData] = useState({
    name: "",
    dob: "",
    bloodType: "",
    gender: "",
  });

  useEffect(() => {
    if (selectedChild) {
      setChildData(selectedChild);
    }
  }, [selectedChild]);

  const handleChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!childData?.childId) {
        toast.error("Missing child ID!", { autoClose: 3000 });
        return;
      }

      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) {
        toast.error("Customer information not found!", { autoClose: 3000 });
        return;
      }

      const customerId = JSON.parse(storedUser).id;

      const updatedChildData = {
        ...childData,
        customerId,
      };

      console.log("Data sent to API:", updatedChildData);

      await axios.put(
        `https://vaccine-system2.azurewebsites.net/Child/update-child/${childData.childId}`,
        updatedChildData
      );

      toast.success("Update successful!", { autoClose: 3000 });

      setChildren((prevChildren) =>
        prevChildren.map((child) =>
          child.childId === childData.childId
            ? { ...child, ...updatedChildData }
            : child
        )
      );

      handleClose();
    } catch (error) {
      console.error("Server error:", error.response?.data);
      toast.error("Update failed!", { autoClose: 3000 });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Update Child Information
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          label="Name"
          name="name"
          value={childData?.name || ""}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Date of Birth"
          name="dob"
          type="date"
          value={childData?.dob || ""}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          margin="dense"
          label="Blood Type"
          name="bloodType"
          value={childData?.bloodType || ""}
          onChange={handleChange}
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="O">O</MenuItem>
          <MenuItem value="AB">AB</MenuItem>
        </TextField>
        <TextField
          select
          fullWidth
          margin="dense"
          label="Gender"
          name="gender"
          value={childData?.gender || ""}
          onChange={handleChange}
        >
          <MenuItem value="M">Male</MenuItem>
          <MenuItem value="F">Female</MenuItem>
        </TextField>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateChild;