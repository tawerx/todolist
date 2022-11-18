import { async } from '@firebase/util';
import dayjs from 'dayjs';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import React from 'react';
import { db, storage } from './firebase-config';
import { uploadAndGetUrl } from './NewTask';

const EditTask = ({
  id,
  title,
  description,
  date,
  setEdit,
  flag,
  setFlag,
  task,
  setTask,
  files,
}) => {
  const [taskTitle, setTaskTitle] = React.useState(title);
  const [taskDesc, setTastDesc] = React.useState(description);
  const [taskDate, setTaskDate] = React.useState(date);
  const [activeBut, setActiveBut] = React.useState(false);

  const onClickDeleteFile = async (fileObj) => {
    const fileRef = ref(storage, `files/${fileObj.fileName}`);
    await deleteObject(fileRef);

    const findItem = files.findIndex((obj) => obj.id == fileObj.id);
    console.log(findItem);
    console.log(files);
    files.splice(findItem, 1);

    const taskDoc = doc(db, 'tasks', id);
    const updateFiles = {
      files: files,
    };
    await updateDoc(taskDoc, updateFiles);
    const newArrayTask = task;
    const findOldItem = task.findIndex((obj) => obj.id == id);
    newArrayTask[findOldItem].files = files;
    setTask(newArrayTask);
    setFlag(!flag);
  };

  const onChangeFile = async (e) => {
    try {
      const newFiles = e.target.files;

      if (newFiles.length > 5 - files.length) {
        return alert(`Можно выбрать только ${5 - files.length}`);
      }
      if (newFiles) {
        setActiveBut(true);
        for (let i = 0; i < newFiles.length; i++) {
          if (i == newFiles.length - 1) {
            await uploadAndGetUrl(newFiles[i]).then((obj) => {
              files.push(obj);
              setActiveBut(false);
            });
          } else
            await uploadAndGetUrl(newFiles[i]).then((obj) => {
              files.push(obj);
            });
        }

        const taskDoc = doc(db, 'tasks', id);
        const updateFiles = {
          files: files,
        };
        await updateDoc(taskDoc, updateFiles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickEdit = async () => {
    const taskDoc = doc(db, 'tasks', id);
    const edittedTask = {
      title: taskTitle,
      description: taskDesc,
      date: taskDate,
    };
    await updateDoc(taskDoc, edittedTask);

    const newArrayTask = task;
    const findItem = task.findIndex((obj) => obj.id == id);
    newArrayTask[findItem].title = taskTitle;
    newArrayTask[findItem].description = taskDesc;
    newArrayTask[findItem].date = taskDate;
    setTask(newArrayTask);

    setEdit(false);
    setFlag(!flag);
    alert('Запись отредактирована!');
  };

  return (
    <div className="edit-task">
      <div className="edit-task-title">
        <p>Название задачи</p>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Введите заголовок"
        />
      </div>
      <div className="edit-task-description">
        <p>Описание задачи</p>
        <textarea
          value={taskDesc}
          onChange={(e) => setTastDesc(e.target.value)}
          placeholder="Опишите задачу"
        />
      </div>
      <div className="edit-task-deadLine">
        <span>До какого числа нужно выполнить</span>

        <input
          type="date"
          onChange={(e) => setTaskDate(e.target.value)}
          value={taskDate}
          min={dayjs().format('YYYY-MM-DD')}
        />
      </div>
      {files.length > 0 &&
        files.map((obj) => {
          return (
            <div className="file" key={obj.id}>
              <a href={obj.fileUrl} target={'_blank'}>
                {obj.fileName.slice(0, obj.fileName.indexOf(obj.id))}
              </a>
              <span onClick={() => onClickDeleteFile(obj)}>Удалить</span>
            </div>
          );
        })}
      {files.length < 5 && (
        <div className="edit-task-file">
          <input type="file" onChange={onChangeFile} multiple="multiple" />
        </div>
      )}
      <div className="edit-task-button">
        <button onClick={onClickEdit} disabled={activeBut}>
          Редактировать
        </button>
      </div>
    </div>
  );
};

export default EditTask;
