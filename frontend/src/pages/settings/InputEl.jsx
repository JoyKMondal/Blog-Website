import { useState } from 'react';

const Input = ({
  type,
  placeholder,
  value,
  defaultValue,
  iconLeft,
  iconRight,
  id,
  onChange,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordType = type === 'password';

  const inputVal = value || defaultValue

  return (
    <div className="relative">
      <input
        id={id}
        type={isPasswordType && isPasswordVisible ? 'text' : type}
        placeholder={placeholder}
        className="input-box"
        value={inputVal}
        onChange={onChange}
      />
      {iconLeft && <i className={`fi ${iconLeft} input-icon-left`}></i>}
      {isPasswordType && (
        <i
          className={`fi ${isPasswordVisible ? 'fi-rr-eye' : 'fi-rs-crossed-eye'} input-icon-right cursor-pointer`}
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        ></i>
      )}
      {!isPasswordType && iconRight && <i className={`fi ${iconRight} input-icon-right`}></i>}
    </div>
  );
};

export default Input;
