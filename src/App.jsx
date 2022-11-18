import React from 'react';
import './App.css';
import { tasksCollectionRef } from './components/firebase-config';
import { getDocs } from 'firebase/firestore';
import Header from './components/Header';
import NewTask from './components/NewTask';
import Task from './components/Task';

const App = () => {
  const [visible, setVisible] = React.useState(false);
  const [task, setTask] = React.useState([]);
  const [flag, setFlag] = React.useState([]);

  React.useEffect(() => {
    const getTasks = async () => {
      const data = await getDocs(tasksCollectionRef);
      setTask(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getTasks();
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="create-new-task-button">
        <button disabled={visible} onClick={() => setVisible(true)}>
          Создать новую задачу
        </button>
      </div>
      {visible && <NewTask setVisible={setVisible} task={task} setTask={setTask} />}
      {!visible &&
        task.map((obj) => (
          <Task key={obj.id} {...obj} task={task} setTask={setTask} setFlag={setFlag} flag={flag} />
        ))}
    </div>
  );
};

export default App;
