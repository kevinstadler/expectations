(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{163:function(e,t,a){e.exports=a(287)},286:function(e,t,a){},287:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),o=a(29),i=a.n(o),l=a(24),s=a(56),c=a(57),u=a(59),h=a(58),m=a(60),d=a(310),p=a(294),g=a(295),f=a(296),y=a(297),b=a(106),v=a(298),w=a(299),E=a(83),x=a(303),k=a(307),C=a(314),O=a(305),j=a(312),S=a(308),A=a(309),N=[{value:"F",label:"female"},{value:"M",label:"male"}];function M(e){return Math.round(10*e)/10}function W(e){var t=10;return e<1e-4?"< 0.01%":e>.9999?"> 99.99%":((e<.01||e>.99)&&(t=100),Math.round(100*t*e)/t+"%")}var _=function(e){function t(e){var a;Object(s.a)(this,t),(a=Object(u.a)(this,Object(h.a)(t).call(this,e))).getNumberOfSkellies=function(e){return Math.max(4,Math.floor((e.target.innerWidth-40)/81))},a.componentWillMount=function(){fetch("countries.json").then(function(e){if(e.ok)return e.json();a.setCountry({value:"world"})}).then(function(e){a.setState({countries:e}),a.setCountry({value:a.state.country})})},a.updateDistribution=function(e){var t=Object(l.a)({},a.state,e),n=t.tableCache[t.country][N.findIndex(function(e){return e.value===t.sex})+1||0].slice(),o=M(n.map(function(e,t){return e*t}).reduce(function(e,t){return e+t}));n.reverse();var i=n.length-1-n.findIndex(function(e){return e>0});n.reverse();var s=n.slice(t.age).reduce(function(e,t){return e+t});0==s&&(t.age=i,s=n.slice(t.age).reduce(function(e,t){return e+t}));var c=n.slice(t.age).map(function(e,a){return e*(t.age+a)}).reduce(function(e,t){return e+t});c/=s;for(var u=n[t.age],h=1;u/s<.008;h++)u+=n[t.age+h];u/=s;var m="";m=1===h?r.a.createElement("span",null,"a ",r.a.createElement("strong",null,W(u))," chance that you will die ",r.a.createElement("strong",null,"within the next year"),"."):Math.abs(u-.01)<.0025?r.a.createElement("span",null,"a 1 in 100 chance that you will already die ",r.a.createElement("strong",null,"within the next ",h," years")," of your life!"):r.a.createElement("span",null,"a ",r.a.createElement("strong",null,W(u))," chance that you will already die within the next ",h," years of your life!");t=Object(l.a)({},t,{distribution:n,mean:c,meanAtBirth:o,factlet:m,maxAge:i,description:"your demographic group",killedOff:n.slice(0,t.age).reduce(function(e,t){return e+t},0)/n.reduce(function(e,t){return e+t})}),a.setState(t),window.location.hash="#"+t.age+"/"+(t.sex||"")+"/"+t.country},a.setAge=function(e){var t=e.value;a.updateDistribution({age:t}),localStorage.setItem("age",t),window.gtag("event","parameter",{event_category:"age",event_label:"age="+t,value:t})},a.setSex=function(e){var t=e?e.value:"";a.updateDistribution({sex:t}),localStorage.setItem("sex",t),window.gtag("event","parameter",{event_category:"sex",event_label:"sex="+t,value:t})},a.setCountry=function(e){var t=e?e.value:"world";a.state.tableCache[t]?a.updateDistribution({country:t}):fetch("data/"+t+".csv").then(function(e){if(e.ok&&e.headers.get("Content-Type").startsWith("text/csv"))return e.text();console.log("Failed to fetch "+t)}).then(function(e){if(e){var n=e.split("\n").map(function(e){return e.split(" ").map(parseFloat)}),r={};r[t]=n,a.updateDistribution({country:t,tableCache:r})}});var n=a.state.countries.find(function(e){return e.value===t});a.setState({locationName:n?n.label:"the world"}),localStorage.setItem("country",t),window.gtag("event","parameter",{event_category:"country",event_label:"country="+t})},a.hideModal=function(){a.setState({showModal:!1})},a.toggleContactForm=function(e){null!==e&&e.preventDefault(),a.setState({contactFormVisible:!a.state.contactFormVisible})};var n=localStorage.getItem("age"),o=localStorage.getItem("sex"),i=localStorage.getItem("country");if(window.location.hash.length){var c=window.location.hash.substring(1).split("/");3===c.length&&(n=c[0],o=c[1],i=c[2])}return n=parseInt(n),a.state={contactFormVisible:!1,numSkellies:a.getNumberOfSkellies({target:window}),tableCache:{},age:isNaN(n)?25:n,sex:o||0,country:i||"world",showModal:0===window.location.hash.length,mean:0,meanAtBirth:0,locationName:"the world",countries:[]},window.addEventListener("resize",function(e){a.setState({numSkellies:a.getNumberOfSkellies(e)})}),a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=Array(this.state.numSkellies).fill(r.a.createElement(q,null));return r.a.createElement("div",null,r.a.createElement(d.a,{className:"firstvisit-dialog",isOpen:this.state.showModal},r.a.createElement(q,null),r.a.createElement(q,null),r.a.createElement(q,null),r.a.createElement(q,null),r.a.createElement(q,null),r.a.createElement(q,null),r.a.createElement("h2",null,"how old are you?"),r.a.createElement(F,{value:this.state.age,onChange:this.setAge}),r.a.createElement("p",{className:"mobile"},"NOTE: it looks like you are visiting this website on a touchscreen device. while the website is just as informative when viewed from a phone or tablet, you will find it a lot more entertaining to play with if you access it from a computer with a mouse or trackpad."),r.a.createElement(p.a,{color:"secondary",onClick:this.hideModal},"I am prepared to look death in the eye")),r.a.createElement("div",{className:"content"},r.a.createElement("header",null,e),r.a.createElement("p",null,r.a.createElement("em",null,"life expectancy")," is a measure that is often used to capture the general health and wealth of a country or population group. but what does it mean for you as an individual that the average life expectancy in ",this.state.locationName," today is ",r.a.createElement("strong",null,M(this.state.meanAtBirth)),"\xa0years?"),r.a.createElement("h2",null,"all is not so bad!"),r.a.createElement("p",null,"while your average life expectancy at birth was ",M(this.state.meanAtBirth),", by managing to stay alive until today you have already proven that you are not part of the ",r.a.createElement("strong",null,W(this.state.killedOff))," of all people who die before they even make it to the age of ",this.state.age,". well done!"),r.a.createElement("p",null,"with the knowledge that you haven't died yet, we can re-calculate your personal life expectancy and find out that it is now actually higher than it was at your birth, namely ",r.a.createElement("strong",null,M(this.state.mean)),"\xa0years. what a treat."),r.a.createElement("h2",null,"all is not so good!"),r.a.createElement("p",null,"your new average life expectancy might sound pretty high to you, but there is of course no guarantee that you will live to exactly that age, or even anywhere near it. in reality, life is much more random, and so your own personal remaining life span will also be randomly drawn from a statistical distribution of which the average life expectancy is just a ",r.a.createElement("em",null,"very crude")," measure."),r.a.createElement("p",null,"in other words, while it might be another ",M(this.state.mean-this.state.age)," years until you reach your average life expectancy, there is also ",this.state.factlet),r.a.createElement("p",null,"to get an even better grasp of how much you should really be fearing for your life and when, please consult the interactive probability distribution below, which you can even further tailor to your own personal demographic circumstances. enjoy!"),r.a.createElement(B,{currentAge:this.state.age,distribution:this.state.distribution,mean:this.state.mean}),r.a.createElement("h3",null,"adjust demographic features"),r.a.createElement(g.a,{trigger:"focus",placement:"top",target:"infobutton"},r.a.createElement(f.a,null,"about the data"),r.a.createElement(y.a,null,r.a.createElement("p",null,"because the quality and resolution of mortality data varies from country to country, you might see some things in the distributions shown on this website which will not seem right to you. if there's weird abrupt jumps or unusually straight lines in the distributions, this is most likely due to the low quality of the underlying data: for many countries we only have data about the probability of death per 5 or even 15-year interval, so i've had to employ some (probability-preserving) smoothing to generate rough approximations of the probable underlying distributions."),r.a.createElement("p",null,"the limitations on available countries and binary sex are also a result of the data gathering and coding by the ",r.a.createElement("a",{href:"https://www.who.int/gho/mortality_burden_disease/life_tables/life_tables/en/"},"WHO"),", who all of the data shown here eventually goes back to."))),r.a.createElement("div",{className:"parameters"},r.a.createElement(F,{value:this.state.age,maxAge:this.state.maxAge,onChange:this.setAge}),r.a.createElement("label",{className:"sex"},r.a.createElement(I,{value:this.state.sex,onChange:this.setSex})),r.a.createElement("div",{className:"country"},r.a.createElement(D,{countries:this.state.countries,value:this.state.country,onChange:this.setCountry})),r.a.createElement(p.a,{id:"infobutton",color:"secondary"},"?")),r.a.createElement("footer",null,r.a.createElement("p",null,"built in 2019 by ",r.a.createElement("a",{href:"http://kevinstadler.github.io"},"Kevin Stadler"),", skellie drawings by baroque artiste ",r.a.createElement("i",null,"Daniela Carnevale"),", data by the ",r.a.createElement("a",{href:"https://www.lifetable.de"},"human life table database"),"."),r.a.createElement(b.a,{placement:"top",target:"contact",isOpen:this.state.contactFormVisible},r.a.createElement(y.a,null,r.a.createElement(v.a,null,r.a.createElement(w.a,{type:"text",name:"name",id:"name",placeholder:"name"}),r.a.createElement(w.a,{type:"email",name:"email",id:"email",placeholder:"e-mail"}),r.a.createElement(w.a,{type:"textarea",name:"text",id:"contacttext",placeholder:"your message"}),r.a.createElement(p.a,{disabled:!0},"under construction")))),r.a.createElement("p",null,"comments, questions, suggestions? ",r.a.createElement("a",{href:"https://kevinstadler.github.io/#contact",id:"contact"},"contact me")," before it's too late."),r.a.createElement("p",null,"realized you can't possibly spend all of your accumulated fortune in this lifetime? send me your money: ",r.a.createElement("a",{href:"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2JE6FCBYY94LJ"},r.a.createElement("img",{src:"https://img.shields.io/badge/\ud83d\udc80%20%20\ud83d\udc80%20%20\ud83d\udc80-paypal%20($)-lightgray.svg",alt:"give me your dollars",title:"send me your money"}))," ",r.a.createElement("a",{href:"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WKKFFM6D7ZHEE"},r.a.createElement("img",{src:"https://img.shields.io/badge/\ud83d\udc80%20%20\ud83d\udc80%20%20\ud83d\udc80-paypal%20(%E2%82%AC)-lightgray.svg",alt:"give me your euros",title:"send me your money"}))))))}}]),t}(r.a.Component);function F(e){var t=Array.apply(null,{length:e.maxAge-1||109}).map(Number.call,Number).map(function(e){return{value:e+1,label:e+1}});return r.a.createElement(E.a,{className:"age",options:t,onChange:e.onChange,value:t[e.value-1],isClearable:!1})}function I(e){return r.a.createElement(E.a,{className:"age",options:N,onChange:e.onChange,value:N.find(function(t){return t.value===e.value}),placeholder:"Select sex...",isClearable:!0})}var D=function(e){function t(){return Object(s.a)(this,t),Object(u.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement(E.a,{options:this.props.countries,onChange:this.props.onChange,value:this.props.countries.find(function(t){return t.value===e.props.value}),isClearable:!0,placeholder:"Select country..."})}}]),t}(r.a.Component),B=function(e){function t(){return Object(s.a)(this,t),Object(u.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;if(!this.props.distribution)return null;var t=this.props.distribution.slice(0,this.props.currentAge+1).map(function(e,t){return{x:t,y:e}}),a=this.props.distribution.slice(0,this.props.currentAge).reduce(function(e,t){return e+t}),n=this.props.distribution.slice(this.props.currentAge),o=n.slice(1).reduce(function(e,t){return e.push(e[e.length-1]+t),e},[n[0]]),i=o[o.length-1],l=n.map(function(t,a){return{x:e.props.currentAge+a,y:t,c:o[a]/i}}),s=this.props.distribution[Math.floor(this.props.mean)]+this.props.mean%1*(this.props.distribution[Math.ceil(this.props.mean)]-this.props.distribution[Math.floor(this.props.mean)]),c=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(function(t){return{x:e.props.mean,y:s*t/20}}),u={data:{stroke:"black",strokeWidth:1,fill:"#eee"}};return r.a.createElement(x.a,{minDomain:{x:0,y:0},containerComponent:r.a.createElement(k.a,{className:"chart",labelComponent:r.a.createElement(C.a,{flyoutComponent:r.a.createElement(L,null),labelComponent:r.a.createElement(O.a,{style:{fontSize:11}}),flyoutStyle:{fill:"white"}}),labels:function(t){if(t.x<e.props.currentAge){var n=0===t.x?"during the first year of your life":"when you were ".concat(t.x);return"you didn't die ".concat(n,",\nunlike ").concat(W(t.y)," of other people\nfrom your cohort. well done!")}return t.x===e.props.currentAge?"by surviving to the age of ".concat(e.props.currentAge,", you have outlived\n").concat(W(a)," of your cohort who are already dead.\nprobability that you will die within\nthe next year of your life: ")+W(l[0].y):t.x===e.props.mean?"average expected lifetime for somebody\nwho has already survived to age ".concat(e.props.currentAge,":\n").concat(M(e.props.mean)," years"):"probability that you will\ndie before you turn "+(t.x+1)+":\n"+W(t.c)}})},r.a.createElement(j.a,{label:"age",style:{axis:{strokeWidth:0}}}),r.a.createElement(j.a,{dependentAxis:!0,label:"probability of dying at that age",style:{axis:{stroke:"lightgray",strokeWidth:1.5},tickLabels:{fill:"none"}}}),r.a.createElement(S.a,{data:t,style:{data:{stroke:"darkgray",strokeWidth:1}}}),r.a.createElement(A.a,{data:l,style:u}),r.a.createElement(S.a,{data:[{x:this.props.currentAge,y:0},l[0]],style:u}),r.a.createElement(S.a,{data:c,style:{data:{strokeWidth:1,stroke:"red",fill:"#eee"}}}))}}]),t}(r.a.Component),L=function(e){function t(){return Object(s.a)(this,t),Object(u.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props,t=e.x,a=e.y,n=e.height-10,o=a;return r.a.createElement("g",null,r.a.createElement("rect",{x:t-.5,y:o,width:"1",height:Math.max(0,250-o),fill:"black"}),r.a.createElement("circle",{cx:t,cy:o,r:"2",fill:"black"}),r.a.createElement("rect",{x:t-120,y:o-15-n,width:240,height:n,stroke:"black",fill:"white"}))}}]),t}(r.a.Component),q=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(u.a)(this,Object(h.a)(t).call(this))).changeSkellie=function(){e.setState({counter:e.state.counter+1,alive:!e.state.alive,skellie:Math.floor(8*Math.random())%8}),window.gtag("event","skellie",{event_label:"skellie#"+(e.state.counter+1),value:e.state.counter+1})},e.state={counter:0,alive:Math.random()>=.5,skellie:Math.floor(8*Math.random())%8},e}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("img",{className:"skellie",alt:"a graphic reminder of your mortality",title:"what do you expect?",src:"skellie"+(this.state.alive?"0":"1")+this.state.skellie+".png",onClick:this.changeSkellie})}}]),t}(r.a.Component),J=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function T(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var a=e.installing;null!=a&&(a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}a(285),a(286);i.a.render(r.a.createElement(_,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/expectations",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("/expectations","/service-worker.js");J?(function(e,t){fetch(e).then(function(a){var n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):T(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")})):T(t,e)})}}()}},[[163,1,2]]]);
//# sourceMappingURL=main.9437f5f4.chunk.js.map