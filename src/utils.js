export function formatString(initialString, data) {
    const replacedNL = initialString.replace(/{{NL}}/g, '\n');
    return replacedNL.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key]);
  }