import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import * as React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [duration, setDuration] = React.useState<number | null>(null);

  const soundRef = React.useRef<Audio.Sound | null>(null);

  const togglePlayPause = async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis ?? null);
            setProgress(status.positionMillis ?? 0);

            if (status.didJustFinish) {
              soundRef.current = null;
              setIsPlaying(false);
              setProgress(0);
            }
          }
        });

        await sound.playAsync();
        setIsPlaying(true);
        return;
      }

      const status = await soundRef.current.getStatusAsync();

      if (status && status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        return;
      }

      await soundRef.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro no togglePlayPause:', error);
    }
  };

  React.useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const getSeekSliderPosition = () => {
    if (progress !== null && duration !== null) {
      return progress / duration;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={togglePlayPause}>
        <MaterialIcons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={60}
          color="#6366F1"
        />
      </Pressable>

      <Slider
        style={styles.slider}
        value={getSeekSliderPosition()}
        minimumTrackTintColor="#5557ae"
        maximumTrackTintColor="#b3b3b3"
        thumbTintColor="#6366F1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    marginBottom: 24,
    borderRadius: 30,
  },
  slider: {
    flex: 1,
    height: 40,
  },
});

export default AudioPlayer;
