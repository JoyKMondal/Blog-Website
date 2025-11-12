import { Fragment, useContext, useState } from "react";
import Input from "./InputEl";
import toast from "react-hot-toast";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const ChangePasswordPage = () => {
  const { sendRequest, error, clearError } = useHttpClient();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [inputValues, setInputValues] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

  const handleChangePassword = async () => {
    if (inputValues.currentPassword === "" || inputValues.newPassword === "") {
      toast.error("Please fill all the input field!", { duration: 1000 });
      return;
    }

    if (
      inputValues.currentPassword.length < 6 ||
      inputValues.newPassword.length < 6
    ) {
      toast.error("Password must be at least 6 characters long.", {
        duration: 1000,
      });
      return;
    }

    if (
      !passwordRegex.test(inputValues.currentPassword) ||
      !passwordRegex.test(inputValues.newPassword)
    ) {
      toast.error(
        "Password must be at least 6 characters long, include an uppercase or lowercase letter, a number, and a special character.",
        {
          duration: 2000,
        }
      );
      return;
    }

    setLoading(true);
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/users/change-password`,
        "PATCH",
        JSON.stringify({
          currentPassword: inputValues.currentPassword,
          newPassword: inputValues.newPassword,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      console.log(responseData);
      toast.success(responseData.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    setInputValues({
      currentPassword: "",
      newPassword: "",
    });
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="flex flex-col gap-5">
        <p className="my-4 text-center font-inter font-semibold text-xl max-md:hidden">
          Change Password
        </p>

        <div className="flex flex-col gap-5">
          <Input
            type="password"
            id="currentPassword"
            placeholder="current password"
            value={inputValues.currentPassword}
            iconLeft="fi-sr-key"
            onChange={handleInputChange}
          />

          <Input
            type="password"
            id="newPassword"
            placeholder="new password"
            value={inputValues.newPassword}
            iconLeft="fi-sr-key"
            onChange={handleInputChange}
          />
        </div>

        <button
          className="btn-dark max-w-[200px]"
          onClick={handleChangePassword}
          disabled={loading}
        >
          Change Password
        </button>
      </div>
    </Fragment>
  );
};

export default ChangePasswordPage;
