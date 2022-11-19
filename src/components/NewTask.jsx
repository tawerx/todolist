import React from 'react';
import dayjs from 'dayjs';
import { addDoc } from 'firebase/firestore';
import { tasksCollectionRef } from './firebase-config';
import { uploadAndGetUrl } from '../buisnessLogic';
import Alert from './Alert';

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
 * @typedef {object} NewTaskProps
 * @property {[Task]} task
 * @property {React.Dispatch<React.SetStateAction<never[]>>} setTask
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setVisible
 * @property {(data: string) => void} showAlert
 */

/**
 * NewTask component
 * @type {React.FC<NewTaskProps>}
 * @returns {React.ReactElement} the NewTask element
 */

const NewTask = ({ setVisible, task, setTask, showAlert }) => {
  const [taskTitle, setTaskTitle] = React.useState('');
  const [taskDesc, setTastDesc] = React.useState('');
  const [date, setDate] = React.useState(dayjs().format('YYYY-MM-DD'));
  const [activeBut, setActiveBut] = React.useState(false);
  const [files, setFiles] = React.useState([]);

  const dateFormate = dayjs().format('YYYY-MM-DD');

  /**
   *Функция, которая сохраняет выбранные файлы в состоянии
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @returns alert or void
   */
  const onChangeFile = (e) => {
    if (e.target.files.length > 5) {
      return showAlert('Можно выбрать только 5 файлов');
    } else {
      setFiles(e.target.files);
    }
  };

  /**
   * Функция, которая создает новую запись
   */
  const onClickCreate = async () => {
    try {
      const filesArray = [];
      if (taskTitle == '' || taskDesc == '') {
        return showAlert('Введены не все данные');
      }

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          if (i == files.length - 1) {
            await uploadAndGetUrl(files[i]).then(async (obj) => {
              filesArray.push(obj);
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
              showAlert('Запись добавлена!');
              setVisible(false);
            });
          } else
            await uploadAndGetUrl(files[i]).then((obj) => {
              filesArray.push(obj);
            });
        }
      } else {
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
        showAlert('Запись добавлена!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-new-task">
      <div className="create-new-task-title">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Введите заголовок"
        />
      </div>
      <div className="create-new-task-description">
        <textarea
          value={taskDesc}
          onChange={(e) => setTastDesc(e.target.value)}
          placeholder="Опишите задачу"
        />
      </div>
      <div className="create-new-task-deadLine">
        <span>До какого числа нужно выполнить</span>

        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          min={dateFormate}
        />
      </div>
      <div className="create-new-task-fileUpload">
        <input type="file" onChange={onChangeFile} multiple="multiple" />
      </div>
      <div className="create-new-task-button-create">
        <button onClick={onClickCreate} disabled={activeBut}>
          Создать запись
        </button>
      </div>
    </div>
  );
};

export default NewTask;
