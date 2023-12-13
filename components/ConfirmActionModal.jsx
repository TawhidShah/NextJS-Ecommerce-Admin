import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

const ConfirmActionModal = ({
  showModal,
  onClose,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm">
      <div className="flex w-[500px] flex-col rounded-2xl bg-white p-4">
        <button
          className="place-self-end text-2xl text-gray-700 hover:text-gray-500"
          onClick={() => onClose()}
          aria-label="Close modal"
        >
          <FaXmark />
        </button>

        <h1>{title}</h1>

        <div>
          {message.split("\n").map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        <div className="m-2 place-self-end">
          <button className="btn-secondary mr-2" onClick={() => onConfirm()}>
            {confirmButtonText}
          </button>
          <button className="btn-primary" onClick={() => onCancel()}>
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
