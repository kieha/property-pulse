"use client";

import { type ReactElement } from "react";
import { useFormStatus } from "react-dom";

type SigninButtonProps = {
  text: string;
  pendingText: string;
  Icon?: ReactElement;
};

const SigninButton = ({ text, pendingText, Icon }: SigninButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 w-full justify-center"
      disabled={pending}
      type="submit"
    >
      {Icon ? Icon : null}
      {pending ? pendingText : text}
    </button>
  );
};

export default SigninButton;
