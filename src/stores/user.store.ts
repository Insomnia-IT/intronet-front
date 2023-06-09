import {LocalStore} from "@stores/localStore";
import {authStore} from "./auth.store";
import {votingStore} from "./votingStore";


const api = process.env.NODE_ENV === 'production' || true
  ? `/webapi/log`
  : `https://redmine.cb27.ru:17443/webapi/log`;

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

  public log(data: Record<string, string>){
    return fetch(api, {
      method: 'POST',
      headers: authStore.headers,
      body: JSON.stringify({
        hostname: location.hostname,
        path: location.pathname,
        ticket: votingStore.ticket,
        ...data
      })
    })
  }
}

export const userStore = new UserStore();
