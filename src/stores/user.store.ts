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
    this.getOrCreateMeta('theme-color').setAttribute('content', color);
    this.getOrCreateMeta('apple-mobile-web-app-status-bar-style').setAttribute('content', color);
  }

  private getOrCreateMeta(name: string){
    return document.head.querySelector(`meta[name=${name}]`) ?? this.createMeta(name)
  }
  private createMeta(name: string){
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta)
    return meta;
  }

  onboardingNext = () => this.OnboardingPhase++;
  onboardingFinish = () => this.OnboardingPhase = 5;
}

export const userStore = new UserStore();
