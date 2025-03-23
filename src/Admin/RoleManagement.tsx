import React, { useState, useEffect } from "react";
import {
  Container as MuiContainer,
  Typography,
  Paper,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SelectChangeEvent } from "@mui/material/Select";

const useStyles = makeStyles((theme: any) => ({
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "20px auto",
    background: "rgba(248, 247, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "25px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    fontFamily: "'Inter', sans-serif",
  },
  sectionTitle: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#4a3aff",
    fontWeight: 600,
    background: "linear-gradient(90deg, #4a3aff, #6c5ce7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  formPaper: {
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "rgba(245, 245, 245, 0.95)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  formControl: {
    marginBottom: "16px",
    minWidth: "150px",
  },
  submitButton: {
    marginTop: "20px",
    padding: "12px 0",
    fontWeight: 600,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  tablePaper: {
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "white",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  tableHeaderCell: {
    backgroundColor: "#4a3aff",
    color: "white",
    fontWeight: "bold",
    padding: "10px 15px",
  },
  tableCell: {
    padding: "10px 15px",
  },
}));

// Component tạo staff
const CreateStaff: React.FC = () => {
  const classes = useStyles();
  // Giá trị mặc định cho form: role là "Receptionist", gender là "M"
  const [newStaff, setNewStaff] = useState({
    name: "",
    dob: "", // yyyy-mm-dd
    gender: "M",
    phone: "",
    email: "",
    role: "Receptionist",
    userName: "",
    password: "",
    degree: "",
    experienceYears: "",
  });

  const API_URL = "https://vaccine-system1.azurewebsites.net/Staff/create-staff";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewStaff((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateStaff = async () => {
    // Validate số điện thoại: phải chứa đúng 10 số
    if (!/^\d{10}$/.test(newStaff.phone)) {
      toast.error("Số điện thoại phải có 10 số");
      return;
    }
    // Validate giới tính: chỉ cho phép "M" hoặc "F"
    if (newStaff.gender !== "M" && newStaff.gender !== "F") {
      toast.error("Giới tính phải là M hoặc F");
      return;
    }
    // Validate userName: phải bắt đầu bằng "ST"
    if (!newStaff.userName.startsWith("ST")) {
      toast.error("UserName phải bắt đầu bằng ST");
      return;
    }
    // Kiểm tra nếu nhập số năm kinh nghiệm không phải là số
    if (newStaff.experienceYears && isNaN(Number(newStaff.experienceYears))) {
      toast.error("Số năm kinh nghiệm phải là số");
      return;
    }

    const payload = {
      ...newStaff,
      experienceYears: newStaff.experienceYears
        ? parseInt(newStaff.experienceYears, 10)
        : 0,
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      // Hiển thị thông báo thành công từ backend
      toast.success(response.data.message || "Tạo tài khoản staff thành công");
      // Reset lại form, giữ giá trị mặc định cho role và gender
      setNewStaff({
        name: "",
        dob: "",
        gender: "M",
        phone: "",
        email: "",
        role: "Receptionist",
        userName: "",
        password: "",
        degree: "",
        experienceYears: "",
      });
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Tạo tài khoản staff thất bại";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper className={classes.formPaper} elevation={4}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Tạo Tài Khoản Staff
        </Typography>
        <Box display="flex" flexWrap="wrap" gap="24px">
          <Box flex="1 1 45%" mt={3}>
            <TextField
              label="Tên"
              variant="outlined"
              fullWidth
              name="name"
              value={newStaff.name}
              onChange={handleInputChange}
              placeholder="Nhập tên đầy đủ"
            />
          </Box>
          <Box flex="1 1 45%" mt={3}>
            <TextField
              label="Ngày sinh"
              variant="outlined"
              fullWidth
              name="dob"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newStaff.dob}
              onChange={handleInputChange}
            />
          </Box>
          <Box flex="1 1 45%">
            <FormControl variant="outlined" fullWidth className={classes.formControl}>
              <InputLabel id="gender-label">Giới tính</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={newStaff.gender}
                onChange={handleSelectChange}
                label="Giới tính"
              >
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box flex="1 1 45%">
            <TextField
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              name="phone"
              value={newStaff.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
            />
          </Box>
          <Box flex="1 1 45%">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={newStaff.email}
              onChange={handleInputChange}
              placeholder="example@domain.com"
            />
          </Box>
          <Box flex="1 1 45%">
            <FormControl variant="outlined" fullWidth className={classes.formControl}>
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={newStaff.role}
                onChange={handleSelectChange}
                label="Vai trò"
              >
                <MenuItem value="Receptionist">Receptionist</MenuItem>
                <MenuItem value="Nurse">Nurse</MenuItem>
                <MenuItem value="Data Entry">Data Entry</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box flex="1 1 45%">
            <TextField
              label="User Name"
              variant="outlined"
              fullWidth
              name="userName"
              value={newStaff.userName}
              onChange={handleInputChange}
              placeholder="Tên đăng nhập (phải bắt đầu bằng ST)"
            />
          </Box>
          <Box flex="1 1 45%">
            <TextField
              label="Mật khẩu"
              variant="outlined"
              fullWidth
              name="password"
              type="password"
              value={newStaff.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
            />
          </Box>
          <Box flex="1 1 45%">
            <TextField
              label="Bằng cấp"
              variant="outlined"
              fullWidth
              name="degree"
              value={newStaff.degree}
              onChange={handleInputChange}
              placeholder="Nhập bằng cấp"
            />
          </Box>
          <Box flex="1 1 45%">
            <TextField
              label="Số năm kinh nghiệm"
              variant="outlined"
              fullWidth
              name="experienceYears"
              type="number"
              value={newStaff.experienceYears}
              onChange={handleInputChange}
              placeholder="Nhập số năm kinh nghiệm"
            />
          </Box>
        </Box>
        <Box mt={2}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCreateStaff}
              className={classes.submitButton}
            >
              Tạo tài khoản
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

// Interface cho dữ liệu staff theo response mẫu
interface Staff {
  staffId: number;
  name: string;
  role: string;
  gender: string;
  phone: string;
  dob: string;
  email: string;
  status: string;
  userName: string;
  experienceYears: number | null;
  degree: string | null;
}

// Component lấy danh sách staff
const GetStaffs: React.FC = () => {
  const classes = useStyles();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_URL = "https://vaccine-system1.azurewebsites.net/Staff/get-staffs";

  useEffect(() => {
    const fetchStaffs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL);
        console.log("Fetched staffs:", response.data);
        setStaffs(response.data);
      } catch (err: any) {
        console.error(err);
        const errorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Lỗi tải danh sách staff";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper className={classes.tablePaper} elevation={4}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Danh Sách Staff
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>ID</TableCell>
                <TableCell className={classes.tableHeaderCell}>Tên</TableCell>
                <TableCell className={classes.tableHeaderCell}>Email</TableCell>
                <TableCell className={classes.tableHeaderCell}>Vai trò</TableCell>
                <TableCell className={classes.tableHeaderCell}>Giới tính</TableCell>
                <TableCell className={classes.tableHeaderCell}>SĐT</TableCell>
                <TableCell className={classes.tableHeaderCell}>Ngày sinh</TableCell>
                <TableCell className={classes.tableHeaderCell}>Trạng thái</TableCell>
                <TableCell className={classes.tableHeaderCell}>UserName</TableCell>
                <TableCell className={classes.tableHeaderCell}>Kinh nghiệm</TableCell>
                <TableCell className={classes.tableHeaderCell}>Bằng cấp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffs.map((staff, index) => (
                <TableRow key={staff.staffId || index}>
                  <TableCell className={classes.tableCell}>{staff.staffId}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.name}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.email}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.role}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.gender}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.phone}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.dob}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.status}</TableCell>
                  <TableCell className={classes.tableCell}>{staff.userName}</TableCell>
                  <TableCell className={classes.tableCell}>
                    {staff.experienceYears !== null ? staff.experienceYears : "N/A"}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {staff.degree || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </motion.div>
  );
};

// Trang chính quản lý staff với layout 2 cột
const StaffManagement: React.FC = () => {
  const classes = useStyles();
  return (
    <MuiContainer className={classes.container}>
      <ToastContainer autoClose={3000} />
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap="20px">
        <Box flex="1">
          <CreateStaff />
        </Box>
        <Box flex="1">
          <GetStaffs />
        </Box>
      </Box>
    </MuiContainer>
  );
};

export default StaffManagement;
