import api from '@/assets/js/http.js';
// var config = require('static/config/config.json');
var config;
export default class {
    constructor() {
        this.config = '';
        this.HOST = [];
        this.URL = [];
        this.MyProcess = '';
        this.callback = '';
    }
    init(process, callback, config) {
        // api.get('./config.json').then((res) => {
        // config = res;
        this.config = config;
        this.MyProcess = process;
        this.callback = callback;
        for (let key in config) {
            if (key.indexOf("_HOST") >= 0) {
                this.HOST.push({
                    key: key,
                    url: config[key]
                });
            } else if (key.indexOf("_URL") >= 0) {
                this.URL.push({
                    key: key,
                    url: config[key]
                });
            }
        }
        this.observer();
        this.autoLoad();
        // });
    }
    observer() {
        if (this.MyProcess.NODE_ENV == 'development' && this.MyProcess.ISMOCK_ENV) {
            this.HOST.forEach(host => {
                config[host.key] = "http://" + this.MyProcess.HOST_ENV;
            });
        }
    }
    autoLoad() {
        if (this.URL.length > 0) {
            this.URL.forEach((item, idx, arr) => {
                if (idx == arr.length - 1) {
                    this.loadJS(item.url, this.callback);
                } else {
                    this.loadJS(item.url);
                }
            });
        } else {
            this.callback();
        }
    }
    loadJS(url, callback) {
        var script = document.createElement('script');
        script.type = "text/javascript";
        if (typeof (callback) != "undefined") {
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = function () {
                    callback();
                };
                script.onerror = function () {
                    callback();
                };
            }
        }
        script.src = url;
        document.body.appendChild(script);
    };
}
