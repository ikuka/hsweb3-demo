!function(I){function g(C){if(A[C])return A[C].exports;var n=A[C]={i:C,l:!1,exports:{}};return I[C].call(n.exports,n,n.exports,g),n.l=!0,n.exports}var C=window.webpackJsonp;window.webpackJsonp=function(A,e,t){for(var B,c,u,a=0,r=[];a<A.length;a++)c=A[a],n[c]&&r.push(n[c][0]),n[c]=0;for(B in e)Object.prototype.hasOwnProperty.call(e,B)&&(I[B]=e[B]);for(C&&C(A,e,t);r.length;)r.shift()();if(t)for(a=0;a<t.length;a++)u=g(g.s=t[a]);return u};var A={},n={17:0};g.e=function(I){function C(){t.onerror=t.onload=null,clearTimeout(B);var g=n[I];0!==g&&(g&&g[1](new Error("Loading chunk "+I+" failed.")),n[I]=void 0)}if(0===n[I])return Promise.resolve();if(n[I])return n[I][2];var A=new Promise(function(g,C){n[I]=[g,C]});n[I][2]=A;var e=document.getElementsByTagName("head")[0],t=document.createElement("script");t.type="text/javascript",t.charset="utf-8",t.async=!0,t.timeout=12e4,g.nc&&t.setAttribute("nonce",g.nc),t.src=g.p+"plugins/"+({0:"role/save",1:"permission/save",2:"user/save",3:"user/index",4:"role/index",5:"permission/index",6:"menu/index",7:"menu-group/index",8:"autz-settings/index",9:"utils/script/script-editor",10:"utils/script/index",11:"menu/save",12:"login/index",13:"index",14:"utils/script-editor",15:"boot",16:"commons/request"}[I]||I)+".js";var B=setTimeout(C,12e4);return t.onerror=t.onload=C,e.appendChild(t),A},g.m=I,g.c=A,g.i=function(I){return I},g.d=function(I,C,A){g.o(I,C)||Object.defineProperty(I,C,{configurable:!1,enumerable:!0,get:A})},g.n=function(I){var C=I&&I.__esModule?function(){return I.default}:function(){return I};return g.d(C,"a",C),C},g.o=function(I,g){return Object.prototype.hasOwnProperty.call(I,g)},g.p="/dist/",g.oe=function(I){throw console.error(I),I}}([,function(module,exports){eval('function doAjax(url, data, method, callback, syc, requestBody) {\n    var data_tmp = data;\n    if (requestBody == true) {\n        if (typeof(data) != \'string\') {\n            data = JSON.stringify(data);\n        }\n    }\n    var param = {\n        type: method,\n        url: url,\n        data: data,\n        cache: false,\n        async: syc == true,\n        success: callback,\n        error: function (e) {\n            if (e.status == 200) {\n                msg = {status: 200, result: e.statusText, success: true};\n                return msg;\n            }\n            var msg = {};\n            if (e.responseJSON) {\n                msg = e.responseJSON;\n            } else {\n                msg = {code: e.status, result: e.statusText, success: false};\n            }\n            if (msg.status == 401) {\n                if (window.doLogin) {\n                    window.doLogin(function () {\n                        doAjax(url, data_tmp, method, callback, syc, requestBody);\n                    });\n                } else if (window.top.doLogin) {\n                    window.top.doLogin(function () {\n                        doAjax(url, data_tmp, method, callback, syc, requestBody);\n                    });\n                }\n            } else {\n                if (callback)\n                    callback(msg);\n            }\n        },\n        dataType: \'json\'\n    };\n    if (requestBody == true) {\n        param.contentType = "application/json";\n    }\n    return $.ajax(param).responseJSON;\n}\nfunction getRequestUrl(url) {\n    if (url.indexOf("http") == 0) {\n        return url;\n    } else {\n        return ( window.API_BASE_PATH ? window.API_BASE_PATH : window.BASE_PATH) + url;\n    }\n}\nmodule.exports = {\n    basePath: window.API_BASE_PATH ? window.API_BASE_PATH : window.BASE_PATH,\n    getParameter: function (name) {\n        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");\n        var r = window.location.search.substr(1).match(reg);\n        if (r != null) return unescape(r[2]);\n        return null;\n    },\n    encodeQueryParam: function (data) {\n        var queryParam = {};\n        var index = 0;\n        for (var f in data) {\n            if (data[f] == "")continue;\n            if (f.indexOf(\'$LIKE\') != -1 && data[f].indexOf(\'%\') == -1)data[f] = "%" + data[f] + "%";\n            if (f.indexOf(\'$START\') != -1)data[f] = "%" + data[f];\n            if (f.indexOf(\'$END\') != -1)data[f] = data[f] + "%";\n            queryParam["terms[" + (index) + "].column"] = f;\n            queryParam["terms[" + (index) + "].value"] = data[f];\n            index++;\n        }\n        return queryParam;\n    },\n    createQuery: function (api) {\n        var query = {};\n        query.param = {};\n        query.terms = [];\n        query.nowType = "and";\n        query.getParams = function () {\n            var tmp = buildParam(query.terms);\n            for (var f in tmp) {\n                query.param[f] = tmp[f];\n            }\n            return query.param;\n        };\n        query.select = function (columns) {\n            query.param.includes = columns + "";\n            return query;\n        };\n        query.excludes = function (columns) {\n            query.param.excludes = columns + "";\n            return query;\n        };\n        query.like = function (k, v) {\n            query.terms.push({column: k, type: query.nowType, termType: "like", value: v});\n            return query;\n        };\n        query.where = function (k, v, t) {\n            query.and(k, v, t);\n            return query;\n        };\n        query.and = function (k, v, t) {\n            query.nowType = "and";\n            if (k && v)\n                query.terms.push({column: k, termType: t ? "eq" : t, type: query.nowType, value: v});\n            return query;\n        };\n        query.orNest = function (k, v) {\n            return query.nest(k, v, true);\n        };\n        query.nest = function (k, v, isOr) {\n            var nest = {column: k, value: v, type: isOr ? \'or\' : \'and\'};\n            var func = {};\n            nest.terms = [];\n            func.and = function (k, v, t) {\n                query.nowType = "and";\n                if (k && v)\n                    nest.terms.push({column: k, termType: t ? "eq" : t, value: v, type: \'and\'});\n                return func;\n            };\n            func.or = function (k, v, t) {\n                query.nowType = "or";\n                if (k && v)\n                    nest.terms.push({column: k, termType: t ? "eq" : t, value: v, type: \'or\'});\n                return func;\n            };\n            func.exec = query.exec;\n            func.nest = query.nest;\n            query.terms.push(nest);\n            return func;\n        };\n        query.or = function (k, v, t) {\n            query.nowType = "or";\n            if (k && v)\n                query.terms.push({column: k, termType: t ? "eq" : t, value: v, type: query.nowType});\n            return query;\n        };\n        query.orderBy = function (f) {\n            query.param.sortField = f;\n            return query;\n        };\n        query.desc = function () {\n            query.param.sortOrder = \'desc\';\n            return query;\n        };\n        query.asc = function () {\n            query.param.sortOrder = \'asc\';\n            return query;\n        };\n        query.noPaging = function () {\n            query.param.paging = \'false\';\n            return query;\n        };\n        query.limit = function (pageIndex, pageSize) {\n            query.param.pageIndex = start;\n            if (pageSize)\n                query.param.pageSize = pageSize;\n            return query;\n        };\n        function buildParam(terms) {\n            var tmp = {};\n            $(terms).each(function (i, e) {\n                for (var f in e) {\n                    if (f != \'terms\')\n                        tmp["terms[" + i + "]." + f] = e[f]; else {\n                        var tmpTerms = buildParam(e[f]);\n                        for (var f2 in tmpTerms) {\n                            tmp["terms[" + i + "]." + f2] = tmpTerms[f2];\n                        }\n                    }\n                }\n            });\n            return tmp\n        }\n\n        query.exec = function (callback) {\n            var tmp = buildParam(query.terms);\n            for (var f in tmp) {\n                query.param[f] = tmp[f];\n            }\n            return doAjax(getRequestUrl(api), query.param, "GET", callback, typeof(callback) != \'undefined\', false);\n        };\n        return query;\n    }, get: function (uri, data, callback) {\n        var data_ = data, callback_ = callback;\n        if (typeof(data) == \'undefined\')data_ = {};\n        if (typeof(callback) == \'object\')data_ = callback;\n        if (typeof(data) == \'function\')callback_ = data;\n        return doAjax(getRequestUrl(uri), data_, "GET", callback_, typeof(callback_) != \'undefined\', false);\n    }, post: function (uri, data, callback, requestBody) {\n        if (requestBody != false)requestBody = true;\n        doAjax(getRequestUrl(uri), data, "POST", callback, true, requestBody);\n    }, put: function (uri, data, callback, requestBody) {\n        if (requestBody != false)requestBody = true;\n        doAjax(getRequestUrl(uri), data, "PUT", callback, true, requestBody);\n    }, patch: function (uri, data, callback, requestBody) {\n        if (requestBody != false)requestBody = true;\n        doAjax(getRequestUrl(uri), data, "PATCH", callback, true, requestBody);\n    }, "delete": function (uri, data, callback) {\n        var data_ = data, callback_ = callback;\n        if (typeof(data) == \'undefined\')data_ = {};\n        if (typeof(callback) == \'object\')data_ = callback;\n        if (typeof(data) == \'function\')callback_ = data;\n        return doAjax(getRequestUrl(uri), data_, "DELETE", callback_, typeof(callback_) != \'undefined\', false);\n    }, doAjax: doAjax\n}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9ucy9yZXF1ZXN0LmpzPzFhMWIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYix1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDJEQUEyRDtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsaUVBQWlFO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHlEQUF5RDtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHdEQUF3RDtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpRUFBaUU7QUFDbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZG9BamF4KHVybCwgZGF0YSwgbWV0aG9kLCBjYWxsYmFjaywgc3ljLCByZXF1ZXN0Qm9keSkge1xuICAgIHZhciBkYXRhX3RtcCA9IGRhdGE7XG4gICAgaWYgKHJlcXVlc3RCb2R5ID09IHRydWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhKSAhPSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgdHlwZTogbWV0aG9kLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICBhc3luYzogc3ljID09IHRydWUsXG4gICAgICAgIHN1Y2Nlc3M6IGNhbGxiYWNrLFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICBtc2cgPSB7c3RhdHVzOiAyMDAsIHJlc3VsdDogZS5zdGF0dXNUZXh0LCBzdWNjZXNzOiB0cnVlfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXNnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1zZyA9IHt9O1xuICAgICAgICAgICAgaWYgKGUucmVzcG9uc2VKU09OKSB7XG4gICAgICAgICAgICAgICAgbXNnID0gZS5yZXNwb25zZUpTT047XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1zZyA9IHtjb2RlOiBlLnN0YXR1cywgcmVzdWx0OiBlLnN0YXR1c1RleHQsIHN1Y2Nlc3M6IGZhbHNlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtc2cuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuZG9Mb2dpbikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZG9Mb2dpbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb0FqYXgodXJsLCBkYXRhX3RtcCwgbWV0aG9kLCBjYWxsYmFjaywgc3ljLCByZXF1ZXN0Qm9keSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnRvcC5kb0xvZ2luKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy50b3AuZG9Mb2dpbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb0FqYXgodXJsLCBkYXRhX3RtcCwgbWV0aG9kLCBjYWxsYmFjaywgc3ljLCByZXF1ZXN0Qm9keSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfTtcbiAgICBpZiAocmVxdWVzdEJvZHkgPT0gdHJ1ZSkge1xuICAgICAgICBwYXJhbS5jb250ZW50VHlwZSA9IFwiYXBwbGljYXRpb24vanNvblwiO1xuICAgIH1cbiAgICByZXR1cm4gJC5hamF4KHBhcmFtKS5yZXNwb25zZUpTT047XG59XG5mdW5jdGlvbiBnZXRSZXF1ZXN0VXJsKHVybCkge1xuICAgIGlmICh1cmwuaW5kZXhPZihcImh0dHBcIikgPT0gMCkge1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoIHdpbmRvdy5BUElfQkFTRV9QQVRIID8gd2luZG93LkFQSV9CQVNFX1BBVEggOiB3aW5kb3cuQkFTRV9QQVRIKSArIHVybDtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBiYXNlUGF0aDogd2luZG93LkFQSV9CQVNFX1BBVEggPyB3aW5kb3cuQVBJX0JBU0VfUEFUSCA6IHdpbmRvdy5CQVNFX1BBVEgsXG4gICAgZ2V0UGFyYW1ldGVyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIihefCYpXCIgKyBuYW1lICsgXCI9KFteJl0qKSgmfCQpXCIsIFwiaVwiKTtcbiAgICAgICAgdmFyIHIgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xuICAgICAgICBpZiAociAhPSBudWxsKSByZXR1cm4gdW5lc2NhcGUoclsyXSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZW5jb2RlUXVlcnlQYXJhbTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgZm9yICh2YXIgZiBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtmXSA9PSBcIlwiKWNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKGYuaW5kZXhPZignJExJS0UnKSAhPSAtMSAmJiBkYXRhW2ZdLmluZGV4T2YoJyUnKSA9PSAtMSlkYXRhW2ZdID0gXCIlXCIgKyBkYXRhW2ZdICsgXCIlXCI7XG4gICAgICAgICAgICBpZiAoZi5pbmRleE9mKCckU1RBUlQnKSAhPSAtMSlkYXRhW2ZdID0gXCIlXCIgKyBkYXRhW2ZdO1xuICAgICAgICAgICAgaWYgKGYuaW5kZXhPZignJEVORCcpICE9IC0xKWRhdGFbZl0gPSBkYXRhW2ZdICsgXCIlXCI7XG4gICAgICAgICAgICBxdWVyeVBhcmFtW1widGVybXNbXCIgKyAoaW5kZXgpICsgXCJdLmNvbHVtblwiXSA9IGY7XG4gICAgICAgICAgICBxdWVyeVBhcmFtW1widGVybXNbXCIgKyAoaW5kZXgpICsgXCJdLnZhbHVlXCJdID0gZGF0YVtmXTtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHF1ZXJ5UGFyYW07XG4gICAgfSxcbiAgICBjcmVhdGVRdWVyeTogZnVuY3Rpb24gKGFwaSkge1xuICAgICAgICB2YXIgcXVlcnkgPSB7fTtcbiAgICAgICAgcXVlcnkucGFyYW0gPSB7fTtcbiAgICAgICAgcXVlcnkudGVybXMgPSBbXTtcbiAgICAgICAgcXVlcnkubm93VHlwZSA9IFwiYW5kXCI7XG4gICAgICAgIHF1ZXJ5LmdldFBhcmFtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0bXAgPSBidWlsZFBhcmFtKHF1ZXJ5LnRlcm1zKTtcbiAgICAgICAgICAgIGZvciAodmFyIGYgaW4gdG1wKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkucGFyYW1bZl0gPSB0bXBbZl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcXVlcnkucGFyYW07XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXJ5LnNlbGVjdCA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gICAgICAgICAgICBxdWVyeS5wYXJhbS5pbmNsdWRlcyA9IGNvbHVtbnMgKyBcIlwiO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9O1xuICAgICAgICBxdWVyeS5leGNsdWRlcyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gICAgICAgICAgICBxdWVyeS5wYXJhbS5leGNsdWRlcyA9IGNvbHVtbnMgKyBcIlwiO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9O1xuICAgICAgICBxdWVyeS5saWtlID0gZnVuY3Rpb24gKGssIHYpIHtcbiAgICAgICAgICAgIHF1ZXJ5LnRlcm1zLnB1c2goe2NvbHVtbjogaywgdHlwZTogcXVlcnkubm93VHlwZSwgdGVybVR5cGU6IFwibGlrZVwiLCB2YWx1ZTogdn0pO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9O1xuICAgICAgICBxdWVyeS53aGVyZSA9IGZ1bmN0aW9uIChrLCB2LCB0KSB7XG4gICAgICAgICAgICBxdWVyeS5hbmQoaywgdiwgdCk7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXJ5LmFuZCA9IGZ1bmN0aW9uIChrLCB2LCB0KSB7XG4gICAgICAgICAgICBxdWVyeS5ub3dUeXBlID0gXCJhbmRcIjtcbiAgICAgICAgICAgIGlmIChrICYmIHYpXG4gICAgICAgICAgICAgICAgcXVlcnkudGVybXMucHVzaCh7Y29sdW1uOiBrLCB0ZXJtVHlwZTogdCA/IFwiZXFcIiA6IHQsIHR5cGU6IHF1ZXJ5Lm5vd1R5cGUsIHZhbHVlOiB2fSk7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXJ5Lm9yTmVzdCA9IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnkubmVzdChrLCB2LCB0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVlcnkubmVzdCA9IGZ1bmN0aW9uIChrLCB2LCBpc09yKSB7XG4gICAgICAgICAgICB2YXIgbmVzdCA9IHtjb2x1bW46IGssIHZhbHVlOiB2LCB0eXBlOiBpc09yID8gJ29yJyA6ICdhbmQnfTtcbiAgICAgICAgICAgIHZhciBmdW5jID0ge307XG4gICAgICAgICAgICBuZXN0LnRlcm1zID0gW107XG4gICAgICAgICAgICBmdW5jLmFuZCA9IGZ1bmN0aW9uIChrLCB2LCB0KSB7XG4gICAgICAgICAgICAgICAgcXVlcnkubm93VHlwZSA9IFwiYW5kXCI7XG4gICAgICAgICAgICAgICAgaWYgKGsgJiYgdilcbiAgICAgICAgICAgICAgICAgICAgbmVzdC50ZXJtcy5wdXNoKHtjb2x1bW46IGssIHRlcm1UeXBlOiB0ID8gXCJlcVwiIDogdCwgdmFsdWU6IHYsIHR5cGU6ICdhbmQnfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZnVuYy5vciA9IGZ1bmN0aW9uIChrLCB2LCB0KSB7XG4gICAgICAgICAgICAgICAgcXVlcnkubm93VHlwZSA9IFwib3JcIjtcbiAgICAgICAgICAgICAgICBpZiAoayAmJiB2KVxuICAgICAgICAgICAgICAgICAgICBuZXN0LnRlcm1zLnB1c2goe2NvbHVtbjogaywgdGVybVR5cGU6IHQgPyBcImVxXCIgOiB0LCB2YWx1ZTogdiwgdHlwZTogJ29yJ30pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZ1bmMuZXhlYyA9IHF1ZXJ5LmV4ZWM7XG4gICAgICAgICAgICBmdW5jLm5lc3QgPSBxdWVyeS5uZXN0O1xuICAgICAgICAgICAgcXVlcnkudGVybXMucHVzaChuZXN0KTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgICB9O1xuICAgICAgICBxdWVyeS5vciA9IGZ1bmN0aW9uIChrLCB2LCB0KSB7XG4gICAgICAgICAgICBxdWVyeS5ub3dUeXBlID0gXCJvclwiO1xuICAgICAgICAgICAgaWYgKGsgJiYgdilcbiAgICAgICAgICAgICAgICBxdWVyeS50ZXJtcy5wdXNoKHtjb2x1bW46IGssIHRlcm1UeXBlOiB0ID8gXCJlcVwiIDogdCwgdmFsdWU6IHYsIHR5cGU6IHF1ZXJ5Lm5vd1R5cGV9KTtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVlcnkub3JkZXJCeSA9IGZ1bmN0aW9uIChmKSB7XG4gICAgICAgICAgICBxdWVyeS5wYXJhbS5zb3J0RmllbGQgPSBmO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9O1xuICAgICAgICBxdWVyeS5kZXNjID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcXVlcnkucGFyYW0uc29ydE9yZGVyID0gJ2Rlc2MnO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9O1xuICAgICAgICBxdWVyeS5hc2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBxdWVyeS5wYXJhbS5zb3J0T3JkZXIgPSAnYXNjJztcbiAgICAgICAgICAgIHJldHVybiBxdWVyeTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVlcnkubm9QYWdpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBxdWVyeS5wYXJhbS5wYWdpbmcgPSAnZmFsc2UnO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9O1xuICAgICAgICBxdWVyeS5saW1pdCA9IGZ1bmN0aW9uIChwYWdlSW5kZXgsIHBhZ2VTaXplKSB7XG4gICAgICAgICAgICBxdWVyeS5wYXJhbS5wYWdlSW5kZXggPSBzdGFydDtcbiAgICAgICAgICAgIGlmIChwYWdlU2l6ZSlcbiAgICAgICAgICAgICAgICBxdWVyeS5wYXJhbS5wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBidWlsZFBhcmFtKHRlcm1zKSB7XG4gICAgICAgICAgICB2YXIgdG1wID0ge307XG4gICAgICAgICAgICAkKHRlcm1zKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZiBpbiBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmICE9ICd0ZXJtcycpXG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBbXCJ0ZXJtc1tcIiArIGkgKyBcIl0uXCIgKyBmXSA9IGVbZl07IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcFRlcm1zID0gYnVpbGRQYXJhbShlW2ZdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGYyIGluIHRtcFRlcm1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wW1widGVybXNbXCIgKyBpICsgXCJdLlwiICsgZjJdID0gdG1wVGVybXNbZjJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdG1wXG4gICAgICAgIH1cblxuICAgICAgICBxdWVyeS5leGVjID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgdG1wID0gYnVpbGRQYXJhbShxdWVyeS50ZXJtcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBmIGluIHRtcCkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LnBhcmFtW2ZdID0gdG1wW2ZdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRvQWpheChnZXRSZXF1ZXN0VXJsKGFwaSksIHF1ZXJ5LnBhcmFtLCBcIkdFVFwiLCBjYWxsYmFjaywgdHlwZW9mKGNhbGxiYWNrKSAhPSAndW5kZWZpbmVkJywgZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgfSwgZ2V0OiBmdW5jdGlvbiAodXJpLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZGF0YV8gPSBkYXRhLCBjYWxsYmFja18gPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhKSA9PSAndW5kZWZpbmVkJylkYXRhXyA9IHt9O1xuICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSA9PSAnb2JqZWN0JylkYXRhXyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEpID09ICdmdW5jdGlvbicpY2FsbGJhY2tfID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIGRvQWpheChnZXRSZXF1ZXN0VXJsKHVyaSksIGRhdGFfLCBcIkdFVFwiLCBjYWxsYmFja18sIHR5cGVvZihjYWxsYmFja18pICE9ICd1bmRlZmluZWQnLCBmYWxzZSk7XG4gICAgfSwgcG9zdDogZnVuY3Rpb24gKHVyaSwgZGF0YSwgY2FsbGJhY2ssIHJlcXVlc3RCb2R5KSB7XG4gICAgICAgIGlmIChyZXF1ZXN0Qm9keSAhPSBmYWxzZSlyZXF1ZXN0Qm9keSA9IHRydWU7XG4gICAgICAgIGRvQWpheChnZXRSZXF1ZXN0VXJsKHVyaSksIGRhdGEsIFwiUE9TVFwiLCBjYWxsYmFjaywgdHJ1ZSwgcmVxdWVzdEJvZHkpO1xuICAgIH0sIHB1dDogZnVuY3Rpb24gKHVyaSwgZGF0YSwgY2FsbGJhY2ssIHJlcXVlc3RCb2R5KSB7XG4gICAgICAgIGlmIChyZXF1ZXN0Qm9keSAhPSBmYWxzZSlyZXF1ZXN0Qm9keSA9IHRydWU7XG4gICAgICAgIGRvQWpheChnZXRSZXF1ZXN0VXJsKHVyaSksIGRhdGEsIFwiUFVUXCIsIGNhbGxiYWNrLCB0cnVlLCByZXF1ZXN0Qm9keSk7XG4gICAgfSwgcGF0Y2g6IGZ1bmN0aW9uICh1cmksIGRhdGEsIGNhbGxiYWNrLCByZXF1ZXN0Qm9keSkge1xuICAgICAgICBpZiAocmVxdWVzdEJvZHkgIT0gZmFsc2UpcmVxdWVzdEJvZHkgPSB0cnVlO1xuICAgICAgICBkb0FqYXgoZ2V0UmVxdWVzdFVybCh1cmkpLCBkYXRhLCBcIlBBVENIXCIsIGNhbGxiYWNrLCB0cnVlLCByZXF1ZXN0Qm9keSk7XG4gICAgfSwgXCJkZWxldGVcIjogZnVuY3Rpb24gKHVyaSwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGRhdGFfID0gZGF0YSwgY2FsbGJhY2tfID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YoZGF0YSkgPT0gJ3VuZGVmaW5lZCcpZGF0YV8gPSB7fTtcbiAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgPT0gJ29iamVjdCcpZGF0YV8gPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhKSA9PSAnZnVuY3Rpb24nKWNhbGxiYWNrXyA9IGRhdGE7XG4gICAgICAgIHJldHVybiBkb0FqYXgoZ2V0UmVxdWVzdFVybCh1cmkpLCBkYXRhXywgXCJERUxFVEVcIiwgY2FsbGJhY2tfLCB0eXBlb2YoY2FsbGJhY2tfKSAhPSAndW5kZWZpbmVkJywgZmFsc2UpO1xuICAgIH0sIGRvQWpheDogZG9BamF4XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb25zL3JlcXVlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxNyJdLCJzb3VyY2VSb290IjoiIn0=')}]);