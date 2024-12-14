import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { StyleSheet } from 'react-native';

interface BottomsheetProps {
  children: React.ReactNode;
  modalRef: React.RefObject<BottomSheetModal>;
}

export const Bottomsheet: React.FC<BottomsheetProps> = ({ children, modalRef }) => {
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} enableTouchThrough disappearsOnIndex={-1} />
    ),
    []
  );

  return (
    <BottomSheetModal ref={modalRef} enablePanDownToClose backdropComponent={renderBackdrop}>
      <BottomSheetView style={styles.contentContainer}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  gestureContainer: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
});
