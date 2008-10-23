if (typeof blueskyminds == "undefined") {
    var blueskyminds = {}
}
blueskyminds.namespace = function(F) {
    var B = arguments;
    var D;
    var E;
    for (var C = 0; C < B.length; C++) {
        E = window;
        D = B[C].split(".");
        for (var A = 0; A < D.length; A++) {
            if (!E[D[A]]) {
                E[D[A]] = {}
            }
            E = E[D[A]]
        }
    }
    return E
};
blueskyminds.log = function() {
    function A() {
        return(typeof blueskyminds.events.log != "undefined")
    }
    return{debug:function(B) {
        if (A()) {
            blueskyminds.events.log.debug(B)
        }
    },info:function(B) {
        if (A()) {
            blueskyminds.events.log.info(B)
        }
    },error:function(B) {
        if (A()) {
            blueskyminds.events.log.error(B)
        }
    }}
}();
blueskyminds.calendar = function() {
    var A = ["Jan","Fev","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    function B(E) {
        if (YAHOO.lang.isObject(E)) {
            var D = E.getYear();
            if (D < 1000) {
                D += 1900
            }
            return E.getDate() + " " + A[E.getMonth()] + " " + D
        } else {
            return null
        }
    }
    function C(E) {
        if (YAHOO.lang.isObject(E)) {
            var D = E.getYear();
            if (D < 1000) {
                D += 1900
            }
            return E.getDate() + " " + A[E.getMonth()] + " " + D + " " + E.getHours() + ":" + E.getMinutes() + ":" + E.getSeconds()
        } else {
            return null
        }
    }
    return{shortDateFormat:function(D) {
        return B(D)
    },shortDateTimeFormat:function(D) {
        return C(D)
    },inOneYear:function() {
        var D = new Date();
        var E = D.getYear();
        if (E < 1000) {
            E += 1900
        }
        return new Date(E + 1, D.getMonth(), D.getDate())
    }}
}();
blueskyminds.namespace("blueskyminds.dom");
blueskyminds.dom.escapeHTML = function(C, B) {
    if (C) {
        var A = C.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
        if (B) {
            A = A.replace(/\n/, "<br/>")
        }
        return A
    } else {
        return null
    }
};
blueskyminds.dom.resolveReference = function(B) {
    var A;
    if (YAHOO.lang.isObject(B)) {
        A = B
    } else {
        if (YAHOO.lang.isString(B)) {
            A = document.getElementById(B)
        }
    }
    return A
};
blueskyminds.dom.insertHTML = function(B, D, E) {
    var A = blueskyminds.dom.resolveReference(B);
    if (A) {
        var C = (E ? D : blueskyminds.dom.escapeHTML(D));
        if (C) {
            A.innerHTML = C
        } else {
            blueskyminds.dom.clearHTML(A)
        }
    }
};
blueskyminds.dom.appendHTML = function(D, A, F, G) {
    var C = blueskyminds.dom.resolveReference(D);
    if (C) {
        var E = (G ? F : blueskyminds.dom.escapeHTML(F));
        if (E) {
            var B = document.createElement(A);
            B.innerHTML = E;
            C.appendChild(B)
        }
    }
};
blueskyminds.dom.clearHTML = function(B) {
    var A = blueskyminds.dom.resolveReference(B);
    if (A) {
        while (A.firstChild) {
            A.removeChild(A.firstChild)
        }
    }
};
blueskyminds.namespace("blueskyminds.xml");
blueskyminds.xml.parse = function(C) {
    var A;
    var B = YAHOO.Tools.getBrowserEngine();
    if (B.msie) {
        window.status = "IE!";
        var D = new ActiveXObject("Microsoft.XMLDOM");
        D.async = "false";
        D.loadXML(C)
    } else {
        var E = new DOMParser();
        D = E.parseFromString(C, "text/xml")
    }
    A = D.documentElement;
    window.status = A;
    return A
};
blueskyminds.dom.isSafeFunctionName = function(A) {
    return A.match(/^\w[\w|\d|\.]+$/)
};
blueskyminds.namespace("blueskyminds");
blueskyminds.events = function() {
    var D = {};
    var B = function(I) {
        var J = [];
        var H = function(L, K) {
            this.callback = L;
            this.context = K
        };
        return{isProxy:true,subscribe:function(L, K) {
            J[J.length] = new H(L, K)
        },fire:function(K) {
        },subscribers:function() {
            return J
        }}
    };
    function G(H, I, K) {
        D[H] = K;
        for (var J in I.subscribers()) {
            if (I.hasOwnProperty(J)) {
                K.subscribe(J.callback, J.context)
            }
        }
        blueskyminds.log.debug(H + " event proxy replaced")
    }
    function C(H) {
        var I = new B(H);
        D[H] = I;
        blueskyminds.log.debug(H + " event proxy registered");
        return I
    }
    function A(H) {
        var I = D[H];
        if (!I) {
            return C(H)
        } else {
            return I
        }
    }
    function E(H, J) {
        var I = D[H];
        if (!I) {
            D[H] = J;
            blueskyminds.log.debug(H + " event registered")
        } else {
            if (I.isProxy) {
                G(H, I, J)
            } else {
                D[H] = J
            }
        }
    }
    function F() {
        D.debug = new YAHOO.util.CustomEvent("debug");
        D.info = new YAHOO.util.CustomEvent("info");
        D.error = new YAHOO.util.CustomEvent("error")
    }
    F();
    return{register:function(H, I) {
        E(H, I)
    },subscribe:function(H, K, I) {
        var J = A(H);
        J.subscribe(K, I)
    },fire:function(H, I) {
        var J = A(H);
        if (J) {
            J.fire(I);
            blueskyminds.log.debug(H + " event fired")
        }
    },log:{debug:function(I) {
        var H = A("logDebug");
        if (H) {
            H.fire(I)
        }
    },info:function(I) {
        var H = A("logInfo");
        if (H) {
            H.fire(I)
        }
    },warn:function(I) {
        var H = A("logInfo");
        if (H) {
            H.fire("WARN: " + I)
        }
    },error:function(I) {
        var H = A("logError");
        if (H) {
            H.fire(I)
        }
    }}}
}();
blueskyminds.events.IdleTimer = function(C, D, H) {
    var A;
    var E;
    var B;
    function F() {
        A++;
        if (A - E > B) {
            H();
            E = A
        }
    }
    function G() {
        A = 0;
        E = 0;
        B = (D / C);
        setInterval(F, C)
    }
    G();
    return{reset:function() {
        A = 0;
        E = 0
    }}
};
blueskyminds.namespace("blueskyminds.net", "blueskyminds.net.json");
blueskyminds.net.json.evaluate = function(response) {
    var obj = null;
    if (response) {
        if ((response.indexOf("/*") >= 0) && (response.lastIndexOf("*/") >= 0)) {
            try {
                obj = eval("(" + response.substring(response.indexOf("/*") + 2, response.lastIndexOf("*/")) + ")")
            } catch(ex) {
                blueskyminds.log.error("Exception evaluating JSON-commented response" + ex)
            }
        } else {
            try {
                obj = eval("(" + response + ")")
            } catch(ex2) {
                blueskyminds.log.error("Exception evaluating JSON response" + ex2)
            }
        }
    }
    return obj
};
blueskyminds.net.json.isJSON = function(B) {
    var A = B.replace(/^\s+/, "");
    return A.match(/^\{/) || A.match(/^\/\*/)
};
blueskyminds.net.errorMessage = function(B) {
    var A = null;
    if (B) {
        switch (B.status) {case 0:A = "Unable to contact the server: communication error";break;case -1:A = "Transaction aborted";break;default:A = "The server reported an error: " + B.status;break}
    } else {
        A = "Invalid server response"
    }
    return A
};
blueskyminds.net.relativePath = function(A) {
    if (A && A.length > 0) {
        return A.substring(A.indexOf(location.host) + location.host.length)
    } else {
        return A
    }
};
blueskyminds.net.hostname = function() {
    return location.hostname
};
blueskyminds.namespace("blueskyminds.ui", "blueskyminds.ui.datatable");
blueskyminds.ui.MessageConsole = function(B) {
    var A;
    function C() {
        A = document.getElementById(B)
    }
    C();
    return{clear:function() {
        blueskyminds.dom.clearHTML(A)
    },println:function(D) {
        blueskyminds.dom.appendHTML(A, "div", D)
    },print:function(D) {
        blueskyminds.dom.appendHTML(A, "span", D)
    },isEnabled:function() {
        return A !== null
    }}
};
blueskyminds.ui.Logger = function(G) {
    var C;
    function E(M, L) {
        if (YAHOO.lang.isString(L)) {
            M(L)
        } else {
            if (L.length > 0) {
                for (var K = 0; K < L.length; K++) {
                    M(L[K])
                }
            }
        }
    }
    function B(K) {
        C.println("debug:" + K)
    }
    function D(K) {
        C.println("info:" + K)
    }
    function H(K) {
        C.println("error:" + K)
    }
    function I(M, K, L) {
        E(B, K)
    }
    function A(M, K, L) {
        E(D, K)
    }
    function F(M, K, L) {
        E(H, K)
    }
    function J() {
        C = new blueskyminds.ui.MessageConsole(G);
        blueskyminds.events.subscribe("logDebug", I);
        blueskyminds.events.subscribe("logInfo", A);
        blueskyminds.events.subscribe("logError", F);
        E(D, "Logger started")
    }
    J();
    return{debug:function(K) {
        E(B, K)
    },info:function(K) {
        E(D, K)
    },error:function(K) {
        E(H, K)
    }}
};
blueskyminds.ui.ProgressIndicatorController = function(D, C, E) {
    function B(I, G, H) {
        var F = document.getElementById(D);
        if (F) {
            F.style.display = "inline"
        }
    }
    function A(I, G, H) {
        var F = document.getElementById(D);
        if (F) {
            F.style.display = "none"
        }
    }
    blueskyminds.events.subscribe(C, B);
    blueskyminds.events.subscribe(E, A)
};
blueskyminds.ui.ErrorController = function(D, E, F, C) {
    var A = D;
    function B(M, L, H) {
        var N = L[0];
        var G = document.getElementById(A);
        if (F) {
            var I = F(N);
            if (I && G) {
                blueskyminds.dom.clearHTML(A);
                G.appendChild(I)
            }
        } else {
            if (G) {
                if (C) {
                    var O = {message:N};
                    var J = C.process(O);
                    blueskyminds.dom.insertHTML(A, J, true);
                    G.style.display = "block"
                } else {
                    var K = blueskyminds.calendar.shortDateTimeFormat(new Date());
                    blueskyminds.dom.insertHTML(A, K + ":" + N);
                    G.style.display = "block"
                }
            }
        }
    }
    blueskyminds.events.register(E, new YAHOO.util.CustomEvent(E, this));
    blueskyminds.events.subscribe(E, B, null);
    return{dismissErrors:function() {
        var G = document.getElementById(A);
        if (G) {
            blueskyminds.dom.clearHTML(G)
        }
    }}
};
blueskyminds.ui.forms = function() {
    var _formHandlersById = {};
    var _formHandlersByClass = {};
    return{registerHandlerForForm:function(id, handler) {
        _formHandlersById[id] = handler
    },registerHandlerForForms:function(className, handler) {
        _formHandlersByClass[className] = handler
    },getHandler:function(formEl, defaultHandler) {
        var Dom = YAHOO.util.Dom;
        var handler = null;
        if (!YAHOO.lang.isNull(formEl) && !YAHOO.lang.isUndefined(formEl) && formEl.tagName === "FORM") {
            var handlerName = formEl.getAttribute("data-handler");
            if (handlerName) {
                if (blueskyminds.dom.isSafeFunctionName(handlerName)) {
                    var handlerRef = eval(handlerName);
                    if (YAHOO.lang.isObject(handlerRef)) {
                        handler = handlerRef
                    }
                }
            }
            if (!YAHOO.lang.isValue(handler)) {
                if (formEl.id) {
                    handler = _formHandlersById[formEl.id]
                }
            }
            if (!YAHOO.lang.isValue(handler)) {
                for (var className in _formHandlersByClass) {
                    if (Dom.hasClass(formEl, className)) {
                        handler = _formHandlersByClass[className]
                    }
                }
            }
        }
        if (handler === null) {
            return defaultHandler
        } else {
            return handler
        }
    }}
}();
blueskyminds.ui.components = function() {
    function E(I) {
        var J = YAHOO.util.Dom;
        var H = J.getElementsByClassName("datatable", "div", I);
        var K;
        var N;
        var M;
        var O;
        var L;
        for (j = 0; j < H.length; j++) {
            K = J.getFirstChildBy(H[j], isTableDataSource);
            if (K) {
                N = new YAHOO.util.DataSource(K);
                N.responseType = YAHOO.util.DataSource.TYPE_HTMLTABLE;
                M = J.getElementsBy(isTableHeaderData, null, J.getFirstChildBy(K, isTableHeader));
                O = [];
                N.responseSchema = {fields:[]};
                for (k = 0; k < M.length; k++) {
                    O[k] = {key:M[k].className.split(" ", 2)[0],sortable:J.hasClass(M[k], "sortable")};
                    N.responseSchema.fields[k] = {key:O[k].key}
                }
                L = new YAHOO.widget.DataTable(H[j], O, N)
            }
        }
    }
    var A = {success:function(K) {
        try {
            var J = YAHOO.lang.JSON.parse(K.responseText)
        } catch(I) {
            blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + I.message)
        }
        if (YAHOO.lang.isObject(J)) {
            var H = document.getElementById(this.containerId);
            if (H) {
                _lastTableModel = J;
                HousePad.ui.dataTable.render(H, J)
            } else {
                blueskyminds.events.log.info("The target container for rendering a TableModel does not exist (containerId:" + this.containerId + ").")
            }
        } else {
            blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not a valid TableModel.")
        }
    },failure:function(H) {
        blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(H))
    }};
    function C(K) {
        var H = YAHOO.util.Connect;
        var L = YAHOO.util.Dom;
        var J = L.getElementsByClassName("xhr-datatable", "div", K);
        var I;
        for (j = 0; j < J.length; j++) {
            I = J[j].className.split(" ", 2)[0];
            if (I) {
                if ((YAHOO.lang.isNull(J[j].id) || (J[j].id.length === 0))) {
                    L.generateId(J[j])
                }
                H.resetFormState();
                YAHOO.util.Connect.asyncRequest("GET", _mainPath + "/" + I + ".json", {success:A.success,failure:A.failure,scope:{containerId:J[j].id},cache:true})
            }
        }
    }
    var D = {success:function(K) {
        try {
            var J = YAHOO.lang.JSON.parse(K.responseText)
        } catch(I) {
            blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + I.message)
        }
        if (YAHOO.lang.isObject(J)) {
            var H = document.getElementById(this.containerId);
            if (H) {
                HousePad.ui.dataTable.renderAsList(H, J)
            } else {
                blueskyminds.events.log.info("The target container for rendering a List does not exist (containerId:" + this.containerId + ").")
            }
        } else {
            blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not a valid TableModel.")
        }
    },failure:function(H) {
        blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(H))
    }};
    function G(K) {
        var I = YAHOO.util.Connect;
        var L = YAHOO.util.Dom;
        var H = L.getElementsByClassName("xhr-list", "div", K);
        var J;
        for (j = 0; j < H.length; j++) {
            J = H[j].className.split(" ", 2)[0];
            if (J) {
                if ((YAHOO.lang.isNull(H[j].id) || (H[j].id.length === 0))) {
                    L.generateId(H[j])
                }
                I.resetFormState();
                YAHOO.util.Connect.asyncRequest("GET", _mainPath + "/" + J + ".json", {success:D.success,failure:D.failure,scope:{containerId:H[j].id},cache:true})
            }
        }
    }
    function B(H) {
        var K = YAHOO.util.Dom;
        var I = K.getElementsByClassName("yui-navset", "div", H);
        var J;
        for (j = 0; j < I.length; j++) {
            if ((YAHOO.lang.isNull(I[j].id) || (I[j].id.length === 0))) {
                K.generateId(I[j])
            }
            J = new YAHOO.widget.TabView(I[j])
        }
    }
    function F(H) {
        blueskyminds.ui.commands.init(H);
        C(H);
        G(H);
        B(H)
    }
    return{initialiseComponents:function(H) {
        F(H)
    }}
}();
blueskyminds.ui.loader = function() {
    var A = "main";
    var D;
    var B = new YAHOO.util.CustomEvent("rendered");
    var M = new YAHOO.util.CustomEvent("loading");
    var O = new YAHOO.util.CustomEvent("beforeMainContextChange");
    var K = new YAHOO.util.CustomEvent("afterMainContextChange");
    var L = {rendered:B,loading:M,beforeMainContextChange:O,afterMainContextChange:K};
    var F = {};
    function E(P) {
        return(P === A)
    }
    var I = {success:function(S, P) {
        M.fire("stop");
        if (E(this.targetId)) {
            D = this.href;
            blueskyminds.events.log.debug("_mainPath=" + D)
        }
        if (YAHOO.util.Dom.hasClass(this.targetId, "restorable")) {
            blueskyminds.ui.effects.backupChildren(this.targetId)
        }
        if (YAHOO.lang.JSON.isValid(S.responseText)) {
            try {
                var R = YAHOO.lang.JSON.parse(S.responseText);
                if (YAHOO.lang.isObject(R)) {
                    HousePad.ui.dataTable.render(this.targetId, R)
                } else {
                    blueskyminds.events.fire("error", "Invalid json table model")
                }
            } catch(Q) {
                blueskyminds.events.fire("error", "Invalid json response")
            }
        } else {
            blueskyminds.dom.insertHTML(this.targetId, S.responseText, true);
            blueskyminds.ui.components.initialiseComponents(this.targetId)
        }
        if (YAHOO.util.Dom.hasClass(this.targetId, "hidden")) {
            YAHOO.util.Dom.setStyle(this.targetId, "display", "block")
        }
    },failure:function(P) {
        M.fire("stop");
        blueskyminds.events.fire("error", blueskyminds.net.errorMessage(P))
    },cache:false};
    var N = {success:function(Q, P) {
        M.fire("stop");
        this.command.invoke(this.href, Q)
    },failure:function(P) {
        M.fire("stop");
        blueskyminds.events.fire("error", blueskyminds.net.errorMessage(P))
    },cache:false};
    function J(W, R, S, T, Q) {
        if ((R) && (R !== "/")) {
            var P = YAHOO.util.Connect;
            P.resetFormState();
            if (YAHOO.lang.isValue(S)) {
                P.setForm(S)
            }
            Q = YAHOO.lang.isValue(Q);
            M.fire("start");
            var V;
            if (YAHOO.lang.isString(T)) {
                V = {success:I.success,failure:I.failure,scope:{href:R,targetId:T},cache:Q}
            } else {
                V = {success:N.success,failure:N.failure,scope:{href:R,command:T},cache:Q}
            }
            var U = P.asyncRequest(W, R, V)
        } else {
            blueskyminds.dom.clearHTML(T)
        }
    }
    function C(P, Q) {
        if ((P) && (P !== "/")) {
            if (YAHOO.lang.isValue(Q)) {
                Q.method = "GET";
                Q.action = P;
                Q.submit()
            } else {
                window.location = P
            }
        }
    }
    function G(W, S, Q, T) {
        var U;
        var P = !YAHOO.util.Dom.hasClass(Q, "refresh");
        var R = S.indexOf("#");
        if (R >= 0) {
            U = S.split("#", 2);
            J(W, U[0], T, U[1], P)
        } else {
            R = S.indexOf(";");
            if (R >= 0) {
                U = S.split(";", 2);
                var V = YAHOO.util.Dom.getAncestorByClassName(Q, U[1]);
                if (V) {
                    if ((YAHOO.lang.isNull(V.id) || (V.id.length === 0))) {
                        YAHOO.util.Dom.generateId(V)
                    }
                    J(W, U[0], T, V.id, P)
                }
            } else {
                R = S.indexOf("!");
                if (R >= 0) {
                    U = S.split("!", 2);
                    J(W, S, T, window[U[1]], P)
                } else {
                    C(S, T)
                }
            }
        }
    }
    var H = function(T, S) {
        var R = YAHOO.util.Dom;
        var U = null;
        var V = R.getAncestorBy(S, function(X) {
            return X.nodeName === "DIV" && R.hasClass(X, T + "-parent")
        });
        if (V) {
            var P = V.id;
            var Q = F[P];
            if (Q) {
                U = R.get(Q);
                if (!U) {
                    F[P] = null;
                    Q = null
                }
            }
            if (!Q) {
                var W = R.getElementsByClassName(T + "-container", "div", V);
                if (W !== null && W.length > 0) {
                    U = W[0];
                    F[R.generateId(V)] = R.generateId(U)
                }
            }
        }
        return U
    };
    return{loadTarget:function(S, Q, P, R) {
        G(S, Q, P, R)
    },findTarget:function(Q, P) {
        return H(Q, P)
    }}
}();
blueskyminds.ui.effects = {show:function(A) {
    YAHOO.util.Dom.setStyle(A, "display", "block")
},hide:function(A) {
    YAHOO.util.Dom.setStyle(A, "display", "none")
},backupChildren:function(C) {
    var B = document.getElementById(C);
    var A = YAHOO.util.Dom.create("div", {id:C + "-backup",style:"display:none"});
    document.body.appendChild(A);
    while (B.hasChildNodes()) {
        A.appendChild(B.firstChild)
    }
},restoreChildren:function(C) {
    var B = document.getElementById(C);
    blueskyminds.dom.clearHTML(B);
    var A = document.getElementById(C + "-backup");
    if (A) {
        while (A.hasChildNodes()) {
            B.appendChild(A.firstChild)
        }
        document.body.removeChild(A)
    }
}};
blueskyminds.ui.commands = function() {
    var A = YAHOO.util.Dom;
    var D = [];
    function G(S) {
        YAHOO.util.Event.preventDefault(S)
    }
    function L(S) {
        return S.tagName === "INPUT"
    }
    function J(S) {
        return S.tagName === "TEXTAREA"
    }
    function B(S) {
        return S.tagName === "SELECT"
    }
    function R(S) {
        return S.tagName === "INPUT" && S.type.toUpperCase() === "SUBMIT"
    }
    function I(S) {
        return S.tagName === "BUTTON"
    }
    function O(S) {
        return S.tagName === "A"
    }
    function M(S) {
        return S.tagName === "TABLE" && A.hasClass(S, "datasource")
    }
    function C(S) {
        return S.tagName === "THEAD"
    }
    function F(S) {
        return S.tagName === "TH"
    }
    var E = {invoke:function(U, V, T) {
        var S = T.action;
        if (S) {
            blueskyminds.ui.loader.loadTarget((T.method.toUpperCase() || "POST"), S, V, T)
        }
    }};
    var H = {back:{canHandle:function(S, T) {
        return A.hasClass(T, "back")
    },invoke:function(S, T) {
        history.go(-1);
        return true
    }},closeParent:{canHandle:function(S, T) {
        return A.hasClass(T, "bsm-close-parent")
    },invoke:function(T, U) {
        var S = A.getAncestorByClassName(U, "bsm-closeable");
        if (S) {
            blueskyminds.ui.effects.hide(S)
        }
        return true
    }},cancel:{canHandle:function(S, T) {
        return A.hasClass(T, "cancel")
    },invoke:function(T, U) {
        var S = A.getAncestorByClassName(U, "restorable");
        if (S) {
            blueskyminds.ui.effects.restoreChildren(S.id)
        }
        return true
    }},home:{canHandle:function(S, T) {
        return A.hasClass(T, "home")
    },invoke:function(S, T) {
        blueskyminds.ui.loader.loadTarget("GET", "/", T);
        return true
    }},buttonPress:{canHandle:function(S, T) {
        return(R(T) || I(T))
    },invoke:function(U, V) {
        var T = V.form;
        if (T) {
            var S = blueskyminds.ui.forms.getHandler(T, E);
            if (S !== null) {
                S.invoke(U, V, T)
            }
        }
    }},anchor:{canHandle:function(S, T) {
        return O(T)
    },invoke:function(T, U) {
        var S = U.href;
        if (S) {
            blueskyminds.ui.loader.loadTarget("GET", S, U)
        }
    }},nestedAnchor:{canHandle:function(S, U) {
        var T = A.getAncestorBy(U, function(V) {
            return(A.hasClass(V, "command") && (V.nodeName === "A"))
        });
        return(T !== null)
    },invoke:function(S, U) {
        var T = A.getAncestorBy(U, function(V) {
            return(A.hasClass(V, "command") && (V.nodeName === "A"))
        });
        blueskyminds.ui.loader.loadTarget("GET", T.href, T)
    }},keyPress:{canHandle:function(S, U) {
        if (S.type === "keyup") {
            if (L(U) || J(U) || B(U)) {
                var T = A.getAncestorBy(U, function(V) {
                    return V.nodeName === "FORM"
                });
                return(T !== null)
            }
        } else {
            return false
        }
    },invoke:function(U, V) {
        var T = A.getAncestorBy(V, function(W) {
            return W.nodeName === "FORM"
        });
        if (T) {
            var S = blueskyminds.ui.forms.getHandler(T, E);
            if (S !== null) {
                S.invoke(U, V, T)
            }
        }
    }},help:{canHandle:function(S, T) {
        if (S.type === "focus" || S.type === "blur") {
            if (L(T) || J(T || B(T))) {
                var U = T.getAttribute("data-helpId");
                if (U) {
                    return true
                }
            }
        } else {
            return false
        }
    },invoke:function(S, T) {
        var U = T.getAttribute("data-helpId");
        T = blueskyminds.ui.loader.findTarget("bsm-help", T);
        if (T) {
            if (S.type === "focus") {
                HousePad.ui.help.show(T, U)
            } else {
                HousePad.ui.help.hide(T, U)
            }
        }
    }},focus:{canHandle:function(S, U) {
        if (S.type === "focus" || S.type === "blur") {
            if (A.hasClass(U, "bsm-watch-focus")) {
                var T = A.getAncestorBy(U, function(V) {
                    return V.nodeName === "FORM"
                });
                return(T !== null)
            }
        } else {
            return false
        }
    },invoke:function(T, V) {
        var U = A.getAncestorBy(V, function(W) {
            return W.nodeName === "FORM"
        });
        if (U) {
            var S = blueskyminds.ui.forms.getHandler(U, E);
            if (S !== null) {
                S.invoke(T, V, U)
            }
        }
    }},change:{canHandle:function(S, U) {
        if (S.type === "change") {
            if (A.hasClass(U, "bsm-watch-change")) {
                var T = A.getAncestorBy(U, function(V) {
                    return V.nodeName === "FORM"
                });
                return(T !== null)
            }
        } else {
            return false
        }
    },invoke:function(T, V) {
        var U = A.getAncestorBy(V, function(W) {
            return W.nodeName === "FORM"
        });
        if (U) {
            var S = blueskyminds.ui.forms.getHandler(U, E);
            if (S !== null) {
                S.invoke(T, V, U)
            }
        }
    }}};
    function N(T) {
        var V;
        var S;
        var W;
        if (YAHOO.env.ua.ie) {
            V = T.srcElement
        } else {
            V = T.target
        }
        if (V) {
            var U = false;
            for (S = 0; S < D.length; S++) {
                W = D[S];
                if (W.canHandle(T, V)) {
                    if (!U) {
                        YAHOO.util.Event.preventDefault(T);
                        U = true
                    }
                    if (W.invoke(T, V)) {
                        break
                    }
                }
            }
        }
    }
    function P(S) {
        return true
    }
    function K(Y) {
        var W = YAHOO.util.Dom,b = YAHOO.util.Event;
        var X,V;
        var T = W.getElementsByClassName("commands", "div", Y);
        for (X = 0; X < T.length; X++) {
            b.addListener(T[X], "click", N);
            var U = W.getElementsByClassName("bsm-watch-keypress", "input", T[X]);
            for (V = 0; V < U.length; V++) {
                b.addListener(U[V], "keyup", N)
            }
            var Z = W.getElementsByClassName("bsm-watch-keypress", "textarea", T[X]);
            for (V = 0; V < Z.length; V++) {
                b.addListener(Z[V], "keyup", N)
            }
            U = W.getElementsByClassName("bsm-watch-focus", "input", T[X]);
            for (V = 0; V < U.length; V++) {
                b.addListener(U[V], "focus", N);
                b.addListener(U[V], "blur", N)
            }
            Z = W.getElementsByClassName("bsm-watch-focus", "textarea", T[X]);
            for (V = 0; V < Z.length; V++) {
                b.addListener(Z[V], "focus", N);
                b.addListener(Z[V], "blur", N)
            }
            var a = W.getElementsByClassName("bsm-watch-change", "select", T[X]);
            for (V = 0; V < a.length; V++) {
                b.addListener(a[V], "change", N);
                N({type:"change",target:a[V],srcElement:a[V]})
            }
            var S = W.getElementsBy(P, "form", T[X]);
            for (V = 0; V < S.length; V++) {
                b.addListener(S[V], "submit", G)
            }
        }
    }
    function Q() {
        for (var S in H) {
            if (typeof H[S] !== "function") {
                D[D.length] = H[S]
            }
        }
    }
    Q();
    return{init:function(S) {
        K(S)
    },registerCommand:function(S) {
        D.unshift(S)
    },getCommandClickListener:function() {
        return N
    },defaultFormHandler:E,viewRegion:function(S) {
        N({type:"click",target:S,srcElement:S});
        return false
    }}
}();
(function() {
    var B = YAHOO.util.Dom;
    var a = YAHOO.util.Event;
    var K = "voted";
    var D = "sbwm";
    var Q = "all";
    var X;
    var T = 0;
    var V = function(b, e) {
        var d = 10;
        var c = (d * e);
        var h = (d - c);
        var f = ("" + Math.round(e * 100)).substr(0, 4) + "%";
        var g = B.getElementsByClassName("empty", "div", b)[0];
        var i = B.getElementsByClassName("filled", "div", b)[0];
        if (e > 0) {
            B.setStyle(g, "height", h + "em");
            B.setStyle(i, "height", c + "em");
            B.setStyle(i, "display", "block")
        } else {
            B.setStyle(g, "height", d + "em");
            B.setStyle(i, "display", "none")
        }
        if (c > 1) {
            blueskyminds.dom.clearHTML(g);
            blueskyminds.dom.insertHTML(i, f)
        } else {
            blueskyminds.dom.clearHTML(i);
            blueskyminds.dom.insertHTML(g, f)
        }
    };
    var W = function() {
        var b = B.get("country");
        var d;
        X = {};
        if (b) {
            for (var c = 0; c < b.options.length; c++) {
                d = b.options[c];
                if (d.value) {
                    X[d.value] = d.text
                }
            }
        }
    };
    var J = function(d) {
        var b;
        if (!X) {
            W()
        }
        try {
            b = X[d];
            if (!b) {
                b = "???"
            }
        } catch(c) {
            b = "???"
        }
        return b
    };
    var F = function(d) {
        var f = d.country + "_";
        var c = B.get(f);
        var b;
        if (c) {
            b = c;
            if (B.getStyle(b, "display") === "none") {
                T += 1
            }
            B.setStyle(b, "display", "none")
        } else {
            var e = B.get("resultTemplate");
            if (e) {
                b = e.cloneNode(true);
                T += 1
            }
        }
        if (b) {
            b.setAttribute("id", f)
        }
        return b
    };
    var N = function(l, n) {
        var c = B.get("results");
        if (c) {
            var e = l.democratic + l.republican;
            var m;
            var b;
            if (e > 0) {
                m = Math.round(l.democratic / e * 100) / 100;
                b = Math.round((1 - m) * 100) / 100
            } else {
                m = 0;
                b = 0
            }
            var p = B.getElementsByClassName("democraticBar", "div", n)[0];
            V(p, m);
            var g = B.getElementsByClassName("republicanBar", "div", n)[0];
            V(g, b);
            var h = J(l.country);
            var o = B.getElementsByClassName("country", "h2", n)[0];
            blueskyminds.dom.insertHTML(o, h);
            var i = B.getElementsByClassName("voteCount", "h3", n)[0];
            blueskyminds.dom.insertHTML(i, "(" + e + " votes)");
            var f = B.getElementsByClassName("last-row", "div", c)[0];
            f.appendChild(n);
            B.setStyle(n, "display", "block");
            T += 1
        }
    };
    var I = function() {
        var e = B.get("results");
        if (e) {
            var f;
            if (YAHOO.env.ua.ie) {
                f = 12 * 13.3333
            } else {
                f = 12 * 13
            }
            var p = B.getViewportWidth();
            var m = (Math.floor(p / f) - 1) || 1;
            var o = (T || 1);
            var h = 0;
            var s = [];
            var c;
            var b = 0;
            do{
                c = Math.min(m, o - h);
                if (c > 0) {
                    s[b] = c;
                    h += c
                }
                b += 1
            } while (h < o);
            T = 0;
            var d = B.getElementsByClassName("row", "div", e);
            var l;
            var q = 0;
            for (b = 0; b < d.length; b++) {
                var r = [];
                l = B.getElementsByClassName("result", "div", d[b], function(t) {
                    if (B.getStyle(t, "display") !== "none") {
                        r.push(t)
                    }
                });
                T += r.length;
                if (q > 0) {
                    var i;
                    for (i = 0; i < q; i++) {
                        d[b - 1].appendChild(l[i])
                    }
                } else {
                    if (r.length < s[b]) {
                        q = s[b] - r.length
                    }
                }
            }
            if (d.length > s.length) {
                for (b = s.length; b < d.length; b++) {
                    a.purgeElement(d[b]);
                    e.removeChild(d[b])
                }
            } else {
                if (d.length < s.length) {
                    for (b = d.length; b < s.length; b++) {
                        var n = document.createElement("div");
                        n.setAttribute("id", "row" + b);
                        n.setAttribute("class", "row");
                        e.appendChild(n)
                    }
                }
            }
            for (b = 0; b < s.length; b++) {
                var g = B.get("row" + b);
                B.setStyle(g, "margin-left", Math.floor((p / 2) - (s[b] * f / 2)) + "px");
                if (b === s.length - 1) {
                    B.addClass(g, "last-row")
                } else {
                    B.removeClass(g, "last-row")
                }
            }
        }
    };
    var Z = {success:function(f) {
        var c;
        try {
            c = YAHOO.lang.JSON.parse(f.responseText)
        } catch(e) {
            blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + e.message)
        }
        try {
            if (YAHOO.lang.isObject(c)) {
                var b = F(c);
                I();
                N(c, b)
            } else {
                blueskyminds.events.fire("error", "The response from the server was invalid.")
            }
        } catch(d) {
            blueskyminds.events.fire("error", "A client-side exception occured while updating the page. Message: " + d.message)
        }
    },failure:function(b) {
        blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(b))
    },cache:false};
    var Y = function(b) {
        if (b) {
            YAHOO.util.Connect.asyncRequest("GET", "poll/result/" + b + ".json", Z)
        } else {
            YAHOO.util.Connect.asyncRequest("GET", "poll/result.json", Z)
        }
    };
    var E = {invoke:function(c, d, b) {
        var e = b.country;
        if (YAHOO.lang.isValue(e.value)) {
            Y(e.value)
        }
    }};
    function L() {
        B.setStyle("voteTemplate", "display", "block")
    }
    function P() {
        B.setStyle("voteTemplate", "display", "none")
    }
    var U = {success:function(b) {
        YAHOO.util.Cookie.set(K, true, {expires:blueskyminds.calendar.inOneYear()});
        P();
        B.get("voteSubmit").disabled = false;
        if (this !== Q) {
            Y(Q)
        }
        Y(this)
    },failure:function(b) {
        blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(b))
    }};
    var O = {invoke:function(d, e, c) {
        var b = YAHOO.util.Connect;
        b.resetFormState();
        c.action = "poll/vote";
        b.setForm(c);
        b.initHeader("X-AuthToken", D, true);
        b.asyncRequest("POST", "poll/vote", {success:U.success,failure:U.failure,scope:c.country.value});
        return true
    }};
    var A = function(g) {
        var b = YAHOO.util.Cookie.get(K);
        if (!b) {
            var f = B.get("firstVote");
            var c = B.get("party");
            var d = B.get("voteCountry");
            if (f.checked) {
                if (c.selectedIndex > 0) {
                    if (d.selectedIndex > 0) {
                        B.get("voteSubmit").disabled = false;
                        return
                    }
                }
            }
        }
        B.get("voteSubmit").disabled = true
    };
    var S = {canHandle:function(b, c) {
        return B.hasClass(c, "close-result")
    },invoke:function(c, d) {
        var b = B.getAncestorByClassName(d, "bsm-closeable");
        if (b) {
            blueskyminds.ui.effects.hide(b);
            T--;
            I()
        }
        return true
    }};
    var M = function(b) {
        I()
    };
    var H = function() {
        blueskyminds.ui.forms.registerHandlerForForm("resultForm", E);
        a.addListener("firstVote", "change", A);
        a.addListener("party", "change", A);
        a.addListener("voteCountry", "change", A);
        blueskyminds.ui.forms.registerHandlerForForm("voteForm", O);
        blueskyminds.ui.commands.registerCommand(S);
        blueskyminds.ui.commands.init("bd");
        blueskyminds.ui.commands.init("ft");
        a.addListener(window, "resize", M)
    };
    var G = function() {
        W();
        var b = B.get("voteCountry");
        if (b) {
            var c = document.createElement("option");
            c.value = "";
            c.text = "...";
            if (YAHOO.env.ua.ie) {
                b.add(c)
            } else {
                b.add(c, null)
            }
            var d;
            for (d in X) {
                if (typeof X[d] !== "function") {
                    if (d !== Q) {
                        c = document.createElement("option");
                        c.value = d;
                        c.text = X[d];
                        if (YAHOO.env.ua.ie) {
                            b.add(c)
                        } else {
                            b.add(c, null)
                        }
                    }
                }
            }
        }
    };
    var C = function() {
        var b = YAHOO.util.Cookie.get(K);
        if (!b) {
            if (B.get("marker")) {
                L()
            }
        }
    };
    var R = function() {
        var c = new blueskyminds.ui.ErrorController("errors", "error");
        try {
            H();
            G();
            Y(Q);
            C();
            I()
        } catch(b) {
            blueskyminds.events.fire("error", "A client-side exception occurred during init. Message:" + b.message)
        }
    };
    YAHOO.util.Event.onDOMReady(R)
})();