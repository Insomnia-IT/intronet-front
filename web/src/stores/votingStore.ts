import { Fn } from "@cmmn/core";
import { Cell, cell } from "@cmmn/cell";
import { LocalStore } from "./localStore";
import { moviesStore } from "./movies.store";
import { api } from "./api";
import { authStore } from "./auth.store";

class TicketStore extends LocalStore<{
  ticket?: string;
  movies?: string;
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
    votedMovies: (JSON.parse(this.values.movies ?? '[]') as string[])
      .map((id) => moviesStore.Movies.find((x) => x.id == id))
      .filter(Boolean),
    ticket: this.ticket,
    isValidating: this.isValidating,
    isValid: !!this.ticket,
  }));

  vote(id: string) {
    const movies = JSON.parse(this.values.movies ?? '[]') as string[];
    if (movies.includes(id)) {
      this.patch({
        movies: JSON.stringify(movies.filter((m) => m !== id)),
      });
      return fetch(`${api}/unvote`, {
        method: "POST",
        headers: authStore.headers,
        body: JSON.stringify({ id }),
      })
    } else {
      this.patch({
        movies: JSON.stringify([...movies, id]),
      });
      return fetch(`${api}/vote`, {
        method: "POST",
        headers: authStore.headers,
        body: JSON.stringify({ id }),
      });
    }
  }
}

export const votingStore = new TicketStore();
