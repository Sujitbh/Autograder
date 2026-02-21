(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Checkbox({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "checkbox",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "checkbox-indicator",
            className: "flex items-center justify-center text-current transition-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                className: "size-3.5"
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/checkbox.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/checkbox.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/checkbox.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Checkbox;
;
var _c;
__turbopack_context__.k.register(_c, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignupPage",
    ()=>SignupPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function SignupPage({ onSignup }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [passwordStrength, setPasswordStrength] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [emailError, setEmailError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const validateULMEmail = (email)=>{
        const emailLower = email.toLowerCase().trim();
        if (!emailLower.endsWith('@ulm.edu')) {
            return 'Email address must be a valid @ulm.edu address';
        }
        return null;
    };
    const handlePasswordChange = (password)=>{
        setFormData({
            ...formData,
            password
        });
        // Calculate password strength
        if (password.length === 0) {
            setPasswordStrength(null);
        } else if (password.length < 6) {
            setPasswordStrength('weak');
        } else if (password.length < 10) {
            setPasswordStrength('medium');
        } else if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            setPasswordStrength('strong');
        } else {
            setPasswordStrength('medium');
        }
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        setFormError(null);
        setEmailError(null);
        // Validate ULM email
        const emailValidationError = validateULMEmail(formData.email);
        if (emailValidationError) {
            setEmailError(emailValidationError);
            return;
        }
        // Validate all required fields
        if (!formData.firstName || !formData.lastName) {
            setFormError('Please fill in all required fields');
            return;
        }
        if (!formData.password || !formData.confirmPassword) {
            setFormError('Please enter and confirm your password');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setFormError('Password must be at least 6 characters long');
            return;
        }
        if (!formData.agreeToTerms) {
            setFormError('You must agree to the Terms of Service and Privacy Policy');
            return;
        }
        // Check if email is already registered
        const existingUsers = localStorage.getItem('autograde_users');
        const users = existingUsers ? JSON.parse(existingUsers) : [
            {
                email: 'sjohnson@ulm.edu',
                password: 'password123',
                firstName: 'Sarah',
                lastName: 'Johnson'
            },
            {
                email: 'professor@ulm.edu',
                password: 'demo123',
                firstName: 'Demo',
                lastName: 'Professor'
            },
            {
                email: 'faculty@ulm.edu',
                password: 'faculty123',
                firstName: 'Faculty',
                lastName: 'Member'
            }
        ];
        const emailExists = users.find((u)=>u.email.toLowerCase() === formData.email.toLowerCase());
        if (emailExists) {
            setEmailError('This email is already registered. Please sign in instead.');
            return;
        }
        // Save new user to localStorage
        const newUser = {
            email: formData.email.toLowerCase(),
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
        };
        users.push(newUser);
        localStorage.setItem('autograde_users', JSON.stringify(users));
        // All validation passed - redirect to login page with success message
        router.push('/login?signup=success');
    };
    const getPasswordStrengthColor = ()=>{
        switch(passwordStrength){
            case 'weak':
                return 'var(--color-error)';
            case 'medium':
                return 'var(--color-warning)';
            case 'strong':
                return 'var(--color-success)';
            default:
                return 'var(--color-border)';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden",
                style: {
                    background: 'linear-gradient(135deg, #6B0000 0%, #3A0000 100%)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center z-10 px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8 flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"], {
                                    className: "w-20 h-20 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 147,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-white mb-4",
                            style: {
                                fontSize: '28px',
                                fontWeight: 700,
                                lineHeight: '36px'
                            },
                            children: "AutoGrade"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-white/80",
                            style: {
                                fontSize: '18px',
                                lineHeight: '26px'
                            },
                            children: "University of Louisiana Monroe"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-white/70 mt-2",
                            style: {
                                fontSize: '14px',
                                lineHeight: '22px'
                            },
                            children: "Automated Grading System for Faculty"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-12 text-left max-w-md mx-auto space-y-4",
                            children: [
                                'Automated code grading and testing',
                                'Real-time student performance analytics',
                                'AI-powered plagiarism detection',
                                'Seamless Canvas LMS integration'
                            ].map((feature, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                            className: "w-5 h-5 text-[var(--color-gold-accent)] flex-shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 169,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white/80",
                                            style: {
                                                fontSize: '14px',
                                                lineHeight: '22px'
                                            },
                                            children: feature
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 170,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex items-center justify-center bg-white px-8 overflow-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-md py-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:hidden mb-8 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                                    style: {
                                        backgroundColor: 'var(--color-primary)'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"], {
                                        className: "w-10 h-10 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontSize: '22px',
                                        fontWeight: 600,
                                        lineHeight: '30px',
                                        color: 'var(--color-text-dark)'
                                    },
                                    children: "AutoGrade"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 183,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "mb-2",
                                    style: {
                                        fontSize: '28px',
                                        fontWeight: 700,
                                        lineHeight: '36px',
                                        color: 'var(--color-text-dark)'
                                    },
                                    children: "Create Faculty Account"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '14px',
                                        lineHeight: '22px',
                                        color: 'var(--color-text-mid)'
                                    },
                                    children: "Join the AutoGrade system and streamline your grading workflow"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "firstName",
                                                    className: "block mb-2",
                                                    style: {
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        lineHeight: '18px',
                                                        color: 'var(--color-text-dark)'
                                                    },
                                                    children: "First Name *"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "firstName",
                                                    type: "text",
                                                    placeholder: "John",
                                                    value: formData.firstName,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            firstName: e.target.value
                                                        }),
                                                    className: "h-11 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 204,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "lastName",
                                                    className: "block mb-2",
                                                    style: {
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        lineHeight: '18px',
                                                        color: 'var(--color-text-dark)'
                                                    },
                                                    children: "Last Name *"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "lastName",
                                                    type: "text",
                                                    placeholder: "Doe",
                                                    value: formData.lastName,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            lastName: e.target.value
                                                        }),
                                                    className: "h-11 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "email",
                                            className: "block mb-2",
                                            style: {
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                lineHeight: '18px',
                                                color: 'var(--color-text-dark)'
                                            },
                                            children: "ULM Email Address *"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 244,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "email",
                                            type: "email",
                                            placeholder: "professor@ulm.edu",
                                            value: formData.email,
                                            onChange: (e)=>{
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value
                                                });
                                                setEmailError(null);
                                            },
                                            onBlur: (e)=>{
                                                const error = validateULMEmail(e.target.value);
                                                setEmailError(error);
                                            },
                                            className: `h-11 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] ${emailError ? 'border-[var(--color-error)]' : ''}`,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 251,
                                            columnNumber: 15
                                        }, this),
                                        emailError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1",
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--color-error)'
                                            },
                                            children: emailError
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 269,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-[var(--color-text-light)]",
                                            style: {
                                                fontSize: '12px'
                                            },
                                            children: "Must be a @ulm.edu email address"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 273,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "password",
                                            className: "block mb-2",
                                            style: {
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                lineHeight: '18px',
                                                color: 'var(--color-text-dark)'
                                            },
                                            children: "Password *"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "password",
                                                    type: showPassword ? 'text' : 'password',
                                                    placeholder: "Create a strong password",
                                                    value: formData.password,
                                                    onChange: (e)=>handlePasswordChange(e.target.value),
                                                    className: "h-11 pr-12 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 289,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowPassword(!showPassword),
                                                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-mid)] hover:text-[var(--color-text-dark)]",
                                                    "aria-label": showPassword ? 'Hide password' : 'Show password',
                                                    children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 35
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 68
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this),
                                        formData.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-1 flex-1 rounded-full transition-colors",
                                                            style: {
                                                                backgroundColor: passwordStrength ? getPasswordStrengthColor() : 'var(--color-border)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                            lineNumber: 312,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-1 flex-1 rounded-full transition-colors",
                                                            style: {
                                                                backgroundColor: passwordStrength && passwordStrength !== 'weak' ? getPasswordStrengthColor() : 'var(--color-border)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                            lineNumber: 316,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-1 flex-1 rounded-full transition-colors",
                                                            style: {
                                                                backgroundColor: passwordStrength === 'strong' ? getPasswordStrengthColor() : 'var(--color-border)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '12px',
                                                        color: getPasswordStrengthColor()
                                                    },
                                                    children: [
                                                        "Password strength: ",
                                                        passwordStrength
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 310,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-[var(--color-text-light)]",
                                            style: {
                                                fontSize: '12px'
                                            },
                                            children: "At least 6 characters"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 330,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "confirmPassword",
                                            className: "block mb-2",
                                            style: {
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                lineHeight: '18px',
                                                color: 'var(--color-text-dark)'
                                            },
                                            children: "Confirm Password *"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 337,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "confirmPassword",
                                                    type: showConfirmPassword ? 'text' : 'password',
                                                    placeholder: "Re-enter your password",
                                                    value: formData.confirmPassword,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            confirmPassword: e.target.value
                                                        }),
                                                    className: "h-11 pr-12 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowConfirmPassword(!showConfirmPassword),
                                                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-mid)] hover:text-[var(--color-text-dark)]",
                                                    "aria-label": showConfirmPassword ? 'Hide password' : 'Show password',
                                                    children: showConfirmPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                        lineNumber: 360,
                                                        columnNumber: 42
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                        lineNumber: 360,
                                                        columnNumber: 75
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 344,
                                            columnNumber: 15
                                        }, this),
                                        formData.confirmPassword && formData.password !== formData.confirmPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1",
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--color-error)'
                                            },
                                            children: "Passwords do not match"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 336,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-2 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                            id: "terms",
                                            checked: formData.agreeToTerms,
                                            onCheckedChange: (checked)=>setFormData({
                                                    ...formData,
                                                    agreeToTerms: checked
                                                }),
                                            className: "mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 372,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "terms",
                                            className: "cursor-pointer select-none",
                                            style: {
                                                fontSize: '13px',
                                                lineHeight: '18px',
                                                color: 'var(--color-text-dark)'
                                            },
                                            children: [
                                                "I agree to the",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    className: "hover:underline",
                                                    style: {
                                                        color: 'var(--color-primary)'
                                                    },
                                                    children: "Terms of Service"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 17
                                                }, this),
                                                ' ',
                                                "and",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    className: "hover:underline",
                                                    style: {
                                                        color: 'var(--color-primary)'
                                                    },
                                                    children: "Privacy Policy"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 378,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 371,
                                    columnNumber: 13
                                }, this),
                                formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 rounded-lg flex items-start gap-3",
                                    style: {
                                        backgroundColor: 'var(--color-error-bg)',
                                        border: '1px solid var(--color-error)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                            className: "w-5 h-5 flex-shrink-0 mt-0.5",
                                            style: {
                                                color: 'var(--color-error)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 403,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '14px',
                                                color: 'var(--color-error)'
                                            },
                                            children: formError
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 404,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 396,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    className: "w-full h-11 text-white hover:opacity-90 transition-opacity",
                                    style: {
                                        backgroundColor: 'var(--color-primary)',
                                        fontSize: '14px',
                                        fontWeight: 500
                                    },
                                    children: "Create Account"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 411,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-center",
                                    style: {
                                        fontSize: '13px',
                                        lineHeight: '18px',
                                        color: 'var(--color-text-light)'
                                    },
                                    children: [
                                        "Already have an account?",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>router.push('/login'),
                                            className: "hover:underline",
                                            style: {
                                                color: 'var(--color-primary)',
                                                fontWeight: 500
                                            },
                                            children: "Sign In"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 426,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 424,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-center",
                                    style: {
                                        fontSize: '13px',
                                        lineHeight: '18px',
                                        color: 'var(--color-text-light)'
                                    },
                                    children: [
                                        "Need assistance? Contact",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "mailto:support@ulm.edu",
                                            className: "hover:underline",
                                            style: {
                                                color: 'var(--color-primary)'
                                            },
                                            children: "support@ulm.edu"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                            lineNumber: 439,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                                    lineNumber: 437,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_s(SignupPage, "/g7YvDdOQcipKuj1axKm8KMgDUc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SignupPage;
var _c;
__turbopack_context__.k.register(_c, "SignupPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/signup/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Signup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$SignupPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/components/SignupPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/src/utils/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Autograder/Untitled/autograder/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Signup() {
    _s();
    const { isAuthenticated, signup } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Signup.useEffect": ()=>{
            if (isAuthenticated) router.replace('/courses');
        }
    }["Signup.useEffect"], [
        isAuthenticated,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$components$2f$SignupPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignupPage"], {
        onSignup: ()=>{
            try {
                const stored = localStorage.getItem('autograde_current_user');
                if (stored) {
                    const userData = JSON.parse(stored);
                    signup(userData);
                } else {
                    signup();
                }
            } catch  {
                signup();
            }
            router.push('/courses');
        }
    }, void 0, false, {
        fileName: "[project]/Desktop/Autograder/Untitled/autograder/frontend/src/app/signup/page.tsx",
        lineNumber: 16,
        columnNumber: 12
    }, this);
}
_s(Signup, "91hm8K16Y6dw7MczK61bjuz71Ho=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$src$2f$utils$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Autograder$2f$Untitled$2f$autograder$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Signup;
var _c;
__turbopack_context__.k.register(_c, "Signup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Autograder_Untitled_autograder_frontend_src_769c1072._.js.map