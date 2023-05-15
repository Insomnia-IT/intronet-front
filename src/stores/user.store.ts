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

  set StatusBarColor(color: string){
    for (let meta of Array.from(
      document.head.querySelectorAll(`meta[name=theme-color],meta[name=apple-mobile-web-app-status-bar-style]`)
    )) {
      meta.setAttribute('content', color);
    }
  }


  onboardingNext = () => this.OnboardingPhase++;
  onboardingFinish = () => this.OnboardingPhase = 5;
}

export const userStore = new UserStore();
