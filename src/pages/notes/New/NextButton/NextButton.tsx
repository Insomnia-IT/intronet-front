import { FunctionalComponent } from "preact";
import {
  IOnlineButtonProps,
  OnlineButton,
} from "@components/buttons/online-button";

export type INextButtonProps = IOnlineButtonProps;

export const NextButton: FunctionalComponent<INextButtonProps> = (props) => {
  return <OnlineButton {...props} type={"vivid"} />;
};
