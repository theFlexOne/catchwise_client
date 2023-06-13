export default function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => {
      let firstLetterIndex = word.search(/[a-zA-Z]/);
      firstLetterIndex = firstLetterIndex === -1 ? 0 : firstLetterIndex;
      return (
        word.slice(0, firstLetterIndex) +
        word.slice(firstLetterIndex, firstLetterIndex + 1).toUpperCase() +
        word.slice(firstLetterIndex + 1)
      );
    })
    .join(" ");
}
