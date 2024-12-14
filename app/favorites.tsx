import { WordListComponent } from '~/components/WordListComponent';
import { useStore } from '~/store/store';

export default function Favorites() {
  const { favoriteWords } = useStore((state) => state);

  const reversedRecentWords = [...favoriteWords].reverse();

  return <WordListComponent wordList={reversedRecentWords.map((item) => item.word)} />;
}
