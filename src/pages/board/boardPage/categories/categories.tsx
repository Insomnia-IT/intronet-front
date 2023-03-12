import * as React from "preact/compat";
import { RequireAuth } from "@components/RequireAuth";
import { Loading } from "@components";
import { categoriesStore } from "@stores";
import { CategoryCard } from "./categoryCard/categoryCard";
import { cellState } from "@helpers/cell-state";

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
          <Loading isLoading={ this.state.isLoading }>
            { this.state.allCategory.map((category) => (
              <CategoryCard
                key={ category._id }
                categoryObj={ category }
                onClick={ () => (categoriesStore.activeCategory = category._id) }
                isActive={ this.state.activeCategory === category._id }
                onIconLeftClick={ this.props.onEditCategory }
              />
            )) }
          </Loading>
          <RequireAuth>
            <button
              aria-label="Add category"
              onClick={ this.props.onAddCategory }
            ></button>
          </RequireAuth>
        </div>
      </div>
    );
  }
}
