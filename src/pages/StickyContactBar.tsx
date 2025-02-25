import React, { useState } from "react";
import { makeStyles } from '@mui/styles';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import EmailIcon from "@mui/icons-material/Email";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";

// 🛠 Định nghĩa kiểu Props
interface StickyContactBarProps {
  currentPath: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3f51b5',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5px 0',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },
  icon: {
    fontSize: '2rem',
  },
  hidden: {
    transform: 'scale(0)', // Initially hide
  },
  visible: {
    transform: 'scale(1)', // Show when triggered
  },
  message: {
    backgroundColor: '#3f51b5',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    textAlign: 'center',
  },
}));

// 🛠 Nhận prop `currentPath`
const StickyContactBar: React.FC<StickyContactBarProps> = ({ currentPath }) => {
  const classes = useStyles();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleMessengerClick = () => {
    window.open("https://www.messenger.com/e2ee/t/8860454574017890", "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:";
  };

  const shouldShowHeader = !location.pathname.startsWith("/signIn");

  if (!shouldShowHeader) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={`${classes.button} ${isVisible ? classes.visible : classes.hidden}`} onClick={handleMessengerClick}>
        <FontAwesomeIcon className={classes.icon} icon={faFacebookMessenger} />
      </div>
      <div className={`${classes.button} ${isVisible ? classes.visible : classes.hidden}`} onClick={handleEmailClick}>
        <EmailIcon className={classes.icon} />
      </div>
      <div className={classes.button} onClick={handleToggle}>
        {isVisible ? <CloseIcon className={classes.icon} /> : <MoreHorizIcon className={classes.icon} />}
      </div>
    </div>
  );
};

export default StickyContactBar;
