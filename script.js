function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function init() {
  let vacancies = document.querySelectorAll('[data-qa="vacancy-serp__vacancy_response"]');

  // Проверка на наличие вакансий
  if (!vacancies.length) {
    console.error('Вакансии не найдены');
    return;
  }

  // Функция для автоматического выбора резюме
  function selectResume() {
    const resume = document.querySelector('resumeID'); // Укажите id вашего резюме
    const message = document.querySelector('[data-qa="vacancy-response-letter-toggle"]');
    if (resume) {
      resume.click();
      if (message) {
        message.click();
      }
    } else {
      console.error('Резюме не найдено');
    }
  }

  // Функция для автоматической отправки сопроводительного письма
  function handlerCoverLetter() {
    const vacancyTitleElement = document.querySelector('.bloko-modal-header_outlined > div');
    const vacancyName = vacancyTitleElement ? vacancyTitleElement.textContent.trim() : '';

    const messageArea = document.querySelector('[data-qa="vacancy-response-popup-form-letter-input"]');
    if (messageArea) {
      const coverLetter = `Добрый день! 

Меня заинтересовала предложенная Вами вакансия ${vacancyName}. Ознакомившись с перечнем требований к кандидатам, пришел к выводу, что мой опыт работы позволяют мне претендовать на данную должность. 

Обладаю высоким уровнем фронтенд-разработки, свободно говорю по-английски. В работе ответствен, пунктуален и коммуникабелен.

Буду с нетерпением ждать ответа и возможности обсудить условия работы и взаимные ожидания на собеседовании. Спасибо, что уделили время. 

Контактные данные прилагаю.`;

      messageArea.value = coverLetter;

      // Генерируем событие изменения для активации обработчика ввода
      const event = new Event('input', { bubbles: true });
      messageArea.dispatchEvent(event);

      const btnSubmit = document.querySelector('[data-qa="vacancy-response-submit-popup"]');
      if (btnSubmit) {
        btnSubmit.click();
      } else {
        console.error('Кнопка отправки отклика не найдена');
      }
    } else {
      console.error('Поле сопроводительного письма не найдено');
    }
  }

  for (let i = 0; i < vacancies.length; i++) {
    // Перезагружаем список вакансий, чтобы учесть изменения DOM
    vacancies = document.querySelectorAll('[data-qa="vacancy-serp__vacancy_response"]');

    // Кликаем по кнопке "Откликнуться" на текущей вакансии
    vacancies[i].click();
    await delay(1000); //  Увеличенное ожидание для полной загрузки модального окна

    selectResume();
    await delay(500) // Ожидание для выбора резюме

    handlerCoverLetter();
    await delay(1000); // Ожидание завершения отправки отклика и закрытия модального окна

    // Проверяем и закрываем модальное окно, если оно осталось открытым
    const closeButton = document.querySelector('[data-qa="vacancy-response-popup-close-button"]');
    if (closeButton) {
      closeButton.click();
      await delay(1000); // Ждём закрытия окна
    }
  }
}

// Добавление кнопки на навигационную панель
(async function addNavLinks() {
  await delay(1000);

  const navLinks = document.querySelectorAll(
    '.supernova-navi-item.supernova-navi-item_lvl-2.supernova-navi-item_no-mobile'
  );

  const itemLetters = document.createElement('div');

  function createElement(item, attribute, title) {
    item.classList.add(
      'supernova-navi-item',
      'supernova-navi-item_lvl-2',
      'supernova-navi-item_no-mobile'
    );

    item.innerHTML = `
      <a
        data-qa="mainmenu_vacancyResponses"
        class="supernova-link"
        ${attribute}
      >
        ${title}
      </a>
      <div class="supernova-navi-underline">${title}</div>
    `;
  }

  createElement(itemLetters, 'handler-letters', 'Отправить отклики');

  navLinks[2].append(itemLetters);
  document.querySelector('[handler-letters]').addEventListener('click', init);
})();

