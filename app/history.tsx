import { WordListComponent } from '~/components/WordListComponent';
import { useStore } from '~/store/store';

export default function History() {
  const { recentWords } = useStore((state) => state);

  const reversedRecentWords = [...recentWords].reverse();

  return <WordListComponent wordList={reversedRecentWords.map((item) => item.word)} />;
}
