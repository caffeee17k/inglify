import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AudioPlayer from './AudioPlayer';

import { Bottomsheet } from '~/components/Bottomsheet';
import { Button } from '~/components/Button';
import { fetchWordDefinition } from '~/controllers/wordController';
import { WordResponse } from '~/models/WordResponse';
import { useStore } from '~/store/store';

interface WordListComponentProps {
  wordList: string[];
}

export const WordListComponent: React.FC<WordListComponentProps> = ({ wordList }) => {
  const { recentWords, addWord, favoriteWords, toggleFavoriteWord } = useStore((state) => state);

  const [data, setData] = React.useState<string[][]>([]);
  const [page, setPage] = React.useState(0);
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [wordResponseData, setWordResponseData] = React.useState<WordResponse | null>(null);
  const [currentMeaningIndex, setCurrentMeaningIndex] = React.useState(0);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const loadWords = React.useCallback(() => {
    const startIndex = page * 30;
    const endIndex = startIndex + 30;
    const newWords = wordList.slice(startIndex, endIndex);

    if (newWords.length > 0) {
      const groupedWords: string[][] = [];
      for (let i = 0; i < newWords.length; i += 3) {
        const group = newWords.slice(i, i + 3);
        while (group.length < 3) {
          group.push('');
        }
        groupedWords.push(group);
      }
      setData((prevData) => [...prevData, ...groupedWords]);
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, wordList]);

  const openBottomSheet = React.useCallback(
    async (word: string) => {
      setSelectedWord(word);
      setLoading(true);
      setCurrentMeaningIndex(0);
      bottomSheetModalRef.current?.present();

      const cachedDefinition = recentWords.find((cachedWord) => cachedWord.word === word);

      if (cachedDefinition) {
        setLoading(false);
        setWordResponseData(cachedDefinition);
        return;
      }

      try {
        const definition = await fetchWordDefinition(word);
        setLoading(false);
        const fetchedDefinition = definition[0];

        setWordResponseData(fetchedDefinition);
        addWord(fetchedDefinition);
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', `Unable to fetch definition for "${word}"`);
      }
    },
    [recentWords, addWord]
  );

  const handleNext = () => {
    if (wordResponseData?.meanings && currentMeaningIndex < wordResponseData.meanings.length - 1) {
      setCurrentMeaningIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentMeaningIndex > 0) {
      setCurrentMeaningIndex((prevIndex) => prevIndex - 1);
    }
  };

  const isFavorite = React.useMemo(
    () => favoriteWords.some((favWord) => favWord.word === selectedWord),
    [favoriteWords, selectedWord]
  );

  React.useEffect(() => {
    loadWords();
  }, []);

  const currentMeaning = wordResponseData?.meanings[currentMeaningIndex] || null;
  const firstValidDefinition = currentMeaning?.definitions.find(
    (definition) => definition.definition && definition.example
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `group-${index}`}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((word, index) => {
              if (!word.length) {
                return <View key={`${word}-${index}`} style={{ flex: 1 }} />;
              }
              return (
                <Pressable
                  key={`${word}-${index}`}
                  style={styles.cell}
                  onPress={() => openBottomSheet(word)}>
                  <Text style={styles.caption}>{word}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
        onEndReached={loadWords}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
      />

      <Bottomsheet modalRef={bottomSheetModalRef}>
        <View style={styles.sheetContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#6366F1" />
          ) : (
            <>
              <View style={styles.sheetWordContainer}>
                <Text style={styles.subtitle}>{selectedWord}</Text>
                <Text style={styles.subtitle}>{wordResponseData?.phonetic}</Text>
              </View>

              {wordResponseData?.phonetics && (
                <>
                  {wordResponseData.phonetics
                    .map((phonetic) => phonetic.audio)
                    .filter((audio, index, self) => audio && self.indexOf(audio) === index)
                    .slice(0, 1)
                    .map((validAudio) => (
                      <AudioPlayer key={validAudio} audioUrl={validAudio} />
                    ))}
                </>
              )}

              <View style={styles.favoriteContainer}>
                <Text style={styles.title}>Meanings</Text>

                {wordResponseData && (
                  <Pressable
                    onPress={() => toggleFavoriteWord(wordResponseData)}
                    style={styles.favoriteButton}>
                    <MaterialIcons
                      name={isFavorite ? 'favorite' : 'favorite-outline'}
                      size={40}
                      color="#6366F1"
                    />
                  </Pressable>
                )}
              </View>

              {currentMeaning ? (
                <View>
                  <Text style={styles.partOfSpeech}>
                    {currentMeaning.partOfSpeech.charAt(0).toUpperCase() +
                      currentMeaning.partOfSpeech.slice(1)}
                  </Text>

                  {firstValidDefinition ? (
                    <View style={styles.definitionContainer}>
                      <Text style={styles.definitionText}>
                        Definition: {firstValidDefinition.definition}
                      </Text>
                      <Text style={styles.exampleText}>
                        Example: {firstValidDefinition.example}
                      </Text>
                    </View>
                  ) : (
                    <Text>No valid definitions available</Text>
                  )}

                  <View style={styles.navigationContainer}>
                    <Button
                      title="Back"
                      onPress={handlePrev}
                      disabled={currentMeaningIndex === 0}
                    />
                    <Button
                      isActive
                      title="Next"
                      onPress={handleNext}
                      disabled={
                        !wordResponseData ||
                        currentMeaningIndex >= wordResponseData.meanings.length - 1
                      }
                    />
                  </View>
                </View>
              ) : (
                <Text>No meanings available</Text>
              )}
            </>
          )}
        </View>
      </Bottomsheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  cell: {
    minHeight: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  subtitle: {
    fontSize: 24,
    color: '#333',
  },
  caption: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 8,
    flexWrap: 'wrap',
  },
  sheetContainer: {
    marginBottom: 24,
  },
  sheetWordContainer: {
    width: '100%',
    height: 150,
    gap: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  partOfSpeech: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  definitionContainer: {
    marginBottom: 16,
  },
  definitionText: {
    fontSize: 18,
    color: '#000',
  },
  exampleText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 100,
    marginTop: 16,
  },
  favoriteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
