import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import Modal from "../components/Modal/VaccineModal";
import ImageSlider from "../components/body/bodySlider";
import Chatbot from "../Chatbot/Chat";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import axios from "axios";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { Autoplay } from "swiper/modules";

const StyledWrapper = styled("div")`
  button {
    border-radius: 0.25rem;
    text-transform: uppercase;
    font-style: normal;
    font-weight: 400;
    padding-left: 25px;
    padding-right: 25px;
    color: #fff;
    -webkit-clip-path: polygon(
      0 0,
      0 0,
      100% 0,
      100% 0,
      100% calc(100% - 15px),
      calc(100% - 15px) 100%,
      15px 100%,
      0 100%
    );
    clip-path: polygon(
      0 0,
      0 0,
      100% 0,
      100% 0,
      100% calc(100% - 15px),
      calc(100% - 15px) 100%,
      15px 100%,
      0 100%
    );
    height: 40px;
    font-size: 0.7rem;
    line-height: 14px;
    letter-spacing: 1.2px;
    transition: 0.2s 0.1s;
    background-image: linear-gradient(90deg, #1c1c1c, #6220fb);
    border: 0 solid;
    overflow: hidden;
  }
  button:hover {
    cursor: pointer;
    transition: all 0.3s ease-in;
    padding-right: 30px;
    padding-left: 30px;
  }
`;

const heroSlides = [
  {
    title: "Celebrating 30 Years of the Vaccines For Children Program",
    description:
      "The VFC program has provided millions of doses of vaccines to children across the United States, saving lives and preventing countless illnesses. Since its inception, it is estimated that routine childhood vaccines given in the U.S. will prevent over one million deaths.",
    buttonText: "Learn More",
    image:
      "https://vaccinateyourfamily.org/wp-content/uploads/2025/03/GettyImages-1266944621.jpg",
  },
  {
    title: "Introducing Vaccinate Your Family University",
    description:
      "Free online courses for advocates, community health workers, and professionals.",
    buttonText: "Learn More",
    image:
      "https://www.trs.texas.gov/PublishingImages/Pages/temp/healthcare-news-202404-vaccinate-newborn/vaccinate-1.png",
  },
  {
    title: "Protect Your Family Against Measles",
    description:
      "Measles outbreaks are occurring around the U.S. right now. The MMR vaccine offers important & safe protection from this potentially deadly disease.",
    buttonText: "Learn More",
    image:
      "https://www.inquirer.com/resizer/v2/PCSZGSHBJZARLHKYE7WZWIV4OA.jpg?auth=c1bef2b65cfd26f25ff9493333fbc90a66b173adf3f15ce4d0cd72271328c6fc&width=760&height=507&smart=true",
  },
];

// ------------------ Hero Slideshow với Animation ------------------
function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Sử dụng useSpring để tạo animation fade+slide
  const [animProps, api] = useSpring(() => ({
    opacity: 1,
    transform: "translateY(0px)",
    config: { tension: 120, friction: 20 },
  }));

  // Tự động chuyển slide mỗi 3 giây (có thể bỏ nếu muốn chỉ chuyển khi nhấn nút)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mỗi khi currentIndex thay đổi, khởi chạy animation từ từ hiện slide mới
  useEffect(() => {
    api.start({
      from: { opacity: 0, transform: "translateY(30px)" },
      to: { opacity: 1, transform: "translateY(0px)" },
    });
  }, [currentIndex, api]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = heroSlides[currentIndex];

  return (
    <div style={styles.heroSection}>
      <animated.div
        style={{
          ...styles.heroContent,
          ...animProps,
        }}
      >
        <div style={styles.heroImageContainer}>
          {currentSlide.image ? (
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              style={styles.heroImage}
            />
          ) : (
            <div
              style={{
                ...styles.heroImage,
                backgroundColor: "#cccccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              No Image
            </div>
          )}
        </div>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>{currentSlide.title}</h1>
          <p style={styles.heroDescription}>{currentSlide.description}</p>
          <StyledWrapper>
            <button>{currentSlide.buttonText}</button>
          </StyledWrapper>
        </div>
        <div style={styles.navContainer}>
          <button style={styles.arrowButton} onClick={prevSlide}>
            &#10094;
          </button>
          {heroSlides.map((_, index) => (
            <span
              key={index}
              style={{
                ...styles.dot,
                backgroundColor:
                  currentIndex === index
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.5)",
              }}
              onClick={() => goToSlide(index)}
            />
          ))}
          <button style={styles.arrowButton} onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      </animated.div>
    </div>
  );
}

// ------------------ Body Component Chính ------------------
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Body: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loop, setLoop] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    image: "",
  });
  const vaccineCardRef = useRef<HTMLDivElement>(null);

  const heroSectionProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { tension: 200, friction: 20 },
  });

  const fadeUpProps = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(20px)" },
    delay: 200,
    config: { tension: 180, friction: 15 },
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      vaccineCardRef.current &&
      !vaccineCardRef.current.contains(event.target as Node)
    ) {
      setActiveCard(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCardClick = (title: string) => {
    let details = "";
    let imageUrl = "";

    switch (title) {
      case "MMR (Measles)":
        details = `Vắc-xin MMR giúp phòng ngừa 3 bệnh sởi, quai bị và rubella. Đây là vắc-xin an toàn và rất quan trọng cho cả trẻ em lẫn người lớn.`;
        break;
      case "COVID-19":
        details = `Vắc-xin COVID-19 giúp phòng ngừa nguy cơ mắc bệnh nặng và góp phần bảo vệ cộng đồng. Các loại phổ biến gồm Pfizer, Moderna...`;
        break;
      case "Flu (Cúm)":
        details = `Tiêm vắc-xin cúm hằng năm là cách tốt nhất để giảm nguy cơ nhiễm cúm và biến chứng nguy hiểm, đặc biệt với người già và trẻ nhỏ.`;
        break;
      default:
        details = "No information available.";
    }

    setActiveCard(title);
    setIsModalOpen(true);
    setModalContent({ title, content: details, image: imageUrl });
  };

  interface Feedback {
    reviewId: number;
    customerId: number;
    customerUsername: string;
    customerAvatar: string;
    staffId: number;
    vaccineId: number;
    appointmentId: number;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
  }

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          "https://vaccine-system1.azurewebsites.net/FeedBack/get-feedback"
        );
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Failed to fetch feedbacks. Please try again.");
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const loop = true;
    const hasEnoughSlides = feedbacks.length > slidesPerView;
    setLoop(hasEnoughSlides);
  }, [feedbacks.length, slidesPerView]);

  const renderFeedbackSlides = () => {
    return feedbacks.map((feedback, index) => (
      <SwiperSlide key={feedback.reviewId} virtualIndex={index}>
        <div style={styles.testimonialBox}>
          <img
            style={styles.testimonialAvatar}
            src={feedback.customerAvatar || "default-avatar.png"}
            alt="User Avatar"
          />
          <div style={styles.testimonialContent}>
            <div style={{ fontSize: "3rem", color: "var(--text-color)" }}>
              Rating:
            </div>
            <Box
              sx={{
                marginTop: "12px",
                width: 200,
                display: "flex",
                alignItems: "center",
                float: "right",
              }}
            >
              <Box sx={{ ml: 2, fontSize: "2rem", marginRight: "12px" }}>
                {feedback.rating.toFixed(1)}
              </Box>
              <Rating
                name="read-only"
                value={feedback.rating}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "gold",
                  },
                }}
              />
            </Box>
            <div style={styles.testimonialDiscription}>
              <div
                style={{
                  fontSize: "3rem",
                  color: "var(--text-color)",
                  marginBottom: "20px",
                  marginTop: "10px",
                }}
              >
                Review:
              </div>
              {feedback.comment}
            </div>
            <p style={styles.testimonialSignature}>
              {feedback.customerUsername}, {feedback.appointmentId}
            </p>
          </div>
        </div>
      </SwiperSlide>
    ));
  };

  return (
    <body style={styles.body}>
      {/* Hero Slideshow */}
      <animated.div style={{ ...heroSectionProps }}>
        <HeroSlideshow />
      </animated.div>

      {/* Các section khác giữ nguyên */}
      <animated.section style={{ ...styles.whyVaccineSection, ...fadeUpProps }}>
        <div style={styles.whyContent}>
          <h2 style={styles.sectionTitle}>
            Vaccines offer the best protection against dangerous diseases.
          </h2>
          <p style={styles.whyDescription}>
            In the U.S., more than 1 million lives will be saved by routine
            vaccines given to children over the last 30 years. When you choose
            to vaccinate yourself and your family, you get the best protection
            against dangerous diseases and you do your part to keep your
            community healthy and strong. Vaccines are one of the most important
            public health innovations ever—right up there with clean drinking
            water.
          </p>
          <StyledWrapper>
            <button>Learn More</button>
          </StyledWrapper>
        </div>
        <div style={styles.whySideBox}>
          <h3 style={styles.whySideTitle}>
            Which vaccines does my family need?
          </h3>
          <p style={styles.whySideDesc}>
            Learn which vaccines are recommended at every age and stage of life.
          </p>
          <StyledWrapper>
            <button>Learn More</button>
          </StyledWrapper>
        </div>
      </animated.section>

      <animated.section
        style={{ ...styles.personalStorySection, ...fadeUpProps }}
      >
        <h2 style={styles.sectionTitle}>Personal Stories</h2>
        <div style={styles.storyContainer}>
          <img
            src="https://vaccinateyourfamily.org/wp-content/uploads/2023/05/Sarah-Watts-2.jpg"
            alt="Teresa"
            style={styles.storyImage}
          />
          <div style={styles.storyText}>
            <h3 style={styles.storyName}>Teresa</h3>
            <p style={styles.storyLocation}>
              Place of Residence: Suffolk, Virginia
            </p>
            <p style={styles.storyDesc}>
              Teresa was a healthy, artistic 10-year-old who loved to read, sew,
              draw, sing, and dance. She loved being a Junior Girl Scout and was
              very outgoing. She wasn’t high risk for COVID and hadn’t been
              vaccinated because in September 2021 it wasn’t yet approved for
              her age group. Sadly, Teresa lost her life to COVID.
            </p>
          </div>
        </div>
      </animated.section>

      <animated.section style={{ ...styles.vaccineSection, ...fadeUpProps }}>
        <h2 style={styles.sectionTitle}>Recommended Vaccines</h2>
        <div style={styles.vaccineCardContainer} ref={vaccineCardRef}>
          {["MMR (Measles)", "COVID-19", "Flu (Cúm)"].map((item) => (
            <div
              key={item}
              style={styles.vaccineCard}
              onClick={() => handleCardClick(item)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 0, 0, 0.1)")
              }
            >
              <h3 style={styles.vaccineTitle}>{item}</h3>
              <p style={styles.vaccineDescription}>
                {item === "MMR (Measles)"
                  ? "Helps protect against measles, mumps, and rubella."
                  : item === "COVID-19"
                  ? "Reduces risk of severe illness, protect community."
                  : "Yearly flu shots lower risk of complications."}
              </p>
            </div>
          ))}
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title=""
          content=""
        >
          <h2>{modalContent.title}</h2>
          {modalContent.image && (
            <img
              src={modalContent.image}
              alt={modalContent.title}
              style={{ maxWidth: "100%", marginBottom: "10px" }}
            />
          )}
          <p>{modalContent.content}</p>
        </Modal>
      </animated.section>

      <animated.div style={{ ...fadeUpProps, marginTop: "40px" }}>
        <ImageSlider />
      </animated.div>

      <animated.section style={{ ...styles.locationsSection, ...fadeUpProps }}>
        <h2 style={styles.sectionTitle}>Find a Vaccination Site Near You</h2>
        <div style={styles.locationCardContainer}>
          <div style={styles.locationCard}>
            <h3 style={styles.locationName}>White Square</h3>
            <p style={styles.locationAddress}>Jalan Setiabudi Santoso</p>
            <button style={styles.locationButton}>Get Your Vaccine</button>
          </div>
          <div style={styles.locationCard}>
            <h3 style={styles.locationName}>White Town</h3>
            <p style={styles.locationAddress}>Jalan Jenderal Sudirman</p>
            <button style={styles.locationButton}>Get Your Vaccine</button>
          </div>
        </div>
      </animated.section>

      <animated.section
        style={{ ...styles.testimonialsSection, ...fadeUpProps }}
      >
        <h2 style={styles.sectionTitle}>What People Say About Us</h2>
        <div style={styles.testimonialCard}>
          <p style={styles.testimonialText}>
            “I am very grateful to Vaccining. With this application, it’s so
            much easier for me to find vaccination sites and schedule
            appointments.”
          </p>
          <p style={styles.testimonialAuthor}>- Arya Wijaya, 25 Years Old</p>
        </div>
      </animated.section>
      <div style={styles.testimonialContainer} data-aos="fade-up">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={slidesPerView}
          loop={loop}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {renderFeedbackSlides()}
        </Swiper>
      </div>

      <animated.section style={{ ...styles.faqSection, ...fadeUpProps }}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>How many doses do I need?</h3>
          <p style={styles.faqAnswer}>
            Most vaccines require two doses for full protection.
          </p>
        </div>
        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>Are there any side effects?</h3>
          <p style={styles.faqAnswer}>
            Some may experience mild side effects such as soreness or fever.
          </p>
        </div>
      </animated.section>

      <animated.section style={{ ...styles.contactSection, ...fadeUpProps }}>
        <h2 style={styles.sectionTitle}>Contact Us</h2>
        <p style={styles.contactText}>
          Have questions? Reach out to us at{" "}
          <strong>support@vaccining.com</strong>
        </p>
      </animated.section>

      <section style={styles.chatbotSection}>
        <h3 style={styles.chatbotTitle}>Need More Help? Chat with Us!</h3>
        <button style={styles.chatbotButton} onClick={toggleChat}>
          {isChatOpen ? "Close Chat" : "Open Chat"}
        </button>
        {isChatOpen && <Chatbot />}
      </section>

      <button style={styles.backToTopButton} onClick={scrollToTop}>
        ↑ Back to Top
      </button>
    </body>
  );
};

const styles = {
  body: {
    margin: 0,
    fontFamily: "Zilla, sans-serif",
    backgroundColor: "#f7f7f7",
  } as React.CSSProperties,

  heroSection: {
    width: "100%",
    minHeight: "60vh",
    background: "linear-gradient(to right, #7fd6d0, #9c7ccb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    color: "#fff",
    position: "relative",
  } as React.CSSProperties,
  heroContent: {
    display: "flex",
    maxWidth: "1200px",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  } as React.CSSProperties,
  heroImageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  } as React.CSSProperties,
  heroImage: {
    width: "100%",
    maxWidth: "1000px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  } as React.CSSProperties,
  heroText: {
    flex: 1,
    minWidth: "300px",
  } as React.CSSProperties,
  heroTitle: {
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "20px",
    fontFamily: "Montserrat, sans-serif",
  } as React.CSSProperties,
  heroDescription: {
    fontSize: "18px",
    marginBottom: "20px",
    fontFamily: "Montserrat, sans-serif",
  } as React.CSSProperties,
  navContainer: {
    position: "absolute",
    bottom: "-50px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    zIndex: 3,
  } as React.CSSProperties,
  arrowButton: {
    background: "transparent",
    border: "2px solid #fff",
    borderRadius: "50%",
    color: "#fff",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    margin: "0 10px",
    fontSize: "20px",
    lineHeight: "35px",
    textAlign: "center",
    outline: "none",
  } as React.CSSProperties,
  dot: {
    height: "12px",
    width: "12px",
    margin: "0 4px",
    borderRadius: "50%",
    display: "inline-block",
    cursor: "pointer",
    border: "2px solid #fff",
  } as React.CSSProperties,

  // Các section khác giữ nguyên như cũ...
  whyVaccineSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    marginTop: "40px",
    padding: "0 20px",
  } as React.CSSProperties,
  whyContent: {
    flex: 2,
  } as React.CSSProperties,
  whyDescription: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "20px",
  } as React.CSSProperties,
  whySideBox: {
    flex: 1,
    backgroundColor: "#eef9ff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    minWidth: "250px",
  } as React.CSSProperties,
  whySideTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  } as React.CSSProperties,
  whySideDesc: {
    fontSize: "16px",
    marginBottom: "20px",
  } as React.CSSProperties,

  personalStorySection: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  } as React.CSSProperties,
  storyContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "20px",
  } as React.CSSProperties,
  storyImage: {
    width: "280px",
    borderRadius: "10px",
    objectFit: "cover",
  } as React.CSSProperties,
  storyText: {
    flex: 1,
  } as React.CSSProperties,
  storyName: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  } as React.CSSProperties,
  storyLocation: {
    fontSize: "16px",
    fontStyle: "italic",
    marginBottom: "10px",
  } as React.CSSProperties,
  storyDesc: {
    fontSize: "16px",
    lineHeight: "1.6",
  } as React.CSSProperties,

  vaccineSection: {
    maxWidth: "1200px",
    margin: "40px auto",
    textAlign: "center",
    padding: "0 20px",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  } as React.CSSProperties,
  vaccineCardContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  } as React.CSSProperties,
  vaccineCard: {
    flex: "1",
    minWidth: "220px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  } as React.CSSProperties,
  vaccineTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  } as React.CSSProperties,
  vaccineDescription: {
    fontSize: "16px",
  } as React.CSSProperties,

  locationsSection: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  } as React.CSSProperties,
  locationCardContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  } as React.CSSProperties,
  locationCard: {
    flex: "1",
    minWidth: "250px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  } as React.CSSProperties,
  locationName: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  } as React.CSSProperties,
  locationAddress: {
    fontSize: "16px",
    marginBottom: "10px",
  } as React.CSSProperties,
  locationButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  } as React.CSSProperties,

  testimonialsSection: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
    textAlign: "center",
  } as React.CSSProperties,
  testimonialCard: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  } as React.CSSProperties,
  testimonialText: {
    fontSize: "18px",
    marginBottom: "10px",
    fontStyle: "italic",
  } as React.CSSProperties,
  testimonialAuthor: {
    fontSize: "16px",
  } as React.CSSProperties,

  faqSection: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  } as React.CSSProperties,
  faqItem: {
    marginBottom: "20px",
  } as React.CSSProperties,
  faqQuestion: {
    fontSize: "18px",
    fontWeight: "bold",
  } as React.CSSProperties,
  faqAnswer: {
    fontSize: "16px",
    marginLeft: "10px",
  } as React.CSSProperties,

  contactSection: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
    textAlign: "center",
  } as React.CSSProperties,
  contactText: {
    fontSize: "18px",
  } as React.CSSProperties,

  chatbotSection: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#eef9ff",
    borderRadius: "10px",
    textAlign: "center",
  } as React.CSSProperties,
  chatbotTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  } as React.CSSProperties,
  chatbotButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  } as React.CSSProperties,

  backToTopButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  } as React.CSSProperties,

  testimonialBox: {
    backgroundColor: "#f9fbff",
    border: "1px solid #cce4f6",
    borderRadius: "10px",
    padding: "20px",
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  } as React.CSSProperties,

  testimonialAvatar: {
    width: "100px",
    height: "100px",
    marginBottom: "15px",
    borderRadius: "50%",
  } as React.CSSProperties,

  testimonialContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,

  testimonialDiscription: {
    fontSize: "24px",
    color: "#666",
    marginBottom: "15px",
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minHeight: "calc(1.5em * 4)",
    lineHeight: "1.5em",
    height: "20rem",
  } as React.CSSProperties,

  testimonialSignature: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#2e3a59",
    marginTop: "20px",
    marginBottom: "40px",
    height: "50px",
  } as React.CSSProperties,

  testimonialContainer: {
    marginTop: "200px",
    marginBottom: "50px",
  } as React.CSSProperties,
};

export default Body;