// var baseURL = 'http://wwwdev.ebi.ac.uk/eva';
var baseURL = 'http://localhost/eva-web/build/3.1.0/index.html';
// var baseURL = 'http://localhost/eva-web/src/index.html';
var browser = process.env.BROWSER;

module.exports = {
    initDriver: function (driverName) {
        require('chromedriver');
        require('geckodriver');
        driver = new webdriver.Builder()
            .forBrowser(driverName)
            .build();
        driver.manage().window().maximize();
        driver.get(baseURL);
        chai.use(chaiWebdriver(driver));
        driver.wait(until.elementLocated(By.id("cookie-dismiss")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[@id='cookie-dismiss']//button[@class='close-button']")).click();
        });
        return driver;
    },
    shutdownDriver: function (driver) {
        driver.quit();
    },
    browser: function (driver) {
       return browser;
    },
    baseURL: function () {
        return baseURL;
    },
    loadModules: function(){
     return test = require('selenium-webdriver/testing'),
            webdriver = require('selenium-webdriver'),
            By = require('selenium-webdriver').By,
            until = require('selenium-webdriver').until,
            assert = require('selenium-webdriver/testing/assert'),
            flow = webdriver.promise.controlFlow(),
            chai = require('chai'),
            chaiWebdriver = require('chai-webdriver');
    },
    sleep:function(value){
        flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
    },
    reset:function (driver){
        driver.findElement(By.xpath("//span[text()='Reset']")).click();
        return driver;
    },
    submit:function (driver){
        driver.findElement(By.xpath("//span[text()='Submit']")).click();
        return driver;
    },
    back:function(){
        driver.navigate().back();
        return driver;
    },
    hashCode:function(string){
        var hash = 0;
        if (string.length == 0) return hash;
        for (i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },
    waitForVisibleElement: function (locator, timeout) {
        var timeout = timeout || DEFAULT_TIMEOUT;
        var element = driver.wait(until.elementLocated(locator), timeout);
        return driver.wait(until.WebElementCondition('for element to be visible ' + locator, function() {
            return element.isDisplayed().then(v => v ? element : null);
        }), timeout);
    }
};




