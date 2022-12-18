import { DataFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { ValidatedForm } from "remix-validated-form";
import * as yup from "yup";
import { SubmitButton } from "~/components/SubmitButton";

const schema = yup.object({});
const validator = withYup(schema);

export const action = async (args: DataFunctionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return json({ message: "Submitted!" });
};

export default function FrontendValidation() {
  const fetcher = useFetcher();
  return (
    <>
      <ValidatedForm validator={validator} method="post">
        <SubmitButton
          label="Submit main form"
          submittingLabel="Submitting main form"
        />
      </ValidatedForm>
      <ValidatedForm
        validator={validator}
        method="post"
        action="/submission/alt"
      >
        <SubmitButton
          label="Submit alt form"
          submittingLabel="Submitting alt form"
        />
      </ValidatedForm>
      <ValidatedForm
        validator={validator}
        method="post"
        action="/submission/fetcher"
        fetcher={fetcher as any}
      >
        <SubmitButton
          label="Submit fetcher form"
          submittingLabel="Submitting fetcher form"
        />
      </ValidatedForm>
    </>
  );
}
