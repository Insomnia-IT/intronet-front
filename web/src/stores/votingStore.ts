import { Fn } from "@cmmn/core";
import { Cell, cell } from "@cmmn/cell";
import { LocalStore } from "./localStore";
import { moviesStore } from "./movies.store";
import { api } from "./api";
import { authStore } from "./auth.store";

class TicketStore extends LocalStore<{
  ticket?: string;
  movie?: string;
}> {
  public get ticket() {
    return this.values.ticket;
  }
  @cell
  public isValidating: boolean = false;

  public async setTicket(ticket: string) {
    this.isValidating = true;
    await Fn.asyncDelay(3000);
    this.isValidating = false;
    this.patch({ ticket });
  }

  public state = new Cell(() => ({
    votedMovie: this.values.movie
      ? moviesStore.Movies.find((x) => x.id == this.values.movie)
      : undefined,
    ticket: this.ticket,
    isValidating: this.isValidating,
    isValid: !!this.ticket,
    canVote: !this.values.movie,
  }));

  vote(id: string) {
    this.patch({
      movie: id,
    });
    return fetch(`${api}/vote`, {
      method: "POST",
      headers: authStore.headers,
      body: JSON.stringify({ id }),
    });
  }
}

export const votingStore = new TicketStore();
