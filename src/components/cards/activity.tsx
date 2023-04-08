import { FunctionalComponent } from "preact";
import Style from "./activity.module.css";
import { ComponentChildren } from "preact";

export type ActivityCardProps = {
    children: ComponentChildren;
}
export const ActivityCard: FunctionalComponent<ActivityCardProps> = ({children}) => {
    return <div className={Style.activity}>
        {children}
    </div>
}
