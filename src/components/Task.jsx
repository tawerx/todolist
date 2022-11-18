import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React from 'react';
import { db, storage } from './firebase-config';
import EditTask from './EditTask';
import dayjs from 'dayjs';
import { deleteObject, ref } from 'firebase/storage';

const Task = ({
  id,
  title,
  description,
  date,
  complete,
  delay,
  files,
  task,
  setTask,
  setFlag,
  flag,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [completeBut, setCompleteBut] = React.useState(complete);
  const [delayBut, setDelayBut] = React.useState(delay);
  const [edit, setEdit] = React.useState(false);
  const taskRef = React.useRef(null);
  const dateFormate = dayjs().format('YYYY-MM-DD');
  React.useEffect(() => {
    if (!delay) {
      if (date < dateFormate) {
        onDelayHandle();
      }
    } else {
      if (taskRef.current) {
        taskRef.current.style.backgroundColor = 'red';
      }
    }
    if (complete) {
      if (taskRef.current) {
        taskRef.current.style.backgroundColor = 'green';
      }
    }
  }, []);

  const onDelayHandle = async () => {
    if (taskRef.current) {
      taskRef.current.style.backgroundColor = 'red';
    }
    setDelayBut(true);
    const taskDoc = doc(db, 'tasks', id);
    const updateDelay = { delay: true };
    await updateDoc(taskDoc, updateDelay);
  };

  const onClickDelete = async () => {
    if (files) {
      files.forEach(async (obj) => {
        const fileRef = ref(storage, `files/${obj.fileName}`);
        await deleteObject(fileRef);
      });
    }

    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);

    const newArrayTask = task;
    const findItem = task.findIndex((obj) => obj.id == id);
    newArrayTask.splice(findItem, 1);
    setTask(newArrayTask);
    setFlag(!flag);
  };

  const onClickComplete = async () => {
    if (taskRef.current) {
      taskRef.current.style.backgroundColor = 'green';
    }
    setCompleteBut(true);
    const taskDoc = doc(db, 'tasks', id);
    const updateComplete = { complete: true };
    await updateDoc(taskDoc, updateComplete);
  };

  if (edit) {
    return (
      <div className="task">
        <EditTask
          title={title}
          description={description}
          date={date}
          id={id}
          setEdit={setEdit}
          setTask={setTask}
          task={task}
          setFlag={setFlag}
          flag={flag}
          files={files}
        />
      </div>
    );
  }

  return (
    <div className="task" ref={taskRef}>
      <div className="task-title" onClick={() => setVisible(!visible)}>
        <span>Название задачи</span>
        <h3>{title}</h3>
      </div>
      {visible && (
        <>
          <div className="task-description">
            <span>Описание задачи</span>
            <p>{description}</p>
          </div>
          <div className="task-deadLine">
            <span>{delay ? `Нужно было выполнить к ${date}` : `Нужно выполнить к ${date}`}</span>
          </div>
          {files.length > 0
            ? files.map((obj) => {
                return (
                  <div className="task-file" key={obj.id}>
                    <a href={obj.fileUrl} target={'_blank'}>
                      {obj.fileName.slice(0, obj.fileName.indexOf(obj.id))}
                    </a>
                  </div>
                );
              })
            : null}
          {!completeBut && !delayBut && (
            <div className="task-edit-button">
              <button onClick={() => setEdit(true)}>Редактировать</button>
            </div>
          )}
          <div className="task-button-control">
            {!completeBut && !delayBut && <button onClick={onClickComplete}>Завершить</button>}
            <button onClick={onClickDelete}>Удалить</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;
