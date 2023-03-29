import * as React from "preact/compat";
import { RequireAuth } from "@components/RequireAuth";
import {Button, Loading} from "@components";
import { categoriesStore } from "@stores";
import { CategoryCard } from "./categoryCard/categoryCard";
import {cellState} from "@helpers/cell-state";
import { SvgIcon} from "@icons";

export interface ICategoriesProps {
  activeCategory?: number;
  onChangeCategory?: (id: number) => void;
  onEditCategory?: (category: ICategory) => void;
  onAddCategory?: () => void;
}

export default class Categories extends React.PureComponent<ICategoriesProps, {}> {
  componentDidMount() {
  }

  state = cellState(this, {
    isLoading: () => categoriesStore.isLoading,
    allCategory: () => categoriesStore.allCategory,
    activeCategory: () => categoriesStore.activeCategory
  })

  handleClick = (id: string) => (categoriesStore.activeCategory = id);

  render() {
    return (
      <div>
        <div>
          <Loading isLoading={this.state.isLoading} height={40} width={40}>
            {this.state.allCategory.map((category) => (
                <CategoryCard
                  as={"li"}
                  key={category._id}
                  categoryObj={category}
                  _last={{marginRight: "2rem"}}
                  onClick={() => (categoriesStore.activeCategory = category._id)}
                  isActive={this.state.activeCategory === category._id}
                  onIconLeftClick={this.props.onEditCategory}
                />
              ))}
          </Loading>
          <RequireAuth>
            <Button
              aria-label="Add category"
              onClick={this.props.onAddCategory}
            ><SvgIcon id="#add"/></Button>
          </RequireAuth>
        </div>
      </div>
    );
  }
}
