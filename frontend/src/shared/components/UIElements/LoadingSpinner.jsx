/* eslint-disable react/prop-types */
import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`flex items-center justify-center ${props.asOverlay && "loading-spinner__overlay"}`}>
      <span className="loading loading-ring loading-lg"></span>
    </div>
  );
};

export default LoadingSpinner;
