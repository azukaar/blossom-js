let taskQueue = [];

function taskQueueRunNext() {
  taskQueue[0]();
  taskQueue.shift();
  if (taskQueue.length > 0) {
    taskQueueRunNext();
  }
}

function add(task) {
  const needStart = taskQueue.length === 0;
  taskQueue.push(task);
  if (needStart) {
    taskQueueRunNext();
  }
}

function addList(tasks) {
  const needStart = taskQueue.length === 0;
  taskQueue = taskQueue.concat(tasks);
  if (needStart) {
    taskQueueRunNext();
  }
}

function isEmpty() {
  return taskQueue.length === 0;
}

function length() {
  return taskQueue.length === 0;
}

export { add, addList, isEmpty, length };
