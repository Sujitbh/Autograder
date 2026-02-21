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
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Select({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "select",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, this);
}
_c = Select;
function SelectGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "select-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_c1 = SelectGroup;
function SelectValue({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"], {
        "data-slot": "select-value",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
_c2 = SelectValue;
function SelectTrigger({ className, size = "default", children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    className: "size-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c3 = SelectTrigger;
function SelectContent({ className, children, position = "popper", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "select-content",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_c4 = SelectContent;
function SelectLabel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "select-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground px-2 py-1.5 text-xs", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_c5 = SelectLabel;
function SelectItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "select-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c6 = SelectItem;
function SelectSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "select-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border pointer-events-none -mx-1 my-1 h-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_c7 = SelectSeparator;
function SelectScrollUpButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        "data-slot": "select-scroll-up-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
            lineNumber: 155,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_c8 = SelectScrollUpButton;
function SelectScrollDownButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        "data-slot": "select-scroll-down-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
            lineNumber: 173,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_c9 = SelectScrollDownButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectGroup");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectTrigger");
__turbopack_context__.k.register(_c4, "SelectContent");
__turbopack_context__.k.register(_c5, "SelectLabel");
__turbopack_context__.k.register(_c6, "SelectItem");
__turbopack_context__.k.register(_c7, "SelectSeparator");
__turbopack_context__.k.register(_c8, "SelectScrollUpButton");
__turbopack_context__.k.register(_c9, "SelectScrollDownButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/utils/helpers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* ═══════════════════════════════════════════════════════════════════
   Utility Helpers — Date, grade, string, file, and course utilities
   ═══════════════════════════════════════════════════════════════════ */ // ── Date / Time Utilities ───────────────────────────────────────────
/**
 * Format a date to "Feb 20, 2026" style.
 */ __turbopack_context__.s([
    "calculatePercentage",
    ()=>calculatePercentage,
    "cn",
    ()=>cn,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatFileSize",
    ()=>formatFileSize,
    "generateCourseCode",
    ()=>generateCourseCode,
    "getDaysUntil",
    ()=>getDaysUntil,
    "getFileExtension",
    ()=>getFileExtension,
    "getGradeBgColor",
    ()=>getGradeBgColor,
    "getGradeColor",
    ()=>getGradeColor,
    "getInitials",
    ()=>getInitials,
    "getLetterGrade",
    ()=>getLetterGrade,
    "getRelativeTime",
    ()=>getRelativeTime,
    "isPast",
    ()=>isPast,
    "isValidEmail",
    ()=>isValidEmail,
    "isValidFileType",
    ()=>isValidFileType,
    "sleep",
    ()=>sleep,
    "truncate",
    ()=>truncate
]);
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
function formatDateTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const datePart = formatDate(d);
    const timePart = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${datePart} at ${timePart}`;
}
function getRelativeTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = Date.now();
    const diffMs = now - d.getTime();
    const absDiff = Math.abs(diffMs);
    const isFuture = diffMs < 0;
    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    let label;
    if (seconds < 60) label = 'just now';
    else if (minutes < 60) label = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    else if (hours < 24) label = `${hours} hour${hours > 1 ? 's' : ''}`;
    else if (days < 7) label = `${days} day${days > 1 ? 's' : ''}`;
    else if (weeks < 5) label = `${weeks} week${weeks > 1 ? 's' : ''}`;
    else label = `${months} month${months > 1 ? 's' : ''}`;
    if (label === 'just now') return label;
    return isFuture ? `in ${label}` : `${label} ago`;
}
function isPast(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.getTime() < Date.now();
}
function getDaysUntil(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = d.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
function getGradeColor(percentage) {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-[#6B0000]';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-red-600';
}
function getGradeBgColor(percentage) {
    if (percentage >= 90) return 'bg-green-50 text-green-700';
    if (percentage >= 80) return 'bg-red-50 text-[#6B0000]';
    if (percentage >= 70) return 'bg-orange-50 text-orange-700';
    return 'bg-red-50 text-red-700';
}
function getLetterGrade(percentage) {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 60) return 'D';
    return 'F';
}
function calculatePercentage(earned, max) {
    if (max <= 0) return 0;
    return Math.round(earned / max * 100 * 100) / 100; // 2 decimal places
}
function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 1) + '…';
}
function getInitials(name) {
    return name.split(/\s+/).filter(Boolean).map((word)=>word[0].toUpperCase()).slice(0, 2).join('');
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const units = [
        'B',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / 1024 ** i;
    return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
function getFileExtension(filename) {
    const idx = filename.lastIndexOf('.');
    return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : '';
}
function isValidFileType(filename, allowedTypes) {
    const ext = getFileExtension(filename);
    return allowedTypes.map((t)=>t.toLowerCase().replace('.', '')).includes(ext);
}
// ── Course Code Generation ──────────────────────────────────────────
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O, I, 0, 1
function generateCourseCode() {
    let code = '';
    for(let i = 0; i < 7; i++){
        code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return code;
}
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportsTable",
    ()=>ReportsTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/* ═══════════════════════════════════════════════════════════════════
   ReportsTable — Spreadsheet-style grade report for faculty
   Features: sticky columns, color-coded cells, sortable, exportable
   ═══════════════════════════════════════════════════════════════════ */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-client] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/file-down.js [app-client] (ecmascript) <export default as FileDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/utils/helpers.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
// ── Helper: grade cell styling ──────────────────────────────────────
function gradeCellClass(earned, max, isLate) {
    if (earned === null) return 'text-gray-300';
    const pct = max > 0 ? earned / max * 100 : 0;
    const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGradeColor"])(pct);
    return `${color} ${isLate ? 'italic' : ''}`;
}
function ReportsTable({ assignments, students, grades, lateFlags, onViewStudentReport, onExport }) {
    _s();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('name');
    const [sortDir, setSortDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('asc');
    const [perfFilter, setPerfFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    // Total possible points
    const totalMaxPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportsTable.useMemo[totalMaxPoints]": ()=>assignments.reduce({
                "ReportsTable.useMemo[totalMaxPoints]": (s, a)=>s + a.maxPoints
            }["ReportsTable.useMemo[totalMaxPoints]"], 0)
    }["ReportsTable.useMemo[totalMaxPoints]"], [
        assignments
    ]);
    // Compute per-student totals
    const studentTotals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportsTable.useMemo[studentTotals]": ()=>{
            const map = {};
            students.forEach({
                "ReportsTable.useMemo[studentTotals]": (s)=>{
                    let earned = 0;
                    assignments.forEach({
                        "ReportsTable.useMemo[studentTotals]": (a)=>{
                            const g = grades[s.id]?.[a.id];
                            if (g != null) earned += g;
                        }
                    }["ReportsTable.useMemo[studentTotals]"]);
                    map[s.id] = {
                        earned,
                        percentage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculatePercentage"])(earned, totalMaxPoints)
                    };
                }
            }["ReportsTable.useMemo[studentTotals]"]);
            return map;
        }
    }["ReportsTable.useMemo[studentTotals]"], [
        students,
        assignments,
        grades,
        totalMaxPoints
    ]);
    // Filter + sort
    const filteredStudents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportsTable.useMemo[filteredStudents]": ()=>{
            let list = [
                ...students
            ];
            // Text search
            if (search) {
                const q = search.toLowerCase();
                list = list.filter({
                    "ReportsTable.useMemo[filteredStudents]": (s)=>s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.sisLoginId.toLowerCase().includes(q)
                }["ReportsTable.useMemo[filteredStudents]"]);
            }
            // Performance filter
            if (perfFilter !== 'all') {
                list = list.filter({
                    "ReportsTable.useMemo[filteredStudents]": (s)=>{
                        const pct = studentTotals[s.id]?.percentage ?? 0;
                        switch(perfFilter){
                            case 'high':
                                return pct >= 90;
                            case 'mid':
                                return pct >= 70 && pct < 90;
                            case 'low':
                                return pct >= 60 && pct < 70;
                            case 'failing':
                                return pct < 60;
                        }
                    }
                }["ReportsTable.useMemo[filteredStudents]"]);
            }
            // Sort
            list.sort({
                "ReportsTable.useMemo[filteredStudents]": (a, b)=>{
                    let cmp = 0;
                    if (sortField === 'name') {
                        cmp = a.name.localeCompare(b.name);
                    } else if (sortField === 'studentId') {
                        cmp = a.studentId.localeCompare(b.studentId);
                    } else if (sortField === 'total') {
                        cmp = (studentTotals[a.id]?.percentage ?? 0) - (studentTotals[b.id]?.percentage ?? 0);
                    } else {
                        // Sort by assignment grade
                        const ga = grades[a.id]?.[sortField] ?? -1;
                        const gb = grades[b.id]?.[sortField] ?? -1;
                        cmp = ga - gb;
                    }
                    return sortDir === 'asc' ? cmp : -cmp;
                }
            }["ReportsTable.useMemo[filteredStudents]"]);
            return list;
        }
    }["ReportsTable.useMemo[filteredStudents]"], [
        students,
        search,
        perfFilter,
        sortField,
        sortDir,
        grades,
        studentTotals
    ]);
    // Toggle sort
    const toggleSort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportsTable.useCallback[toggleSort]": (field)=>{
            if (sortField === field) {
                setSortDir({
                    "ReportsTable.useCallback[toggleSort]": (d)=>d === 'asc' ? 'desc' : 'asc'
                }["ReportsTable.useCallback[toggleSort]"]);
            } else {
                setSortField(field);
                setSortDir('asc');
            }
        }
    }["ReportsTable.useCallback[toggleSort]"], [
        sortField
    ]);
    function SortIcon({ field }) {
        if (sortField !== field) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
            className: "h-3 w-3 opacity-30"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
            lineNumber: 181,
            columnNumber: 37
        }, this);
        return sortDir === 'asc' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
            className: "h-3 w-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
            lineNumber: 182,
            columnNumber: 32
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
            className: "h-3 w-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
            lineNumber: 182,
            columnNumber: 66
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex-1 min-w-[200px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                value: search,
                                onChange: (e)=>setSearch(e.target.value),
                                placeholder: "Search students...",
                                className: "pl-9"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        value: perfFilter,
                        onValueChange: (v)=>setPerfFilter(v),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                className: "w-[180px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                    placeholder: "All students"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "all",
                                        children: "All Students"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "high",
                                        children: "High Performers (≥90%)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "mid",
                                        children: "Mid Range (70-89%)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 206,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "low",
                                        children: "Low Range (60-69%)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "failing",
                                        children: "Failing (<60%)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    onExport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "mr-1 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 216,
                                            columnNumber: 17
                                        }, this),
                                        " Export"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onExport('csv'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 221,
                                                columnNumber: 17
                                            }, this),
                                            " CSV"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onExport('excel'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 224,
                                                columnNumber: 17
                                            }, this),
                                            " Excel"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 223,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onExport('pdf'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDown$3e$__["FileDown"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, this),
                                            " PDF"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 226,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onExport('canvas'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDown$3e$__["FileDown"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this),
                                            " Canvas Gradebook"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-400",
                        children: [
                            filteredStudents.length,
                            " of ",
                            students.length,
                            " students"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-x-auto rounded-lg border dark:border-gray-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "sticky left-0 z-20 cursor-pointer bg-gray-50 px-4 py-3 text-left dark:bg-gray-800",
                                        onClick: ()=>toggleSort('name'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                "Student Name ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                    field: "name"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 32
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 252,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "hidden px-3 py-3 text-left md:table-cell",
                                        children: "CWID"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "hidden px-3 py-3 text-left md:table-cell",
                                        children: "Username"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "hidden px-3 py-3 text-left lg:table-cell",
                                        children: "Section"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this),
                                    assignments.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "cursor-pointer whitespace-nowrap px-3 py-3 text-center",
                                            onClick: ()=>toggleSort(a.id),
                                            title: a.fullName,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center justify-center gap-1",
                                                children: [
                                                    a.shortName,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                        field: a.id
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                        lineNumber: 269,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 268,
                                                columnNumber: 19
                                            }, this)
                                        }, a.id, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 262,
                                            columnNumber: 17
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "cursor-pointer px-3 py-3 text-center",
                                        onClick: ()=>toggleSort('total'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center justify-center gap-1",
                                            children: [
                                                "Total ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                    field: "total"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 279,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-3 text-center",
                                        children: "%"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-3 text-center",
                                        children: "Grade"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this),
                                    onViewStudentReport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-3 text-center",
                                        children: "Action"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 285,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y dark:divide-gray-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "bg-gray-100 font-medium text-gray-500 dark:bg-gray-800/60",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "sticky left-0 z-10 bg-gray-100 px-4 py-2 dark:bg-gray-800/60",
                                            children: "Points Possible"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "hidden px-3 py-2 md:table-cell"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 295,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "hidden px-3 py-2 md:table-cell"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 296,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "hidden px-3 py-2 lg:table-cell"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, this),
                                        assignments.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-center font-semibold",
                                                children: a.maxPoints
                                            }, a.id, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 299,
                                                columnNumber: 17
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-center font-semibold",
                                            children: totalMaxPoints
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 303,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-center",
                                            children: "100%"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 304,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-center"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 305,
                                            columnNumber: 15
                                        }, this),
                                        onViewStudentReport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                            lineNumber: 306,
                                            columnNumber: 39
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                filteredStudents.map((student)=>{
                                    const totals = studentTotals[student.id];
                                    const pct = totals?.percentage ?? 0;
                                    const earned = totals?.earned ?? 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-gray-50 dark:hover:bg-gray-800/40",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "sticky left-0 z-10 bg-white px-4 py-2.5 font-medium text-gray-900 dark:bg-gray-900 dark:text-gray-100",
                                                children: onViewStudentReport ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "text-left hover:text-[#6B0000] hover:underline",
                                                    onClick: ()=>onViewStudentReport(student.id),
                                                    children: student.name
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 23
                                                }, this) : student.name
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 320,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "hidden px-3 py-2.5 text-gray-400 md:table-cell",
                                                children: student.sisUserId
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 332,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "hidden px-3 py-2.5 text-gray-400 md:table-cell",
                                                children: student.sisLoginId
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 335,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "hidden px-3 py-2.5 text-gray-400 lg:table-cell",
                                                children: student.section
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 338,
                                                columnNumber: 19
                                            }, this),
                                            assignments.map((a)=>{
                                                const g = grades[student.id]?.[a.id] ?? null;
                                                const isLate = lateFlags?.[student.id]?.[a.id] ?? false;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: `px-3 py-2.5 text-center font-medium ${gradeCellClass(g, a.maxPoints, isLate)}`,
                                                    children: g === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300",
                                                        children: "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            g,
                                                            isLate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                }, a.id, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this);
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2.5 text-center font-semibold text-gray-900 dark:text-gray-100",
                                                children: [
                                                    earned,
                                                    "/",
                                                    totalMaxPoints
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: `px-3 py-2.5 text-center font-semibold ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGradeColor"])(pct)}`,
                                                children: [
                                                    pct.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 367,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2.5 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${pct >= 90 ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : pct >= 80 ? 'bg-red-50 text-[#6B0000]' : pct >= 70 ? 'bg-orange-50 text-orange-700' : 'bg-red-100 text-red-700'}`,
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLetterGrade"])(pct)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 370,
                                                columnNumber: 19
                                            }, this),
                                            onViewStudentReport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2.5 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-7 w-7",
                                                    onClick: ()=>onViewStudentReport(student.id),
                                                    "aria-label": `View report for ${student.name}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                        lineNumber: 394,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                    lineNumber: 387,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                                lineNumber: 386,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, student.id, true, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, this);
                                }),
                                filteredStudents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 6 + assignments.length + (onViewStudentReport ? 4 : 3),
                                        className: "px-4 py-12 text-center text-sm text-gray-400",
                                        children: "No students match your search or filters."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                        lineNumber: 404,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                    lineNumber: 403,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-4 text-xs text-gray-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-orange-500",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 419,
                                columnNumber: 11
                            }, this),
                            " Late submission"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-300",
                                children: "—"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this),
                            " Not submitted"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 421,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full bg-green-500"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 425,
                                columnNumber: 11
                            }, this),
                            " ≥90%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full bg-[#6B0000]"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 428,
                                columnNumber: 11
                            }, this),
                            " 80-89%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 427,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full bg-orange-500"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this),
                            " 70-79%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full bg-red-500"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                                lineNumber: 434,
                                columnNumber: 11
                            }, this),
                            " <70%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
                lineNumber: 417,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
_s(ReportsTable, "qLDvyDIFCpZLPZTs2BJDflqDJ+0=");
_c = ReportsTable;
var _c;
__turbopack_context__.k.register(_c, "ReportsTable");
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
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportsDashboard",
    ()=>ReportsDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$TopNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/TopNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/PageLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ReportsTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
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
function lookupCourseCode(id) {
    try {
        const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const f = s.find((c)=>c.id === id);
        if (f) return f.code;
    } catch  {}
    return id;
}
function ReportsDashboard() {
    _s();
    const { courseId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const courseCode = lookupCourseCode(courseId ?? '');
    const section = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECTION_MAP"][courseId ?? ''] || 'Spring 2026 - 64251';
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('gradebook');
    const [selectedStudent, setSelectedStudent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('lastName');
    const [sortDir, setSortDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('asc');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [expandedRows, setExpandedRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const students = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportsDashboard.useMemo[students]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStudentsForCourse"])(courseId ?? 'cs-1001')
    }["ReportsDashboard.useMemo[students]"], [
        courseId
    ]);
    const studentStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportsDashboard.useMemo[studentStats]": ()=>{
            const map = new Map();
            students.forEach({
                "ReportsDashboard.useMemo[studentStats]": (s)=>{
                    let earned = 0;
                    let submitted = 0;
                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ASSIGNMENTS"].forEach({
                        "ReportsDashboard.useMemo[studentStats]": (a)=>{
                            if (s.grades[a.id] !== null && s.grades[a.id] !== undefined) {
                                earned += s.grades[a.id];
                                submitted++;
                            }
                        }
                    }["ReportsDashboard.useMemo[studentStats]"]);
                    map.set(s.id, {
                        earned,
                        possible: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_MAX"],
                        pct: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_MAX"] > 0 ? earned / __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_MAX"] * 100 : 0,
                        submitted,
                        total: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ASSIGNMENTS"].length
                    });
                }
            }["ReportsDashboard.useMemo[studentStats]"]);
            return map;
        }
    }["ReportsDashboard.useMemo[studentStats]"], [
        students
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportsDashboard.useMemo[filtered]": ()=>{
            let list = [
                ...students
            ];
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                list = list.filter({
                    "ReportsDashboard.useMemo[filtered]": (s)=>`${s.lastName}, ${s.firstName}`.toLowerCase().includes(q) || s.id.includes(q) || s.sisUserId.includes(q) || s.sisLoginId.toLowerCase().includes(q)
                }["ReportsDashboard.useMemo[filtered]"]);
            }
            list.sort({
                "ReportsDashboard.useMemo[filtered]": (a, b)=>{
                    let cmp = 0;
                    if (sortField === 'lastName') cmp = a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
                    else if (sortField === 'id') cmp = parseInt(a.id) - parseInt(b.id);
                    else if (sortField === 'sisUserId') cmp = parseInt(a.sisUserId) - parseInt(b.sisUserId);
                    else if (sortField === 'sisLoginId') cmp = a.sisLoginId.localeCompare(b.sisLoginId);
                    else if (sortField === 'total') cmp = (studentStats.get(a.id)?.earned ?? 0) - (studentStats.get(b.id)?.earned ?? 0);
                    else if (sortField === 'pct') cmp = (studentStats.get(a.id)?.pct ?? 0) - (studentStats.get(b.id)?.pct ?? 0);
                    else if (sortField.startsWith('assign:')) {
                        const aId = sortField.replace('assign:', '');
                        cmp = (a.grades[aId] ?? -1) - (b.grades[aId] ?? -1);
                    }
                    return sortDir === 'asc' ? cmp : -cmp;
                }
            }["ReportsDashboard.useMemo[filtered]"]);
            return list;
        }
    }["ReportsDashboard.useMemo[filtered]"], [
        students,
        searchQuery,
        sortField,
        sortDir,
        studentStats
    ]);
    const handleSort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportsDashboard.useCallback[handleSort]": (field)=>{
            setSortField({
                "ReportsDashboard.useCallback[handleSort]": (prev)=>{
                    if (prev === field) {
                        setSortDir({
                            "ReportsDashboard.useCallback[handleSort]": (d)=>d === 'asc' ? 'desc' : 'asc'
                        }["ReportsDashboard.useCallback[handleSort]"]);
                        return prev;
                    }
                    setSortDir('asc');
                    return field;
                }
            }["ReportsDashboard.useCallback[handleSort]"]);
        }
    }["ReportsDashboard.useCallback[handleSort]"], []);
    const openStudentReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportsDashboard.useCallback[openStudentReport]": (s)=>{
            setSelectedStudent(s);
            setView('student');
            setExpandedRows(new Set());
        }
    }["ReportsDashboard.useCallback[openStudentReport]"], []);
    const toggleExpand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportsDashboard.useCallback[toggleExpand]": (assignId)=>{
            setExpandedRows({
                "ReportsDashboard.useCallback[toggleExpand]": (prev)=>{
                    const next = new Set(prev);
                    next.has(assignId) ? next.delete(assignId) : next.add(assignId);
                    return next;
                }
            }["ReportsDashboard.useCallback[toggleExpand]"]);
        }
    }["ReportsDashboard.useCallback[toggleExpand]"], []);
    const SortIcon = ({ field })=>{
        if (sortField !== field) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
            className: "w-3 h-3 ml-1 opacity-40 flex-shrink-0"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
            lineNumber: 130,
            columnNumber: 37
        }, this);
        return sortDir === 'asc' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "w-3 h-3 ml-1 flex-shrink-0"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
            lineNumber: 132,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "w-3 h-3 ml-1 flex-shrink-0"
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
            lineNumber: 133,
            columnNumber: 9
        }, this);
    };
    const hoverBg = 'var(--color-primary-bg)';
    const summaryBg = '#F9F9F9';
    const rowBgFor = (isEven)=>isEven ? '#FAFAFA' : 'var(--color-surface)';
    const onRowEnter = (e)=>{
        e.currentTarget.querySelectorAll('td').forEach((el)=>{
            el.style.backgroundColor = hoverBg;
        });
    };
    const onRowLeave = (e, isEven)=>{
        const bg = rowBgFor(isEven);
        e.currentTarget.querySelectorAll('td').forEach((el)=>{
            el.style.backgroundColor = el.dataset.summary ? summaryBg : bg;
        });
    };
    /* ══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$PageLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageLayout"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$TopNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopNav"], {
                breadcrumbs: [
                    {
                        label: 'Courses',
                        href: '/courses'
                    },
                    {
                        label: courseCode,
                        href: `/courses/${courseId}`
                    },
                    {
                        label: 'Reports'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-[calc(100vh-64px)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                        activeItem: "reports"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-auto p-8",
                        style: {
                            backgroundColor: 'var(--color-background)'
                        },
                        children: [
                            view === 'gradebook' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between mb-6 flex-wrap gap-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                    style: {
                                                        fontSize: '28px',
                                                        fontWeight: 700,
                                                        color: 'var(--color-text-dark)'
                                                    },
                                                    children: "Gradebook"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '14px',
                                                        color: 'var(--color-text-mid)',
                                                        marginTop: '4px'
                                                    },
                                                    children: [
                                                        "All student grades at a glance — ",
                                                        section
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ReportsTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportsTable"], {
                                        assignments: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ASSIGNMENTS"].map((a)=>({
                                                id: a.id,
                                                shortName: a.shortName,
                                                fullName: a.fullName,
                                                maxPoints: a.maxPoints
                                            })),
                                        students: students.map((s)=>({
                                                id: s.id,
                                                name: `${s.lastName}, ${s.firstName}`,
                                                studentId: s.studentId,
                                                sisUserId: s.sisUserId,
                                                sisLoginId: s.sisLoginId,
                                                section: s.section
                                            })),
                                        grades: students.reduce((acc, s)=>{
                                            acc[s.id] = {
                                                ...s.grades
                                            };
                                            return acc;
                                        }, {}),
                                        lateFlags: students.reduce((acc, s)=>{
                                            acc[s.id] = {
                                                ...s.lateFlags
                                            };
                                            return acc;
                                        }, {}),
                                        onViewStudentReport: (studentId)=>{
                                            const s = students.find((st)=>st.id === studentId);
                                            if (s) openStudentReport(s);
                                        },
                                        onExport: (format)=>{
                                            console.log(`Exporting gradebook as ${format}`);
                                        // In production, call exportGrades API
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            view === 'student' && selectedStudent && (()=>{
                                const s = selectedStudent;
                                const stats = studentStats.get(s.id);
                                const pct = stats.pct;
                                const grade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["letterGrade"])(pct);
                                const gradeCounts = {
                                    A: 0,
                                    B: 0,
                                    C: 0,
                                    D: 0,
                                    F: 0,
                                    missing: 0
                                };
                                let onTime = 0;
                                let lateCount = 0;
                                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ASSIGNMENTS"].forEach((a)=>{
                                    const g = s.grades[a.id];
                                    if (g === null || g === undefined) {
                                        gradeCounts.missing++;
                                    } else {
                                        const aPct = g / a.maxPoints * 100;
                                        if (aPct >= 90) gradeCounts.A++;
                                        else if (aPct >= 80) gradeCounts.B++;
                                        else if (aPct >= 70) gradeCounts.C++;
                                        else if (aPct >= 60) gradeCounts.D++;
                                        else gradeCounts.F++;
                                        if (s.lateFlags[a.id]) lateCount++;
                                        else onTime++;
                                    }
                                });
                                const allPcts = Array.from(studentStats.values()).map((v)=>v.pct).sort((a, b)=>b - a);
                                const rank = allPcts.indexOf(pct) + 1;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setView('gradebook');
                                                setSelectedStudent(null);
                                            },
                                            className: "flex items-center gap-1 mb-5 hover:underline transition-colors",
                                            style: {
                                                fontSize: '13px',
                                                color: '#6B0000'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 19
                                                }, this),
                                                " Back to All Students"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                            lineNumber: 247,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg p-6 mb-6",
                                            style: {
                                                backgroundColor: 'var(--color-surface)',
                                                boxShadow: 'var(--shadow-card)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between flex-wrap gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 text-white",
                                                                style: {
                                                                    backgroundColor: '#6B0000',
                                                                    fontSize: '22px',
                                                                    fontWeight: 700
                                                                },
                                                                children: [
                                                                    s.firstName[0],
                                                                    s.lastName[0]
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                lineNumber: 259,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                        style: {
                                                                            fontSize: '24px',
                                                                            fontWeight: 700,
                                                                            color: 'var(--color-text-dark)'
                                                                        },
                                                                        children: [
                                                                            s.firstName,
                                                                            " ",
                                                                            s.lastName
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 263,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-2 space-y-1",
                                                                        style: {
                                                                            fontSize: '14px',
                                                                            color: '#595959'
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    "Student ID: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: s.id
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 265,
                                                                                        columnNumber: 42
                                                                                    }, this),
                                                                                    "  ·  CWID: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: s.sisUserId
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 265,
                                                                                        columnNumber: 86
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                lineNumber: 265,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    "Username: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: s.sisLoginId
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 266,
                                                                                        columnNumber: 40
                                                                                    }, this),
                                                                                    "  ·  Section: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: s.section
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 266,
                                                                                        columnNumber: 95
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                lineNumber: 266,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    "Email: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: s.email
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 267,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                lineNumber: 267,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    "Enrolled: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: new Date(s.enrollmentDate).toLocaleDateString('en-US', {
                                                                                            month: 'long',
                                                                                            day: 'numeric',
                                                                                            year: 'numeric'
                                                                                        })
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 268,
                                                                                        columnNumber: 40
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                lineNumber: 268,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 264,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                lineNumber: 262,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                className: "border-[var(--color-border)]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                                        className: "w-4 h-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 273,
                                                                        columnNumber: 90
                                                                    }, this),
                                                                    " Print Report"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                lineNumber: 273,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                className: "border-[var(--color-border)]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                        className: "w-4 h-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 274,
                                                                        columnNumber: 90
                                                                    }, this),
                                                                    " Export PDF"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                lineNumber: 274,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                lineNumber: 257,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                            lineNumber: 256,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg p-5",
                                                    style: {
                                                        backgroundColor: 'var(--color-surface)',
                                                        boxShadow: 'var(--shadow-card)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '12px',
                                                                color: 'var(--color-text-light)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                marginBottom: '6px'
                                                            },
                                                            children: "Current Grade"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 282,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '32px',
                                                                fontWeight: 700,
                                                                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pctColor"])(pct)
                                                            },
                                                            children: [
                                                                pct.toFixed(1),
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '14px',
                                                                color: '#595959',
                                                                marginTop: '6px'
                                                            },
                                                            children: [
                                                                grade,
                                                                " · Rank: ",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ordinal"])(rank),
                                                                "/",
                                                                students.length
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg p-5",
                                                    style: {
                                                        backgroundColor: 'var(--color-surface)',
                                                        boxShadow: 'var(--shadow-card)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '12px',
                                                                color: 'var(--color-text-light)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                marginBottom: '6px'
                                                            },
                                                            children: "Total Points"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '32px',
                                                                fontWeight: 700,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                stats.earned,
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: '18px',
                                                                        fontWeight: 400,
                                                                        color: '#8A8A8A'
                                                                    },
                                                                    children: [
                                                                        "/ ",
                                                                        stats.possible
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 288,
                                                                    columnNumber: 118
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '14px',
                                                                color: '#595959',
                                                                marginTop: '6px'
                                                            },
                                                            children: [
                                                                "Missing: ",
                                                                stats.possible - stats.earned,
                                                                " pts"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 289,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg p-5",
                                                    style: {
                                                        backgroundColor: 'var(--color-surface)',
                                                        boxShadow: 'var(--shadow-card)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '12px',
                                                                color: 'var(--color-text-light)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                marginBottom: '6px'
                                                            },
                                                            children: "Submissions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 292,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '32px',
                                                                fontWeight: 700,
                                                                color: 'var(--color-text-dark)'
                                                            },
                                                            children: [
                                                                stats.submitted,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: '18px',
                                                                        fontWeight: 400,
                                                                        color: '#8A8A8A'
                                                                    },
                                                                    children: [
                                                                        "/",
                                                                        stats.total
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 293,
                                                                    columnNumber: 120
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 293,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '14px',
                                                                color: '#595959',
                                                                marginTop: '6px'
                                                            },
                                                            children: [
                                                                "On time: ",
                                                                onTime,
                                                                " · Late: ",
                                                                lateCount
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 294,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg p-5",
                                                    style: {
                                                        backgroundColor: 'var(--color-surface)',
                                                        boxShadow: 'var(--shadow-card)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: '12px',
                                                                color: 'var(--color-text-light)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                marginBottom: '6px'
                                                            },
                                                            children: "Grade Breakdown"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5",
                                                            style: {
                                                                fontSize: '14px'
                                                            },
                                                            children: [
                                                                gradeCounts.A > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                color: '#2D6A2D',
                                                                                fontWeight: 600
                                                                            },
                                                                            children: "A:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 299,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " ",
                                                                        gradeCounts.A,
                                                                        " assignments"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 299,
                                                                    columnNumber: 45
                                                                }, this),
                                                                gradeCounts.B > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                color: '#6B0000',
                                                                                fontWeight: 600
                                                                            },
                                                                            children: "B:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 300,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " ",
                                                                        gradeCounts.B,
                                                                        " assignments"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 300,
                                                                    columnNumber: 45
                                                                }, this),
                                                                gradeCounts.C > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                color: '#8A5700',
                                                                                fontWeight: 600
                                                                            },
                                                                            children: "C:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 301,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " ",
                                                                        gradeCounts.C,
                                                                        " assignments"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 301,
                                                                    columnNumber: 45
                                                                }, this),
                                                                gradeCounts.D > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                color: '#8B0000',
                                                                                fontWeight: 600
                                                                            },
                                                                            children: "D:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 302,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " ",
                                                                        gradeCounts.D,
                                                                        " assignments"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 302,
                                                                    columnNumber: 45
                                                                }, this),
                                                                gradeCounts.F > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                color: '#8B0000',
                                                                                fontWeight: 600
                                                                            },
                                                                            children: "F:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 303,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " ",
                                                                        gradeCounts.F,
                                                                        " assignments"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 303,
                                                                    columnNumber: 45
                                                                }, this),
                                                                gradeCounts.missing > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                color: '#8A8A8A',
                                                                                fontWeight: 600
                                                                            },
                                                                            children: "Missing:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 304,
                                                                            columnNumber: 54
                                                                        }, this),
                                                                        " ",
                                                                        gradeCounts.missing
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 304,
                                                                    columnNumber: 51
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 298,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                            lineNumber: 280,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg overflow-hidden mb-6",
                                            style: {
                                                backgroundColor: 'var(--color-surface)',
                                                boxShadow: 'var(--shadow-card)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-6 py-4 border-b",
                                                    style: {
                                                        borderColor: 'var(--color-border)'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        style: {
                                                            fontSize: '18px',
                                                            fontWeight: 600,
                                                            color: 'var(--color-text-dark)'
                                                        },
                                                        children: "Assignment-by-Assignment Breakdown"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                    className: "w-full",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                            style: {
                                                                backgroundColor: '#FAFAFA'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                style: {
                                                                    borderBottom: '2px solid #D9D9D9'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        style: {
                                                                            width: 40
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 317,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "text-left px-4 py-3",
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            color: '#2D2D2D'
                                                                        },
                                                                        children: "Assignment"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 318,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "text-left px-4 py-3",
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            color: '#2D2D2D'
                                                                        },
                                                                        children: "Category"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 319,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "text-center px-4 py-3",
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            color: '#2D2D2D'
                                                                        },
                                                                        children: "Max Pts"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 320,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "text-left px-4 py-3",
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            color: '#2D2D2D'
                                                                        },
                                                                        children: "Submitted"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 321,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "text-left px-4 py-3",
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            color: '#2D2D2D'
                                                                        },
                                                                        children: "Status"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 322,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "text-center px-4 py-3",
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            color: '#2D2D2D'
                                                                        },
                                                                        children: "Earned"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 323,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "text-center px-4 py-3",
                                                                        style: {
                                                                            fontSize: '13px',
                                                                            fontWeight: 600,
                                                                            color: '#2D2D2D'
                                                                        },
                                                                        children: "%"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                        lineNumber: 324,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 315,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ASSIGNMENTS"].map((a, aIdx)=>{
                                                                const earned = s.grades[a.id];
                                                                const isNull = earned === null || earned === undefined;
                                                                const aPct = isNull ? 0 : earned / a.maxPoints * 100;
                                                                const isLate = s.lateFlags[a.id] && !isNull;
                                                                const expanded = expandedRows.has(a.id);
                                                                const rubricScores = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUBRIC_CRITERIA"].map((r)=>{
                                                                    const max = Math.round(a.maxPoints * r.weight / 100);
                                                                    if (isNull) return {
                                                                        ...r,
                                                                        earned: 0,
                                                                        max
                                                                    };
                                                                    const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashStr"])(s.id + ':' + a.id + ':' + r.name);
                                                                    const variation = h % 11 - 5;
                                                                    const rPct = Math.min(100, Math.max(25, aPct + variation));
                                                                    return {
                                                                        ...r,
                                                                        earned: Math.round(max * rPct / 100),
                                                                        max
                                                                    };
                                                                });
                                                                const dueDate = new Date(a.dueDate);
                                                                const dayOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashStr"])(s.id + a.id + 'sub') % 5 + 1;
                                                                const submitDate = isNull ? null : new Date(dueDate.getTime() + (isLate ? 86400000 : -86400000 * dayOffset));
                                                                const feedbackIdx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashStr"])(s.id + ':' + a.id + ':fb') % __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEEDBACK_POOL"].length;
                                                                const altBg = aIdx % 2 ? '#FAFAF8' : '#fff';
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            className: "cursor-pointer transition-colors",
                                                                            style: {
                                                                                borderBottom: expanded ? 'none' : '1px solid #E8E8E8',
                                                                                backgroundColor: altBg
                                                                            },
                                                                            onClick: ()=>!isNull && toggleExpand(a.id),
                                                                            onMouseEnter: (e)=>{
                                                                                e.currentTarget.style.backgroundColor = 'var(--color-primary-bg)';
                                                                            },
                                                                            onMouseLeave: (e)=>{
                                                                                e.currentTarget.style.backgroundColor = altBg;
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "text-center px-2 py-3",
                                                                                    children: !isNull && (expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                        className: "w-4 h-4 mx-auto",
                                                                                        style: {
                                                                                            color: '#6B0000'
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 361,
                                                                                        columnNumber: 37
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                        className: "w-4 h-4 mx-auto",
                                                                                        style: {
                                                                                            color: '#8A8A8A'
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 362,
                                                                                        columnNumber: 37
                                                                                    }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 359,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3",
                                                                                    style: {
                                                                                        fontSize: '14px',
                                                                                        fontWeight: 500,
                                                                                        color: '#2D2D2D'
                                                                                    },
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1.5",
                                                                                        children: [
                                                                                            a.fullName,
                                                                                            a.isGroup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold",
                                                                                                style: {
                                                                                                    backgroundColor: '#F5EDED',
                                                                                                    color: '#6B0000',
                                                                                                    border: '1px solid #E8D5D5'
                                                                                                },
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                                                        className: "w-3 h-3"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                        lineNumber: 370,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    " Group"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                lineNumber: 369,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 366,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 365,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "px-2 py-0.5 rounded text-xs",
                                                                                        style: {
                                                                                            backgroundColor: a.category === 'Homework' ? '#E3F2FD' : a.category === 'Quiz' ? '#FFF8E1' : '#F3E8FF',
                                                                                            color: a.category === 'Homework' ? '#1565C0' : a.category === 'Quiz' ? '#8A5700' : '#6B21A8',
                                                                                            fontWeight: 600
                                                                                        },
                                                                                        children: a.category
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 376,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 375,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "text-center px-4 py-3",
                                                                                    style: {
                                                                                        color: '#595959'
                                                                                    },
                                                                                    children: a.maxPoints
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 384,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3",
                                                                                    style: {
                                                                                        fontSize: '13px',
                                                                                        color: '#595959'
                                                                                    },
                                                                                    children: isNull ? '—' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                        children: [
                                                                                            submitDate?.toLocaleDateString('en-US', {
                                                                                                month: 'short',
                                                                                                day: 'numeric'
                                                                                            }),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                style: {
                                                                                                    fontSize: '11px',
                                                                                                    color: '#8A8A8A',
                                                                                                    display: 'block'
                                                                                                },
                                                                                                children: submitDate?.toLocaleTimeString('en-US', {
                                                                                                    hour: 'numeric',
                                                                                                    minute: '2-digit'
                                                                                                })
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                lineNumber: 389,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 385,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "px-4 py-3",
                                                                                    children: isNull ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1 text-xs",
                                                                                        style: {
                                                                                            color: '#8B0000',
                                                                                            fontWeight: 600
                                                                                        },
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                                                className: "w-3.5 h-3.5"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                lineNumber: 398,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            " Missing"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 397,
                                                                                        columnNumber: 35
                                                                                    }, this) : isLate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1 text-xs",
                                                                                        style: {
                                                                                            color: '#8A5700',
                                                                                            fontWeight: 600
                                                                                        },
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                                className: "w-3.5 h-3.5"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                lineNumber: 402,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            " Late"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 401,
                                                                                        columnNumber: 35
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1 text-xs",
                                                                                        style: {
                                                                                            color: '#2D6A2D',
                                                                                            fontWeight: 600
                                                                                        },
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                className: "w-3.5 h-3.5"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                lineNumber: 406,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            " On Time"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                        lineNumber: 405,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 395,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "text-center px-4 py-3",
                                                                                    style: {
                                                                                        fontWeight: 600,
                                                                                        color: isNull ? '#8A8A8A' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradeColor"])(earned, a.maxPoints)
                                                                                    },
                                                                                    children: isNull ? '0' : earned
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 410,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    className: "text-center px-4 py-3",
                                                                                    style: {
                                                                                        fontWeight: 600,
                                                                                        color: isNull ? '#8A8A8A' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradeColor"])(earned, a.maxPoints)
                                                                                    },
                                                                                    children: [
                                                                                        isNull ? '0%' : `${aPct.toFixed(0)}%`,
                                                                                        !isNull && aPct >= 90 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            style: {
                                                                                                marginLeft: 4
                                                                                            },
                                                                                            children: "✓"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                            lineNumber: 415,
                                                                                            columnNumber: 59
                                                                                        }, this),
                                                                                        isNull && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            style: {
                                                                                                marginLeft: 4
                                                                                            },
                                                                                            children: "✗"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                            lineNumber: 416,
                                                                                            columnNumber: 44
                                                                                        }, this),
                                                                                        !isNull && aPct < 70 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            style: {
                                                                                                marginLeft: 4
                                                                                            },
                                                                                            children: "⚠"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                            lineNumber: 417,
                                                                                            columnNumber: 58
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 413,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 352,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        expanded && !isNull && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            style: {
                                                                                borderBottom: '1px solid #E8E8E8'
                                                                            },
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                colSpan: 8,
                                                                                className: "px-6 py-5",
                                                                                style: {
                                                                                    backgroundColor: '#FAFAFA'
                                                                                },
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                                    className: "flex items-center gap-2 mb-3",
                                                                                                    style: {
                                                                                                        fontSize: '14px',
                                                                                                        fontWeight: 600,
                                                                                                        color: '#2D2D2D'
                                                                                                    },
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                                            className: "w-4 h-4",
                                                                                                            style: {
                                                                                                                color: '#6B0000'
                                                                                                            }
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                            lineNumber: 427,
                                                                                                            columnNumber: 41
                                                                                                        }, this),
                                                                                                        " Rubric Breakdown"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                    lineNumber: 426,
                                                                                                    columnNumber: 39
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "space-y-2",
                                                                                                    children: rubricScores.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                    className: "flex items-center gap-3 mb-1",
                                                                                                                    children: [
                                                                                                                        r.max > 0 && r.earned >= r.max * 0.7 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                                            className: "w-4 h-4 flex-shrink-0",
                                                                                                                            style: {
                                                                                                                                color: '#2D6A2D'
                                                                                                                            }
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                            lineNumber: 434,
                                                                                                                            columnNumber: 51
                                                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                                                                            className: "w-4 h-4 flex-shrink-0",
                                                                                                                            style: {
                                                                                                                                color: '#8A5700'
                                                                                                                            }
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                            lineNumber: 435,
                                                                                                                            columnNumber: 51
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                            style: {
                                                                                                                                fontSize: '13px',
                                                                                                                                color: '#2D2D2D',
                                                                                                                                minWidth: 140
                                                                                                                            },
                                                                                                                            children: [
                                                                                                                                r.name,
                                                                                                                                ":"
                                                                                                                            ]
                                                                                                                        }, void 0, true, {
                                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                            lineNumber: 437,
                                                                                                                            columnNumber: 47
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                            style: {
                                                                                                                                fontSize: '13px',
                                                                                                                                fontWeight: 600,
                                                                                                                                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradeColor"])(r.earned, r.max)
                                                                                                                            },
                                                                                                                            children: [
                                                                                                                                r.earned,
                                                                                                                                " / ",
                                                                                                                                r.max
                                                                                                                            ]
                                                                                                                        }, void 0, true, {
                                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                            lineNumber: 438,
                                                                                                                            columnNumber: 47
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                            style: {
                                                                                                                                fontSize: '12px',
                                                                                                                                color: '#8A8A8A'
                                                                                                                            },
                                                                                                                            children: [
                                                                                                                                "(",
                                                                                                                                r.max > 0 ? Math.round(r.earned / r.max * 100) : 0,
                                                                                                                                "%)"
                                                                                                                            ]
                                                                                                                        }, void 0, true, {
                                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                            lineNumber: 439,
                                                                                                                            columnNumber: 47
                                                                                                                        }, this)
                                                                                                                    ]
                                                                                                                }, void 0, true, {
                                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                    lineNumber: 432,
                                                                                                                    columnNumber: 45
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                    className: "ml-7 h-1.5 rounded-full overflow-hidden",
                                                                                                                    style: {
                                                                                                                        backgroundColor: '#E8E8E8',
                                                                                                                        maxWidth: 200
                                                                                                                    },
                                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                        className: "h-full rounded-full",
                                                                                                                        style: {
                                                                                                                            width: `${r.max > 0 ? Math.round(r.earned / r.max * 100) : 0}%`,
                                                                                                                            backgroundColor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradeColor"])(r.earned, r.max),
                                                                                                                            transition: 'width 0.3s ease'
                                                                                                                        }
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                        lineNumber: 442,
                                                                                                                        columnNumber: 47
                                                                                                                    }, this)
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                    lineNumber: 441,
                                                                                                                    columnNumber: 45
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, r.name, true, {
                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                            lineNumber: 431,
                                                                                                            columnNumber: 43
                                                                                                        }, this))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                    lineNumber: 429,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                            lineNumber: 425,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                                    className: "flex items-center gap-2 mb-3",
                                                                                                    style: {
                                                                                                        fontSize: '14px',
                                                                                                        fontWeight: 600,
                                                                                                        color: '#2D2D2D'
                                                                                                    },
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                                                                            className: "w-4 h-4",
                                                                                                            style: {
                                                                                                                color: '#6B0000'
                                                                                                            }
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                            lineNumber: 450,
                                                                                                            columnNumber: 41
                                                                                                        }, this),
                                                                                                        " Details & Feedback"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                    lineNumber: 449,
                                                                                                    columnNumber: 39
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "space-y-2",
                                                                                                    style: {
                                                                                                        fontSize: '13px',
                                                                                                        color: '#595959'
                                                                                                    },
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                                    children: "Submitted:"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                    lineNumber: 453,
                                                                                                                    columnNumber: 44
                                                                                                                }, this),
                                                                                                                " ",
                                                                                                                submitDate?.toLocaleDateString('en-US', {
                                                                                                                    month: 'long',
                                                                                                                    day: 'numeric',
                                                                                                                    year: 'numeric'
                                                                                                                }),
                                                                                                                " at ",
                                                                                                                submitDate?.toLocaleTimeString('en-US', {
                                                                                                                    hour: 'numeric',
                                                                                                                    minute: '2-digit'
                                                                                                                })
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                            lineNumber: 453,
                                                                                                            columnNumber: 41
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                                    children: "Due:"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                    lineNumber: 454,
                                                                                                                    columnNumber: 44
                                                                                                                }, this),
                                                                                                                " ",
                                                                                                                dueDate.toLocaleDateString('en-US', {
                                                                                                                    month: 'long',
                                                                                                                    day: 'numeric',
                                                                                                                    year: 'numeric'
                                                                                                                }),
                                                                                                                " at 11:59 PM"
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                            lineNumber: 454,
                                                                                                            columnNumber: 41
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                                    children: "Status:"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                    lineNumber: 455,
                                                                                                                    columnNumber: 44
                                                                                                                }, this),
                                                                                                                " ",
                                                                                                                isLate ? 'Late (submitted after deadline)' : `On time (submitted ${dayOffset} day${dayOffset > 1 ? 's' : ''} early)`
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                            lineNumber: 455,
                                                                                                            columnNumber: 41
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "mt-3 p-3 rounded-lg",
                                                                                                            style: {
                                                                                                                backgroundColor: '#fff',
                                                                                                                border: '1px solid #E8E8E8'
                                                                                                            },
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                                    style: {
                                                                                                                        fontWeight: 600,
                                                                                                                        marginBottom: '4px',
                                                                                                                        color: '#2D2D2D',
                                                                                                                        fontSize: '13px'
                                                                                                                    },
                                                                                                                    children: "Instructor Feedback:"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                    lineNumber: 457,
                                                                                                                    columnNumber: 43
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                                    style: {
                                                                                                                        fontStyle: 'italic',
                                                                                                                        lineHeight: '1.6'
                                                                                                                    },
                                                                                                                    children: [
                                                                                                                        '"',
                                                                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEEDBACK_POOL"][feedbackIdx],
                                                                                                                        '"'
                                                                                                                    ]
                                                                                                                }, void 0, true, {
                                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                                    lineNumber: 458,
                                                                                                                    columnNumber: 43
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                            lineNumber: 456,
                                                                                                            columnNumber: 41
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                                    lineNumber: 452,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                            lineNumber: 448,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                    lineNumber: 424,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                                lineNumber: 423,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 422,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, a.id, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 351,
                                                                    columnNumber: 27
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 327,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                            lineNumber: 310,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg p-6",
                                            style: {
                                                backgroundColor: 'var(--color-surface)',
                                                boxShadow: 'var(--shadow-card)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "mb-4",
                                                    style: {
                                                        fontSize: '16px',
                                                        fontWeight: 600,
                                                        color: 'var(--color-text-dark)'
                                                    },
                                                    children: "Summary Statistics"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                                    style: {
                                                        fontSize: '14px',
                                                        color: '#595959',
                                                        lineHeight: '1.8'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Total Earned:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 478,
                                                                            columnNumber: 26
                                                                        }, this),
                                                                        " ",
                                                                        stats.earned,
                                                                        " / ",
                                                                        stats.possible,
                                                                        " points (",
                                                                        pct.toFixed(1),
                                                                        "%)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 478,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Assignments Completed:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 479,
                                                                            columnNumber: 26
                                                                        }, this),
                                                                        " ",
                                                                        stats.submitted,
                                                                        " / ",
                                                                        stats.total,
                                                                        " (",
                                                                        (stats.submitted / stats.total * 100).toFixed(1),
                                                                        "%)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 479,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Average Assignment Score:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 480,
                                                                            columnNumber: 26
                                                                        }, this),
                                                                        " ",
                                                                        pct.toFixed(1),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 480,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Current Course Grade:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 483,
                                                                            columnNumber: 26
                                                                        }, this),
                                                                        " ",
                                                                        grade,
                                                                        " (",
                                                                        pct.toFixed(1),
                                                                        "%)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 483,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Class Rank:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 484,
                                                                            columnNumber: 26
                                                                        }, this),
                                                                        " ",
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$studentData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ordinal"])(rank),
                                                                        " out of ",
                                                                        students.length,
                                                                        " students"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "On-Time Submissions:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                            lineNumber: 485,
                                                                            columnNumber: 26
                                                                        }, this),
                                                                        " ",
                                                                        onTime,
                                                                        " / ",
                                                                        stats.submitted,
                                                                        " (",
                                                                        stats.submitted > 0 ? (onTime / stats.submitted * 100).toFixed(0) : 0,
                                                                        "%)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                                    lineNumber: 485,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                            lineNumber: 482,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                                            lineNumber: 474,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true);
                            })()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}
_s(ReportsDashboard, "2CWgBPOFZYNNoki7pk39iWYDAMo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = ReportsDashboard;
var _c;
__turbopack_context__.k.register(_c, "ReportsDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/courses/[courseId]/reports/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$app$2f$AuthGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/AuthGuard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ReportsDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ReportsDashboard.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function ReportsPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$app$2f$AuthGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthGuard"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ReportsDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportsDashboard"], {}, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/courses/[courseId]/reports/page.tsx",
            lineNumber: 9,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/courses/[courseId]/reports/page.tsx",
        lineNumber: 8,
        columnNumber: 9
    }, this);
}
_c = ReportsPage;
var _c;
__turbopack_context__.k.register(_c, "ReportsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Autograder_Untitled_autograder_frontend_src_812b66fa._.js.map