import { FC } from "preact/compat";
import Style from "./activity.module.css";
import { ComponentChildren } from "preact";

export type ActivityCardProps = {
    children: ComponentChildren;
}
export const ActivityCard: FC<ActivityCardProps> = ({children}) => {
    return <div className={Style.activity}>
        {children}
    </div>
}