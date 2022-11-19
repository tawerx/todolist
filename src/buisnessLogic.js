import { getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage, tasksCollectionRef } from './components/firebase-config';

/**
 * Функция, которая запрашивает записи из базы данных
 *@param {React.Dispatch<React.SetStateAction<never[]>>} setTask Функция, которая обновляет состояние записей
 */
export const getTasks = async (setTask) => {
  const data = await getDocs(tasksCollectionRef);
  setTask(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
};

/**
 * @typedef {object} FileInfo
 * @property {string} id
 * @property {string} fileName
 * @property {string} fileUrl
 */
/**
 *Функция, которая загружает файл в хранилище.
 * @param {File} file
 * @returns {Promise<FileInfo>} Промис, содержащий объект с информацией: уникальный идентификатор, название файла, URL файла.
 */
export const uploadAndGetUrl = async (file) => {
  try {
    const id = (+new Date()).toString(16);
    const fileRef = ref(storage, `files/${file.name}${id}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    return {
      id: id,
      fileName: `${file.name}${id}`,
      fileUrl: fileUrl,
    };
  } catch (error) {
    console.log(error);
  }
};
