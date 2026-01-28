export function resolveBindings(html, data) {
  return html.replace(/{{(.*?)}}/g, (_, key) => {
    return key.split(".").reduce((o, i) => o?.[i], data) ?? "";
  });
}