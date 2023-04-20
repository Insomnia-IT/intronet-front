import { Cell, cell, Fn } from "@cmmn/cell/lib";
import { LocalStore } from "@stores/localStore";
import { IsConnected } from "@stores/connection";
import { moviesStore } from "@stores/movies.store";

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
    isOnline: IsConnected.get(),
    canVote: !this.values.movie,
  }));

  vote(id: string) {
    this.patch({
      movie: id,
    });
  }
}

export const votingStore = new TicketStore();