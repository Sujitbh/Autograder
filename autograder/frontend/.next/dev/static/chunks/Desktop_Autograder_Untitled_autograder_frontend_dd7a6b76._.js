(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/faculty/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Login
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/LoginPage'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/utils/AuthContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function LoginContent() {
    _s();
    const { isAuthenticated, login } = useAuth();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginContent.useEffect": ()=>{
            if (isAuthenticated) router.replace('/faculty/courses');
        }
    }["LoginContent.useEffect"], [
        isAuthenticated,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginPage, {
        onLogin: ()=>{
            // Read the user data that LoginPage saved to localStorage
            try {
                const stored = localStorage.getItem('autograde_current_user');
                if (stored) {
                    const userData = JSON.parse(stored);
                    login(userData);
                } else {
                    login();
                }
            } catch  {
                login();
            }
            router.push('/faculty/courses');
        }
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/faculty/login/page.tsx",
        lineNumber: 16,
        columnNumber: 12
    }, this);
}
_s(LoginContent, "ZUXn4oXpbToIk5T5RF7N2p1SetY=", false, function() {
    return [
        useAuth,
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginContent;
function Login() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginContent, {}, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/faculty/login/page.tsx",
            lineNumber: 36,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/faculty/login/page.tsx",
        lineNumber: 35,
        columnNumber: 9
    }, this);
}
_c1 = Login;
var _c, _c1;
__turbopack_context__.k.register(_c, "LoginContent");
__turbopack_context__.k.register(_c1, "Login");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Desktop_Autograder_Untitled_autograder_frontend_dd7a6b76._.js.map