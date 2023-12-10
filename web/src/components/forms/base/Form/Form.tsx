import { FunctionalComponent, JSX } from "preact";
import { useMemo, useState } from "preact/hooks";

export type IFormProps = {
  initialFields: IFormField[];
  onSubmit: (fields) => void;
  children: (props: IFormChildern) => JSX.Element;
  className?: string;
};

export const Form: FunctionalComponent<IFormProps> = ({
  initialFields,
  onSubmit,
  children,
  className,
}) => {
  const [state, setState] = useState(
    initialFields.reduce((accum, { name, value }) => {
      accum[name] = value;
      return accum;
    }, {})
  );

  const allReqFieldIsFill = useMemo<boolean>(() => {
    for (const field of initialFields) {
      const { require, name } = field;
      if (require && state[name] === "") {
        return false;
      }
    }

    return true;
  }, [state, initialFields]);

  const onFieldChange = ({ name, value }: IFormField) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const submit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();

    if (!allReqFieldIsFill) {
      return;
    }

    onSubmit(
      Object.keys(state).reduce((accum, name) => {
        accum[name] = state[name].trim();

        return accum;
      }, {})
    );
  };

  return (
    <form className={className}>
      {children({ state, onFieldChange, submit, allReqFieldIsFill })}
    </form>
  );
};

export type IFormField = {
  name: string;
  value: string;
  require?: boolean;
};

type IFormChildern = {
  state: {};
  onFieldChange: (field: IFormField) => void;
  submit: (e: JSX.TargetedEvent<HTMLElement, Event>) => void;
  allReqFieldIsFill: boolean;
};
