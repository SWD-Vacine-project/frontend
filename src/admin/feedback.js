// import React, { useState } from "react";
// import styles from "./Feedback_style.module.css";
// const mockFeedbacks = [
//   {
//     reviewId: 1,
//     customerId: 23,
//     staffId: 40,
//     vaccineId: 421,
//     appointmentId: 23,
//     rating: 4,
//     comment: "Dịch vụ tốt, nhân viên thân thiện.",
//     createdAt: "2024-03-07T08:02:48",
//     updatedAt: "2024-03-10T10:45:56",
//   },
//   {
//     reviewId: 2,
//     customerId: 45,
//     staffId: 12,
//     vaccineId: 312,
//     appointmentId: 55,
//     rating: 5,
//     comment: "Rất hài lòng, spa sạch sẽ và chuyên nghiệp!",
//     createdAt: "2024-02-10T11:20:33",
//     updatedAt: "2024-02-15T14:25:22",
//   },
//   {
//     reviewId: 3,
//     customerId: 30,
//     staffId: 15,
//     vaccineId: 500,
//     appointmentId: 60,
//     rating: 3,
//     comment: "Dịch vụ ổn nhưng còn chậm, mong cải thiện.",
//     createdAt: "2024-01-18T09:45:00",
//     updatedAt: "2024-01-20T12:30:20",
//   },
//   {
//     reviewId: 4,
//     customerId: 67,
//     staffId: 22,
//     vaccineId: 221,
//     appointmentId: 77,
//     rating: 5,
//     comment: "Nhân viên nhiệt tình, rất thích!",
//     createdAt: "2024-04-15T14:10:48",
//     updatedAt: "2024-04-18T16:55:32",
//   },
//   {
//     reviewId: 5,
//     customerId: 81,
//     staffId: 33,
//     vaccineId: 110,
//     appointmentId: 90,
//     rating: 2,
//     comment: "Không hài lòng lắm, cần cải thiện dịch vụ.",
//     createdAt: "2024-05-07T08:20:10",
//     updatedAt: "2024-05-10T09:30:22",
//   },
//   {
//     reviewId: 6,
//     customerId: 99,
//     staffId: 44,
//     vaccineId: 500,
//     appointmentId: 101,
//     rating: 4,
//     comment: "Giá hợp lý, chất lượng ổn.",
//     createdAt: "2024-06-01T12:40:00",
//     updatedAt: "2024-06-05T15:20:10",
//   },
//   {
//     reviewId: 7,
//     customerId: 12,
//     staffId: 20,
//     vaccineId: 320,
//     appointmentId: 150,
//     rating: 5,
//     comment: "Tuyệt vời, không có gì để chê!",
//     createdAt: "2024-07-11T18:25:33",
//     updatedAt: "2024-07-12T21:15:45",
//   },
//   {
//     reviewId: 8,
//     customerId: 56,
//     staffId: 29,
//     vaccineId: 410,
//     appointmentId: 190,
//     rating: 3,
//     comment: "Ổn nhưng cần cải thiện dịch vụ chăm sóc khách hàng.",
//     createdAt: "2024-08-22T10:15:00",
//     updatedAt: "2024-08-23T12:50:20",
//   },
//   {
//     reviewId: 9,
//     customerId: 77,
//     staffId: 31,
//     vaccineId: 275,
//     appointmentId: 220,
//     rating: 4,
//     comment: "Nhân viên vui vẻ, dịch vụ ổn định.",
//     createdAt: "2024-09-03T15:00:00",
//     updatedAt: "2024-09-05T17:45:10",
//   },
//   {
//     reviewId: 10,
//     customerId: 88,
//     staffId: 35,
//     vaccineId: 500,
//     appointmentId: 250,
//     rating: 1,
//     comment: "Dịch vụ kém, không hài lòng chút nào.",
//     createdAt: "2024-10-10T09:00:00",
//     updatedAt: "2024-10-11T11:10:10",
//   },
// ];

// const ViewFeedback = () => {
//   const [selectedFeedback, setSelectedFeedback] = useState(mockFeedbacks[0]);
//   const [filter, setFilter] = useState(null);

//   const filteredFeedbacks = filter
//     ? mockFeedbacks.filter((fb) => fb.rating === filter)
//     : mockFeedbacks;

//   const averageRating = (
//     mockFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / mockFeedbacks.length
//   ).toFixed(1);
//   const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
//     star,
//     count: mockFeedbacks.filter((fb) => fb.rating === star).length,
//   }));

//   return (
//     <div className={styles.feedback_container}>
//       <div className={styles.insights_card}>
//         <h3 className={styles.insights_title}>Thống kê đánh giá</h3>
//         <div className={styles.average_rating}>
//           <span>Trung bình:</span>
//           <strong>{averageRating} ⭐</strong>
//         </div>

//         <div className={styles.rating_stats}>
//           {ratingCounts.map(({ star, count }) => (
//             <div key={star} className={styles.rating_row}>
//               <span>{star}⭐</span>
//               <div className={styles.progress_bar}>
//                 <div
//                   className={styles.progress_fill}
//                   style={{ width: `${(count / mockFeedbacks.length) * 100}%` }}
//                 ></div>
//               </div>
//               <span>{count}</span>
//             </div>
//           ))}
//         </div>

//         <div className={styles.filter_buttons}>
//           <button
//             className={!filter ? styles.active : ""}
//             onClick={() => setFilter(null)}
//           >
//             Tất cả
//           </button>
//           {[1, 2, 3, 4, 5].map((star) => (
//             <button
//               key={star}
//               className={filter === star ? styles.active : ""}
//               onClick={() => setFilter(star)}
//             >
//               {star}⭐
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className={styles.feedback_list}>
//         <h2>Feedback List</h2>
//         {filteredFeedbacks.map((feedback) => (
//           <div
//             key={feedback.reviewId}
//             className={`${styles.feedback_item} ${
//               selectedFeedback.reviewId === feedback.reviewId
//                 ? styles.active
//                 : ""
//             }`}
//             onClick={() => setSelectedFeedback(feedback)}
//           >
//             <p>
//               <strong>Review ID:</strong> {feedback.reviewId}
//             </p>
//             <p>
//               <strong>Rating:</strong> {feedback.rating} ⭐
//             </p>
//           </div>
//         ))}
//       </div>
//       <div className={styles.feedback_detail}>
//         <h2>Feedback Detail</h2>
//         <p>
//           <strong>Review ID:</strong> {selectedFeedback.reviewId}
//         </p>
//         <p>
//           <strong>Customer ID:</strong> {selectedFeedback.customerId}
//         </p>
//         <p>
//           <strong>Staff ID:</strong> {selectedFeedback.staffId}
//         </p>
//         <p>
//           <strong>Vaccine ID:</strong> {selectedFeedback.vaccineId}
//         </p>
//         <p>
//           <strong>Appointment ID:</strong> {selectedFeedback.appointmentId}
//         </p>
//         <p>
//           <strong>Rating:</strong> {selectedFeedback.rating} ⭐
//         </p>
//         <p>
//           <strong>Comment:</strong> {selectedFeedback.comment}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ViewFeedback;

import React, { useState, useEffect } from "react";
import styles from "./Feedback_style.module.css";
import axios from "axios";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    axios
      .get("https://vaccine-system1.azurewebsites.net/FeedBack/get-feedback")
      .then((response) => {
        setFeedbacks(response.data);
        if (response.data.length > 0) {
          setSelectedFeedback(response.data[0]);
        }
      })
      .catch((error) => console.error("Error fetching feedbacks:", error));
  }, []);

  const filteredFeedbacks = filter
    ? feedbacks.filter((fb) => fb.rating === filter)
    : feedbacks;

  const averageRating = feedbacks.length
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
    : "N/A";
  
  const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: feedbacks.filter((fb) => fb.rating === star).length,
  }));

  return (
    <div className={styles.feedback_container}>
      <div className={styles.insights_card}>
        <h3 className={styles.insights_title}>Thống kê đánh giá</h3>
        <div className={styles.average_rating}>
          <span>Trung bình:</span>
          <strong>{averageRating} ⭐</strong>
        </div>

        <div className={styles.rating_stats}>
          {ratingCounts.map(({ star, count }) => (
            <div key={star} className={styles.rating_row}>
              <span>{star}⭐</span>
              <div className={styles.progress_bar}>
                <div
                  className={styles.progress_fill}
                  style={{ width: `${(count / feedbacks.length) * 100}%` }}
                ></div>
              </div>
              <span>{count}</span>
            </div>
          ))}
        </div>

        <div className={styles.filter_buttons}>
          <button
            className={!filter ? styles.active : ""}
            onClick={() => setFilter(null)}
          >
            Tất cả
          </button>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={filter === star ? styles.active : ""}
              onClick={() => setFilter(star)}
            >
              {star}⭐
            </button>
          ))}
        </div>
      </div>
      <div className={styles.feedback_list}>
        <h2>Feedback List</h2>
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.reviewId}
            className={`${styles.feedback_item} ${
              selectedFeedback && selectedFeedback.reviewId === feedback.reviewId
                ? styles.active
                : ""
            }`}
            onClick={() => setSelectedFeedback(feedback)}
          >
            <p>
              <strong>Review ID:</strong> {feedback.reviewId}
            </p>
            <p>
              <strong>Rating:</strong> {feedback.rating} ⭐
            </p>
          </div>
        ))}
      </div>
      {selectedFeedback && (
        <div className={styles.feedback_detail}>
          <h2>Feedback Detail</h2>
          <p>
            <strong>Review ID:</strong> {selectedFeedback.reviewId}
          </p>
          <p>
            <strong>Customer Name:</strong> {selectedFeedback.customerName}
          </p>
          <p>
            <strong>Staff Name:</strong> {selectedFeedback.staffName}
          </p>
          <p>
            <strong>Doctor Name:</strong> {selectedFeedback.doctorName}
          </p>
          <p>
            <strong>Appointment ID:</strong> {selectedFeedback.appointmentId}
          </p>
          <p>
            <strong>Appointment Date:</strong> {selectedFeedback.appointmentDate}
          </p>
          <p>
            <strong>Appointment Status:</strong> {selectedFeedback.appointmentStatus}
          </p>
          <p>
            <strong>Rating:</strong> {selectedFeedback.rating} ⭐
          </p>
          <p>
            <strong>Comment:</strong> {selectedFeedback.comment}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
