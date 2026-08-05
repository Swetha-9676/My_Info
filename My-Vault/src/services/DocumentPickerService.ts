import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export class DocumentPickerService {
  static async pickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (err) {
      console.error('Pick Document Error:', err);
      return null;
    }
  }

  static async pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (err) {
      console.error('Pick Image Error:', err);
      return null;
    }
  }
}
