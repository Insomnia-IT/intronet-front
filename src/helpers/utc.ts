export function utc(){
  return new Date(+new Date() + new Date().getTimezoneOffset() * 60000);
}

export function fromUTC(date: Date){
  return new Date(+date - new Date().getTimezoneOffset() * 60000);
}
