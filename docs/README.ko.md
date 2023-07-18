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

> "Novemberizing storage" 는 저장소에 접근하여 리소스를 생성, 삭제, 수정 등의 작업을 쉽게 수행할 수 있도록 자바스크립트로 만들어진 라이브러리입니다.

"Novemberizing storage" 의 목표는 메모리, 파일 시스템 그리고 데이터베이스는 물론 기타 다양한 스토리지 타입을 지원하여 "URL" 변경 만으로 스토리지를 쉽게 변경할 수 있도록 하는 것입니다.

![Class Diagram Log](https://novemberizing.github.io/storage/assets/images/ClassDiagramStorage.jpg)

스토리지 클래스는 실제 명령을 수행하는 `adapter: Adapter`와 부가적인 명령을 정의할 수 있는 `extension: Extension` 를 멤버로 가지고 있습니다. 예를 들어, 파일 시스템의 경우 `adapter: Adapter`는 기본적으로 `get()`, `set(value)`, `del()` 과 같은 간단한 명령만 가지고 있어서, 파일의 데이터를 읽고, 쓰고, 지울 수 있는 메서드만 구현되어 있지만, `extension: ExtensionJson` 을 사용한다면, Json 파일에 접근하여 특정 키 값을 사용하여 `Json` 객체의 특정 키로 조회, 수정, 삭제할 수 있는 메서드를 정의하여 사용할 수 있습니다.

```js
const o = new Storage({ url: 'fs://./configure.json' });

console.log(o.set("hello.world", {}));
console.log(o.get("hello"));
console.log(o.del("hello"));
```

## 설치

스토리지 라이브러리는 "npm"을 이용하여 설치할 수 있습니다.

```
npm install --save @novemberizing/storage
```

## 사용법

URL이 명시된 스토리지 객체를 생성하고, 명령을 수행할 수 있습니다.

```js
const o = new Storage({ url:"fs://./configure.json" });

console.log(o.set("hello", "world"));
console.log(o.get(""));
console.log(o.del("hello"));
```

### 메모리 스토리지 사용

메모리 기반의 스토리지를 생성하고 사용하려면 간단하게 `URL`에 프로토콜(`mem:`), 호스트, 그리고 경로를 명시하여 사용할 수 있습니다. 메모리 기반의 스토리지의 경우 어플리케이션이 생성되면 스토리지의 모든 값이 초기화되고, 어플리케이션이 종료되면 모든 값이 사라지기 때문에 휘발성을 염두에 두고 사용해야 합니다. 다만, 어플리케이션이 실행 중에, 이미 생성된 메모리 스토리지가 존재하는 경우 이전에 저장된 값을 사용할 수 있습니다.

```js
const o = new Storage({ url: "mem://./configure.json" });

console.log(o.set("hello", "world"));
console.log(o.get(""));
console.log(o.del("hello"));
```

### 파일 스토리지 사용

파일 스토리지의 생성은 메모리 스토리지와 마찬가지로 `URL`에 프로토콜(`fs:`), 호스트, 그리고 경로를 명시하여 사용할 수 있습니다. 파일 스토리지의 경우 메모리 스토리지와 달리 어플리케이션의 생성과 종료와 별개로 파일 존재 여부에 따라서 저장된 데이터를 사용할 수 있게 됩니다.


```js
const o = new Storage({ url: "fs://./configure.json" });

console.log(o.set("hello", "world"));
console.log(o.get(""));
console.log(o.del("hello"));
```

### MYSQL 데이터베이스 스토리지 사용

MYSQL 데이터베이스 스토리지는 데이터베이스를 저장소 처럼 사용할 수 있는 아답터를 내부적으로 생성해서 사용하는 것입니다. MYSQL 데이터베이스의 경우 파일이나 메모리 처럼 사용하려면 `extension` 설정을 부가적으로 정의하여 사용할 수 있습니다. JSON 메모리나 파일처럼 사용하려면 `get`, `set`, `del` 을 정의하여 사용할 수 있습니다.

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

### JSON EXTENSION 사용

파일 확장자에 `.json` 을 명시하면 JSON 확장을 사용할 수 있습니다. 단, 데이터베이스의 경우 `get(key): object`, `set(key, value): object`, `del(key): object` 와 같은 메서드를 정의하여 사용해야 합니다.

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

### 문서

[Novemberizing storage api](https://novemberizing.github.io/storage/api)
