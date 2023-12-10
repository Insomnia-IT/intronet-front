import { Fn } from "@cmmn/core";
import { Input } from "@components/input";
import { Tag, Tags } from "@components/tag";
import classNames from "classnames";
import { FunctionalComponent, JSX } from "preact";
import { useMemo } from "preact/hooks";
import styles from "./field.module.css";

export type IFieldProps = {
  onChange: (props: { name: string; value: string }) => void;
  className?: string;
  inputClassName?: string;
} & IField;

export const Field: FunctionalComponent<IFieldProps> = ({
  type,
  lable,
  name,
  onChange,
  value,
  placeholder = "",
  description,
  className,
  inputClassName,
  tags,
  maxLength,
  key,
}) => {
  const id = useMemo(() => Fn.ulid(), []);
  const handleChange = (newValue: string) => {
    onChange({
      name,
      value: newValue,
    });
  };
  const handleInput = (
    e:
      | JSX.TargetedEvent<HTMLInputElement, Event>
      | JSX.TargetedEvent<HTMLTextAreaElement, Event>
  ) => {
    handleChange(e.currentTarget.value);
  };

  const getHandleTagSelect = (tagName: string) => {
    return () => {
      handleChange(tagName);
    };
  };

  const getInput = () => {
    switch (type) {
      case "input":
      case "textarea": {
        return (
          <Input
            name={name}
            placeholder={placeholder}
            className={classNames(inputClassName, styles.input)}
            inputType={type}
            value={value}
            id={id}
            onInput={handleInput}
            maxLength={maxLength}
          />
        );
      }

      case "tags": {
        return (
          tags.length && (
            <Tags
              tagsList={tags}
              class={classNames(inputClassName, styles.input)}
              id={id}
            >
              {({ value: tagValue, name: tagName }) => {
                return (
                  <Tag
                    selected={tagName === value}
                    onClick={getHandleTagSelect(tagName)}
                    key={tagName}
                  >
                    {tagValue}
                  </Tag>
                );
              }}
            </Tags>
          )
        );
      }
    }
  };

  if (type === "tags" && !tags.length) {
    return;
  }

  return (
    <div className={classNames(className, styles.field)} key={key}>
      {lable && (
        <label className={classNames(styles.lable, "sh1")} htmlFor={id}>
          {lable}
        </label>
      )}
      {getInput()}
      {description && (
        <span className={classNames(styles.description, "textSmall")}>
          {description}
        </span>
      )}
    </div>
  );
};

export type IField = {
  type: "input" | "textarea" | "tags";
  name: string;
  value: string;
  lable?: string;
  placeholder?: string;
  description?: string;
  tags?: ITag[];
  maxLength?: number;
};

type ITag = {
  value: string;
  name: string;
};
