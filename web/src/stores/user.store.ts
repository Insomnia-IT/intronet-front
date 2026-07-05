import {LocalStore} from "./localStore";
import {api} from "./api";
import {authStore} from "./auth.store";
import {votingStore} from "./votingStore";


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
      document.head.querySelectorAll(`meta[name=theme-color]`)
    )) {
      meta.setAttribute('content', color);
    }
    // apple-mobile-web-app-status-bar-style only accepts default/black/black-translucent, not colors
    const [r, g, b] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
    const isDark = (0.299 * r + 0.587 * g + 0.114 * b) < 128;
    document.head
      .querySelector('meta[name=apple-mobile-web-app-status-bar-style]')
      ?.setAttribute('content', isDark ? 'black-translucent' : 'default');
  }


  onboardingNext = () => this.OnboardingPhase++;
  onboardingPrev = () => this.OnboardingPhase--;
  onboardingFinish = () => this.OnboardingPhase = 5;

  public log(data: Record<string, string>){
    return fetch(api+"/log", {
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
// @ts-ignore
window.userStore = userStore;
