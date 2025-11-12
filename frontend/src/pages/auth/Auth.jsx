import { Fragment, useState, useContext, useEffect } from "react";

import {
  Navigate,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import { authWithGoogle } from "../../shared/components/firebase/firebase";

const Auth = () => {
  const { isLoggedIn, login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const authMode = useSearchParams()[0].get("mode");

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        login(responseData.userId, responseData.token);
        redirect("/");
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/signup`,
          "POST",
          JSON.stringify({
            fullName: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        login(responseData.userId, responseData.token);
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    let user;

    try {
      user = await authWithGoogle();

      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/google-auth`,
        "POST",
        JSON.stringify({
          access_token: user.accessToken,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      login(responseData.userId, responseData.token);
      redirect("/");
    } catch (err) {
      console.log(err);
    }
  };

  const authType = isLoginMode ? "sign-in" : "sign-up";

  useEffect(() => {
    if (authMode === "sign-in") {
      setIsLoginMode(true);
    }
    if (authMode === "sign-up") {
      setIsLoginMode(false);
    }
  }, [authMode]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {isLoggedIn && <Navigate to="/" replace={true} />}

      <AnimationWrapper keyValue={authType}>
        <section className="auth">
          <p className="text-4xl font-semibold mx-auto my-10">
            {isLoginMode ? "Welcome Back" : "Join Us Today"}
          </p>
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <Input
                element="input"
                id="name"
                type="text"
                label="Full Name"
                placeholder="Full Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your full name."
                onInput={inputHandler}
              />
            )}
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              placeholder="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password, at least 6 characters."
              onInput={inputHandler}
            />
            <button
              className="btn-dark mt-5 mb-10"
              type="submit"
              disabled={!formState.isValid}
            >
              {isLoginMode ? "Sign In" : "Sign Up"}
            </button>
            <button
              className="btn-dark mx-auto my-5 flex justify-center items-center gap-2"
              type="button"
              onClick={handleGoogleAuth}
            >
              <i className="fi fi-brands-google text-purple"></i>
              <span>Continue With Google</span>
            </button>
            <div className="formFooter">
              <p>
                {isLoginMode
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <p className="span" onClick={switchModeHandler}>
                {isLoginMode ? "Register" : "Login"}
              </p>
            </div>
          </form>
        </section>
      </AnimationWrapper>
    </Fragment>
  );
};

export default Auth;
