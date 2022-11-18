import React from 'react';
import dayjs from 'dayjs';
import { addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage, tasksCollectionRef } from './firebase-config';
import { async } from '@firebase/util';

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

const NewTask = ({ setVisible, task, setTask }) => {
  const [taskTitle, setTaskTitle] = React.useState('');
  const [taskDesc, setTastDesc] = React.useState('');
  const [date, setDate] = React.useState(dayjs().format('YYYY-MM-DD'));
  // const [files, setFiles] = React.useState([]);
  const [filesArray, setFilesArray] = React.useState([]);
  const [activeBut, setActiveBut] = React.useState(false);

  const dateFormate = dayjs().format('YYYY-MM-DD');

  // const uploadAndGetUrl = async (file) => {
  //   try {
  //     const id = (+new Date()).toString(16);
  //     const fileRef = ref(storage, `files/${file.name}${id}`);
  //     await uploadBytes(fileRef, file);
  //     const fileUrl = await getDownloadURL(fileRef);

  //     return {
  //       id: id,
  //       fileName: `${file.name}${id}`,
  //       fileUrl: fileUrl,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onChangeFile = async (e) => {
    try {
      const files = e.target.files;

      if (files.length > 5) {
        return alert('Можно выбрать только 5 файлов');
      }
      if (files) {
        setActiveBut(true);
        for (let i = 0; i < files.length; i++) {
          if (i == files.length - 1) {
            await uploadAndGetUrl(files[i]).then((obj) => {
              filesArray.push(obj);
              setActiveBut(false);
            });
          } else
            await uploadAndGetUrl(files[i]).then((obj) => {
              filesArray.push(obj);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickCreate = async () => {
    try {
      if (taskTitle == '' || taskDesc == '') {
        return alert('Введены не все данные');
      }
      const newTaskPush = {
        title: taskTitle,
        description: taskDesc,
        date: date,
        complete: false,
        delay: false,
        files: filesArray,
      };
      const { id } = await addDoc(tasksCollectionRef, newTaskPush);
      newTaskPush.id = id;

      const newTaskArray = task;
      newTaskArray.push(newTaskPush);

      setTask(newTaskArray);
      setVisible(false);
      alert('Запись добавлена!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-new-task">
      <div className="new-task-title">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Введите заголовок"
        />
      </div>
      <div className="new-task-description">
        <textarea
          value={taskDesc}
          onChange={(e) => setTastDesc(e.target.value)}
          placeholder="Опишите задачу"
        />
      </div>
      <div className="new-task-deadLine">
        <span>До какого числа нужно выполнить</span>

        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          min={dateFormate}
        />
      </div>
      <div className="new-task-fileUpload">
        <input type="file" onChange={onChangeFile} multiple="multiple" />
      </div>
      <div className="new-task-button-create">
        <button onClick={onClickCreate} disabled={activeBut}>
          Создать запись
        </button>
      </div>
    </div>
  );
};

export default NewTask;
