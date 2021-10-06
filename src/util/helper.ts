export function setReply(
  type: string,
  message: unknown
): { type: string; msg: unknown } {
  return {
    type: type,
    msg: message,
  };
}
