const {
  DIMENSIONS,
  normalizeAnswers
} = require("../shared/recommender");

const ANSWER_KEYS = DIMENSIONS.map(({ key }) => key);

function encodeAnswers(input) {
  const answers = normalizeAnswers(input);
  return ANSWER_KEYS
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(answers[key])}`)
    .join("&");
}

function decodeAnswers(options = {}) {
  return normalizeAnswers(options);
}

module.exports = { ANSWER_KEYS, decodeAnswers, encodeAnswers };
