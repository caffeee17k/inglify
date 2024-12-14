import * as React from 'react';

import { WordListComponent } from '~/components/WordListComponent';
import words from '~/data/words_dictionary.json';

export default function WordList() {
  const wordList = React.useMemo(() => Object.keys(words), []);

  return <WordListComponent wordList={wordList} />;
}
