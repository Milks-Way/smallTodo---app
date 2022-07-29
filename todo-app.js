(function () {
  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  tasksArr = [];
  listName = '';
  entry = [];

  // создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', 'disabled');


    // Делаем кнопку неактивной до ввода текста в поле

    input.oninput = function() {
      button.removeAttribute('disabled');
      if(input.value <= 0) {
          button.setAttribute('disabled', 'disabled');
      };
    }


    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // создаём и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }



  function createTodoItem(obj) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для елемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    doneButton.addEventListener('click', function() {
      const tasksArr = JSON.parse(localStorage.getItem(listName));

      item.classList.toggle('list-group-item-success');
      for( const task of tasksArr) {
        if (task.id == obj.id) {
          task.done = !task.done;
        }
      }
      localStorage.setItem(listName, JSON.stringify(tasksArr));

    });


    deleteButton.addEventListener('click', function() {
      const tasksArr = JSON.parse(localStorage.getItem(listName));
      if (confirm('Вы уверены?')) {
        item.remove();
        for (let i = 0; i < tasksArr.length; ++i) {
          if(tasksArr[i].id == obj.id)
          tasksArr.splice(i, 1)
        }
        localStorage.setItem(listName, JSON.stringify(tasksArr));
        console.log(tasksArr);
      }
    });

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);



    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }


  function createTodoApp(container, title = 'Список дел', keyName, startTask = []) {


    listName = keyName;

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    let todoItem = createTodoItem(todoItemForm.input.value);


    function showTasks() {
      startTask;
      const tasksArr = JSON.parse(localStorage.getItem(listName));
      if (tasksArr == null || tasksArr == '') {

        let existingTasks = [];
        for (let i = 0; i < startTask.length; ++i) {
            let entry = {name: startTask[i].name, done: false, id: existingTasks.length + 1};
            localStorage.setItem("entry", JSON.stringify(entry));
            // Save allEntries back to local storage
            existingTasks.push(entry);

            let todoItem = createTodoItem(entry);



          todoList.append(todoItem.item);
        }

        localStorage.setItem(listName, JSON.stringify(existingTasks));
          return;

      }

      for (let i = 0; i < tasksArr.length; ++i) {
        let todoItem = createTodoItem(tasksArr[i]);
        todoList.append(todoItem.item);

        if (tasksArr[i].done == true) {
            todoItem.item.classList.toggle('list-group-item-success');
        }


      }
        todoItem.doneButton.addEventListener('click', function() {
          todoItem.item.classList.toggle('list-group-item-success');
          if (tasksArr[i].done !== true) {
              tasksArr[i].done = true;
              localStorage.setItem(listName, JSON.stringify(tasksArr));
          } else if (tasksArr[i].done == true) {
              tasksArr[i].done = false;
              localStorage.setItem(listName, JSON.stringify(tasksArr));
          }

        });

        todoItem.deleteButton.addEventListener('click', function() {
          if (confirm('Вы уверены?')) {

            const taskName = todoItem.item.firstChild.textContent;
            console.log(taskName)
            for (let i = 0; i < tasksArr.length; i++) {
              todoItem.item.remove();
              if (tasksArr[i].name == taskName) {
                tasksArr.splice(i, 1)
                localStorage.setItem(listName, JSON.stringify(tasksArr));
              }
            }
          }
        });
    }

    showTasks();




    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);



    // браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания  дела
    todoItemForm.form.addEventListener('submit', function(e) {
      //эти строчка необходима, чтобы предотвратить стандатное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();


      // игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      }


      function makeID(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) {
                max = item.id
            }
        }
        return max + 1;
      }




        // Parse any JSON previously stored in allEntries
      var existingTasks = JSON.parse(localStorage.getItem(listName));
      if(existingTasks == null) existingTasks = [];
      let entry = {name: todoItemForm.input.value, done: false, id: makeID(existingTasks)};


      localStorage.setItem("entry", JSON.stringify(entry));
      // Save allEntries back to local storage
      existingTasks.push(entry);
      localStorage.setItem(listName, JSON.stringify(existingTasks));
      let todoItem = createTodoItem(entry);


      // обнуляем знвчение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';

      // делаем кнопу неактивной после добавления задачи
      todoItemForm.button.setAttribute('disabled', 'disabled');

      // создаём и добавляем в список новое дело с названием из полдя ввода
      todoList.append(todoItem.item);


    });

  }


  window.createTodoApp = createTodoApp;
}) ();


// function doneBtn (arr, list) {
//     todoItem.doneButton.addEventListener('click', function() {
//         todoItem.item.classList.toggle('list-group-item-success');
//         if (arr[i].done !== true) {
//             arr[i].done = true;
//             localStorage.setItem(list, JSON.stringify(arr));
//         } else if (arr[i].done == true) {
//             arr[i].done = false;
//             localStorage.setItem(list, JSON.stringify(arr));
//         }

//     });
// }




