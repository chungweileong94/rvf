import { DataFunctionArgs, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { withZod } from "@rvf/zod";
import { ValidatedForm } from "@rvf/remix";
import { z } from "zod";
import { SubmitButton } from "~/components/SubmitButton";

const validator = withZod(z.object({}));

export const action = async ({ request }: DataFunctionArgs) => {
  const result = await validator.validate(await request.formData());
  return json({ message: `Form has id: ${result.formId}` });
};

export default function FormId() {
  const actionData = useActionData<typeof action>();
  return (
    <ValidatedForm validator={validator} method="post" id="form-id-test-form">
      <p>{actionData?.message}</p>
      <SubmitButton />
    </ValidatedForm>
  );
}
