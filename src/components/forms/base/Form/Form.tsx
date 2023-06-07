import { FunctionalComponent, JSX } from "preact";
import { useMemo, useState } from "preact/hooks";

export type IFormProps = {
  initialFields: IFormField[];
  onSubmit: (fields: IFormField[]) => void;
  children: (props: IFormChildern) => JSX.Element;
};

export const Form: FunctionalComponent<IFormProps> = ({
  initialFields,
  onSubmit,
  children,
}) => {
  const [state, setState] = useState(
    initialFields.reduce((accum, { name, value }) => {
      accum[name] = value;
      return accum;
    }, {})
  );

  const onFieldChange = ({ name, value }: IFormField) => {
    setState({
      ...state,
      name: value,
    });
  };

  const submit = () => {
    onSubmit(
      Object.keys(state).map((name: string) => {
        return {
          name,
          value: state[name],
        };
      })
    );
  };

  const allReqFieldIsFill = useMemo<boolean>(() => {
    for (const { name, require } of initialFields) {
      if (require && state[name] === "") {
        return false;
      }

      return false;
    }
  }, [state, initialFields]);

  return (
    <form>{children({ state, onFieldChange, submit, allReqFieldIsFill })}</form>
  );
};

type IFormField = {
  name: string;
  value: string;
  require?: boolean;
};

type IFormChildern = {
  state: {};
  onFieldChange: (field: IFormField) => void;
  submit: () => void;
  allReqFieldIsFill: boolean;
};
