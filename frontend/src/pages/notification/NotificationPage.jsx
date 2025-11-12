import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";
import NotificationSkeleton from "../../components/skeletons/NotificationSkeleton";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import Notifications from "../../components/notifications/Notifications";
import NoDataFound from "../../components/skeletons/NoDataFound";

const NotificationPage = () => {
  const buttons = ["all", "like", "comment", "reply"];
  const [activeButton, setActiveButton] = useState("all");
  const {
    token,
    loggedInUser,
    loggedInUser: { newNotification },
    setLoggedInUser,
  } = useContext(AuthContext);

  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/users/get-notifications`,
          { type: activeButton },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (newNotification) {
          setLoggedInUser({ ...loggedInUser, newNotification: true });
        }

        console.log(response.data, "response.data");
        if (response.data.success) {
          setNotifications(response.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [activeButton, token, loggedInUser, setLoggedInUser, newNotification]);

  return (
    <div className="w-full mx-auto px-10">
      <h1 className="max-md:hidden my-4 text-2xl font-inter font-semibold">
        Recent Notifications
      </h1>
      <div className="mb-4 flex gap-5">
        {buttons.map((button) => (
          <button
            key={button}
            className={`btn-grey ${activeButton === button ? "active" : ""}`}
            onClick={() => setActiveButton(button)}
          >
            {button.charAt(0).toUpperCase() + button.slice(1)}
          </button>
        ))}
      </div>

      <div className="py-4">
        {notifications === null ? (
          [...Array(4)].map((_, idx) => <NotificationSkeleton key={idx} />)
        ) : notifications.length ? (
          notifications.map((notification, index) => (
            <AnimationWrapper
              key={index}
              transition={{ duration: 1, delay: index * 0.1 }}
            >
              <Notifications notification={notification} index={index} />
            </AnimationWrapper>
          ))
        ) : (
          <NoDataFound
            message={`No notifications related to ${activeButton}s found`}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
