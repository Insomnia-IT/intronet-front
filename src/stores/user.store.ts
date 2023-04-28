import {LocalStore} from "@stores/localStore";

class UserStore extends LocalStore<{
  onboardingPhase: string;
}>{
  get OnboardingPhase(){
    return +(this.values.onboardingPhase ?? 0);
  }
  set OnboardingPhase(value ){
    this.patch({onboardingPhase: value.toString()})
  }

  onboardingNext = () => this.OnboardingPhase++;
  onboardingFinish = () => this.OnboardingPhase = 5;
}

export const userStore = new UserStore();
