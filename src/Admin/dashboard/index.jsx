import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../../src/theme";
import { mockTransactions, mockDataTeam } from "../../../src/Admin/data/mockData";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../../src/components/dashboardChart/Header";
import LineChart from "../../../src/components/dashboardChart/LineChart";
import BarChart from "../../../src/components/dashboardChart/BarChart";
import StatBox from "../../../src/components/dashboardChart/StatBox";
import PieChart from "../../../src/components/dashboardChart/PieChart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Định nghĩa biến navigate

  const goToRoleManagement = () => {
    navigate("/roleManagement");
  };

  // Hàm lấy ngày hiện tại theo định dạng YYYY-MM-DD
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State cho bộ lọc ngày (bao gồm ngày, tháng, năm)
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);

  // Các state hiển thị doanh thu tổng hợp
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [dailyRevenueChange, setDailyRevenueChange] = useState("0%");
  const [monthlyRevenueChange, setMonthlyRevenueChange] = useState("0%");
  const [yearlyRevenueChange, setYearlyRevenueChange] = useState("0%");
  const [newUser, setNewUser] = useState("");

  // Hàm tính tổng doanh thu từ mockDataTeam theo ngày, tháng hay năm.
  const getTotalPaid = (date, type) => {
    let totalPaid = 0;
    mockDataTeam.forEach((user) => {
      for (const bookingId in user.bookings) {
        const booking = user.bookings[bookingId];
        if (booking.status !== "Paid") continue;
        const bookingDate = new Date(booking.createdAt || booking.date);
        const formattedDate = `${bookingDate.getFullYear()}-${(bookingDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${bookingDate.getDate().toString().padStart(2, "0")}`;
        if (type === "date" && date === formattedDate) {
          totalPaid += booking.totalPaid || 0;
        } else if (type === "month" && formattedDate.startsWith(date)) {
          totalPaid += booking.totalPaid || 0;
        } else if (type === "year" && formattedDate.startsWith(date)) {
          totalPaid += booking.totalPaid || 0;
        }
      }
    });
    return totalPaid;
  };

  // Cập nhật doanh thu tổng hợp dựa trên ngày được chọn.
  useEffect(() => {
    const updateRevenue = () => {
      const targetDate = isCustomDateSelected ? selectedDate : getCurrentDate();
      const targetDateObj = new Date(targetDate);
      const targetYear = targetDateObj.getFullYear();
      const targetMonth = String(targetDateObj.getMonth() + 1).padStart(2, "0");

      const totalPaidForDay = getTotalPaid(targetDate, "date");
      const totalPaidForMonth = getTotalPaid(`${targetYear}-${targetMonth}`, "month");
      const totalPaidForYear = getTotalPaid(targetYear.toString(), "year");

      setDailyRevenue(totalPaidForDay.toLocaleString());
      setMonthlyRevenue(totalPaidForMonth.toLocaleString());
      setYearlyRevenue(totalPaidForYear.toLocaleString());

      const previousDayObj = new Date(targetDateObj);
      previousDayObj.setDate(targetDateObj.getDate() - 1);
      const previousDay = previousDayObj.toISOString().split("T")[0];

      const previousMonthObj = new Date(targetDateObj);
      previousMonthObj.setMonth(targetDateObj.getMonth() - 1);
      const previousMonth = `${previousMonthObj.getFullYear()}-${String(previousMonthObj.getMonth() + 1).padStart(2, "0")}`;

      const previousYear = (targetYear - 1).toString();

      const totalPaidForPreviousDay = getTotalPaid(previousDay, "date");
      const totalPaidForPreviousMonth = getTotalPaid(previousMonth, "month");
      const totalPaidForPreviousYear = getTotalPaid(previousYear, "year");

      const dailyPercentageChange =
        totalPaidForPreviousDay === 0
          ? "N/A"
          : (((totalPaidForDay - totalPaidForPreviousDay) / totalPaidForPreviousDay) * 100).toFixed(2) + "%";
      setDailyRevenueChange(dailyPercentageChange);

      const monthlyPercentageChange =
        totalPaidForPreviousMonth === 0
          ? "N/A"
          : (((totalPaidForMonth - totalPaidForPreviousMonth) / totalPaidForPreviousMonth) * 100).toFixed(2) + "%";
      setMonthlyRevenueChange(monthlyPercentageChange);

      const yearlyPercentageChange =
        totalPaidForPreviousYear === 0
          ? "N/A"
          : (((totalPaidForYear - totalPaidForPreviousYear) / totalPaidForPreviousYear) * 100).toFixed(2) + "%";
      setYearlyRevenueChange(yearlyPercentageChange);
    };

    updateRevenue();
    const intervalId = setInterval(updateRevenue, 1000);
    return () => clearInterval(intervalId);
  }, [isCustomDateSelected, selectedDate]);

  useEffect(() => {
    setIsCustomDateSelected(selectedDate !== getCurrentDate());
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Tính số lượng New User dựa theo tháng và năm của selectedDate.
  useEffect(() => {
    const selected = new Date(selectedDate);
    const selectedMonth = selected.getMonth();
    const selectedYear = selected.getFullYear();
    const newUsers = mockDataTeam.filter((user) => {
      if (!user.creationTime) return false;
      const creationDate = new Date(user.creationTime);
      return (
        creationDate.getMonth() === selectedMonth &&
        creationDate.getFullYear() === selectedYear
      );
    });
    setNewUser(newUsers.length);
  }, [selectedDate]);

  // Dữ liệu cho LineChart
  const getLineDataForMonth = () => {
    const selected = new Date(selectedDate);
    const year = selected.getFullYear();
    const month = selected.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyRevenueArr = Array(daysInMonth).fill(0);

    mockDataTeam.forEach((user) => {
      for (const bookingId in user.bookings) {
        const booking = user.bookings[bookingId];
        if (booking.status !== "Paid") continue;
        const bookingDate = new Date(booking.createdAt || booking.date);
        if (bookingDate.getFullYear() === year && bookingDate.getMonth() === month) {
          const day = bookingDate.getDate();
          dailyRevenueArr[day - 1] += booking.totalPaid || 0;
        }
      }
    });

    return dailyRevenueArr.map((total, index) => ({
      x: (index + 1).toString(),
      y: total,
    }));
  };

  // Dữ liệu cho BarChart
  const getBarDataForMonth = () => {
    const selected = new Date(selectedDate);
    const year = selected.getFullYear();
    const month = selected.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const barData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = { day: day.toString(), Single: 0, Combo: 0 };
      mockDataTeam.forEach((user) => {
        for (const bookingId in user.bookings) {
          const booking = user.bookings[bookingId];
          if (booking.status !== "Paid") continue;
          const bookingDate = new Date(booking.createdAt || booking.date);
          if (
            bookingDate.getFullYear() === year &&
            bookingDate.getMonth() === month &&
            bookingDate.getDate() === day
          ) {
            if (booking.type === "Single") dayData.Single++;
            else if (booking.type === "Combo") dayData.Combo++;
          }
        }
      });
      barData.push(dayData);
    }
    return barData;
  };

  const lineData = getLineDataForMonth();
  const totalMonthlyRevenue = lineData.reduce((sum, item) => sum + item.y, 0);
  const barData = getBarDataForMonth();
  const totalTransactions = barData.reduce((sum, item) => sum + item.Single + item.Combo, 0);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
      <Button variant="contained" color="primary" onClick={goToRoleManagement}>
        Go to RoleManagement
      </Button>

      {/* Bộ lọc ngày */}
      <Box textAlign="center" mb="20px">
        <Typography variant="h6">Filter by date:</Typography>
        <input
          type="date"
          onChange={handleDateChange}
          value={selectedDate}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: `1px solid ${colors.primary[300]}`,
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
          }}
        />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1: Revenue Stat Boxes */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${dailyRevenue} VND`}
            subtitle="Daily Revenue"
            progress="0.75"
            increase={dailyRevenueChange}
            icon={
              <PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${monthlyRevenue} VND`}
            subtitle="Monthly Revenue"
            progress="0.50"
            increase={monthlyRevenueChange}
            icon={
              <PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${yearlyRevenue} VND`}
            subtitle="Yearly Revenue"
            progress="0.30"
            increase={yearlyRevenueChange}
            icon={
              <PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={newUser}
            subtitle="New User this month"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />
        </Box>

        {/* ROW 2: LineChart & PieChart */}
        <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Revenue Generated
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                {totalMonthlyRevenue.toLocaleString()} VND
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {totalMonthlyRevenue > 0 ? (
              <LineChart data={[{ id: "Revenue", data: lineData }]} isDashboard={true} />
            ) : (
              <Typography textAlign="center" color={colors.grey[100]} mt="80px">
                No data available for selected month/year
              </Typography>
            )}
          </Box>
        </Box>
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <PieChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 3: BarChart & Recent Transactions */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
            Sales Quantity By Day
          </Typography>
          <Box height="250px" mt="-20px">
            {totalTransactions > 0 ? (
              <BarChart data={barData} isDashboard={true} />
            ) : (
              <Typography textAlign="center" color={colors.grey[100]} mt="80px">
                No data available for selected month/year
              </Typography>
            )}
          </Box>
        </Box>
        <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
            position="sticky"
            top="0"
            backgroundColor={colors.primary[400]}
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions
            .filter((transaction) => transaction.status !== "Cancelled")
            .map((transaction, i) => (
              <Box
                key={`${transaction.bookingId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box flex="1">
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                    fontSize={"2rem"}
                  >
                    {transaction.bookingID}
                  </Typography>
                  <Typography color={colors.grey[100]} fontSize={"2rem"}>
                    {transaction.user}
                  </Typography>
                </Box>
                <Box flex="1" textAlign="center">
                  <Typography color={colors.grey[100]} fontSize={"2rem"}>
                    {transaction.time + " " + transaction.date}
                  </Typography>
                </Box>
                <Box flex="1" textAlign="center">
                  <Typography
                    color={
                      transaction.status === "Checked-in"
                        ? colors.blueAccent[500]
                        : transaction.status === "Rated"
                        ? "yellow"
                        : transaction.status === "Pending Payment"
                        ? "rgb(255, 219, 194)"
                        : colors.greenAccent[500]
                    }
                    fontSize={"2rem"}
                  >
                    {transaction.status}
                  </Typography>
                </Box>
                <Box
                  flex=".5"
                  textAlign="center"
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 5px"
                  borderRadius="4px"
                  fontSize={"2rem"}
                >
                  ${transaction.cost}
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
