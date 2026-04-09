# Инструкция по работе с ветками (SEO и Прод)

Этот документ описывает структуру веток после внедрения премиального SEO-дизайна.

## 1. Актуальные ветки

### 🛠 Ветка для разработки и демонстрации (DEV)
**Название:** `feature/seo-expanded-text-example`
*   **Что внутри:** Полный SEO-функционал + тестовая премиум-страница `/test1`.
*   **Для чего:** Идеально подходит для показа руководству новых возможностей дизайна и контента.
*   **Команда переключения:** `git checkout feature/seo-expanded-text-example`

### 🚀 Ветка для выпуска в прод (RELEASE)
**Название:** `release/seo-production`
*   **Что внутри:** Все SEO-улучшения (robots.txt, sitemap, seo-engine, убранный топ-бар), но **БЕЗ** тестовой страницы `/test1`.
*   **Для чего:** Эту ветку нужно мержить в `main` для финального деплоя на сайт.
*   **Команда переключения:** `git checkout release/seo-production`

---

## 2. Как выкатывать обновления (Workflow)

### Шаг А: Если нужно внести изменения в дизайн
1. Переключись на dev-ветку: `git checkout feature/seo-expanded-text-example`.
2. Внеси правки, закоммить.
3. Перенеси изменения в прод-ветку: 
   ```bash
   git checkout release/seo-production
   git merge feature/seo-expanded-text-example
   git rm -r app/test1    # Удаляем страницу, если она снова появилась после мерджа
   git commit -m "update: sync production with dev (removed test1)"
   ```

### Шаг Б: Деплой на продакшн (в основной сайт)
Когда `release/seo-production` готова к выкатке:
1. Переключись на главную ветку: `git checkout main`.
2. Слей изменения: `git merge release/seo-production`.
3. Запусти сборку: `npm run build`.

---

## 3. Краткое резюме проделанной работы
*   Стандартизирован домен `metall-calculator.ru` (выпилен MetalPro).
*   Настроены `robots.txt` и `sitemap.ts`.
*   Добавлены JSON-LD микроразметка и канонические теги.
*   Убран Top Bar со всех страниц кроме тестовой.
*   Создан SEO-движок для динамических заголовков и мета-тегов.
