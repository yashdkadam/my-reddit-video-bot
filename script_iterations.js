function checkExecutionStatus() {
  const cells = document.querySelectorAll('colab-cell');
  let allCellsExecuted = true;

  cells.forEach(cell => {
    const cellType = cell.getAttribute('cell-type');
    if (cellType !== 'text') {
      const runButton = cell.querySelector('colab-run-button');
      const outputArea = cell.querySelector('colab-output-area');
      const isExecuting = outputArea ? outputArea.classList.contains('running') : false;
      if (runButton && isExecuting) {
        allCellsExecuted = false;
      }
    }
  });

  return allCellsExecuted;
}

function runAll() {
  const F9Event = {key: "F9", code: "F9", metaKey: true, keyCode: 120};
  return new Promise((resolve, reject) => {
    document.dispatchEvent(new KeyboardEvent("keydown", F9Event));
    // Assuming runAll will always succeed
    resolve(true);
  });
}

function waitForCompletion() {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      const allCellsExecuted = checkExecutionStatus();
      if (allCellsExecuted) {
        clearInterval(intervalId);
        console.log('All cells have been executed.');
        resolve(true);
      }
    }, 3000); // Check every 3 seconds
  });
}

function loop1(i) {
  if (i === 0) {
    return Promise.resolve();
  }

  console.log('iteration number', i);

  return runAll()
    .then(() => waitForCompletion())
    .then(() => loop1(--i))
    .catch(error => {
      console.error(error);
      throw error;
    });
}

let it = prompt("Please enter number of iterations: ");
// Running loop 5 times
let promiseChain = Promise.resolve();
promiseChain = promiseChain.then(() => loop1(it));


promiseChain.catch(error => console.error(error));
