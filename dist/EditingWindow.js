import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ImageCropOverlay } from './ImageCropOverlay';
import { editingModeState, imageBoundsState, imageDataState, imageScaleFactorState, editorOptionsState } from './Store';
import { height, width } from '../../../src/styles/pixel-ratio';
import { COLORS } from '../../../src/functions/constants';
import { EditorContext } from './context/editor';
export function EditingWindow() {
    const [imageLayout, setImageLayout] = useState(null);
    const [imageData] = useRecoilState(imageDataState);
    const [, setImageBounds] = useRecoilState(imageBoundsState);
    const [, setImageScaleFactor] = useRecoilState(imageScaleFactorState);
    const [editingMode] = useRecoilState(editingModeState);
    const { controlBar } = useRecoilValue(editorOptionsState);
    const { isCircleOverlayShape } = useContext(EditorContext);
    const isCropping = editingMode === 'crop';
    const getImageFrame = (layout) => {
        onUpdateCropLayout(layout);
    };
    const cropImage = {
        alignSelf: "center",
        width: .9 * width,
        aspectRatio: 1,
        borderRadius: width / 2,
        marginTop: (height - width - controlBar.height) / 2
    };
    const onUpdateCropLayout = (layout) => {
        if (layout) {
            const editingWindowAspectRatio = layout.height / layout.width;
            const imageAspectRatio = imageData.height / imageData.width;
            const bounds = { x: 0, y: 0, width: 0, height: 0 };
            let imageScaleFactor = 1;
            if (imageAspectRatio > editingWindowAspectRatio) {
                bounds.x =
                    (((imageAspectRatio - editingWindowAspectRatio) / imageAspectRatio) *
                        layout.width) /
                        2;
                bounds.width = layout.height / imageAspectRatio;
                bounds.height = layout.height;
                imageScaleFactor = imageData.height / layout.height;
            }
            else {
                bounds.y =
                    (((1 / imageAspectRatio - 1 / editingWindowAspectRatio) /
                        (1 / imageAspectRatio)) *
                        layout.height) /
                        2;
                bounds.width = layout.width;
                bounds.height = layout.width * imageAspectRatio;
                imageScaleFactor = imageData.width / layout.width;
            }
            setImageBounds(bounds);
            setImageScaleFactor(imageScaleFactor);
            setImageLayout({
                height: layout.height,
                width: layout.width,
            });
        }
    };
    useEffect(() => {
        onUpdateCropLayout(imageLayout);
    }, [imageData]);
    return (<View style={styles.container}>
      <Image style={!isCropping && isCircleOverlayShape ? cropImage : styles.image} source={{ uri: imageData.uri }} onLayout={({ nativeEvent }) => getImageFrame(nativeEvent.layout)}/>
      {isCropping && imageLayout != null ? <ImageCropOverlay /> : null}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    },
    glContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
//# sourceMappingURL=EditingWindow.js.map
