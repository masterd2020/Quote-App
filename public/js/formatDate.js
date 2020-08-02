const dta = (curDate, ctaDate) => {
  const date = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const obj = {};
  const index = date.forEach((el, i) => {
    if(el === ctaDate.toLowerCase()) {
      obj.cta = i
    }
    if(el === curDate.toLowerCase()) {
      obj.cur = i;
    }
  })
  return {cond: obj.cur > obj.cta, cur: obj.cur, cta: obj.cta };
}