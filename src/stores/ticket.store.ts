import { Cell, cell, Fn } from "@cmmn/cell/lib";
import { CookieStore } from "@stores/cookie.store";

class TicketStore extends CookieStore<{
  ticket?: string;
}> {
  public get ticket() {
    return this.cookie.ticket;
  }
  @cell
  public isValidating: boolean = false;

  public async setTicket(ticket: string) {
    this.isValidating = true;
    await Fn.asyncDelay(3000);
    this.isValidating = false;
    this.patchCookies({ ticket });
  }

  public state = new Cell(() => ({
    ticket: this.ticket,
    isValidating: this.isValidating,
    isValid: !!this.ticket,
  }));
}

export const ticketStore = new TicketStore();
