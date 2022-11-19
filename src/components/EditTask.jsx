import React from 'react';
import dayjs from 'dayjs';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase-config';
import { uploadAndGetUrl } from '../buisnessLogic';
/**
 * @typedef {object} Files
 * @property {string} fileName
 * @property {string} fileUrl
 * @property {string} id
 */

/**
 * @typedef {object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} date
 * @property {boolean} complete
 * @property {boolean} delay
 * @property {[Files]} files
 *
 */

/**
 * @typedef {object} EditTaskProps
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} date
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setEdit
 * @property {boolean} flag
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setFlag
 * @property {[Task]} task
 * @property {React.Dispatch<React.SetStateAction<never[]>>} setTask
 * @property {[Files]} files
 * @property {(data: string) => void} showAlert
 */

/**
 * EditTask component
 * @type {React.FC<EditTaskProps}
 * @returns {React.ReactElement} The EditTask element
 */
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
  showAlert,
}) => {
  const [taskTitle, setTaskTitle] = React.useState(title);
  const [taskDesc, setTastDesc] = React.useState(description);
  const [taskDate, setTaskDate] = React.useState(date);
  const [activeBut, setActiveBut] = React.useState(false);
  const [newFiles, setNewFiles] = React.useState([]);

  /**
   * Функция, которая удаляет выбранный файл из записи
   * @param {Files} fileObj
   */
  const onClickDeleteFile = async (fileObj) => {
    const fileRef = ref(storage, `files/${fileObj.fileName}`);
    await deleteObject(fileRef);

    const findItem = files.findIndex((obj) => obj.id == fileObj.id);
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

  const onChangeFile = (e) => {
    if (e.target.files.length > 5 - files.length) {
      showAlert(`Можно выбрать только ${5 - files.length}`);
    } else {
      setNewFiles(e.target.files);
    }
  };

  /**
   * Функция, которая обновляет поля: заголовок, описание, дату и файлы.
   */
  const onClickEdit = async () => {
    try {
      const taskDoc = doc(db, 'tasks', id);

      if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i++) {
          if (i == newFiles.length - 1) {
            await uploadAndGetUrl(newFiles[i]).then(async (obj) => {
              files.push(obj);
              const edittedTask = {
                title: taskTitle,
                description: taskDesc,
                date: taskDate,
                files: files,
              };
              await updateDoc(taskDoc, edittedTask);

              const newArrayTask = task;
              const findItem = task.findIndex((obj) => obj.id == id);
              newArrayTask[findItem].title = taskTitle;
              newArrayTask[findItem].description = taskDesc;
              newArrayTask[findItem].date = taskDate;
              newArrayTask[findItem].files = files;
              setTask(newArrayTask);

              setEdit(false);
              setFlag(!flag);
              showAlert('Запись отредактирована!');
            });
          } else
            await uploadAndGetUrl(newFiles[i]).then((obj) => {
              files.push(obj);
            });
        }
      } else {
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
        showAlert('Запись отредактирована!');
      }
    } catch (error) {
      console.log(error);
    }
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
            <div className="edit-task-current-file" key={obj.id}>
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
