import { withYup } from "@rvf/yup";
import { useRef } from "react";
import { ValidatedForm } from "@rvf/react-router";
import * as yup from "yup";
import { Input } from "~/components/Input";
import { SubmitButton } from "~/components/SubmitButton";

const schema = yup.object({});
const validator = withYup(schema);

export const action = async () => {
  return { message: "Submitted!" };
};

export default function FrontendValidation() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ValidatedForm validator={validator} method="post">
      <Input name="testinput" label="Test input" ref={inputRef} />
      <SubmitButton label="Submit" submittingLabel="Submitting" />
    </ValidatedForm>
  );
}
