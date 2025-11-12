/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditorContext } from "../../../pages/editor/EditorPage";

const EditorImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { blog, setBlog } = useContext(EditorContext);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = async (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    if (pickedFile) {
      const formData = new FormData();
      formData.append("file", pickedFile);

      try {
        setLoading(true);
        toast.info("Uploading...", { autoClose: false });

        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        setBlog({ ...blog, banner: result.file.url });

        toast.dismiss();
        toast.success("Upload completed!", { autoClose: 3000 });
      } catch (error) {
        toast.dismiss();
        toast.error("Upload failed!", { autoClose: 3000 });
        console.error("Error uploading file:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.warn("Please select a file to upload.", { autoClose: 3000 });
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        disabled={loading}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="image-upload flex flex-col justify-center items-center">
        <div className="w-full h-[20rem] md:h-[30rem] flex justify-center items-center text-center mb-5 border-r-[50%] bg-grey">
          {blog.banner && (
            <img
              src={blog.banner}
              alt="Preview"
            />
          )}
          {!blog.banner && (
            <p className="font-semibold text-2xl opacity-25">Blog Banner</p>
          )}
        </div>
        <button
          type="button"
          disabled={loading}
          className="btn btn-wide text-xl"
          onClick={pickImageHandler}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditorImageUpload;
