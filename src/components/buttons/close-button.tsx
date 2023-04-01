import React from "preact/compat";
import {SvgIcon} from "@icons";
import Styles from "./button.module.css";
import { Button } from "./button";
import {useRouter} from "../../pages/routing";

export const CloseButton = () => {
    const router = useRouter();
    const goToMain = React.useCallback(() => router.goTo(['main']), []);
    return <Button className={Styles.close} onClick={goToMain}>
        <SvgIcon id="#x" size={14}/>
    </Button>
}