import { BaseCell } from "@cmmn/cell/lib";
export class TimerCell extends BaseCell<Date> {
  private timer: any | undefined;

  constructor(private resolution: number = 1000) {
    super(new Date());
  }

  active() {
    super.active();
    this.timer = setInterval(() => this.set(new Date()), this.resolution);
  }
  disactive() {
    super.disactive();
    this.timer && clearInterval(this.timer);
  }
}
