import { suite, test, timeout } from "@cmmn/tools/test";
import { importLocations } from "../data/importLocations";

@suite()
class LocationsSpecs {
  @test()
  @timeout(3000000)
  async importLocations() {
    await importLocations(true);
  }
}
