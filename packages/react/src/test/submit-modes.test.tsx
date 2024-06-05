import { render, screen } from "@testing-library/react";
import { useRvf } from "../useRvf";
import { successValidator } from "./util/successValidator";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { preprocessFormData } from "@rvf/core";
import { Mock } from "vitest";

it("should use the form itself as the source of truth for `dom` mode", async () => {
  const submit = vi.fn();

  const TestComp = () => {
    const form = useRvf({
      submitSource: "dom",
      defaultValues: {
        foo: 123,
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input readOnly data-testid="foo" value="456" name="foo" />
        <button type="submit" data-testid="submit" />
      </form>
    );
  };

  render(<TestComp />);

  await userEvent.click(screen.getByTestId("submit"));
  expect(successValidator.validate).toHaveBeenCalledTimes(1);
  expect(
    preprocessFormData((successValidator.validate as Mock).mock.lastCall[0]),
  ).toEqual({ foo: "456" });

  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit).toHaveBeenCalledWith({ foo: "456" }, expect.any(FormData), {});
});

it("should use `dom` mode by default", async () => {
  const submit = vi.fn();

  const TestComp = () => {
    const form = useRvf({
      defaultValues: {
        foo: 123,
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input readOnly data-testid="foo" value="456" name="foo" />
        <button type="submit" data-testid="submit" />
      </form>
    );
  };

  render(<TestComp />);

  await userEvent.click(screen.getByTestId("submit"));
  expect(successValidator.validate).toHaveBeenCalledTimes(1);
  expect(
    preprocessFormData((successValidator.validate as Mock).mock.lastCall[0]),
  ).toEqual({ foo: "456" });

  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit).toHaveBeenCalledWith({ foo: "456" }, expect.any(FormData), {});
});

it("should include data from the form submitter on submit", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useRvf({
      submitSource: "state",
      defaultValues: {
        foo: 123,
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input readOnly data-testid="foo" value="456" name="foo" />
        <button
          type="button"
          data-testid="submit"
          onClick={() => {
            // Submitting manually because jsdom doesn't handle submitters
            form.submit({
              name: "submitterValue",
              value: "foobar",
            });
          }}
        />
      </form>
    );
  };

  render(<TestComp />);

  await userEvent.click(screen.getByTestId("submit"));
  expect(successValidator.validate).toHaveBeenCalledTimes(1);
  expect(successValidator.validate).toHaveBeenCalledWith({
    foo: 123,
    submitterValue: "foobar",
  });
  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit).toHaveBeenCalledWith(
    {
      foo: 123,
      submitterValue: "foobar",
    },
    {},
  );
});

it("should use state as the source of truth for state mode", async () => {
  const submit = vi.fn();
  const TestComp = () => {
    const form = useRvf({
      submitSource: "state",
      defaultValues: {
        foo: 123,
      },
      validator: successValidator,
      handleSubmit: submit,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input readOnly data-testid="foo" value="456" name="foo" />
        <button type="submit" data-testid="submit" />
      </form>
    );
  };

  render(<TestComp />);

  await userEvent.click(screen.getByTestId("submit"));
  expect(successValidator.validate).toHaveBeenCalledTimes(1);
  expect(successValidator.validate).toHaveBeenCalledWith({
    foo: 123,
  });
  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit).toHaveBeenCalledWith(
    {
      foo: 123,
    },
    {},
  );
});

it("should respect changes to the submit source", async () => {
  const submit = vi.fn();

  const TestComp = () => {
    const [submitSource, setSubmitSource] = useState(
      "state" as "state" | "dom",
    );
    const form = useRvf({
      defaultValues: {
        foo: 123,
      },
      validator: successValidator,
      handleSubmit: submit,
      submitSource,
    });

    return (
      <form {...form.getFormProps()} data-testid="form">
        <input readOnly data-testid="foo" value="456" name="foo" />
        <button
          type="button"
          onClick={() => setSubmitSource("dom")}
          data-testid="switch"
        />
        <button type="submit" data-testid="submit" />
      </form>
    );
  };

  render(<TestComp />);

  await userEvent.click(screen.getByTestId("submit"));
  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit).toHaveBeenCalledWith(
    {
      foo: 123,
    },
    {},
  );

  await userEvent.click(screen.getByTestId("switch"));
  await userEvent.click(screen.getByTestId("submit"));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit).toHaveBeenLastCalledWith(
    { foo: "456" },
    expect.any(FormData),
    {},
  );
});
