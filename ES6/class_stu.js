/**
 * Created by asusps on 2019/3/30.
 */
/**
 * ES6 的Class 可以看作一个语法糖，他绝大多数的语法都能靠ES5实现
 * */

// es5
function Point (x, y) {
    this.x = x;
    this.y = y;

}
Point.prototype.toString = function () {
    return this.x + 'and ' + this.y;
};

var p = new Point(1,2);
p.toString();

// es6
class Point1 {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
    toString () {
        return this.x + 'and ' + this.y;
    }
}

var p1 = new Point1(1,3);
p1.toString();

// constructor 属性指向类的本身

// 类的内部所定义的方法是不肯枚举的，可是es5的为prototype添加的方法是可以枚举的
Object.keys(Point.prototype); //["toString"]
Object.getOwnPropertyNames(Point.prototype); // ["constructor","toString"]
Object.keys(Point1.prototype); // []
Object.getOwnPropertyNames(Point1.prototype); // ["constructor","toString"]

/**
 * constructor 一个类必须有constructor方法，如果没有显示定义，一个空的constructor会被默认添加
 * */

/**
 * 取值函数getter， 存值函数setter
 * */

/**
 * 属性表达式
 * */

let methodName = 'getArea';
class square {
    constructor (length) {

    }
    [methodName]() {

    }
}

/**
 * class 表达式
 * */

// 采用 Class 表达式，可以写出立即执行的 Class。
let person = new class {
    constructor(name) {
        this.name = name;
    }

    sayName() {
        console.log(this.name);
    }
}('张三');

person.sayName(); // "张三"

// 私有属性， 私有方法
// 1)
class Wdiget {
    foo (baz) {
        bar.call(this, baz);
    }
}
function bar (baz) {
    return this.snaf = baz;
}

// 2) 利用Symbol唯一值属性
const bar = Symbol('bar');
const snaf = Symbol('snaf');
export default class myClass {
    // 公共方法
    foo(baz) {
        this[bar](baz);
    }
    // 私有方法
    [bar](baz) {
        return this[snaf] = baz;
    }
}

// 3) 私有属性提案 #属性，#方法


/***************************************
 *  Class 继承
 * **************************************/

/**
 * 通过extends 关键字实现继承
 * ES5 的继承，实质是先创造子类的实例对象this，
 *   然后再将父类的方法添加到this上面（Parent.apply(this)）。
 *
 * ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），
 * 然后再用子类的构造函数修改this
 * */
class Point {
}

class ColorPoint extends Point {
}


// 继承实现的模式
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();

// setPrototypeOf
Object.setPrototypeOf = function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}