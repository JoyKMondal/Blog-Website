import { Fragment, useEffect, useState } from "react";

const InPageNavigation = ({
  routes,
  smHidden,
  children,
  defaultActiveIndex = 0,
}) => {
  const [navIndex, setNavIndex] = useState(defaultActiveIndex);

  let [isresizeEventAdded, setIsResizeEventAdded] = useState(false);
  let [width, setWidth] = useState(window.innerWidth);

  const changeNavigation = (index) => {
    if (index === 0) {
      setNavIndex(0);
    } else {
      setNavIndex(1);
    }
  };

  useEffect(() => {
    if (width > 762 && navIndex !== defaultActiveIndex) {
      setNavIndex(0);
    }

    if (!isresizeEventAdded) {
      window.addEventListener("resize", () => {
        if (!isresizeEventAdded) {
          setIsResizeEventAdded(true);
        }

        setWidth(window.innerWidth);
      });
    }
  }, [width, isresizeEventAdded, navIndex, defaultActiveIndex]);

  return (
    <Fragment>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto transition-all duration-200">
        {routes.map((route, index) => {
          return (
            <button
              onClick={() => changeNavigation(index)}
              key={index}
              className={`p-4 px-6 capitalize ${
                navIndex === index
                  ? "text-black border-b-2  border-dark-grey"
                  : "text-dark-grey"
              } ${smHidden?.includes(route) ? "md:hidden" : ""}`}
            >
              {route}
            </button>
          );
        })}
      </div>

      {children[navIndex]}
    </Fragment>
  );
};

export default InPageNavigation;
