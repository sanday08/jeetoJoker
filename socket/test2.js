if (newCards[0] === newCards[1] || newCards[1] === newCards[2]) {
  if (newCards[0] == newCards[1]) {
    score += (newCards[0] + 13) * (newCards[1] + 13) + newCards[2];
  } else {
    score += (newCards[1] + 13) * (newCards[2] + 13) + newCards[0];
  }
} //Nothing
