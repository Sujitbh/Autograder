(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/AuthGuard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthGuard",
    ()=>AuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/utils/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AuthGuard({ children }) {
    _s();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthGuard.useEffect": ()=>{
            if (!isAuthenticated) {
                router.replace('/login');
            }
        }
    }["AuthGuard.useEffect"], [
        isAuthenticated,
        router
    ]);
    if (!isAuthenticated) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthGuard, "Z8qV8gahpegazQReeCvErAUIJG4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthGuard;
var _c;
__turbopack_context__.k.register(_c, "AuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuCheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuGroup",
    ()=>DropdownMenuGroup,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuPortal",
    ()=>DropdownMenuPortal,
    "DropdownMenuRadioGroup",
    ()=>DropdownMenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>DropdownMenuRadioItem,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuShortcut",
    ()=>DropdownMenuShortcut,
    "DropdownMenuSub",
    ()=>DropdownMenuSub,
    "DropdownMenuSubContent",
    ()=>DropdownMenuSubContent,
    "DropdownMenuSubTrigger",
    ()=>DropdownMenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function DropdownMenu({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dropdown-menu",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = DropdownMenu;
function DropdownMenuPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dropdown-menu-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c1 = DropdownMenuPortal;
function DropdownMenuTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dropdown-menu-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c2 = DropdownMenuTrigger;
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "dropdown-menu-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c3 = DropdownMenuContent;
function DropdownMenuGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "dropdown-menu-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c4 = DropdownMenuGroup;
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "dropdown-menu-item",
        "data-inset": inset,
        "data-variant": variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c5 = DropdownMenuItem;
function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"], {
        "data-slot": "dropdown-menu-checkbox-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c6 = DropdownMenuCheckboxItem;
function DropdownMenuRadioGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
        "data-slot": "dropdown-menu-radio-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_c7 = DropdownMenuRadioGroup;
function DropdownMenuRadioItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"], {
        "data-slot": "dropdown-menu-radio-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__["CircleIcon"], {
                        className: "size-2 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_c8 = DropdownMenuRadioItem;
function DropdownMenuLabel({ className, inset, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "dropdown-menu-label",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c9 = DropdownMenuLabel;
function DropdownMenuSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "dropdown-menu-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border -mx-1 my-1 h-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_c10 = DropdownMenuSeparator;
function DropdownMenuShortcut({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "dropdown-menu-shortcut",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground ml-auto text-xs tracking-widest", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_c11 = DropdownMenuShortcut;
function DropdownMenuSub({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sub"], {
        "data-slot": "dropdown-menu-sub",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 198,
        columnNumber: 10
    }, this);
}
_c12 = DropdownMenuSub;
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"], {
        "data-slot": "dropdown-menu-sub-trigger",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                className: "ml-auto size-4"
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_c13 = DropdownMenuSubTrigger;
function DropdownMenuSubContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"], {
        "data-slot": "dropdown-menu-sub-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_c14 = DropdownMenuSubContent;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14;
__turbopack_context__.k.register(_c, "DropdownMenu");
__turbopack_context__.k.register(_c1, "DropdownMenuPortal");
__turbopack_context__.k.register(_c2, "DropdownMenuTrigger");
__turbopack_context__.k.register(_c3, "DropdownMenuContent");
__turbopack_context__.k.register(_c4, "DropdownMenuGroup");
__turbopack_context__.k.register(_c5, "DropdownMenuItem");
__turbopack_context__.k.register(_c6, "DropdownMenuCheckboxItem");
__turbopack_context__.k.register(_c7, "DropdownMenuRadioGroup");
__turbopack_context__.k.register(_c8, "DropdownMenuRadioItem");
__turbopack_context__.k.register(_c9, "DropdownMenuLabel");
__turbopack_context__.k.register(_c10, "DropdownMenuSeparator");
__turbopack_context__.k.register(_c11, "DropdownMenuShortcut");
__turbopack_context__.k.register(_c12, "DropdownMenuSub");
__turbopack_context__.k.register(_c13, "DropdownMenuSubTrigger");
__turbopack_context__.k.register(_c14, "DropdownMenuSubContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9 rounded-md"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/button.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotesPanel",
    ()=>NotesPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/sticky-note.js [app-client] (ecmascript) <export default as StickyNote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/pin.js [app-client] (ecmascript) <export default as Pin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PinOff$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/pin-off.js [app-client] (ecmascript) <export default as PinOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$todo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListTodo$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/list-todo.js [app-client] (ecmascript) <export default as ListTodo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/textarea.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */ const NOTE_COLORS = [
    {
        value: 'default',
        bg: 'var(--color-surface)',
        label: 'Default'
    },
    {
        value: 'yellow',
        bg: '#FEF9C3',
        label: 'Yellow'
    },
    {
        value: 'green',
        bg: '#DCFCE7',
        label: 'Green'
    },
    {
        value: 'blue',
        bg: '#DBEAFE',
        label: 'Blue'
    },
    {
        value: 'pink',
        bg: '#FCE7F3',
        label: 'Pink'
    },
    {
        value: 'purple',
        bg: '#F3E8FF',
        label: 'Purple'
    }
];
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function loadTodos() {
    try {
        const stored = localStorage.getItem('autograde_faculty_todos');
        if (stored) return JSON.parse(stored);
    } catch  {}
    return [
        {
            id: 'demo-1',
            text: 'Grade CS-1001 Assignment 3 submissions',
            completed: false,
            createdAt: '2026-02-19T10:00:00'
        },
        {
            id: 'demo-2',
            text: 'Prepare midterm exam questions',
            completed: false,
            createdAt: '2026-02-18T14:00:00'
        },
        {
            id: 'demo-3',
            text: 'Review late submissions for CS-2050',
            completed: true,
            createdAt: '2026-02-17T09:00:00'
        },
        {
            id: 'demo-4',
            text: 'Update rubric for Functions assignment',
            completed: false,
            createdAt: '2026-02-16T11:00:00'
        }
    ];
}
function saveTodos(todos) {
    localStorage.setItem('autograde_faculty_todos', JSON.stringify(todos));
}
function loadNotes() {
    try {
        const stored = localStorage.getItem('autograde_faculty_notes');
        if (stored) return JSON.parse(stored);
    } catch  {}
    return [
        {
            id: 'demo-n1',
            title: 'Office Hours Reminder',
            content: 'Move Wednesday office hours to 3-5 PM starting next week. Email students about the change.',
            pinned: true,
            color: 'yellow',
            createdAt: '2026-02-18T10:00:00',
            updatedAt: '2026-02-18T10:00:00'
        },
        {
            id: 'demo-n2',
            title: 'CS-3100 Project Ideas',
            content: '- REST API with authentication\n- Real-time chat app\n- Task management dashboard\n- E-commerce prototype',
            pinned: false,
            color: 'blue',
            createdAt: '2026-02-15T14:00:00',
            updatedAt: '2026-02-17T09:00:00'
        },
        {
            id: 'demo-n3',
            title: 'Grading Criteria Updates',
            content: 'Consider adding code style/formatting as 10% of grade for all future assignments. Discuss with department.',
            pinned: false,
            color: 'default',
            createdAt: '2026-02-14T11:00:00',
            updatedAt: '2026-02-14T11:00:00'
        }
    ];
}
function saveNotes(notes) {
    localStorage.setItem('autograde_faculty_notes', JSON.stringify(notes));
}
function formatRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}
function getColorBg(color) {
    return NOTE_COLORS.find((c)=>c.value === color)?.bg ?? 'var(--color-surface)';
}
function NotesPanel({ open, onClose }) {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('todos');
    /* ── Todos state ── */ const [todos, setTodos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(loadTodos);
    const [newTodoText, setNewTodoText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showCompleted, setShowCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const todoInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /* ── Notes state ── */ const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(loadNotes);
    const [editingNote, setEditingNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [noteTitle, setNoteTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [noteContent, setNoteContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [noteColor, setNoteColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('default');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    /* ── Persist ── */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotesPanel.useEffect": ()=>{
            saveTodos(todos);
        }
    }["NotesPanel.useEffect"], [
        todos
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotesPanel.useEffect": ()=>{
            saveNotes(notes);
        }
    }["NotesPanel.useEffect"], [
        notes
    ]);
    /* ── Focus input on tab switch ── */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotesPanel.useEffect": ()=>{
            if (open && activeTab === 'todos') {
                setTimeout({
                    "NotesPanel.useEffect": ()=>todoInputRef.current?.focus()
                }["NotesPanel.useEffect"], 100);
            }
        }
    }["NotesPanel.useEffect"], [
        open,
        activeTab
    ]);
    /* ═══════════════════════════════════════════
       TODO HANDLERS
       ═══════════════════════════════════════════ */ const addTodo = ()=>{
        const text = newTodoText.trim();
        if (!text) return;
        setTodos((prev)=>[
                {
                    id: generateId(),
                    text,
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                ...prev
            ]);
        setNewTodoText('');
        todoInputRef.current?.focus();
    };
    const toggleTodo = (id)=>{
        setTodos((prev)=>prev.map((t)=>t.id === id ? {
                    ...t,
                    completed: !t.completed
                } : t));
    };
    const deleteTodo = (id)=>{
        setTodos((prev)=>prev.filter((t)=>t.id !== id));
    };
    const clearCompleted = ()=>{
        setTodos((prev)=>prev.filter((t)=>!t.completed));
    };
    const activeTodos = todos.filter((t)=>!t.completed);
    const completedTodos = todos.filter((t)=>t.completed);
    /* ═══════════════════════════════════════════
       NOTE HANDLERS
       ═══════════════════════════════════════════ */ const startNewNote = ()=>{
        setEditingNote({
            id: '',
            title: '',
            content: '',
            pinned: false,
            color: 'default',
            createdAt: '',
            updatedAt: ''
        });
        setNoteTitle('');
        setNoteContent('');
        setNoteColor('default');
    };
    const startEditNote = (note)=>{
        setEditingNote(note);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setNoteColor(note.color);
    };
    const saveNote = ()=>{
        if (!noteTitle.trim() && !noteContent.trim()) {
            cancelEdit();
            return;
        }
        const now = new Date().toISOString();
        if (editingNote && editingNote.id) {
            // Update existing
            setNotes((prev)=>prev.map((n)=>n.id === editingNote.id ? {
                        ...n,
                        title: noteTitle.trim(),
                        content: noteContent.trim(),
                        color: noteColor,
                        updatedAt: now
                    } : n));
        } else {
            // New note
            setNotes((prev)=>[
                    {
                        id: generateId(),
                        title: noteTitle.trim(),
                        content: noteContent.trim(),
                        pinned: false,
                        color: noteColor,
                        createdAt: now,
                        updatedAt: now
                    },
                    ...prev
                ]);
        }
        cancelEdit();
    };
    const cancelEdit = ()=>{
        setEditingNote(null);
        setNoteTitle('');
        setNoteContent('');
        setNoteColor('default');
    };
    const deleteNote = (id)=>{
        setNotes((prev)=>prev.filter((n)=>n.id !== id));
        if (editingNote?.id === id) cancelEdit();
    };
    const togglePin = (id)=>{
        setNotes((prev)=>prev.map((n)=>n.id === id ? {
                    ...n,
                    pinned: !n.pinned
                } : n));
    };
    const filteredNotes = notes.filter((n)=>n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const pinnedNotes = filteredNotes.filter((n)=>n.pinned);
    const unpinnedNotes = filteredNotes.filter((n)=>!n.pinned);
    /* ═══════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════ */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 transition-opacity",
                style: {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    zIndex: 1050
                },
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                lineNumber: 247,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-0 right-0 h-full flex flex-col transition-transform duration-300 ease-in-out",
                style: {
                    width: '380px',
                    backgroundColor: 'var(--color-surface)',
                    borderLeft: '1px solid var(--color-border)',
                    boxShadow: open ? '-8px 0 24px rgba(0,0,0,0.12)' : 'none',
                    zIndex: 1060,
                    transform: open ? 'translateX(0)' : 'translateX(100%)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between flex-shrink-0",
                        style: {
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-primary)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                                        className: "w-5 h-5 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 276,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: 'white'
                                        },
                                        children: "My Notes & Todos"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 277,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 275,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "hover:opacity-80 transition-opacity",
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'white'
                                },
                                "aria-label": "Close notes panel",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 285,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 279,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                        lineNumber: 267,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-shrink-0",
                        style: {
                            borderBottom: '1px solid var(--color-border)'
                        },
                        children: [
                            {
                                id: 'todos',
                                label: 'Todos',
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$todo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListTodo$3e$__["ListTodo"],
                                count: activeTodos.length
                            },
                            {
                                id: 'notes',
                                label: 'Notes',
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                                count: notes.length
                            }
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab.id),
                                className: "flex-1 flex items-center justify-center gap-2 transition-colors",
                                style: {
                                    padding: '12px 0',
                                    fontSize: '13px',
                                    fontWeight: activeTab === tab.id ? 700 : 500,
                                    color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                    borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    borderBottomWidth: '2px',
                                    borderBottomStyle: 'solid',
                                    borderBottomColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tab.icon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 313,
                                        columnNumber: 29
                                    }, this),
                                    tab.label,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full",
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            padding: '1px 7px',
                                            backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                                            color: activeTab === tab.id ? 'white' : 'var(--color-text-mid)'
                                        },
                                        children: tab.count
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 315,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, tab.id, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 295,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                        lineNumber: 290,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto",
                        style: {
                            padding: '16px'
                        },
                        children: activeTab === 'todos' ? renderTodosTab() : renderNotesTab()
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                        lineNumber: 329,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                lineNumber: 255,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
    //TURBOPACK unreachable
    ;
    /* ═══════════════════════════════════════════
       TODOS TAB
       ═══════════════════════════════════════════ */ function renderTodosTab() {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            ref: todoInputRef,
                            value: newTodoText,
                            onChange: (e)=>setNewTodoText(e.target.value),
                            onKeyDown: (e)=>e.key === 'Enter' && addTodo(),
                            placeholder: "Add a new task...",
                            style: {
                                fontSize: '13px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 345,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: addTodo,
                            disabled: !newTodoText.trim(),
                            size: "sm",
                            className: "flex-shrink-0 text-white",
                            style: {
                                backgroundColor: 'var(--color-primary)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 360,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 353,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 344,
                    columnNumber: 17
                }, this),
                activeTodos.length === 0 && completedTodos.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$todo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListTodo$3e$__["ListTodo"], {
                            className: "w-10 h-10 mx-auto mb-3",
                            style: {
                                color: 'var(--color-text-light)',
                                opacity: 0.5
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 367,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '14px',
                                color: 'var(--color-text-mid)',
                                fontWeight: 500
                            },
                            children: "No tasks yet"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 368,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '12px',
                                color: 'var(--color-text-light)',
                                marginTop: '4px'
                            },
                            children: "Add your first task above"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 369,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 366,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: activeTodos.map((todo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "group flex items-start gap-2.5 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]",
                            style: {
                                padding: '8px 10px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>toggleTodo(todo.id),
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px 0 0 0',
                                        flexShrink: 0
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                        className: "w-[18px] h-[18px]",
                                        style: {
                                            color: 'var(--color-primary)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 384,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 380,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '13px',
                                                color: 'var(--color-text-dark)',
                                                lineHeight: '1.4',
                                                wordBreak: 'break-word'
                                            },
                                            children: todo.text
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                            lineNumber: 387,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '11px',
                                                color: 'var(--color-text-light)',
                                                marginTop: '2px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "inline w-3 h-3 mr-1",
                                                    style: {
                                                        verticalAlign: 'text-bottom'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                    lineNumber: 389,
                                                    columnNumber: 37
                                                }, this),
                                                formatRelativeDate(todo.createdAt)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                            lineNumber: 388,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 386,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>deleteTodo(todo.id),
                                    className: "opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px'
                                    },
                                    "aria-label": "Delete todo",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "w-3.5 h-3.5",
                                        style: {
                                            color: 'var(--color-text-light)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 399,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 393,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, todo.id, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 375,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 373,
                    columnNumber: 17
                }, this),
                completedTodos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowCompleted(!showCompleted),
                            className: "flex items-center gap-2 w-full mb-2",
                            style: {
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 0'
                            },
                            children: [
                                showCompleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "w-4 h-4",
                                    style: {
                                        color: 'var(--color-text-light)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 413,
                                    columnNumber: 46
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "w-4 h-4",
                                    style: {
                                        color: 'var(--color-text-light)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 413,
                                    columnNumber: 129
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: 'var(--color-text-light)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    },
                                    children: [
                                        "Completed (",
                                        completedTodos.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 414,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 408,
                            columnNumber: 25
                        }, this),
                        showCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                completedTodos.map((todo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "group flex items-start gap-2.5 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]",
                                        style: {
                                            padding: '8px 10px',
                                            opacity: 0.6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleTodo(todo.id),
                                                style: {
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '2px 0 0 0',
                                                    flexShrink: 0
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"], {
                                                    className: "w-[18px] h-[18px]",
                                                    style: {
                                                        color: '#2D6A2D'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                lineNumber: 427,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--color-text-mid)',
                                                    lineHeight: '1.4',
                                                    textDecoration: 'line-through',
                                                    flex: 1,
                                                    wordBreak: 'break-word'
                                                },
                                                children: todo.text
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                lineNumber: 433,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>deleteTodo(todo.id),
                                                className: "opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
                                                style: {
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '2px'
                                                },
                                                "aria-label": "Delete todo",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "w-3.5 h-3.5",
                                                    style: {
                                                        color: 'var(--color-text-light)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                lineNumber: 434,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, todo.id, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 422,
                                        columnNumber: 37
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: clearCompleted,
                                    style: {
                                        fontSize: '12px',
                                        color: '#8B0000',
                                        fontWeight: 500,
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px 10px',
                                        marginTop: '4px'
                                    },
                                    children: "Clear completed"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 444,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 420,
                            columnNumber: 29
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 407,
                    columnNumber: 21
                }, this),
                todos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '20px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-surface-elevated)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: 'var(--color-text-mid)'
                                    },
                                    children: "Progress"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 459,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'var(--color-primary)'
                                    },
                                    children: [
                                        completedTodos.length,
                                        "/",
                                        todos.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 460,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 458,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: '6px',
                                borderRadius: '3px',
                                backgroundColor: 'var(--color-border)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: '100%',
                                    borderRadius: '3px',
                                    backgroundColor: 'var(--color-primary)',
                                    width: `${todos.length > 0 ? completedTodos.length / todos.length * 100 : 0}%`,
                                    transition: 'width 0.3s ease'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 465,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 464,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 457,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
            lineNumber: 342,
            columnNumber: 13
        }, this);
    }
    /* ═══════════════════════════════════════════
       NOTES TAB
       ═══════════════════════════════════════════ */ function renderNotesTab() {
        // Edit / New note view
        if (editingNote) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: 'var(--color-text-dark)'
                                },
                                children: editingNote.id ? 'Edit Note' : 'New Note'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 490,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: cancelEdit,
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4",
                                    style: {
                                        color: 'var(--color-text-light)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 494,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 493,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                        lineNumber: 489,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                value: noteTitle,
                                onChange: (e)=>setNoteTitle(e.target.value),
                                placeholder: "Note title...",
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 600
                                },
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 498,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                value: noteContent,
                                onChange: (e)=>setNoteContent(e.target.value),
                                placeholder: "Write your note...",
                                rows: 8,
                                style: {
                                    fontSize: '13px',
                                    resize: 'vertical'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 505,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--color-text-mid)',
                                            marginBottom: '8px'
                                        },
                                        children: "Color"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 514,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: NOTE_COLORS.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setNoteColor(c.value),
                                                className: "rounded-full transition-all",
                                                style: {
                                                    width: '28px',
                                                    height: '28px',
                                                    backgroundColor: c.bg,
                                                    border: noteColor === c.value ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                                                    cursor: 'pointer',
                                                    boxShadow: noteColor === c.value ? '0 0 0 2px rgba(107,0,0,0.2)' : 'none'
                                                },
                                                title: c.label
                                            }, c.value, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                lineNumber: 517,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 515,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 513,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 pt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: saveNote,
                                        className: "flex-1 text-white",
                                        style: {
                                            backgroundColor: 'var(--color-primary)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "w-4 h-4 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                                lineNumber: 535,
                                                columnNumber: 33
                                            }, this),
                                            "Save Note"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 534,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: cancelEdit,
                                        variant: "outline",
                                        className: "flex-1",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 537,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 533,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                        lineNumber: 497,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                lineNumber: 488,
                columnNumber: 17
            }, this);
        }
        // Notes list view
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            value: searchQuery,
                            onChange: (e)=>setSearchQuery(e.target.value),
                            placeholder: "Search notes...",
                            style: {
                                fontSize: '13px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 549,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: startNewNote,
                            size: "sm",
                            className: "flex-shrink-0 text-white",
                            style: {
                                backgroundColor: 'var(--color-primary)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                lineNumber: 561,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 555,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 548,
                    columnNumber: 17
                }, this),
                filteredNotes.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: "w-10 h-10 mx-auto mb-3",
                            style: {
                                color: 'var(--color-text-light)',
                                opacity: 0.5
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 567,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '14px',
                                color: 'var(--color-text-mid)',
                                fontWeight: 500
                            },
                            children: searchQuery ? 'No notes match your search' : 'No notes yet'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 568,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '12px',
                                color: 'var(--color-text-light)',
                                marginTop: '4px'
                            },
                            children: searchQuery ? 'Try a different search term' : 'Create your first note above'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 571,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 566,
                    columnNumber: 21
                }, this),
                pinnedNotes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "flex items-center gap-1.5 mb-2",
                            style: {
                                fontSize: '11px',
                                fontWeight: 700,
                                color: 'var(--color-text-light)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__["Pin"], {
                                    className: "w-3 h-3"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 581,
                                    columnNumber: 29
                                }, this),
                                "Pinned"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 580,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: pinnedNotes.map((note)=>renderNoteCard(note))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 583,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 579,
                    columnNumber: 21
                }, this),
                unpinnedNotes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        pinnedNotes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-2",
                            style: {
                                fontSize: '11px',
                                fontWeight: 700,
                                color: 'var(--color-text-light)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            },
                            children: "Others"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 593,
                            columnNumber: 29
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: unpinnedNotes.map((note)=>renderNoteCard(note))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 597,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 591,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
            lineNumber: 546,
            columnNumber: 13
        }, this);
    }
    function renderNoteCard(note) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "group rounded-lg cursor-pointer transition-shadow hover:shadow-md",
            style: {
                padding: '12px 14px',
                backgroundColor: getColorBg(note.color),
                border: '1px solid var(--color-border)'
            },
            onClick: ()=>startEditNote(note),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between mb-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            style: {
                                fontSize: '13px',
                                fontWeight: 700,
                                color: 'var(--color-text-dark)',
                                flex: 1,
                                lineHeight: '1.3'
                            },
                            children: note.title || 'Untitled Note'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 619,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        togglePin(note.id);
                                    },
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px'
                                    },
                                    title: note.pinned ? 'Unpin' : 'Pin',
                                    children: note.pinned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PinOff$3e$__["PinOff"], {
                                        className: "w-3.5 h-3.5",
                                        style: {
                                            color: 'var(--color-text-mid)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 628,
                                        columnNumber: 44
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__["Pin"], {
                                        className: "w-3.5 h-3.5",
                                        style: {
                                            color: 'var(--color-text-mid)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 628,
                                        columnNumber: 124
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 623,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        deleteNote(note.id);
                                    },
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px'
                                    },
                                    title: "Delete",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "w-3.5 h-3.5",
                                        style: {
                                            color: 'var(--color-text-light)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                        lineNumber: 635,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                                    lineNumber: 630,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                            lineNumber: 622,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 618,
                    columnNumber: 17
                }, this),
                note.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: '12px',
                        color: 'var(--color-text-mid)',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'pre-wrap'
                    },
                    children: note.content
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 640,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: '11px',
                        color: 'var(--color-text-light)',
                        marginTop: '6px'
                    },
                    children: formatRelativeDate(note.updatedAt)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
                    lineNumber: 648,
                    columnNumber: 17
                }, this)
            ]
        }, note.id, true, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx",
            lineNumber: 608,
            columnNumber: 13
        }, this);
    }
}
_s(NotesPanel, "dt28s7kVEYhz7j2xJjFWL8GkEIw=");
_c = NotesPanel;
var _c;
__turbopack_context__.k.register(_c, "NotesPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/PageLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageLayout",
    ()=>PageLayout,
    "useNotesPanel",
    ()=>useNotesPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$NotesPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/NotesPanel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const NotesPanelContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    notesPanelOpen: false,
    toggleNotesPanel: ()=>{}
});
function useNotesPanel() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(NotesPanelContext);
}
_s(useNotesPanel, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function PageLayout({ children }) {
    _s1();
    const [notesPanelOpen, setNotesPanelOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleNotesPanel = ()=>setNotesPanelOpen((prev)=>!prev);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotesPanelContext.Provider, {
        value: {
            notesPanelOpen,
            toggleNotesPanel
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen",
            style: {
                backgroundColor: 'var(--color-primary-bg)',
                color: 'var(--color-text-dark)',
                paddingTop: '64px' // Account for fixed TopNav height
            },
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$NotesPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotesPanel"], {
                    open: notesPanelOpen,
                    onClose: ()=>setNotesPanelOpen(false)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/PageLayout.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/PageLayout.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/PageLayout.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s1(PageLayout, "1jKY5tnmK3m23WBlhcdAx67SYIY=");
_c = PageLayout;
var _c;
__turbopack_context__.k.register(_c, "PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopNav",
    ()=>TopNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/sticky-note.js [app-client] (ecmascript) <export default as StickyNote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/utils/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/PageLayout.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function TopNav({ breadcrumbs = [], userName: userNameProp, userEmail: userEmailProp, hasUnreadNotifications = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isDropdownOpen, setIsDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { isDark, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const { notesPanelOpen, toggleNotesPanel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotesPanel"])();
    // Read current user from localStorage, fall back to props or defaults
    const currentUser = (()=>{
        try {
            const stored = localStorage.getItem('autograde_current_user');
            if (stored) return JSON.parse(stored);
        } catch  {}
        return null;
    })();
    const userName = userNameProp ?? (currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Dr. Sarah Johnson');
    const userEmail = userEmailProp ?? (currentUser?.email || 'sjohnson@ulm.edu');
    // Get initials from user name (first + last)
    const getInitials = (name)=>{
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
    const handleSignOut = ()=>{
        // Clear session storage
        localStorage.removeItem('autograde_auth');
        localStorage.removeItem('autograde_current_user');
        // Navigate to login
        router.push('/login');
        window.location.reload();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed top-0 left-0 right-0 flex items-center justify-between",
        style: {
            height: '64px',
            backgroundColor: 'var(--color-nav-bg)',
            borderBottom: '1px solid var(--color-border)',
            paddingLeft: '24px',
            paddingRight: '24px',
            zIndex: 1000
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center cursor-pointer",
                onClick: ()=>router.push('/courses'),
                role: "button",
                "aria-label": "Go to courses",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"], {
                        className: "text-white",
                        style: {
                            width: '32px',
                            height: '32px',
                            marginRight: '12px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white",
                        style: {
                            fontSize: '18px',
                            fontWeight: 700,
                            letterSpacing: '0.5px'
                        },
                        children: "AutoGrade"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            breadcrumbs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: breadcrumbs.map((crumb, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "text-white",
                                style: {
                                    width: '12px',
                                    height: '12px',
                                    opacity: 0.5
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                lineNumber: 147,
                                columnNumber: 17
                            }, this),
                            crumb.href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(crumb.href),
                                className: "hover:opacity-100 transition-opacity",
                                style: {
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.75)'
                                },
                                children: crumb.label
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                lineNumber: 157,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.75)'
                                },
                                children: crumb.label
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                lineNumber: 168,
                                columnNumber: 17
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 145,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleTheme,
                        className: "relative hover:opacity-80 transition-opacity",
                        "aria-label": isDark ? 'Switch to light mode' : 'Switch to dark mode',
                        children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                            className: "text-white",
                            style: {
                                width: '22px',
                                height: '22px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                            lineNumber: 191,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                            className: "text-white",
                            style: {
                                width: '22px',
                                height: '22px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "relative hover:opacity-80 transition-opacity",
                        "aria-label": "Notifications",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                className: "text-white",
                                style: {
                                    width: '24px',
                                    height: '24px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            hasUnreadNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute rounded-full",
                                style: {
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: 'var(--color-error)',
                                    top: '0',
                                    right: '0'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleNotesPanel,
                        className: "relative hover:opacity-80 transition-opacity",
                        "aria-label": "Toggle notes panel",
                        style: {
                            background: notesPanelOpen ? 'rgba(255,255,255,0.15)' : 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            padding: '4px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                            className: "text-white",
                            style: {
                                width: '22px',
                                height: '22px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                            lineNumber: 233,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/faculty/calendar'),
                        className: "relative hover:opacity-80 transition-opacity",
                        "aria-label": "Assignment Calendar",
                        style: {
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            padding: '4px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                            className: "text-white",
                            style: {
                                width: '22px',
                                height: '22px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '1px',
                            height: '24px',
                            backgroundColor: 'rgba(255, 255, 255, 0.25)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        open: isDropdownOpen,
                        onOpenChange: setIsDropdownOpen,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                className: "flex items-center gap-3 hover:opacity-90 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-full flex items-center justify-center text-white",
                                        style: {
                                            width: '32px',
                                            height: '32px',
                                            backgroundColor: 'var(--color-gold-accent)',
                                            fontSize: '13px',
                                            fontWeight: 700
                                        },
                                        children: getInitials(userName)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 271,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white truncate",
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            maxWidth: '160px'
                                        },
                                        children: userName
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 285,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "text-white",
                                        style: {
                                            width: '16px',
                                            height: '16px',
                                            opacity: 0.75
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 297,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                style: {
                                    position: 'absolute',
                                    top: '68px',
                                    right: '24px',
                                    width: '220px',
                                    backgroundColor: 'var(--color-surface)',
                                    borderRadius: '12px',
                                    boxShadow: 'var(--shadow-dropdown)',
                                    border: '1px solid var(--color-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        style: {
                                            padding: '16px',
                                            borderBottom: '1px solid var(--color-border)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-full flex items-center justify-center text-white flex-shrink-0",
                                                style: {
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: 'var(--color-gold-accent)',
                                                    fontSize: '14px',
                                                    fontWeight: 700
                                                },
                                                children: getInitials(userName)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 329,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate",
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            color: 'var(--color-text-dark)',
                                                            marginBottom: '2px'
                                                        },
                                                        children: userName
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate",
                                                        style: {
                                                            fontSize: '12px',
                                                            color: 'var(--color-text-light)'
                                                        },
                                                        children: userEmail
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 341,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>router.push('/faculty/settings'),
                                        className: "cursor-pointer",
                                        style: {
                                            padding: '12px 16px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "mr-3",
                                                style: {
                                                    width: '16px',
                                                    height: '16px',
                                                    color: 'var(--color-text-mid)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 371,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '14px',
                                                    color: 'var(--color-text-dark)'
                                                },
                                                children: "Account Settings"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 375,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 366,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>window.open('/help', '_blank'),
                                        className: "cursor-pointer",
                                        style: {
                                            padding: '12px 16px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                className: "mr-3",
                                                style: {
                                                    width: '16px',
                                                    height: '16px',
                                                    color: 'var(--color-text-mid)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 386,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '14px',
                                                    color: 'var(--color-text-dark)'
                                                },
                                                children: "Help & Support"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 390,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 381,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 395,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: handleSignOut,
                                        className: "cursor-pointer",
                                        style: {
                                            padding: '12px 16px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "mr-3",
                                                style: {
                                                    width: '16px',
                                                    height: '16px',
                                                    color: 'var(--color-error)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 403,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '14px',
                                                    color: 'var(--color-error)'
                                                },
                                                children: "Sign Out"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                                lineNumber: 407,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_s(TopNav, "Y5yydjdwszjYL9mlapeR5G684R4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotesPanel"]
    ];
});
_c = TopNav;
var _c;
__turbopack_context__.k.register(_c, "TopNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/users-round.js [app-client] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Sidebar({ activeItem = 'assignments' }) {
    _s();
    const [isCollapsed, setIsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { courseId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    // Safety check - if no courseId, don't crash
    if (!courseId) {
        console.error('Sidebar: courseId is undefined');
        return null;
    }
    const menuItems = [
        {
            id: 'assignments',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            label: 'Assignments',
            path: `/courses/${courseId}`
        },
        {
            id: 'grading',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"],
            label: 'Grading',
            path: `/courses/${courseId}/grading`
        },
        {
            id: 'reports',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
            label: 'Reports',
            path: `/courses/${courseId}/reports`
        },
        {
            id: 'students',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
            label: 'Students',
            path: `/courses/${courseId}/students`
        },
        {
            id: 'groups',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"],
            label: 'Groups',
            path: `/courses/${courseId}/groups`
        },
        {
            id: 'settings',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
            label: 'Settings',
            path: `/courses/${courseId}/settings`
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "border-r h-full transition-all duration-300",
        style: {
            width: isCollapsed ? '64px' : '260px',
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-16 flex items-center border-b",
                style: {
                    padding: isCollapsed ? '0 20px' : '0 24px',
                    borderColor: 'var(--color-border)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setIsCollapsed(!isCollapsed),
                    className: "p-2 rounded hover:bg-[var(--color-primary-bg)] transition-colors",
                    "aria-label": isCollapsed ? 'Expand sidebar' : 'Collapse sidebar',
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                        className: "w-5 h-5",
                        style: {
                            color: 'var(--color-text-dark)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/courses'),
                        className: "w-full flex items-center gap-3 py-3 px-6 transition-colors mb-1",
                        style: {
                            color: 'var(--color-primary)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "w-5 h-5 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 600
                                },
                                children: "All Courses"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            height: '1px',
                            backgroundColor: 'var(--color-border)',
                            margin: '4px 16px 8px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    menuItems.map((item)=>{
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(item.path),
                            className: "w-full flex items-center gap-3 py-3 px-6 transition-colors relative",
                            style: {
                                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-mid)'
                            },
                            children: [
                                isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute left-0 top-0 bottom-0 w-1",
                                    style: {
                                        backgroundColor: 'var(--color-primary)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                                    lineNumber: 98,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "w-5 h-5 flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this),
                                !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '14px',
                                        fontWeight: isActive ? 500 : 400
                                    },
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                                    lineNumber: 107,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "vqktK6Qn6JFd5u7JCiUldF/Y4HE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Dialog;
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = DialogTrigger;
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = DialogPortal;
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c3 = DialogClose;
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c4 = DialogOverlay;
function DialogContent({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c5 = DialogContent;
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_c6 = DialogHeader;
function DialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c7 = DialogFooter;
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c8 = DialogTitle;
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
_c9 = DialogDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogPortal");
__turbopack_context__.k.register(_c3, "DialogClose");
__turbopack_context__.k.register(_c4, "DialogOverlay");
__turbopack_context__.k.register(_c5, "DialogContent");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/utils/studentData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* ═══════════════════════════════════════════════════════════════════
   SHARED STUDENT DATA — Single source of truth for the entire app
   ═══════════════════════════════════════════════════════════════════ */ /* ── Types ── */ __turbopack_context__.s([
    "ASSIGNMENTS",
    ()=>ASSIGNMENTS,
    "COURSE_STUDENT_COUNTS",
    ()=>COURSE_STUDENT_COUNTS,
    "FEEDBACK_POOL",
    ()=>FEEDBACK_POOL,
    "RUBRIC_CRITERIA",
    ()=>RUBRIC_CRITERIA,
    "SECTION_MAP",
    ()=>SECTION_MAP,
    "STUDENT_SEEDS",
    ()=>STUDENT_SEEDS,
    "TOTAL_MAX",
    ()=>TOTAL_MAX,
    "getStudentCountForCourse",
    ()=>getStudentCountForCourse,
    "getStudentsForCourse",
    ()=>getStudentsForCourse,
    "gradeColor",
    ()=>gradeColor,
    "hashStr",
    ()=>hashStr,
    "letterGrade",
    ()=>letterGrade,
    "ordinal",
    ()=>ordinal,
    "pctColor",
    ()=>pctColor
]);
const COURSE_STUDENT_COUNTS = {
    'cs-1001': 42,
    'cs-2050': 35,
    'cs-3100': 28,
    'cs-4200': 18,
    'cs-1001-fall': 38,
    'cs-3500': 22
};
function getStudentCountForCourse(courseId) {
    if (COURSE_STUDENT_COUNTS[courseId]) return COURSE_STUDENT_COUNTS[courseId];
    try {
        const stored = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const found = stored.find((c)=>c.id === courseId);
        if (found && found.students && found.students > 0) return Math.min(found.students, STUDENT_SEEDS.length);
    } catch  {}
    return 0;
}
const SECTION_MAP = {
    'cs-1001': 'Spring 2026 - 64251',
    'cs-2050': 'Spring 2026 - 64252',
    'cs-3100': 'Spring 2026 - 64253',
    'cs-4200': 'Spring 2026 - 64254',
    'cs-1001-fall': 'Fall 2025 - 52180',
    'cs-3500': 'Spring 2026 - 64255'
};
const ASSIGNMENTS = [
    {
        id: 'hw1',
        shortName: 'HW1',
        fullName: 'HW1: Variables & Data Types',
        category: 'Homework',
        maxPoints: 100,
        dueDate: '2026-01-31'
    },
    {
        id: 'hw2',
        shortName: 'HW2',
        fullName: 'HW2: Control Flow',
        category: 'Homework',
        maxPoints: 100,
        dueDate: '2026-02-07'
    },
    {
        id: 'hw3',
        shortName: 'HW3',
        fullName: 'HW3: Functions & Modules',
        category: 'Homework',
        maxPoints: 100,
        dueDate: '2026-02-14'
    },
    {
        id: 'hw4',
        shortName: 'HW4',
        fullName: 'HW4: OOP Basics',
        category: 'Homework',
        maxPoints: 100,
        dueDate: '2026-02-21',
        isGroup: true
    },
    {
        id: 'hw5',
        shortName: 'HW5',
        fullName: 'HW5: File I/O',
        category: 'Homework',
        maxPoints: 100,
        dueDate: '2026-02-28',
        isGroup: true
    },
    {
        id: 'hw6',
        shortName: 'HW6',
        fullName: 'HW6: Error Handling',
        category: 'Homework',
        maxPoints: 100,
        dueDate: '2026-03-07'
    },
    {
        id: 'q1',
        shortName: 'Quiz 1',
        fullName: 'Quiz 1: Fundamentals',
        category: 'Quiz',
        maxPoints: 50,
        dueDate: '2026-02-10'
    },
    {
        id: 'q2',
        shortName: 'Quiz 2',
        fullName: 'Quiz 2: Functions & OOP',
        category: 'Quiz',
        maxPoints: 50,
        dueDate: '2026-02-24'
    },
    {
        id: 'mid',
        shortName: 'Midterm',
        fullName: 'Midterm Exam',
        category: 'Exam',
        maxPoints: 150,
        dueDate: '2026-03-01'
    },
    {
        id: 'final',
        shortName: 'Final',
        fullName: 'Final Exam',
        category: 'Exam',
        maxPoints: 150,
        dueDate: '2026-04-25'
    }
];
const TOTAL_MAX = ASSIGNMENTS.reduce(_c = (s, a)=>s + a.maxPoints, 0); // 1000
_c1 = TOTAL_MAX;
const STUDENT_SEEDS = [
    {
        fn: 'James',
        ln: 'Anderson',
        id: '4790',
        sis: '30154740',
        login: 'andersonj',
        base: 87.5
    },
    {
        fn: 'Michael',
        ln: 'Brooks',
        id: '2478',
        sis: '30155679',
        login: 'brooksm',
        base: 88.3
    },
    {
        fn: 'William',
        ln: 'Carter',
        id: '4842',
        sis: '30155241',
        login: 'carterw',
        base: 91.8
    },
    {
        fn: 'David',
        ln: 'Chen',
        id: '2400',
        sis: '30161748',
        login: 'chend',
        base: 83.8
    },
    {
        fn: 'Robert',
        ln: 'Davis',
        id: '4901',
        sis: '30153512',
        login: 'davisr',
        base: 81.7
    },
    {
        fn: 'Daniel',
        ln: 'Edwards',
        id: '4948',
        sis: '30156286',
        login: 'edwardsd',
        base: 89.0
    },
    {
        fn: 'Matthew',
        ln: 'Fisher',
        id: '4562',
        sis: '30146118',
        login: 'fisherm',
        base: 88.1
    },
    {
        fn: 'Andrew',
        ln: 'Garcia',
        id: '4772',
        sis: '30154647',
        login: 'garciaa',
        base: 89.5
    },
    {
        fn: 'Emily',
        ln: 'Harris',
        id: '4615',
        sis: '30157892',
        login: 'harrise',
        base: 94.2
    },
    {
        fn: 'Christopher',
        ln: 'Jackson',
        id: '3291',
        sis: '30158234',
        login: 'jacksonc',
        base: 76.4
    },
    {
        fn: 'Ryan',
        ln: 'Kim',
        id: '4103',
        sis: '30159467',
        login: 'kimr',
        base: 82.5
    },
    {
        fn: 'Brandon',
        ln: 'Lopez',
        id: '3856',
        sis: '30160123',
        login: 'lopezb',
        base: 91.0
    },
    {
        fn: 'Justin',
        ln: 'Martinez',
        id: '4234',
        sis: '30161456',
        login: 'martinezj',
        base: 78.3
    },
    {
        fn: 'Tyler',
        ln: 'Nelson',
        id: '3567',
        sis: '30162789',
        login: 'nelsont',
        base: 85.6
    },
    {
        fn: 'Nathan',
        ln: 'Ortiz',
        id: '4089',
        sis: '30163012',
        login: 'ortizn',
        base: 72.1
    },
    {
        fn: 'Kevin',
        ln: 'Patel',
        id: '3945',
        sis: '30164345',
        login: 'patelk',
        base: 90.3
    },
    {
        fn: 'Jason',
        ln: 'Quinn',
        id: '4678',
        sis: '30165678',
        login: 'quinnj',
        base: 86.7
    },
    {
        fn: 'Aaron',
        ln: 'Robinson',
        id: '3412',
        sis: '30166901',
        login: 'robinsona',
        base: 68.5
    },
    {
        fn: 'Samuel',
        ln: 'Stewart',
        id: '4567',
        sis: '30168234',
        login: 'stewarts',
        base: 93.4
    },
    {
        fn: 'Derek',
        ln: 'Thompson',
        id: '3789',
        sis: '30169567',
        login: 'thompsond',
        base: 79.8
    },
    {
        fn: 'Brian',
        ln: 'Alvarez',
        id: '4821',
        sis: '30170234',
        login: 'alvarezb',
        base: 84.2
    },
    {
        fn: 'Patrick',
        ln: 'Bennett',
        id: '3654',
        sis: '30171567',
        login: 'bennettp',
        base: 77.9
    },
    {
        fn: 'Ethan',
        ln: 'Clark',
        id: '4912',
        sis: '30172890',
        login: 'clarke',
        base: 86.1
    },
    {
        fn: 'Jordan',
        ln: 'Diaz',
        id: '3478',
        sis: '30174123',
        login: 'diazj',
        base: 90.7
    },
    {
        fn: 'Kyle',
        ln: 'Evans',
        id: '4156',
        sis: '30175456',
        login: 'evansk',
        base: 73.5
    },
    {
        fn: 'Connor',
        ln: 'Foster',
        id: '3890',
        sis: '30176789',
        login: 'fosterc',
        base: 88.9
    },
    {
        fn: 'Sean',
        ln: 'Gray',
        id: '4267',
        sis: '30178012',
        login: 'grays',
        base: 81.3
    },
    {
        fn: 'Trevor',
        ln: 'Hill',
        id: '3523',
        sis: '30179345',
        login: 'hillt',
        base: 75.8
    },
    {
        fn: 'Marcus',
        ln: 'Ingram',
        id: '4689',
        sis: '30180678',
        login: 'ingramm',
        base: 92.1
    },
    {
        fn: 'Dylan',
        ln: 'Johnson',
        id: '3345',
        sis: '30181901',
        login: 'johnsond',
        base: 70.4
    },
    {
        fn: 'Caleb',
        ln: 'King',
        id: '4534',
        sis: '30183234',
        login: 'kingc',
        base: 87.3
    },
    {
        fn: 'Logan',
        ln: 'Lee',
        id: '3712',
        sis: '30184567',
        login: 'leel',
        base: 83.0
    },
    {
        fn: 'Austin',
        ln: 'Mitchell',
        id: '4445',
        sis: '30185890',
        login: 'mitchella',
        base: 91.5
    },
    {
        fn: 'Gavin',
        ln: 'Nguyen',
        id: '3267',
        sis: '30187123',
        login: 'nguyeng',
        base: 78.6
    },
    {
        fn: 'Owen',
        ln: 'Parker',
        id: '4578',
        sis: '30188456',
        login: 'parkero',
        base: 85.0
    },
    {
        fn: 'Cole',
        ln: 'Reed',
        id: '3901',
        sis: '30189789',
        login: 'reedc',
        base: 80.2
    },
    {
        fn: 'Grant',
        ln: 'Scott',
        id: '4134',
        sis: '30191012',
        login: 'scottg',
        base: 74.7
    },
    {
        fn: 'Blake',
        ln: 'Turner',
        id: '3678',
        sis: '30192345',
        login: 'turnerb',
        base: 89.4
    },
    {
        fn: 'Ian',
        ln: 'Walker',
        id: '4356',
        sis: '30193678',
        login: 'walkeri',
        base: 82.8
    },
    {
        fn: 'Chase',
        ln: 'White',
        id: '3145',
        sis: '30194901',
        login: 'whitec',
        base: 76.1
    },
    {
        fn: 'Luke',
        ln: 'Young',
        id: '4723',
        sis: '30196234',
        login: 'youngl',
        base: 87.6
    },
    {
        fn: 'Mason',
        ln: 'Zimmerman',
        id: '3456',
        sis: '30197567',
        login: 'zimmermanm',
        base: 83.4
    }
];
function hashStr(s) {
    let h = 0;
    for(let i = 0; i < s.length; i++){
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}
/* ── Grade computation for a single student across all assignments ── */ function computeGrades(seedId, base) {
    const grades = {};
    const lateFlags = {};
    ASSIGNMENTS.forEach((a)=>{
        const h = hashStr(seedId + ':' + a.id);
        const variation = h % 25 - 12;
        const pct = Math.min(100, Math.max(15, base + variation));
        // ~5% chance of missing for non-Exam assignments
        const missH = hashStr(seedId + ':miss:' + a.id);
        if (missH % 100 < 5 && a.category !== 'Exam') {
            grades[a.id] = null;
        } else {
            grades[a.id] = Math.round(a.maxPoints * pct / 100);
        }
        lateFlags[a.id] = hashStr(seedId + ':late:' + a.id) % 10 === 0;
    });
    return {
        grades,
        lateFlags
    };
}
/* ── Cache ── */ const courseCache = {};
function getStudentsForCourse(courseId) {
    if (courseCache[courseId]) return courseCache[courseId];
    const count = getStudentCountForCourse(courseId);
    const section = SECTION_MAP[courseId] || 'Spring 2026 - 64251';
    const seeds = STUDENT_SEEDS.slice(0, count);
    const students = seeds.map((s, idx)=>{
        const { grades, lateFlags } = computeGrades(s.id, s.base);
        // Compute aggregate stats
        let earned = 0;
        let possible = 0;
        let submitted = 0;
        ASSIGNMENTS.forEach((a)=>{
            possible += a.maxPoints;
            if (grades[a.id] !== null && grades[a.id] !== undefined) {
                earned += grades[a.id];
                submitted++;
            }
        });
        const avgGrade = possible > 0 ? Math.round(earned / possible * 100) : 0;
        // Deterministic trend & lastActive
        const trendH = hashStr(s.id + ':trend');
        const trends = [
            'up',
            'down',
            'stable'
        ];
        const trend = trends[trendH % 3];
        const dayOffset = hashStr(s.id + ':active') % 10;
        const lastActive = `2026-02-${String(10 + dayOffset).padStart(2, '0')}`;
        return {
            id: s.id,
            firstName: s.fn,
            lastName: s.ln,
            name: `${s.fn} ${s.ln}`,
            studentId: `S${20230001 + idx}`,
            sisUserId: s.sis,
            sisLoginId: s.login,
            email: `${s.login}@warhawks.ulm.edu`,
            avatarInitials: `${s.fn[0]}${s.ln[0]}`,
            enrollmentDate: '2026-01-15',
            section,
            baseGrade: s.base,
            avgGrade,
            trend,
            lastActive,
            submissions: submitted,
            grades,
            lateFlags
        };
    });
    courseCache[courseId] = students;
    return students;
}
function gradeColor(earned, max) {
    if (max === 0) return '#8A8A8A';
    const pct = earned / max * 100;
    if (pct >= 90) return '#2D6A2D';
    if (pct >= 80) return '#6B0000';
    if (pct >= 70) return '#8A5700';
    return '#8B0000';
}
function pctColor(pct) {
    if (pct >= 90) return '#2D6A2D';
    if (pct >= 80) return '#6B0000';
    if (pct >= 70) return '#8A5700';
    return '#8B0000';
}
function letterGrade(pct) {
    if (pct >= 93) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 77) return 'C+';
    if (pct >= 73) return 'C';
    if (pct >= 70) return 'C-';
    if (pct >= 67) return 'D+';
    if (pct >= 60) return 'D';
    return 'F';
}
function ordinal(n) {
    if (n % 100 >= 11 && n % 100 <= 13) return n + 'th';
    if (n % 10 === 1) return n + 'st';
    if (n % 10 === 2) return n + 'nd';
    if (n % 10 === 3) return n + 'rd';
    return n + 'th';
}
const RUBRIC_CRITERIA = [
    {
        name: 'Code Correctness',
        weight: 40
    },
    {
        name: 'Code Style',
        weight: 20
    },
    {
        name: 'Documentation',
        weight: 20
    },
    {
        name: 'Efficiency',
        weight: 20
    }
];
const FEEDBACK_POOL = [
    'Excellent work! Clean and well-documented code.',
    'Good effort. Consider adding more edge case handling.',
    'Solid submission. Code style could be improved with consistent formatting.',
    'Great job on the logic! Minor issues with variable naming conventions.',
    'Well-structured code. Documentation needs more detail on complex functions.',
    'Good understanding of concepts. Some room for optimization in inner loops.',
    'Strong performance overall. Keep up the good work!',
    'Needs improvement in error handling — consider try/catch blocks.'
];
var _c, _c1;
__turbopack_context__.k.register(_c, "TOTAL_MAX$ASSIGNMENTS.reduce");
__turbopack_context__.k.register(_c1, "TOTAL_MAX");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CourseInterior",
    ()=>CourseInterior
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardX$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/clipboard-x.js [app-client] (ecmascript) <export default as ClipboardX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FilterX$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/funnel-x.js [app-client] (ecmascript) <export default as FilterX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/archive.js [app-client] (ecmascript) <export default as Archive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$TopNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/PageLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/utils/studentData.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
const cs1 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COURSE_STUDENT_COUNTS"]['cs-1001'];
const cs2 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COURSE_STUDENT_COUNTS"]['cs-2050'];
const cs3 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COURSE_STUDENT_COUNTS"]['cs-3100'];
const cs4 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COURSE_STUDENT_COUNTS"]['cs-4200'];
const mockAssignmentsByCourse = {
    'cs-1001': [
        {
            id: 'a1',
            name: 'Hello World Program',
            language: 'Python',
            dueDate: '2026-02-24',
            submissions: cs1,
            totalStudents: cs1,
            gradedCount: cs1,
            published: true
        },
        {
            id: 'a2',
            name: 'Variables and Data Types',
            language: 'Python',
            dueDate: '2026-03-03',
            submissions: Math.round(cs1 * 0.9),
            totalStudents: cs1,
            gradedCount: Math.round(cs1 * 0.71),
            published: true
        },
        {
            id: 'a3',
            name: 'Control Flow: Loops',
            language: 'Python',
            dueDate: '2026-03-10',
            submissions: Math.round(cs1 * 0.83),
            totalStudents: cs1,
            gradedCount: Math.round(cs1 * 0.48),
            published: true
        },
        {
            id: 'a4',
            name: 'Functions and Modules',
            language: 'Python',
            dueDate: '2026-03-17',
            submissions: Math.round(cs1 * 0.29),
            totalStudents: cs1,
            gradedCount: 0,
            published: true
        },
        {
            id: 'a5',
            name: 'Object-Oriented Programming',
            language: 'Python',
            dueDate: '2026-03-24',
            submissions: 0,
            totalStudents: cs1,
            gradedCount: 0,
            published: false
        }
    ],
    'cs-2050': [
        {
            id: 'ds1',
            name: 'Linked List Implementation',
            language: 'Java',
            dueDate: '2026-02-26',
            submissions: Math.round(cs2 * 0.86),
            totalStudents: cs2,
            gradedCount: Math.round(cs2 * 0.8),
            published: true
        },
        {
            id: 'ds2',
            name: 'Binary Search Trees',
            language: 'Java',
            dueDate: '2026-03-05',
            submissions: Math.round(cs2 * 0.71),
            totalStudents: cs2,
            gradedCount: Math.round(cs2 * 0.43),
            published: true
        },
        {
            id: 'ds3',
            name: 'Graph Algorithms',
            language: 'Java',
            dueDate: '2026-03-19',
            submissions: 0,
            totalStudents: cs2,
            gradedCount: 0,
            published: true
        }
    ],
    'cs-3100': [
        {
            id: 'se1',
            name: 'Requirements Document',
            language: 'Markdown',
            dueDate: '2026-02-28',
            submissions: Math.round(cs3 * 0.93),
            totalStudents: cs3,
            gradedCount: Math.round(cs3 * 0.86),
            published: true
        },
        {
            id: 'se2',
            name: 'System Design Diagram',
            language: 'UML',
            dueDate: '2026-03-12',
            submissions: Math.round(cs3 * 0.36),
            totalStudents: cs3,
            gradedCount: 0,
            published: true
        },
        {
            id: 'se3',
            name: 'Sprint Review Presentation',
            language: 'Presentation',
            dueDate: '2026-03-26',
            submissions: 0,
            totalStudents: cs3,
            gradedCount: 0,
            published: false
        }
    ],
    'cs-4200': [
        {
            id: 'wd1',
            name: 'React Portfolio App',
            language: 'TypeScript',
            dueDate: '2026-03-07',
            submissions: Math.round(cs4 * 0.78),
            totalStudents: cs4,
            gradedCount: Math.round(cs4 * 0.56),
            published: true
        },
        {
            id: 'wd2',
            name: 'REST API Project',
            language: 'TypeScript',
            dueDate: '2026-03-21',
            submissions: 0,
            totalStudents: cs4,
            gradedCount: 0,
            published: true
        }
    ]
};
function loadCreatedAssignments(courseId) {
    try {
        const stored = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
        return stored.filter((a)=>a.courseId === courseId).map((a)=>({
                id: a.id,
                name: a.name,
                language: a.language,
                dueDate: a.dueDate,
                submissions: a.submissions ?? 0,
                totalStudents: a.totalStudents ?? 0,
                gradedCount: a.gradedCount ?? 0,
                published: a.published ?? false,
                courseId: a.courseId
            }));
    } catch  {
        return [];
    }
}
function getAllAssignments(courseId) {
    const mock = mockAssignmentsByCourse[courseId] || [];
    return [
        ...mock,
        ...loadCreatedAssignments(courseId)
    ];
}
function saveCreatedAssignments(assignments, courseId) {
    try {
        const all = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
        const otherCourses = all.filter((a)=>a.courseId !== courseId);
        const thisCourse = assignments.filter((a)=>a.courseId === courseId).map((a)=>({
                ...a,
                courseId
            }));
        localStorage.setItem('createdAssignments', JSON.stringify([
            ...otherCourses,
            ...thisCourse
        ]));
    } catch  {}
}
// Current date for overdue logic
const NOW = new Date('2026-02-19');
function getNeedsGrade(a) {
    return a.submissions - a.gradedCount;
}
function getStatus(a) {
    if (!a.published) return 'draft';
    const needsGrade = getNeedsGrade(a);
    if (needsGrade === 0 && a.submissions > 0) return 'graded';
    if (new Date(a.dueDate) < NOW && needsGrade === 0) return 'closed';
    return 'open';
}
function getSubmittedPct(a) {
    if (a.totalStudents === 0) return 0;
    return Math.round(a.submissions / a.totalStudents * 100);
}
function isOverdue(a) {
    const status = getStatus(a);
    return new Date(a.dueDate) < NOW && status === 'open' && getNeedsGrade(a) > 0;
}
const STATUS_ORDER = {
    open: 0,
    graded: 1,
    draft: 2,
    closed: 3
};
function lookupCourse(courseId) {
    try {
        const stored = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const found = stored.find((c)=>c.id === courseId);
        if (found) return {
            code: found.code,
            title: found.title
        };
    } catch  {}
    return {
        code: courseId,
        title: ''
    };
}
function CourseInterior() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { courseId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const courseInfo = lookupCourse(courseId ?? '');
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [_showGradingModal, _setShowGradingModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dueDate');
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('asc');
    const [deleteTarget, setDeleteTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [duplicateTarget, setDuplicateTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [assignments, setAssignments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CourseInterior.useState": ()=>getAllAssignments(courseId ?? '')
    }["CourseInterior.useState"]);
    const handleDeleteAssignment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CourseInterior.useCallback[handleDeleteAssignment]": ()=>{
            if (!deleteTarget || !courseId) return;
            const updated = assignments.filter({
                "CourseInterior.useCallback[handleDeleteAssignment].updated": (a)=>a.id !== deleteTarget.id
            }["CourseInterior.useCallback[handleDeleteAssignment].updated"]);
            setAssignments(updated);
            // Only user-created assignments are in localStorage; mock ones just get filtered from state
            const userCreated = updated.filter({
                "CourseInterior.useCallback[handleDeleteAssignment].userCreated": (a)=>a.courseId === courseId
            }["CourseInterior.useCallback[handleDeleteAssignment].userCreated"]);
            saveCreatedAssignments(userCreated, courseId);
            setDeleteTarget(null);
        }
    }["CourseInterior.useCallback[handleDeleteAssignment]"], [
        deleteTarget,
        assignments,
        courseId
    ]);
    const handleDuplicateAssignment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CourseInterior.useCallback[handleDuplicateAssignment]": ()=>{
            if (!duplicateTarget || !courseId) return;
            const copy = {
                ...duplicateTarget,
                id: `a-${Date.now()}`,
                name: `${duplicateTarget.name} (Copy)`,
                published: false,
                submissions: 0,
                gradedCount: 0,
                courseId
            };
            const updated = [
                ...assignments,
                copy
            ];
            setAssignments(updated);
            // Persist the new copy
            try {
                const existing = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
                existing.push(copy);
                localStorage.setItem('createdAssignments', JSON.stringify(existing));
            } catch  {}
            setDuplicateTarget(null);
        }
    }["CourseInterior.useCallback[handleDuplicateAssignment]"], [
        duplicateTarget,
        assignments,
        courseId
    ]);
    if (!courseId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageLayout"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$TopNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopNav"], {
                    breadcrumbs: [
                        {
                            label: 'Courses',
                            href: '/courses'
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    style: {
                        minHeight: 'calc(100vh - 64px)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: 'var(--color-primary)',
                                    marginBottom: '16px'
                                },
                                children: "Course Not Found"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '14px',
                                    color: 'var(--color-text-mid)',
                                    marginBottom: '24px'
                                },
                                children: "The course ID is missing or invalid."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>router.push('/courses'),
                                className: "text-white",
                                style: {
                                    backgroundColor: 'var(--color-primary)'
                                },
                                children: "Back to Courses"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 198,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
            lineNumber: 188,
            columnNumber: 7
        }, this);
    }
    // Derived counts for tabs
    const tabCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CourseInterior.useMemo[tabCounts]": ()=>{
            const all = assignments.length;
            const open = assignments.filter({
                "CourseInterior.useMemo[tabCounts]": (a)=>getStatus(a) === 'open'
            }["CourseInterior.useMemo[tabCounts]"]).length;
            const totalNeedsGrade = assignments.reduce({
                "CourseInterior.useMemo[tabCounts].totalNeedsGrade": (s, a)=>s + getNeedsGrade(a)
            }["CourseInterior.useMemo[tabCounts].totalNeedsGrade"], 0);
            const graded = assignments.filter({
                "CourseInterior.useMemo[tabCounts]": (a)=>getStatus(a) === 'graded'
            }["CourseInterior.useMemo[tabCounts]"]).length;
            const draft = assignments.filter({
                "CourseInterior.useMemo[tabCounts]": (a)=>getStatus(a) === 'draft'
            }["CourseInterior.useMemo[tabCounts]"]).length;
            return {
                all,
                open,
                totalNeedsGrade,
                graded,
                draft
            };
        }
    }["CourseInterior.useMemo[tabCounts]"], [
        assignments
    ]);
    const tabs = [
        {
            id: 'all',
            label: 'All',
            count: tabCounts.all
        },
        {
            id: 'open',
            label: 'Open',
            count: tabCounts.open
        },
        {
            id: 'pending',
            label: 'Pending Grading',
            count: tabCounts.totalNeedsGrade
        },
        {
            id: 'graded',
            label: 'Graded',
            count: tabCounts.graded
        },
        {
            id: 'draft',
            label: 'Drafts',
            count: tabCounts.draft
        }
    ];
    // Filter
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CourseInterior.useMemo[filtered]": ()=>{
            return assignments.filter({
                "CourseInterior.useMemo[filtered]": (a)=>{
                    const status = getStatus(a);
                    if (activeTab === 'open' && status !== 'open') return false;
                    if (activeTab === 'pending' && getNeedsGrade(a) === 0) return false;
                    if (activeTab === 'graded' && status !== 'graded') return false;
                    if (activeTab === 'draft' && status !== 'draft') return false;
                    if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        return a.name.toLowerCase().includes(q) || a.language.toLowerCase().includes(q);
                    }
                    return true;
                }
            }["CourseInterior.useMemo[filtered]"]);
        }
    }["CourseInterior.useMemo[filtered]"], [
        activeTab,
        searchQuery
    ]);
    // Sort
    const sorted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CourseInterior.useMemo[sorted]": ()=>{
            return [
                ...filtered
            ].sort({
                "CourseInterior.useMemo[sorted]": (a, b)=>{
                    let cmp = 0;
                    switch(sortField){
                        case 'name':
                            cmp = a.name.localeCompare(b.name);
                            break;
                        case 'language':
                            cmp = a.language.localeCompare(b.language);
                            break;
                        case 'dueDate':
                            cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                            break;
                        case 'submitted':
                            cmp = getSubmittedPct(a) - getSubmittedPct(b);
                            break;
                        case 'needsGrade':
                            cmp = getNeedsGrade(a) - getNeedsGrade(b);
                            break;
                        case 'status':
                            cmp = (STATUS_ORDER[getStatus(a)] ?? 9) - (STATUS_ORDER[getStatus(b)] ?? 9);
                            break;
                    }
                    return sortOrder === 'asc' ? cmp : -cmp;
                }
            }["CourseInterior.useMemo[sorted]"]);
        }
    }["CourseInterior.useMemo[sorted]"], [
        filtered,
        sortField,
        sortOrder
    ]);
    const handleSort = (field)=>{
        if (sortField === field) {
            setSortOrder((prev)=>prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };
    const SortIcon = ({ field })=>{
        if (sortField !== field) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "w-3.5 h-3.5 opacity-30"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
            lineNumber: 267,
            columnNumber: 37
        }, this);
        return sortOrder === 'asc' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "w-3.5 h-3.5",
            style: {
                color: 'var(--color-primary)'
            }
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
            lineNumber: 269,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "w-3.5 h-3.5",
            style: {
                color: 'var(--color-primary)'
            }
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
            lineNumber: 270,
            columnNumber: 9
        }, this);
    };
    // Status badge per spec: pill shape, light bg + colored text
    const getStatusBadge = (status)=>{
        const cfg = {
            draft: {
                bg: '#F5F5F5',
                text: '#595959'
            },
            open: {
                bg: '#E8F0FF',
                text: '#1A4D7A'
            },
            graded: {
                bg: '#E8F5E8',
                text: '#2D6A2D'
            },
            closed: {
                bg: '#F0F0F0',
                text: '#8A8A8A'
            }
        };
        const s = cfg[status];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                display: 'inline-block',
                backgroundColor: s.bg,
                color: s.text,
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '12px',
                lineHeight: '14px',
                letterSpacing: '0.5px'
            },
            children: status
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
            lineNumber: 283,
            columnNumber: 7
        }, this);
    };
    // Language chip: neutral gray pill
    const getLanguageChip = (language)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                display: 'inline-block',
                backgroundColor: '#F5F5F5',
                color: '#2D2D2D',
                fontSize: '12px',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: '12px'
            },
            children: language
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
            lineNumber: 304,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageLayout"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$TopNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopNav"], {
                breadcrumbs: [
                    {
                        label: 'Courses',
                        href: '/courses'
                    },
                    {
                        label: courseInfo.code || 'Course'
                    },
                    {
                        label: 'Assignments'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-[calc(100vh-64px)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                        activeItem: "assignments"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-auto p-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                style: {
                                                    fontSize: '28px',
                                                    fontWeight: 700,
                                                    lineHeight: '36px',
                                                    color: 'var(--color-text-dark)'
                                                },
                                                children: "Assignments"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 334,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '14px',
                                                    color: 'var(--color-text-mid)',
                                                    marginTop: '8px'
                                                },
                                                children: [
                                                    assignments.length,
                                                    " assignments · ",
                                                    courseInfo.code,
                                                    " ",
                                                    courseInfo.title
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 337,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "p-2 rounded-lg hover:bg-[var(--color-primary-bg)] transition-colors",
                                                "aria-label": "Refresh data",
                                                title: "Refresh data",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "w-4.5 h-4.5 text-[var(--color-text-mid)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 342,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: ()=>router.push(`/courses/${courseId}/assignment/new`),
                                                className: "text-white hover:opacity-90 transition-opacity",
                                                style: {
                                                    backgroundColor: 'var(--color-primary)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "w-4 h-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 17
                                                    }, this),
                                                    "New Assignment"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 349,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative max-w-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            placeholder: "Search assignments...",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            className: "pl-10 border-[var(--color-border)]"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                            lineNumber: 364,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 361,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1 mb-6 border-b-2",
                                style: {
                                    borderColor: 'var(--color-border)'
                                },
                                children: tabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab(tab.id),
                                        className: "px-4 py-3 transition-colors relative flex items-center gap-2",
                                        style: {
                                            color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                            fontSize: '14px',
                                            fontWeight: activeTab === tab.id ? 600 : 400
                                        },
                                        children: [
                                            tab.label,
                                            tab.count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                                                    color: activeTab === tab.id ? '#fff' : 'var(--color-text-mid)',
                                                    padding: '1px 7px',
                                                    borderRadius: '10px',
                                                    lineHeight: '16px'
                                                },
                                                children: tab.count
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 388,
                                                columnNumber: 19
                                            }, this),
                                            activeTab === tab.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bottom-0 left-0 right-0",
                                                style: {
                                                    height: '2px',
                                                    backgroundColor: 'var(--color-primary)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, tab.id, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this),
                            assignments.length === 0 ? /* Empty State: No Assignments at all */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardX$3e$__["ClipboardX"], {
                                        className: "w-16 h-16 mx-auto mb-4",
                                        style: {
                                            color: '#D9D9D9'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 416,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            color: 'var(--color-text-dark)',
                                            marginBottom: '8px'
                                        },
                                        children: "No Assignments Yet"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 417,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '14px',
                                            color: 'var(--color-text-mid)',
                                            marginBottom: '24px'
                                        },
                                        children: "Create your first assignment to get started."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 420,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: ()=>router.push(`/courses/${courseId}/assignment/new`),
                                        className: "text-white hover:opacity-90 transition-opacity",
                                        style: {
                                            backgroundColor: 'var(--color-primary)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 428,
                                                columnNumber: 17
                                            }, this),
                                            "New Assignment"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 423,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 415,
                                columnNumber: 13
                            }, this) : sorted.length === 0 ? /* Empty State: No Filter Results */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FilterX$3e$__["FilterX"], {
                                        className: "w-12 h-12 mx-auto mb-4",
                                        style: {
                                            color: '#D9D9D9'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 435,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            color: 'var(--color-text-dark)',
                                            marginBottom: '8px'
                                        },
                                        children: [
                                            "No ",
                                            tabs.find((t)=>t.id === activeTab)?.label,
                                            " Assignments"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 436,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '14px',
                                            color: 'var(--color-text-mid)',
                                            marginBottom: '16px'
                                        },
                                        children: "Try selecting a different filter."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 439,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setActiveTab('all');
                                            setSearchQuery('');
                                        },
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: 'var(--color-primary)'
                                        },
                                        className: "hover:underline",
                                        children: "Clear filters"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                        lineNumber: 442,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg overflow-hidden",
                                style: {
                                    backgroundColor: 'var(--color-surface)',
                                    boxShadow: 'var(--shadow-card)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            style: {
                                                backgroundColor: 'var(--color-primary-bg)',
                                                borderBottom: '1px solid var(--color-border)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "text-left px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('name'),
                                                            className: "flex items-center gap-1.5",
                                                            style: {
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                "Assignment Name ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                    field: "name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 456,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 455,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "text-left px-5 py-4 hidden md:table-cell",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('language'),
                                                            className: "flex items-center gap-1.5",
                                                            style: {
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                "Language ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                    field: "language"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                    lineNumber: 462,
                                                                    columnNumber: 34
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 460,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "text-left px-5 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('dueDate'),
                                                            className: "flex items-center gap-1.5",
                                                            style: {
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                "Due Date ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                    field: "dueDate"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 34
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 466,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 465,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "text-left px-5 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('submitted'),
                                                            className: "flex items-center gap-1.5",
                                                            style: {
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                "Submitted ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                    field: "submitted"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                    lineNumber: 472,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 471,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "text-left px-5 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('needsGrade'),
                                                            className: "flex items-center gap-1.5",
                                                            style: {
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                "Needs Grade ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                    field: "needsGrade"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                    lineNumber: 477,
                                                                    columnNumber: 37
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 476,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 475,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "text-left px-5 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('status'),
                                                            className: "flex items-center gap-1.5",
                                                            style: {
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                "Status ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                    field: "status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                    lineNumber: 482,
                                                                    columnNumber: 32
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 481,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 480,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "text-left px-5 py-4",
                                                        style: {
                                                            fontSize: '13px',
                                                            fontWeight: 500,
                                                            color: 'var(--color-text-dark)'
                                                        },
                                                        children: "Actions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                lineNumber: 454,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                            lineNumber: 453,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: sorted.map((assignment)=>{
                                                const status = getStatus(assignment);
                                                const needsGrade = getNeedsGrade(assignment);
                                                const pct = getSubmittedPct(assignment);
                                                const overdue = isOverdue(assignment);
                                                // Submitted color per spec: green ≥80%, orange 50-79%, red <50%
                                                const submittedColor = pct >= 80 ? '#2D6A2D' : pct >= 50 ? '#8A5700' : '#8B0000';
                                                // Needs Grade color: gray if 0, orange 1-10, red >10, dash for draft
                                                const needsGradeColor = needsGrade === 0 ? '#8A8A8A' : needsGrade <= 10 ? '#8A5700' : '#8B0000';
                                                // Due date overdue if past AND status is open
                                                const dueDateOverdue = new Date(assignment.dueDate) < NOW && status === 'open';
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "border-b transition-colors",
                                                    style: {
                                                        borderColor: 'var(--color-border)',
                                                        borderLeft: overdue ? '4px solid #8B0000' : '4px solid transparent',
                                                        cursor: 'pointer'
                                                    },
                                                    tabIndex: 0,
                                                    role: "button",
                                                    "aria-label": `View grading for ${assignment.name}`,
                                                    onClick: (e)=>{
                                                        if (e.target.closest('.actions-column')) return;
                                                        router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`);
                                                    },
                                                    onKeyDown: (e)=>{
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            if (!e.target.closest('.actions-column')) {
                                                                router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`);
                                                            }
                                                        }
                                                    },
                                                    onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = '#F5EDED',
                                                    onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = '',
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "assignment-name",
                                                                style: {
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    color: '#6B0000'
                                                                },
                                                                children: assignment.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                lineNumber: 535,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 534,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-5 py-4 hidden md:table-cell",
                                                            children: getLanguageChip(assignment.language)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 544,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-5 py-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1.5",
                                                                children: [
                                                                    dueDateOverdue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                        className: "w-3.5 h-3.5 flex-shrink-0",
                                                                        style: {
                                                                            color: '#8B0000'
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 552,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            color: dueDateOverdue ? '#8B0000' : '#595959',
                                                                            fontWeight: dueDateOverdue ? 500 : 400
                                                                        },
                                                                        children: new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 554,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                lineNumber: 550,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 549,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-5 py-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 600,
                                                                            color: submittedColor
                                                                        },
                                                                        children: [
                                                                            assignment.submissions,
                                                                            " / ",
                                                                            assignment.totalStudents
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 571,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 574,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '12px',
                                                                            fontWeight: 400,
                                                                            color: submittedColor
                                                                        },
                                                                        children: [
                                                                            "(",
                                                                            pct,
                                                                            "%)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 575,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                lineNumber: 570,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 569,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-5 py-4",
                                                            children: status === 'draft' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '16px',
                                                                    fontWeight: 700,
                                                                    color: '#8A8A8A'
                                                                },
                                                                children: "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                lineNumber: 584,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '16px',
                                                                    fontWeight: 700,
                                                                    color: needsGradeColor
                                                                },
                                                                children: needsGrade
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                lineNumber: 586,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-5 py-4",
                                                            children: getStatusBadge(status)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 593,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-5 py-4 actions-column",
                                                            onClick: (e)=>e.stopPropagation(),
                                                            style: {
                                                                cursor: 'default'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors",
                                                                        "aria-label": "Edit assignment",
                                                                        title: "Edit",
                                                                        onClick: ()=>router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`),
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                            className: "w-4.5 h-4.5 text-[var(--color-text-mid)]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                            lineNumber: 606,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 600,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors",
                                                                        "aria-label": "Duplicate assignment",
                                                                        title: "Duplicate",
                                                                        onClick: ()=>setDuplicateTarget(assignment),
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                            className: "w-4.5 h-4.5 text-[var(--color-text-mid)]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                            lineNumber: 614,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 608,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "p-1.5 rounded transition-colors group hover:bg-red-50",
                                                                        "aria-label": "Delete assignment",
                                                                        title: "Delete",
                                                                        onClick: ()=>setDeleteTarget(assignment),
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                            className: "w-4.5 h-4.5 text-[var(--color-text-mid)] group-hover:text-[#8B0000]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                            lineNumber: 622,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 616,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    className: "p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors",
                                                                                    "aria-label": "More actions",
                                                                                    title: "More",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                                                                        className: "w-4.5 h-4.5 text-[var(--color-text-mid)]"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                        lineNumber: 632,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                    lineNumber: 627,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                lineNumber: 626,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                                                align: "end",
                                                                                className: "w-48",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                        className: "flex items-center gap-2 cursor-pointer",
                                                                                        onClick: ()=>router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`),
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                                className: "w-4 h-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                                lineNumber: 640,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            " View Submissions"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                        lineNumber: 636,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                        className: "flex items-center gap-2 cursor-pointer",
                                                                                        onClick: ()=>router.push(`/courses/${courseId}/reports`),
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                                                className: "w-4 h-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                                lineNumber: 646,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            " Export Grades"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                        lineNumber: 642,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                        className: "flex items-center gap-2 cursor-pointer",
                                                                                        onClick: ()=>router.push(`/courses/${courseId}/reports`),
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                                                                className: "w-4 h-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                                lineNumber: 652,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            " View Reports"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                        lineNumber: 648,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                        className: "flex items-center gap-2 cursor-pointer",
                                                                                        onClick: ()=>{
                                                                                            const updated = assignments.map((a)=>a.id === assignment.id ? {
                                                                                                    ...a,
                                                                                                    published: false
                                                                                                } : a);
                                                                                            setAssignments(updated);
                                                                                        },
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__["Archive"], {
                                                                                                className: "w-4 h-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                                lineNumber: 663,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            " Archive"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                        lineNumber: 654,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                                lineNumber: 635,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                        lineNumber: 625,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                                lineNumber: 599,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                            lineNumber: 598,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, assignment.id, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                            lineNumber: 490,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 452,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                lineNumber: 451,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: !!deleteTarget,
                onOpenChange: ()=>setDeleteTarget(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-md",
                    style: {
                        boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    style: {
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: 'var(--color-text-dark)'
                                    },
                                    children: "Delete Assignment"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 683,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    style: {
                                        fontSize: '14px',
                                        color: 'var(--color-text-mid)',
                                        marginTop: '8px'
                                    },
                                    children: [
                                        "Delete “",
                                        deleteTarget?.name,
                                        "”? This will permanently remove the assignment and all submissions. This cannot be undone."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 686,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                            lineNumber: 682,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "mt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setDeleteTarget(null),
                                    className: "border-[var(--color-border)]",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 691,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleDeleteAssignment,
                                    className: "text-white",
                                    style: {
                                        backgroundColor: '#8B0000'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                            lineNumber: 695,
                                            columnNumber: 15
                                        }, this),
                                        " Delete"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 694,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                            lineNumber: 690,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                    lineNumber: 681,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                lineNumber: 680,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: !!duplicateTarget,
                onOpenChange: ()=>setDuplicateTarget(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-md",
                    style: {
                        boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    style: {
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: 'var(--color-text-dark)'
                                    },
                                    children: "Duplicate Assignment"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 705,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    style: {
                                        fontSize: '14px',
                                        color: 'var(--color-text-mid)',
                                        marginTop: '8px'
                                    },
                                    children: [
                                        "Duplicate “",
                                        duplicateTarget?.name,
                                        "”? A copy will be created as a draft."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 708,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                            lineNumber: 704,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "mt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setDuplicateTarget(null),
                                    className: "border-[var(--color-border)]",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 713,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleDuplicateAssignment,
                                    className: "text-white",
                                    style: {
                                        backgroundColor: 'var(--color-primary)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                            lineNumber: 717,
                                            columnNumber: 15
                                        }, this),
                                        " Duplicate"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                                    lineNumber: 716,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                            lineNumber: 712,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                    lineNumber: 703,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
                lineNumber: 702,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx",
        lineNumber: 320,
        columnNumber: 5
    }, this);
}
_s(CourseInterior, "gfxqiKeCOJEEeqE2uc2j2H2C2Yc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = CourseInterior;
var _c;
__turbopack_context__.k.register(_c, "CourseInterior");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/courses/[courseId]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CourseDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$app$2f$AuthGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/AuthGuard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$CourseInterior$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/CourseInterior.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function CourseDetailPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$app$2f$AuthGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthGuard"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$CourseInterior$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CourseInterior"], {}, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/courses/[courseId]/page.tsx",
            lineNumber: 9,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/courses/[courseId]/page.tsx",
        lineNumber: 8,
        columnNumber: 9
    }, this);
}
_c = CourseDetailPage;
var _c;
__turbopack_context__.k.register(_c, "CourseDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Autograder_Untitled_autograder_frontend_src_48f59188._.js.map