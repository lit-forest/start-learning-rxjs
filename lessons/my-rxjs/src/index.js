var input = document.querySelector('input');
var h1 = document.querySelector('h1');

input.addEventListener

var Observer = function (consumer) {
    this._consumer = consumer;
};
Observer.prototype.onNotify = function (data) {
    this._consumer.call(this, data); //调用真正的消费逻辑
};
var Observable = function (generator) {
    this._generator = generator; //先保存生成器，当观测者连接时再执行
};
//参数observer声明一个观测者对象
Observable.prototype.subscribe = function (observer) {
    this._generator.call(this, observer);  //为观测者执行生成器
};



var generator = function (observer) {
    setInterval(function () {
        observer.onNotify(Math.random()); //每秒调用一次
    }, 1000);
};
var tickStream = new Observable(generator);

var consumer = function (data) {
    console.log(data)
};
var uiRefresher = new Observer(consumer);

tickStream.subscribe(uiRefresher);