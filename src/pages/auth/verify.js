import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { resend, verify } from "../../redux/actions/auth.action";
import { GLOBALTYPES } from "../../redux/types/global.type";

const Verify = () => {
  const initialState = {
    value1: "",
    value2: "",
    value3: "",
    value4: "",
    value5: "",
    value6: "",
  };
  const [inputsData, setInputsData] = useState(initialState);
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [load, setLoad] = useState(false);
  const [loadChange, setLoadChange] = useState(false);
  const [loadReSend, setLoadReSend] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [isVerify, setIsVerify] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  // Parse the query string to get the phone parameter
  const queryParams = new URLSearchParams(location.search);
  const phone = queryParams.get("phone");
  const email = queryParams.get("email");

  const phoneString = "+84" + phone.replace(/\s/g, "");
  // Replace middle digits with asterisks
  const maskedPhoneNumber = phoneString.replace(
    /(\+\d{2})\d{6}(\d{3})/,
    "$1******$2"
  );

  // Split the email address into local part and domain part
  const [localPart, domainPart] = email.split("@");

  // Mask characters in the local part
  const maskedLocalPart =
    localPart.slice(0, 2) +
    localPart.slice(2, -3).replace(/./g, "*") +
    localPart.slice(-3);

  // Concatenate the masked local part and the domain part
  const maskedEmail = maskedLocalPart + "@" + domainPart;

  const inputsRef = useRef([]);
  const submitRef = useRef(null);

  useEffect(() => {
    if (auth.isVerify) {
      setIsVerify(auth.isVerify);
    }
  }, [auth]);

  useEffect(() => {
    const handleKeyDown = (e, index) => {
      if (
        !/^[0-9]{1}$/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "Tab" &&
        !e.metaKey
      ) {
        e.preventDefault();
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (index > 0) {
          inputsRef.current[index - 1].focus();
          inputsRef.current[index - 1].value = "";
        }
      }
    };

    const handleInput = (e, index) => {
      if (e.target.value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      } else {
        submitRef.current.focus();
      }
    };

    const handleFocus = (e) => {
      e.target.select();
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text");
      if (!new RegExp(`^[0-9]{${inputsRef.current.length}}$`).test(text)) {
        return;
      }
      const digits = text.split("");
      inputsRef.current.forEach(
        (input, index) => (input.value = digits[index])
      );
      submitRef.current.focus();
    };

    if (inputsRef && inputsRef.current) {
      inputsRef.current.forEach((input, index) => {
        input.addEventListener("input", (e) => handleInput(e, index));
        input.addEventListener("keydown", (e) => handleKeyDown(e, index));
        input.addEventListener("focus", handleFocus);
        input.addEventListener("paste", handlePaste);
      });

      return (inputsRef) => {
        inputsRef.current.forEach((input, index) => {
          input.removeEventListener("input", (e) => handleInput(e, index));
          input.removeEventListener("keydown", (e) => handleKeyDown(e, index));
          input.removeEventListener("focus", handleFocus);
          input.removeEventListener("paste", handlePaste);
        });
      };
    }
  }, []);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setInputsData({ ...inputsData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpArray = Object.values(inputsData);
    const otpString = otpArray.join("");
    setLoad(true);
    if (phoneVerify) {
      await dispatch(verify({ phone: phoneString, code: otpString }));
    } else {
      await dispatch(verify({ email, code: otpString }));
    }
    setLoad(false);
  };

  const reSend = async () => {
    setLoadReSend(true);
    if (phoneVerify) {
      await dispatch(resend({ email: null, phone: phoneString }));
    } else {
      await dispatch(resend({ email, phone: null }));
    }
    setLoadReSend(false);
  };

  const handleChangeVerify = async () => {
    setLoadChange(true);
    try {
      if (phoneVerify) {
        await dispatch(resend({ email, phone: null }));
      } else {
        await dispatch(resend({ email: null, phone: phoneString }));
      }
      setPhoneVerify(!phoneVerify);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.message } });
    }
    setLoadChange(false);
  };

  return (
    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
      {!isVerify ? (
        <>
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-1">
              {phoneVerify ? "Mobile Phone Verification" : "Email Verification"}
            </h1>
            <p className="text-[15px] text-slate-500">
              Enter the 6-digit verification code that was sent to{" "}
              {phoneVerify ? maskedPhoneNumber : maskedEmail}
            </p>
          </header>
          <form id="otp-form" onSubmit={handleSubmit}>
            <div className="flex items-center justify-center gap-3">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  type="text"
                  maxLength="1"
                  name={`value${index + 1}`}
                  value={inputsData[`value${index + 1}`]}
                  onChange={handleChangeInput}
                  disabled={load}
                />
              ))}
            </div>
            <div className="max-w-[260px] mx-auto mt-4">
              <button
                type="submit"
                ref={submitRef}
                className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
              >
                {load ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Verify Account"
                )}
              </button>
            </div>
          </form>
          {!loadReSend ? (
            <div className="text-sm text-slate-500 mt-4 cursor-pointer">
              Didn't receive code?{" "}
              <span
                className="font-medium text-indigo-500 hover:text-indigo-600"
                onClick={reSend}
              >
                Resend
              </span>
            </div>
          ) : (
            <div className="text-sm text-slate-500 mt-4">
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Resending...{" "}
            </div>
          )}
          {!loadChange ? (
            <div className="text-sm text-slate-500 mt-4">
              Verify via{" "}
              <span
                className="font-medium text-indigo-500 hover:text-indigo-600 cursor-pointer"
                onClick={handleChangeVerify}
              >
                {phoneVerify ? "email" : "phone number"}
              </span>
            </div>
          ) : (
            <div className="text-sm text-slate-500 mt-4">
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              We are sending otp to your{" "}
              <span className="font-medium text-indigo-500 hover:text-indigo-600 cursor-pointer">
                {phoneVerify ? "email" : "phone number"}
              </span>
            </div>
          )}
          <div className="text-sm text-slate-500 mt-4">
            Back to{" "}
            <span
              className="font-medium text-indigo-500 hover:text-indigo-600 cursor-pointer"
              onClick={() => (window.location.href = "/register")}
            >
              previous
            </span>
          </div>
        </>
      ) : (
        <div>
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Verify Successfully !</h1>
          </header>
          <div className="text-sm text-slate-500 mt-4">
            join LetChat ?{" "}
            <span className="font-medium text-indigo-500 hover:text-indigo-600" onClick={() => (window.location.href = "/login")}>
              Login
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
