import { forwardRef } from 'react';
import { StyleSheet, Text, Pressable, PressableProps, View } from 'react-native';

type ButtonProps = {
  title?: string;
  isActive?: boolean;
} & PressableProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, isActive, disabled, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={[
          styles.button,
          isActive ? styles.activeButton : styles.inactiveButton,
          disabled && styles.disabledButton,
        ]}>
        <Text
          style={[
            styles.buttonText,
            !isActive && styles.buttonTextInactive,
            disabled && styles.buttonTextDisabled,
          ]}>
          {title}
        </Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    padding: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextInactive: { color: '#6366F1' },
  buttonTextDisabled: { color: '#555' },
  activeButton: {
    backgroundColor: '#6366F1',
  },
  inactiveButton: {
    backgroundColor: '#fff',
    borderColor: '#6366F1',
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#fff',
    borderColor: '#555',
    borderWidth: 1,
  },
});
