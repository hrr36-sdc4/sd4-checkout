import jsdom from 'jsdom';
const {JSDOM} = jsdom;
const {document} = (new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>')).window;
global.document = document;
global.window = document.defaultView;
global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(new Event('resize'));
  };

  
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener : function() {},
        removeListener: function() {}
    };
};