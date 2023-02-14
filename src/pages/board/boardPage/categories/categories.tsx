import { AddIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton } from "@chakra-ui/react";
import * as React from "react";
import { RequireAuth } from "src/components/RequireAuth";
import Loading from "src/loading/loading";
import { categoriesStore } from "src/stores";
import { CategoryCard } from "./categoryCard/categoryCard";
import {cellState} from "../../../../helpers/cell-state";

export interface ICategoriesProps {
  activeCategory?: number;
  onChangeCategory?: (id: number) => void;
  onEditCategory?: (category: ICategory) => void;
  onAddCategory?: () => void;
}

export default class Categories extends React.PureComponent<ICategoriesProps, {}> {
  componentDidMount() {
    categoriesStore.load();
  }

  state = cellState(this, {
    isLoading: () => categoriesStore.isLoading,
    allCategory: () => categoriesStore.allCategory,
    activeCategory: () => categoriesStore.activeCategory
  })

  handleClick = (id: number) => (categoriesStore.activeCategory = id);

  render() {
    return (
      <Box
        display={"flex"}
        maxW={"100vw"}
        flex={1}
        overflowX={"auto"}
        className="hide-scrollbar"
      >
        <HStack spacing={0} as="ul" flex={1} minWidth={"max-content"}>
          <Loading isLoading={this.state.isLoading} height={40} width={40}>
            {this.state.allCategory.map((category) => {
              return (
                <CategoryCard
                  as={"li"}
                  key={category.id}
                  categoryObj={category}
                  _last={{ marginRight: "2rem" }}
                  onClick={() => (categoriesStore.activeCategory = category.id)}
                  isActive={this.state.activeCategory === category.id}
                  onIconLeftClick={this.props.onEditCategory}
                />
              );
            })}
          </Loading>
          <RequireAuth>
            <IconButton
              icon={<AddIcon />}
              aria-label="Add category"
              isRound
              onClick={this.props.onAddCategory}
            />
          </RequireAuth>
        </HStack>
      </Box>
    );
  }
}
