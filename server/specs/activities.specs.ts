import { suite, test, timeout } from "@cmmn/tools/test";
import { importActivities } from "../data/importActivities";

@suite()
class ActivitiesSpecs {
  @test()
  @timeout(3000000)
  async importActivities() {
    await importActivities(true);
  }
}
