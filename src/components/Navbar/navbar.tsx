import { Button } from "@components";
import {useRouter, routes} from "../../pages/routing";
import Styles from "./navbar.module.css";
import {SvgIcon} from "@icons";

const items = [
  routes.main,
  routes.board,
  routes.map,
  routes.timetable
];

export const Navbar = () => {
  const {active, goTo} = useRouter();
  return (
    <div className={Styles.navbar}>
      {items.map(x => (
        <Button key={x.name} selected={x === active}
               onClick={() => goTo([x.name])}>
          <SvgIcon id={'#'+x.name}/>
        </Button>
      ))}
    </div>
  );
};
