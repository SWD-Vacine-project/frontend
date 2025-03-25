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
        <h3 className={styles.insights_title}>Feedback Analysis</h3>
        <div className={styles.average_rating}>
          <span>Average:</span>
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
            All
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