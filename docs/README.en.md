NOVEMBERIZING STORAGE
=====================

[ENGLISH](https://novemberizing.github.io/storage/README.en.html) |
[한국어](https://novemberizing.github.io/storage/README.ko.html)

![Node js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

![Github issues](https://img.shields.io/github/issues/novemberizing/storage)
![GitHub license](https://img.shields.io/github/license/novemberizing/storage)
![GitHub release](https://img.shields.io/github/v/release/novemberizing/storage)
![Npm version](https://img.shields.io/npm/v/@novemberizing/storage)

----

> "Novemberizing storage" is a library made in JavaScript that allows you to access storage and easily perform tasks such as creating, deleting, and modifying resources.

The goal of "Novemberizing storage" is to support memory, file system, and database as well as various other storage types so that storage can be changed easily by changing the "URL".

![Class Diagram Log](https://novemberizing.github.io/storage/assets/images/ClassDiagramStorage.jpg)

The storage class has `adapter: Adapter` that executes actual commands and `extension: Extension` that can define additional commands as members. For example, in the case of a file system, `adapter: Adapter` basically has simple commands such as `get()`, `set(value)`, `del()` to read, write, Only the method that can be deleted is implemented, but if you use `extension: ExtensionJson`, you can access the Json file and use a specific key value to define and use methods that can search, modify, or delete with a specific key of the `Json` object. .

```js
const o = new Storage({ url: 'fs://./configure.json' });

console.log(o.set("hello.world", {}));
console.log(o.get("hello"));
console.log(o.del("hello"));
```

## INSTALL

The storage library can be installed using "npm".

```
npm install --save @novemberizing/storage
```

## USAGE

You can create storage objects with URL and execute commands.

```js
const o = new Storage({ url:"fs://./configure.json" });

console.log(o.set("hello", "world"));
console.log(o.get(""));
console.log(o.del("hello"));
```

### USE MEMORY STORAGE

To create and use memory-based storage, simply specify the protocol (`mem:`), host, and path in the `URL`. In the case of memory-based storage, all values in the storage are initialized when the application is created, and all values are lost when the application is closed. However, if an already created memory storage exists while the application is running, the previously saved value can be used.

```js
const o = new Storage({ url: "mem://./configure.json" });

console.log(o.set("hello", "world"));
console.log(o.get(""));
console.log(o.del("hello"));
```

### USE FILE STORAGE

File storage can be created by specifying the protocol (`fs:`), host, and path in `URL` just like memory storage. In the case of file storage, unlike memory storage, stored data can be used depending on the existence of a file, independent of application creation and termination.


```js
const o = new Storage({ url: "fs://./configure.json" });

console.log(o.set("hello", "world"));
console.log(o.get(""));
console.log(o.del("hello"));
```

### USE MYSQL DATABASE STORAGE

MYSQL database storage is used by internally creating an adapter that can use the database as a storage. In case of MYSQL database, if you want to use it like a file or memory, you can additionally define and use the `extension` setting. You can define and use `get`, `set`, `del` to use it like a JSON memory or file.

```js
const o = new Storage({
    url: "mysql://user@localhost:3306/databasename",
    adapter: {
        password: "password"
    },
    extension: {
        get: { sql: "..." },
        set: { sql: "..." },
        del: { sql: "..." },
    }
});

console.log(o.set("hello", "world"));
console.log(o.get(""));
console.log(o.del("hello"));
```

### USE JSON EXTENSION

You can use the JSON extension by specifying `.json` in the file extension. However, in the case of a database, methods such as `get(key): object`, `set(key, value): object`, `del(key): object` must be defined and used.

```js
const fs = new Storage({ url: "fs://./configure.json" });

console.log(fs.set("hello", "world"));
console.log(fs.get(""));
console.log(fs.del("hello"));

const mem = new Storage({ url: "mem://./configure.json" });

console.log(mem.set("hello", "world"));
console.log(mem.get(""));
console.log(mem.del("hello"));

const mysql = new Storage({
    url: "mysql://user@localhost:3306/db",
    adapter: {
        password: "password"
    },
    extension: {
        get: { sql: "..." },
        set: { sql: "..." },
        del: { sql: "..." },
    }
});

console.log(mysql.set("hello", "world"));
console.log(mysql.get(""));
console.log(mysql.del("hello"));
```

### DOCUMENT

[Novemberizing log api](https://novemberizing.github.io/storage/api)
