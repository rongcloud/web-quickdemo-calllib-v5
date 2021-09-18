
const RCDom = {
  get: (id) => {
    return document.getElementById(id)
  },
  show: (id) => {
    var rongIMDom = document.getElementById(id)
    rongIMDom.setAttribute('style', 'display:inline-block;')
  },
  showBlock: (id) => {
    var rongIMDom = document.getElementById(id)
    rongIMDom.setAttribute('style', 'display:block;')
  },
  hide: (id) => {
    var rongIMDom = document.getElementById(id)
    rongIMDom.setAttribute('style', 'display:none;')
  }
}

const RCToast = (msg) => {
  setTimeout(function(){
    document.getElementsByClassName('toast-wrap')[0].getElementsByClassName('toast-msg')[0].innerHTML = msg
    var toastTag = document.getElementsByClassName('toast-wrap')[0];
    toastTag.className = toastTag.className.replace('toastAnimate','')
    setTimeout(function(){
        toastTag.className = toastTag.className + ' toastAnimate';
    }, 10)
  },10)
}

const RCCallView = {
  connectedIM: () => {
    RCDom.show('rongUser')
  },
  readyToCall: () => {
    RCDom.hide('rongIM');
    RCDom.show('rongCall');
  },
  outgoing: () => {
    RCDom.hide('callParam');
    RCDom.hide('callBtn');
    RCDom.show('hungupBtn');
  },
  incomming: () => {
    RCDom.hide('callParam');
    RCDom.hide('callBtn');
    RCDom.show('acceptBtn');
    RCDom.show('hungupBtn');
  },
  inTheCall: () => {
    RCDom.hide('acceptBtn');
    RCDom.hide('callParam');
    RCDom.show('hungupBtn');
  },
  end: () => {
    RCDom.show('callParam');
    RCDom.show('callBtn');
    RCDom.hide('acceptBtn');
    RCDom.hide('hungupBtn');
  }
}