/* eslint-disable react/prop-types */
import "./LoadingSpinner.css";

const LoadingComponent = (props) => {
  return (
    <div
      className={`flex items-center justify-center ${
        props.asOverlay && "loading-spinner__overlay"
      }`}
    >
      <span className="loading loading-infinity loading-lg"></span>
    </div>
  );
};

export default LoadingComponent;
