export function articleChapters(content: string[]) {
  return content.flatMap((text, index) => text.startsWith('## ') ? [{ index, id: `article-chapter-${index}`, title: text.slice(3) }] : []);
}
