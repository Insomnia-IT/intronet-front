import { suite, test, timeout } from "@cmmn/tools/test";
import { importShops } from "../data/importShops";

@suite()
class ShopsSpecs {
  @test()
  @timeout(3000000)
  async importShops() {
    await importShops(true);
  }
}
