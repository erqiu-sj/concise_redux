# tool

### I know that creating actions frequently and creating corresponding hooks in large projects is exhausting, and this situation will not happen in the future.

### Now the package comes with a cli tool, you only need to make the following configuration in the package

```json

"conciseredux": {
    "baseURL": "./src",
    "storePath": "./store/index.ts",
    "reducerDirPath": "./reducer",
    "pathAlias": "~/",
    "hooksDir": "./hooks",
    "reducerList": {
      "actionList": [
        "update",
        "actions",
        "remove"
      ],
      "user": [
        "removeUser",
        "updateuser",
        "addUser"
      ]
    }
  }
```

## baseURL `(require)`

```
This field should point to your src directory
```

## storePath `(require)`

```
This field points to where your store file is, which is used to update your store file synchronously when the action configuration changes
```

## reducerDirPath `(require)`

```
This field points to the folder where your reducer files should be stored
```

## pathAlias `(suggestion)`

## hooksDir `(suggestion)`

```
Create a hooks file directory for reducer-related hooks files
```

## reducerList `(suggestion)`

```
The key is reducerName The content of the array element is the action constant of the reducer
```

# use

```json
{
  "script": {
    "c": "conciseredux -h"
  }
}
```

```shell
yarn run c
or
npm run c
```
