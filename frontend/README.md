# TODO

- [] открыть изображение в лайтбоксе при клике на странице редактирования товара
- [] геолокация по карте
- [] push уведомления
- [] цветовая палитра не очень
- [] тянуть картинку карегории с api
- [] как удалить изображение из товара?
- [] выводить категорию
- [x] фильтр по координатам
- [x] переименовать в mon busines
- [x] ссылка на политики и условия пользования - пустые
- [x] отдебажить карты на устройствах
- [x] выбрать главную картинку
- [x] скрыть кнопки голосования если открыта карточка текущего пользователя не на странице профиля
- [x] отладить голосование (бэк)
- [x] скрыть кнопку чата если открыта карточка, созданная пользователем
- [x] скрыть кнопку report ad если открыта карточка, созданная пользователем
- [x] report ad - отладить
- [x] загрузка аватара на ios эмуляторе виснет
- [x] развернуть боевую хасуру
- [x] собрать боевой билд приложения

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Generate splash

https://github.com/zoontek/react-native-bootsplas#full-command-usage-example

```sh
yarn react-native generate-bootsplash ../design/launch@3x.png \
  --platforms=ios \
  --background=C57249 \
  --logo-width=512 \
  --assets-output=assets \
  --flavor=main

yarn react-native generate-bootsplash ../design/launch@3x.png \
  --platforms=android \
  --background=C57249 \
  --logo-width=192 \
  --assets-output=assets \
  --flavor=main
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## MyBusInAss Backend

Репозиторий: https://bus:vwyNfMu5EMBL8bnqbzwW@lab.alfmaster.ru/my-bus-in-ass/backend.git

// LOCAL token: 1|KuRONowut8Zpk3fK1IcaGzudzLQy7tGY4AD2rHnp
// LOCAL token: 4|laravel_sanctum_5SPInfr293l3vQxNgVH2Tr2NKdJK2rTzGEuL95Sne134af45

### Методы API

#### Авторизация

`POST /api/login` - авторизоваться
В BODY нужно передать:

```json
{
  "login": "alfmaster@alfmaster.ru",
  "password": "123123123"
}
```

Если успешно, вернется HTTP 200:

```json
{
  "token": "2|MlVQQTih1mtI9V8ZLZ5eXIDenrUU0FTGuoITEd0e"
}
```

Если неуспешно, то вернется HTTP-401:

```json
{
  "message": "Unauthenticated"
}
```

#### Города

`GET /api/cities` - получить список городов
`GET /api/cities/{id}` - получить город

#### Места (Населенные пункты, деревни и села)

`GET /api/places` - получить список городов
`GET /api/places/{id}` - получить город

#### Категории товаров

`GET /api/categories` - категории товаров
`GET /api/categories/{id}` - описание категории

#### Товары для авторизованного пользователя

Если пользователь авторизован, то у него есть возможность смотреть свои товары (во всех статуса) + товары других продавцов.
Также есть возможность создавать новые товары и редактировать старые.

`GET /api/wares` - список товаров
`GET /api/wares/{id}` - получение карточки товара
`POST /api/wares/{id}/upload-image` - добавить картинку для товара.
Чтобы добавить картинку - надо передать ее в JSON в виде массива:
`json
                {
                    "name": "Любое имя, title для картинки это ОПЦИОНАЛЬНОЕ ПОЛЕ.",
                    "image": "data:image/jpeg;base64,........."
                }
                `
Желательно передавать картинку в формате 4:3, но в принципе - не обязательно.
Ответ будет примерно такой:
`json
                {
                    "data": {
                        "id": 123123123,
                        "name": "Имя которое было введено ",
                        "avatar": "https://avito.....",
                        "image": "https://avito....."
                    }
                } 
                `
`GET /api/wares/{id}/make-main-image/{imageId}` - сделать картинку главной картинкой внутри товара. По-умолчанию главной становится первая загруженная.
Ответ будет такой:
`json
                {
                    "status": "ok"
                }
                `
`GET /api/wares/create` - получить шаблон, которые можно заполнить, чтобы создать новый товар
Ответ будет примерно такой, нас будет интересовать то, что внутри `data`:
`json
                        {
                            "data": {
                                "name": "",
                                "description": "",
                                "city_id": 0,
                                "place_id": 0,
                                "address": "",
                                "lat": 0,
                                "lon": 0,
                                "price": 0,
                                "youtube_code": "",
                                "category_ids": [
                                    1,
                                    2,
                                    3
                                ]
                            }
                        }
                        `
`POST /api/wares` - создать новый товар. Картинки потом надо будет добавить отдельно.
Передаем соержимое блока `data` из метода `GET /api/wares/create`, например:
`json
                {
                    "name": "Тест",
                    "description": "тестовое описание",
                    "city_id": 1,
                    "place_id": 1,
                    "address": "Москва, Тестовская 11-22",
                    "lat": 55,
                    "lon": 35,
                    "price": 10102,
                    "youtube_code": "",
                    "status": "draft"
                    "category_ids": [7, 8]
                }
                `
Возможные варианты поле status:
_ `draft` - черновик (то есть я это создал и не публиковал), если пользователь 1 раз его перевел из draft -> on, то больше оно в draft не возвращается
_ `on` - опубликованное объявление,
_ `off` - снятое с публикации,
_ `sold` - проданное
`PUT /api/wares/{id}` - обновить данные о товаре, тело запроса такое же, как и при `POST /api/wares`, одновиться только твой товар, который ты сам создал (где ты - trader)
`DELETE /api/wares/{id}` - удалить товар. Удалиться только твой товар, который ты сам создал (где ты - trader)

#### Товары для НЕ авторизованного пользователя

`GET /api/open-wares` - список товаров
`GET /api/open-wares/{id}` - получение карточки товара

#### Избранное

`GET /api/wares/{id}/favorites/add` - добавить товар в избранное
`GET /api/wares/{id}/favorites/remove` - удалить товар из избранного
`GET /api/favorites` - список избранного. Полный аналог (1 в 1 `GET /api/wares`)

#### Пользователи

`GET /api/users/me` - Получить данные своего профиля
`GET /api/users/{id}` - Получить данные профиля произвольного пользователя по ID
`PUT /api/users/me` - отредактировать профиль. Тут нельзя отредактировать пароль и аватар (для этого есть отдельные методы)
`POST /api/users/me/set-avatar` - Загрузить картинку с аватаров (фотка пользователя)
`json
                {
                    "avatar": "data:image/jpeg;base64,........."
                }
                `
В ответ вернется то же самое, что и у метода `GET /api/users/me` (профиль текущего пользователя)
`GET /api/users/me/remove-avatar` - удалить аватар. В ответ вернется то же самое, что и у метода `GET /api/users/me` (профиль текущего пользователя)
`PUT /api/users/me/set-password` - поменять пароль, password - старый пароль, new_password и new_password_confirmation - новый пароль 2 раза.

```json
{
  "password": "12345",
  "new_password": "1234567890",
  "new_password_confirmation": "1234567890"
}
```

`GET /api/users/create` - получить шаблон для заполнения, чтобы создать пользователя
`POST /api/users` - создать нового пользователя, вернуть нужно то, что `GET /api/users/create` вернул внутри data, только заполненное.

#### Голосование

`GET /api/traders/{id}/vote/{vote}` - проголосовать за торговца (я голосую за кого-то, кто что-то продает),
`id` - это ID пользователя, за которого надо проголосовать
`vote` - это голос: `up`, `down` или `remove` (удалить голос)
`GET /api/customers/{id}/vote/{vote}` - проголосовать за покупателя (я голосую за кого-то, кто что-то купил)
`id` - это ID пользователя, за которого надо проголосовать
`vote` - это голос: `up`, `down` или `remove` (удалить голос)

#### Жалоба. На пользователя

`POST /api/complaints/user` - отправить жалобу на пользователя

```json
{
  "bastard_id": 12,
  "message": "Он, однозначно - негодяй"
}
```

- `bastard_id` - ID пользователя, на которого жалуемся
- `message` - текст сообщения

#### Жалоба. На товар

`POST /api/complaints/user` - отправить жалобу на пользователя

```json
{
  "wares_id": 11,
  "message": "Это, однозначно - гавно с дымом"
}
```

- `wares_id` - ID товара, на который жалуемся
- `message` - текст сообщения
