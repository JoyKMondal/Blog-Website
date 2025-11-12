/* eslint-disable react/prop-types */
import { useReducer, useEffect, useContext } from "react";

import { validate } from "../../util/validators";
import { EditorContext } from "../../../pages/editor/EditorPage";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const PublishInput = (props) => {
  const { blog, setBlog } = useContext(EditorContext);

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const inputChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });

    let input = event.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    if (props.id === "topic") {
      return;
    }

    setBlog({ ...blog, title: input.value });
  };

  const desChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });

    let input = event.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, description: input.value });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  let limit = 200;

  const element =
    props.element === "input" ? (
      <div className="relative">
        <input
          id={props.id}
          type={props.type}
          placeholder={props.placeholder}
          onChange={inputChangeHandler}
          onBlur={touchHandler}
          value={inputState.value}
          className={props.id === "topic" ? "input-box-tag" : "input-box"}
          onKeyDown={props.onKeyDown}
        />
        {props.id === "name" && <i className="fi fi-sr-user input-icon"></i>}
        {props.id === "email" && (
          <i className="fi fi-sr-envelope input-icon"></i>
        )}
        {props.id === "password" && <i className="fi fi-sr-key input-icon"></i>}
      </div>
    ) : (
      <>
        <textarea
          id={props.id}
          // rows={props.rows || 3}
          maxLength={limit}
          placeholder={props.placeholder}
          onChange={desChangeHandler}
          onKeyDown={handleKeyDown}
          onBlur={touchHandler}
          value={inputState.value}
          className="input-box text-xl font-medium outline-none resize-none placeholder:opacity-40 bg-grey"
        />
        {blog.description && (
          <p className="mt-1 text-dark-grey text-right">
            {limit - blog.description.length} characters left
          </p>
        )}
      </>
    );

  return (
    <div
      className={`my-4 ${
        !inputState.isValid && inputState.isTouched && "invalid-input"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default PublishInput;
