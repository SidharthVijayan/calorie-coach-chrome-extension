function calculateTDEE(weight, activity) {
  let base = weight * 22;
  const map = { low: 1.2, medium: 1.5, high: 1.8 };
  return Math.round(base * map[activity]);
}

function adjustForGoal(tdee, goal) {
  if (goal === "loss") return tdee - 500;
  if (goal === "gain") return tdee + 300;
  return tdee;
}
