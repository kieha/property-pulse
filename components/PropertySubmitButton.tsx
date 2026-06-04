"use client";

import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";

type PropertySubmitButtonProps = {
  text: string;
  pendingText: string;
};

const PropertySubmitButton = ({
  text,
  pendingText,
}: PropertySubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex justify-center items-center gap-x-5"
        type="submit"
        disabled={pending}
      >
        {pending ? (
          <>
            <FaSpinner fontSize={20} /> {pendingText}
          </>
        ) : (
          <>{text}</>
        )}
      </button>
    </div>
  );
};

export default PropertySubmitButton;
