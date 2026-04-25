const input = document.getElementById('ageInput');  
const btn = document.getElementById('btn');
const result = document.getElementById('result');

const maleNames = ['денис', 'алексей', 'иван', 'петр', 'сергей', 'андрей', 'владимир', 'максим', 'никита'];
const femaleNames = ['анна', 'мария', 'елена', 'ольга', 'наталья', 'ирина', 'светлана', 'татьяна', 'екатерина', 'юлия', 'дарья'];

btn.addEventListener('click', () => {
  const name = input.value.trim().toLowerCase();  

  if (name === '') {
    result.textContent = 'Введите имя';
  } 
  else if (maleNames.includes(name)) {
    result.textContent = 'Вы мужчина';
  } 
  else if (femaleNames.includes(name)) {
    result.textContent = 'Вы женщина';
  } 
  else {
    result.textContent = 'Имя не найдено в базе';
  }
});