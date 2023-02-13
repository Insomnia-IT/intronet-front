import { EditIcon } from "@chakra-ui/icons";
import { Tag, TagLeftIcon, TagProps } from "@chakra-ui/react";
import * as React from "react";
import { RequireAuth } from "@src/components/RequireAuth";
import { categoriesStore } from "@src/stores";

interface ICategoryCard extends TagProps {
  categoryObj: ICategory;
  isActive?: boolean;
  onIconLeftClick?: (category: ICategory) => void;
}

export function CategoryCard({
  categoryObj,
  isActive,
  children,
  onIconLeftClick,
  ...rest
}: React.PropsWithChildren<ICategoryCard>) {
  const color = categoriesStore.getCategoryColor(categoryObj.id);

  return (
    <Tag
      py={2}
      px={4}
      borderRadius={"2rem"}
      bg={isActive ? color : "transparent"}
      color={isActive ? "white" : color}
      cursor={"pointer"}
      flexShrink={1}
      flexBasis={"content"}
      fontSize={"md"}
      lineHeight={1.5}
      {...rest}
    >
      <RequireAuth>
        <TagLeftIcon
          boxSize="5"
          as={EditIcon}
          onClick={(event) => {
            event.stopPropagation();
            onIconLeftClick(categoryObj);
          }}
        />
      </RequireAuth>
      {categoryObj.name}
    </Tag>
  );
}
