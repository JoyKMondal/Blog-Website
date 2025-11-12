/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import Input from "./InputEl";
import toast from "react-hot-toast";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { profileObject } from "../profile/UserProfilePage";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingComponent from "../../shared/components/UIElements/LoadingComponent";

const ChangePasswordPage = () => {
  const { error, sendRequest, clearError } = useHttpClient();
  const {
    token,
    loggedInUser,
    loggedInUser: {
      personal_info: { username: user_name },
    },
    setLoggedInUser,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [bio, setBio] = useState(null);
  const [userProfile, setUserProfile] = useState(profileObject);

  let {
    personal_info: { fullName, username, bio: bioData, profileImage, email },
    social_links,
    // account_info: { total_posts, total_reads },
    // joinedAt,
  } = userProfile;

  const tagLimit = 200;

  const [inputValues, setInputValues] = useState({
    name: "",
    email: "",
    username: "",
    youtubeLink: "",
    instagramLink: "",
    facebookLink: "",
    twitterLink: "",
    githubLink: "",
    websiteLink: "",
  });

  const [image, setImage] = useState(null);
  const [file, setFile] = useState();
  const [loadingFile, setLoadingFile] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  };

  const handleImageUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.", { duration: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoadingFile(true);
      toast.loading("Uploading...", { duration: 1000 });

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/users/update-profile-image`,
        "POST",
        JSON.stringify({
          imageUrl: result.file.url,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      setLoggedInUser({
        ...loggedInUser,
        personal_info: {
          ...loggedInUser.personal_info,
          profileImage: responseData.url,
        },
      });

      toast.success(responseData.message, { duration: 2000 });
    } catch (error) {
      toast.error("Upload failed!", { duration: 2000 });
      console.error("Error uploading file:", error);
    } finally {
      setLoadingFile(false);
    }
  };

  const handleInputChange = (e, identity) => {
    const { id, value } = e.target;
    identity
      ? setInputValues((prevValues) => ({
          ...prevValues,
          [identity]: value,
        }))
      : setInputValues((prevValues) => ({
          ...prevValues,
          [id]: value,
        }));
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/user-profile`,
        "POST",
        JSON.stringify({
          username: user_name,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setUserProfile(responseData.users);
    } catch (err) {
      setUserProfile([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user_name]);

  const linkRegex = /^https?:\/\/.*/;

  // const handleUpdateProfile = async (e) => {
  //   e.preventDefault();
  
  //   if (
  //     (inputValues.facebookLink && !linkRegex.test(inputValues.facebookLink)) ||
  //     (inputValues.youtubeLink && !linkRegex.test(inputValues.youtubeLink)) ||
  //     (inputValues.twitterLink && !linkRegex.test(inputValues.twitterLink)) ||
  //     (inputValues.instagramLink && !linkRegex.test(inputValues.instagramLink)) ||
  //     (inputValues.websiteLink && !linkRegex.test(inputValues.websiteLink)) ||
  //     (inputValues.githubLink && !linkRegex.test(inputValues.githubLink))
  //   ) {
  //     toast.error("Urls must be started with https://", { duration: 2000 });
  //     return;
  //   }
  
  //   try {
  //     setLoadingProfile(true);
  //     toast.loading("Updating Profile...", { duration: 1000 });
  
  //     const responseData = await sendRequest(
  //       `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/update-profile`,
  //       "PATCH",
  //       JSON.stringify({
  //         bio: bio,
  //         youtube: inputValues.youtubeLink || "",
  //         instagram: inputValues.instagramLink || "",
  //         facebook: inputValues.facebookLink || "",
  //         twitter: inputValues.twitterLink || "",
  //         github: inputValues.githubLink || "",
  //         website: inputValues.websiteLink || "",
  //       }),
  //       {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       }
  //     );
  
  //     setUserProfile({
  //       ...userProfile,
  //       personal_info: {
  //         ...userProfile.personal_info,
  //         bio: responseData.user.personal_info.bio,
  //       },
  //       social_links: {
  //         ...userProfile.social_links,
  //         youtube: responseData.user.social_links.youtube,
  //         instagram: responseData.user.social_links.instagram,
  //         facebook: responseData.user.social_links.facebook,
  //         twitter: responseData.user.social_links.twitter,
  //         github: responseData.user.social_links.github,
  //         website: responseData.user.social_links.website,
  //       },
  //     });
  
  //     toast.success(responseData.message, { duration: 2000 });
  //   } catch (err) {
  //     toast.error("Updating failed!", { duration: 2000 });
  //     console.error(err);
  //   } finally {
  //     setLoadingProfile(false);
  //   }
  // };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const socialLinks = [
      "facebookLink",
      "youtubeLink",
      "twitterLink",
      "instagramLink",
      "websiteLink",
      "githubLink",
    ];
  
    for (let link of socialLinks) {
      if (inputValues[link] && !linkRegex.test(inputValues[link])) {
        toast.error(`${link.replace("Link", "")} must start with https://`, {
          duration: 2000,
        });
        return;
      }
    }
  
    try {
      setLoadingProfile(true);
      toast.loading("Updating Profile...", { duration: 1000 });
  
      // This will prepare request body with empty strings for missing links.
      const profileData = socialLinks.reduce((acc, link) => {
        acc[link.replace("Link", "")] = inputValues[link] || "";
        return acc;
      }, { bio });
  
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/update-profile`,
        "PATCH",
        JSON.stringify(profileData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );
  
      setUserProfile({
        ...userProfile,
        personal_info: {
          ...userProfile.personal_info,
          bio: responseData.user.personal_info.bio,
        },
        social_links: { ...responseData.user.social_links },
      });
  
      toast.success(responseData.message, { duration: 2000 });
    } catch (err) {
      toast.error("Updating failed!", { duration: 2000 });
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };
  

  const profileImagePath = image !== null ? image : profileImage;

  return (
    <div>
      {loading && <LoadingComponent />}
      <ErrorModal error={error} onClear={clearError} />
      <p className="my-4 text-center font-inter font-semibold text-xl max-md:hidden">
        Edit profile
      </p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4">
        <div className="col-span-1 flex flex-col items-center gap-5 md:col-span-1">
          <div className="relative rounded-full cursor-pointer">
            <div className="w-36 h-36 rounded-full bg-grey flex items-center justify-center text-center overflow-hidden">
              {profileImagePath ? (
                <img
                  src={profileImagePath}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="skeleton h-36 w-36 rounded-full"></div>
              )}
            </div>
            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={loadingFile}
              accept=".jpg,.png,.jpeg"
            />
          </div>

          <button
            type="button"
            className="btn-grey"
            disabled={loadingFile}
            onClick={handleImageUpload}
          >
            upload
          </button>
        </div>

        <form
          className="col-span-1 md:col-span-4 flex flex-col gap-5"
          onSubmit={handleUpdateProfile}
        >
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="name"
                id="name"
                placeholder="name"
                value={inputValues.name}
                iconLeft="fi-sr-envelope"
                onChange={handleInputChange}
                defaultValue={fullName}
              />

              <Input
                type="email"
                id="email"
                placeholder="email address"
                value={inputValues.email}
                iconLeft="fi-sr-envelope"
                onChange={handleInputChange}
                defaultValue={email}
              />
            </div>

            <Input
              type="username"
              id="username"
              placeholder="username"
              value={inputValues.username}
              iconLeft="fi-sr-envelope"
              onChange={handleInputChange}
              defaultValue={username}
            />

            <p className="text-xl pb-2">
              Username will be used to search user and it will be visible to all
              users
            </p>

            <textarea
              onChange={handleBioChange}
              className="textarea textarea-bordered w-full h-48 lg:h-36 text-xl bg-grey"
              placeholder="Bio ..."
              value={bio || bioData}
            ></textarea>

            {bio !== null && bio.length ? (
              <p className="mb-2 text-dark-grey text-right">
                {tagLimit - bio.length} characters left
              </p>
            ) : (
              ""
            )}

            <p className="text-xl pb-2">Add your social handles below</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(social_links).map((link, index) => {
              let identity = `${link}Link`;
              return (
                <Input
                  key={index}
                  type="text"
                  id={identity}
                  placeholder="https://"
                  value={inputValues[identity] || ""}
                  iconLeft={`${
                    link === "website" ? "fi-br-link-alt" : `fi-brands-${link}`
                  }`}
                  onChange={(e) => handleInputChange(e, identity)}
                  defaultValue={social_links[link]}
                />
              );
            })}
          </div>
          <button
            className="btn-dark max-w-[200px]"
            type="submit"
            disabled={loadingProfile}
          >
            {loadingProfile ? "Updating profile" : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
