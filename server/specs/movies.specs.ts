import { suite, test, timeout } from "@cmmn/tools/test";
import { importMovies } from "../data/importMovies";
import { importVurchel } from "../data/importVurchel";

@suite()
class MoviesSpecs {
  // @test()
  // @timeout(3000000)
  // async importMovies() {
  //   await importMovies(true);
  // }
  @test()
  @timeout(3000000)
  async importVurchel() {
    await importVurchel(true);
  }
}
