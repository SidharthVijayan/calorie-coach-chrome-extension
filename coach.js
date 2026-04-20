function calculateTDEE(w,a){
  return Math.round(w*22*{low:1.2,medium:1.5,high:1.8}[a]);
}
function adjustForGoal(t,g){
  if(g==="loss") return t-500;
  if(g==="gain") return t+300;
  return t;
}
