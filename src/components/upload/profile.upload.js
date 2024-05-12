import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/types/global.type";
import { updatePhotoProfile } from "../../redux/actions/profile.action";

const UploadProfile = () => {
  const auth = useSelector(state => state.auth);
  const [image, setImage] = useState();
  const [load, setLoad] = useState(false);

  const dispatch = useDispatch();

  const handleFile = (e) => {
    const file = e.target.files[0];

    console.log(file);
    let err = "";
    const types = ["image/png", "image/jpeg"];

    if (!file) return (err = "File does not exist.");

    if (file.size > 1024 * 1024 * 25) {
      return (err = "The image largest is 25mb.");
    }

    if (!types.includes(file.type)) return (err = "The image is not support.");

    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });

    setImage(file);

    e.target.value = null;
  };

  const handleDeleteFile = () => {
    setImage("");
  };

  const handleUpload = async() => {
    setLoad(true)
    await dispatch(updatePhotoProfile({ auth, image }))
    setLoad(false)

    dispatch({ type: GLOBALTYPES.MODAL, payload: null })
  }

  return (
    <div
      id="chat-modal"
      aria-hidden="true"
      className="flex overflow-x-hidden overflow-y-auto fixed h-modal md:h-full top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center"
    >
      <div className="flex justify-center h-screen items-center px-3">
        <div className="relative rounded-lg shadow-xl bg-gray-50 w-[360px]">
          <div className="m-4">
            <span className="flex justify-center items-center text-[12px] mb-1 text-red-500"></span>
            {image ? (
                <>
                <div className="flex m-auto justify-center">
                    <div className="relative w-fit">
                    <img
                        src={URL.createObjectURL(image)}
                        alt="images"
                        className="thumbnail"
                    />
                    <span className="delete_photo_upload" onClick={handleDeleteFile}>
                        Remove
                    </span>
                    </div>
                </div>
                <div className="w-full text-center my-3.5">
                    <button
                        onClick={handleUpload}
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center cursor-pointer"
                        >
                            {
                                load ? 
                                <><svg
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
                                </> : 'Upload'
                            }
                    </button>
                </div>
                </>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex cursor-pointer flex-col w-full h-32 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      Select a photo
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFile}
                    className="opacity-0"
                    name="file"
                    accept="image/*"
                  />
                </label>
              </div>
            )}
          </div>
          <div className="close_modal_btn absolute right-1.5 top-0 cursor-pointer" onClick={() => dispatch({ type: GLOBALTYPES.MODAL, payload: null })}>&times;</div>
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;
