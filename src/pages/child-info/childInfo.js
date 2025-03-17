import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../child-info/childInfo_style.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import "boxicons/css/boxicons.min.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddChild from "./addChild";
import UpdateChild from "./updateChild";
import { message, Modal } from "antd";

const ChildList = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const getAvatar = (childName) =>
    `https://robohash.org/${encodeURIComponent(childName)}?set=set4`;

  const handleDelete = async (childId) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this child?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(
            `https://vaccine-system1.azurewebsites.net/Child/delete-child/${childId}`
          );

          setChildren((prevChildren) =>
            prevChildren.filter((child) => child.childId !== childId)
          );

          message.success({
            content: "Child deleted successfully!",
            duration: 3,
            style: { fontSize: "18px" },
          });
        } catch (error) {
          console.error("Error deleting child:", error);
          message.error({
            content: "Failed to delete child. Please try again.",
            duration: 3,
            style: { fontSize: "18px", color: "#ff4d4f" },
          });
        }
      },
    });
  };

  const handleOpenUpdate = (child) => {
    setSelectedChild(child);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdate = () => {
    setSelectedChild(null);
    setOpenUpdateModal(false);
  };

  console.log("Selected Child in Parent:", selectedChild);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // Kiểm tra dữ liệu trong localStorage
        const storedData = JSON.parse(localStorage.getItem("user"));
        console.log("Dữ liệu trong localStorage:", storedData);

        if (!storedData || !storedData.id) {
          console.warn("Không tìm thấy ID người dùng trong localStorage.");
          return;
        }

        // Gọi API lấy dữ liệu trẻ em
        const response = await axios.get(
          `https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/Child/get-child/${storedData.id}`
        );

        console.log("Dữ liệu trả về từ API:", response.data);

        if (response.data && Array.isArray(response.data)) {
          setChildren(response.data);
        } else {
          console.warn("API không trả về mảng dữ liệu hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trẻ em:", error);
      }
    };

    fetchChildren();
  }, []);

  return (
    <div className={style.childInfo}>
      <Swiper
        slidesPerView={2}
        spaceBetween={30}
        loop={true}
        autoplay={false}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className={style.mySwiper}
      >
        {children.length > 0 ? (
          children.map((child, index) => (
            <SwiperSlide key={child.childId || index}>
              <div className={style.child_container}>
                <div className={style.ava_img}>
                  <img src={getAvatar(child.name)} alt="Avatar" />
                </div>
                <div className={style.child_content}>
                  <h3>{child.name}</h3>
                </div>
                <p>
                  {child.dob
                    ? (() => {
                        const birthDate = new Date(child.dob);
                        const today = new Date();

                        const birthYear = birthDate.getFullYear();
                        const birthMonth = birthDate.getMonth();

                        const currentYear = today.getFullYear();
                        const currentMonth = today.getMonth();

                        const age = currentYear - birthYear;
                        const monthDiff = currentMonth - birthMonth;

                        if (age === 0 && monthDiff >= 0) {
                          return `${monthDiff} month`;
                        } else if (age === 0 && monthDiff < 0) {
                          return `${12 + monthDiff} month`;
                        }
                        return `${age} years old`;
                      })()
                    : "N/A"}
                </p>

                <p>Blood Type: {child.bloodType || "Haven't updated"}</p>
                <p>
                  Gender:{" "}
                  {child.gender === "M"
                    ? "Boy"
                    : child.gender === "F"
                    ? "Girl"
                    : "Haven't updated"}
                </p>
                <div className={style.button}>
                  <button
                    className={style.btn}
                    onClick={() => handleOpenUpdate(child)}
                  >
                    <i className="bx bx-edit"></i>
                  </button>
                  <button
                    className={style.btn}
                    onClick={() => handleDelete(child.childId)}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                  <button className={style.btn}>
                    <i className="bx bxs-injection"></i>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p></p>
        )}
        <UpdateChild
          open={openUpdateModal}
          handleClose={handleCloseUpdate}
          selectedChild={selectedChild}
          setChildren={setChildren}
        />

        {/* SwiperSlide thêm mới */}
        <SwiperSlide key="add-child">
          <AddChild
            onChildAdded={(newChild) => setChildren([...children, newChild])}
          />
        </SwiperSlide>

        {/* Floating Action Button */}
        <Fab
          aria-label="add"
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            backgroundColor: "#3f51b5",
            color: "#fff",
          }}
        >
          <AddIcon />
        </Fab>
      </Swiper>
    </div>
  );
};

export default ChildList;
