
# jb-searchbar

minimalistic customizable search bar web-component for adding filter options in minimum space
sample:<https://codepen.io/javadbat/pen/rNjrZpy>

## usage

```cmd

npm i jb-searchbar

```

```js
import 'jb-searchbar';
```

```html
<jb-searchbar></jb-searchbar>
```

## attributes

### placeholder

```html

<jb-searchbar placeholder="please choose column"></jb-searchbar>

```

## set filter list

filter list is a list of your filter you want user choose filter from and set like this:

## search on change

you can trigger search by clicking on search button, if you want to trigger it on every change set `searchOnChange` like this:

```javascript
document.querySelector('jb-searchbar').searchOnChange = true;
```

```js
document.querySelector('jb-searchbar').columnList = [
        {
            key: 'title',
            label: 'تیتر',
            type: 'TEXT'
        },
        {
            key: 'name',
            label: 'نام',
            type: 'TEXT',
            maxUsageCount: 3
        },
        {
            key: 'age',
            label: 'سن',
            type: 'TEXT'
        },
        {
            key: 'fromDate',
            label: 'از تاریخ',
            type: 'DATE'
        },
        {
            key: 'GENDER',
            label: 'جنسیت',
            type: 'SELECT',
            config: {
                optionList: [
                    {
                        title: 'آقا',
                        value: 'MALE'
                    },
                    {
                        title: 'خانم',
                        value: 'FEMALE'
                    }
                ],
                getOptionTitle: (option) => {
                    return option.title;
                },
                getOptionValue: (option) => {
                    return option.value;
                }
            }

        },
        {
            key: 'fromDate',
            label: 'تا تاریخ',
            type: 'DATE'
        }
    ]
```
## css variables
| Name                                | Description                                | Default Value  |
|-------------------------------------|--------------------------------------------|----------------|
| --jb-searchbar-filter-item-bg-color | background color of completed filter item  | #408cff        |
| --jb-searchbar-filter-item-color    | text color of completed filter item         | #fff           |