import { Link } from "react-router-dom";
import { extractTime } from "../../utils/extractTime";

const AboutSection = ({ className, bio, social_links, joinedAt }) => {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <p className="text-xl">{bio.length ? bio : "Nothing to read here"}</p>
      <div className="flex items-center flex-wrap my-5 gap-5 text-dark-grey">
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];

          return (
            link && (
              <Link to={link} key={key} target="_blank">
                <i
                  className={`fi ${
                    key !== "website" ? "fi-brands-" + key : "fi-rr-globe"
                  } text-2xl hover:text-black`}
                ></i>
              </Link>
            )
          );
        })}
      </div>

      <p className="text-xl text-dark-grey">
        Joined on {extractTime(joinedAt)}
      </p>
    </div>
  );
};

export default AboutSection;
