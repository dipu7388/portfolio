export function setReply(
  type: string,
  message: unknown
): { type: string; msg: unknown } {
  return {
    type: type,
    msg: message,
  };
}

export function interpolateString(str = "", obj = {}) {
  const regex = /\{\{[a-zA-Z_$][a-zA-Z_$0-9]*\}\}/gm;
  return str.replace(regex, (match) => {
    const key = match.slice(2, match.length - 2);
    return obj[key] || "";
  });
}
