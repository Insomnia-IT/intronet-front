import { Fn } from "@cmmn/cell/lib";
import { Input } from "@components/input";
import { Tag, Tags } from "@components/tag";
import classNames from "classnames";
import { FunctionalComponent, JSX } from "preact";
import { useMemo } from "preact/hooks";

export type IFieldProps = {
  type: "Input" | "Textarea" | "Tags";
  name: string;
  value: string;
  onChange: (props: { name: string; value: string }) => void;
  lable?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  inputClassName?: string;
  tags?: ITag[];
};

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
}) => {
  const id = useMemo(() => Fn.ulid(), []);
  const handleChange = (newValue: string) => {
    onChange({
      name,
      value: newValue,
    });
  };
  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    handleChange(e.currentTarget.value);
  };
  const getHandleTagSelect = (tagId: string) => {
    return () => {
      handleChange(tagId);
    };
  };

  const getInput = () => {
    switch (type) {
      case "Input":
      case "Textarea": {
        return (
          <Input
            placeholder={placeholder}
            className={inputClassName}
            textarea={type === "Textarea"}
            value={value}
            id={id}
            onInput={handleInput}
          />
        );
      }

      case "Tags": {
        return (
          tags.length && (
            <Tags tagsList={tags} class={className} id={id}>
              {({ value: tagValue, id: tagID }) => {
                return (
                  <Tag
                    selected={tagID === value}
                    onClick={getHandleTagSelect(tagID)}
                    key={tagID}
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

  return (
    <div className={classNames(className)}>
      {lable && <label htmlFor={id}>{lable}</label>}
      {getInput()}
      {description && <span>{description}</span>}
    </div>
  );
};

type ITag = {
  value: string | number;
  id: string;
};
