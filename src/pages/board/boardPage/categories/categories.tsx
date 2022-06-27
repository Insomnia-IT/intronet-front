import { Observer } from "cellx-react";
import * as React from "react";
import { categoriesStore } from "src/stores";
import Loading from "src/loading/loading";
import { HStack } from "@chakra-ui/react";
import { CategoryCard } from "./categoryCard/categoryCard";
import { Box } from "@chakra-ui/react";

export interface ICategoriesProps {
  activeCategory: number;
  onChangeCategory: (id: number) => void;
}

@Observer
export default class Categories extends React.Component<{}, {}> {
  componentDidMount() {
    categoriesStore.load();
  }

  handleClick = (id: number) => (categoriesStore.activeCategory = id);

  render() {
    return (
      <Box
        display={"flex"}
        maxW={"100vw"}
        // mr={'2rem'}
        flex={1}
        overflowX={"auto"}
        className="hide-scrollbar"
      >
        <HStack spacing={0} as="ul" flex={1} minWidth={"max-content"}>
          <Loading isLoading={categoriesStore.isLoading} height={40} width={40}>
            {categoriesStore.allCategory.map((category) => {
              return (
                <CategoryCard
                  as={"li"}
                  key={category.id}
                  categoryObj={category}
                  _last={{ marginRight: "2rem" }}
                  onClick={() => (categoriesStore.activeCategory = category.id)}
                  isActive={categoriesStore.activeCategory === category.id}
                />
              );
            })}
          </Loading>
        </HStack>
      </Box>
    );
  }
}
