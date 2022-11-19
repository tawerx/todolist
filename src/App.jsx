import React from 'react';
import './App.css';
import Header from './components/Header';
import NewTask from './components/NewTask';
import Task from './components/Task';
import { getTasks } from './buisnessLogic';
import Alert from './components/Alert';

/**
 * App Component
 *
 * @type {React.FC}
 * @returns {React.ReactElement} The app element.
 */
const App = () => {
  const [visible, setVisible] = React.useState(false);
  const [task, setTask] = React.useState([]);
  const [flag, setFlag] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState('');

  /**
   * Функция, которая отображает кастомизированный alrt
   * @param {string} data
   */
  const showAlert = (data) => {
    setAlertMsg(data);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  React.useEffect(() => {
    getTasks(setTask);
  }, []);

  return (
    <div className="container">
      {alertVisible && <Alert message={alertMsg} />}
      <Header />
      <div className="create-new-task-button">
        <button disabled={visible} onClick={() => setVisible(true)}>
          Создать новую задачу
        </button>
      </div>
      {visible && (
        <NewTask setVisible={setVisible} task={task} setTask={setTask} showAlert={showAlert} />
      )}
      {!visible &&
        task.map((obj) => (
          <Task
            key={obj.id}
            {...obj}
            task={task}
            setTask={setTask}
            setFlag={setFlag}
            flag={flag}
            showAlert={showAlert}
          />
        ))}
    </div>
  );
};

export default App;
