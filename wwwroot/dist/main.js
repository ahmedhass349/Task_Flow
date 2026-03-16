/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ReactApp/styles/index.css"
/*!***********************************!*\
  !*** ./ReactApp/styles/index.css ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./ReactApp/App.tsx"
/*!**************************!*\
  !*** ./ReactApp/App.tsx ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routes */ "./ReactApp/routes.tsx");
/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./context/AuthContext */ "./ReactApp/context/AuthContext.tsx");




function App() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_3__.AuthProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_1__.RouterProvider, { router: _routes__WEBPACK_IMPORTED_MODULE_2__.router }) }));
}


/***/ },

/***/ "./ReactApp/Components/AuthFooter.tsx"
/*!********************************************!*\
  !*** ./ReactApp/Components/AuthFooter.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthFooter: () => (/* binding */ AuthFooter)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

function AuthFooter() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2.5 text-sm font-normal text-foreground tracking-[0.15px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "hover:underline leading-[1.43] cursor-pointer bg-transparent border-none p-0", children: "Terms and conditions" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "5", height: "5", viewBox: "0 0 5 5", fill: "none", className: "shrink-0", "aria-hidden": "true", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "2.5", cy: "2.5", r: "2.5", fill: "black" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "hover:underline leading-[1.43] cursor-pointer bg-transparent border-none p-0", children: "Privacy policy" })] }));
}


/***/ },

/***/ "./ReactApp/Components/CalendarWidget.tsx"
/*!************************************************!*\
  !*** ./ReactApp/Components/CalendarWidget.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CalendarWidget)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-left.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-right.js");


const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function CalendarWidget({ year, month, selectedDay, onYearChange, onMonthChange, onDaySelect }) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0, Sun=6
    const goToPrevMonth = () => {
        if (month === 0) {
            onYearChange(year - 1);
            onMonthChange(11);
        }
        else
            onMonthChange(month - 1);
        onDaySelect(1);
    };
    const goToNextMonth = () => {
        if (month === 11) {
            onYearChange(year + 1);
            onMonthChange(0);
        }
        else
            onMonthChange(month + 1);
        onDaySelect(1);
    };
    // Build 42-cell grid (6 rows × 7 cols)
    const cells = [];
    for (let i = firstWeekday - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, type: 'prev' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, type: 'current' });
    }
    let nd = 1;
    while (cells.length < 42)
        cells.push({ day: nd++, type: 'next' });
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-[372px] p-6 bg-[#171717] shadow-[0_0_6px_rgba(0,0,0,0.25)] rounded-[30px] flex flex-col gap-3.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: goToPrevMonth, className: "text-white flex items-center cursor-pointer", "aria-label": "Previous month", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-white text-xl font-['Poppins'] font-medium tracking-[0.6px]", children: [MONTH_NAMES[month], " ", selectedDay, ", ", year] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: goToNextMonth, className: "text-white flex items-center cursor-pointer", "aria-label": "Next month", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 20 }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-center items-center gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => onYearChange(year - 1), className: "text-white/60 flex items-center cursor-pointer", "aria-label": "Previous year", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { size: 16 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white/60 text-[13px] font-['Poppins'] font-normal tracking-[0.39px]", children: year }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => onYearChange(year + 1), className: "text-white/60 flex items-center cursor-pointer", "aria-label": "Next year", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 16 }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-7", children: DAY_LABELS.map(d => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-9 flex items-center justify-center text-white text-[13px] font-['Poppins'] font-normal tracking-[0.39px]", children: d }, d))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-7 gap-y-1", role: "grid", "aria-label": "Calendar dates", children: cells.map((cell, i) => {
                    const isSelected = cell.type === 'current' && cell.day === selectedDay;
                    const isOther = cell.type !== 'current';
                    const innerClasses = [
                        'w-9 h-9 flex items-center justify-center rounded-full text-sm font-[\'Poppins\'] font-normal tracking-[0.42px] transition-colors duration-150',
                        isSelected ? 'bg-[#60B8FF] text-white' : '',
                        !isSelected && isOther ? 'text-white/30' : '',
                        !isSelected && !isOther ? 'text-white hover:bg-white/10' : '',
                    ].join(' ');
                    if (isOther) {
                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-9 flex items-center justify-center", "aria-hidden": "true", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: innerClasses, children: cell.day }) }, i));
                    }
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => onDaySelect(cell.day), className: "h-9 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0", "aria-label": `${MONTH_NAMES[month]} ${cell.day}`, "aria-pressed": isSelected, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: innerClasses, children: cell.day }) }, i));
                }) })] }));
}


/***/ },

/***/ "./ReactApp/Components/DashboardCard.tsx"
/*!***********************************************!*\
  !*** ./ReactApp/Components/DashboardCard.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DashboardCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

function DashboardCard({ title, icon: Icon, action, emptyState, children }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border-b border-gray-200 px-6 py-4 flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [Icon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, { className: "size-5 text-gray-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "font-semibold text-gray-900", children: title })] }), action && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: action.onClick, className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: action.label }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6", children: emptyState && !children ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(emptyState.icon, { className: "size-8 text-gray-400" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-500 mb-4", children: emptyState.message }), emptyState.action && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: emptyState.action.onClick, className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: emptyState.action.label }))] })) : (children) })] }));
}


/***/ },

/***/ "./ReactApp/Components/ErrorBoundary.tsx"
/*!***********************************************!*\
  !*** ./ReactApp/Components/ErrorBoundary.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ErrorBoundary)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");


function ErrorBoundary() {
    const error = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useRouteError)();
    let errorMessage;
    if ((0,react_router__WEBPACK_IMPORTED_MODULE_1__.isRouteErrorResponse)(error)) {
        errorMessage = error.statusText || error.data;
    }
    else if (error instanceof Error) {
        errorMessage = error.message;
    }
    else if (typeof error === 'string') {
        errorMessage = error;
    }
    else {
        errorMessage = 'Unknown error';
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center max-w-md", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Oops!" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mb-2", children: "Something went wrong." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mb-6", children: errorMessage }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", { href: "/", className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block transition-colors", children: "Go back home" })] }) }));
}


/***/ },

/***/ "./ReactApp/Components/Footer.tsx"
/*!****************************************!*\
  !*** ./ReactApp/Components/Footer.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Footer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/github.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/linkedin.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/twitter.js");



const COLUMNS = [
    {
        heading: "Help & Support",
        links: [
            "Help Center",
            "Getting Started Guide",
            "Video Tutorials",
            "Contact Support",
            "System Status",
            "Report a Bug",
        ],
    },
    {
        heading: "Community",
        links: [
            "Community Forum",
            "Feature Requests",
        ],
    },
    {
        heading: "Product",
        links: [
            "What's New",
            "Integrations",
            "Mobile Apps",
            "API Documentation",
            "Changelog",
            "Roadmap",
        ],
    },
    {
        heading: "Company",
        links: [
            "About Us",
            "Blog",
            "Careers",
            "Press",
            "Investors",
            "Partners",
        ],
    },
];
const BOTTOM_LINKS = ["Terms of Service", "Privacy Policy", "Cookie Policy", "Security"];
function Footer() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("footer", { style: { background: "#F7F7F7", borderTop: "1px solid #DDDDDD", fontFamily: "Roboto, sans-serif" }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "48px 24px 32px" }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }, children: COLUMNS.map((col) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { style: {
                                    color: "#222222",
                                    fontSize: 14,
                                    fontWeight: 800,
                                    lineHeight: "18px",
                                }, children: col.heading }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: col.links.map((text) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", style: {
                                        color: "#222222",
                                        fontSize: 14,
                                        fontWeight: 400,
                                        lineHeight: "18px",
                                        cursor: "pointer",
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        textAlign: "left",
                                    }, onMouseEnter: (e) => (e.currentTarget.style.textDecoration = "underline"), onMouseLeave: (e) => (e.currentTarget.style.textDecoration = "none"), children: text }, text))) })] }, col.heading))) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "24px",
                    borderTop: "1px solid #DDDDDD",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { style: { color: "#222222", fontSize: 14, fontWeight: 400, lineHeight: "18px" }, children: ["\u00A9 ", new Date().getFullYear(), " TaskFlow, Inc."] }), BOTTOM_LINKS.map((text) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { style: { color: "#222222", fontSize: 14 }, "aria-hidden": "true", children: "\u00B7" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", style: {
                                            color: "#222222",
                                            fontSize: 14,
                                            fontWeight: 400,
                                            lineHeight: "18px",
                                            cursor: "pointer",
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                        }, onMouseEnter: (e) => (e.currentTarget.style.textDecoration = "underline"), onMouseLeave: (e) => (e.currentTarget.style.textDecoration = "none"), children: text })] }, text)))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 24 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", { href: "https://github.com", target: "_blank", rel: "noreferrer", "aria-label": "GitHub", style: { color: "#222222", display: "flex" }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 18 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", { href: "https://twitter.com", target: "_blank", rel: "noreferrer", "aria-label": "Twitter", style: { color: "#222222", display: "flex" }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 18 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", { href: "https://linkedin.com", target: "_blank", rel: "noreferrer", "aria-label": "LinkedIn", style: { color: "#222222", display: "flex" }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 18 }) })] })] })] }));
}


/***/ },

/***/ "./ReactApp/Components/Header.tsx"
/*!****************************************!*\
  !*** ./ReactApp/Components/Header.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-user.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bell.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/log-out.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/settings.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.js");
/* harmony import */ var _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @radix-ui/react-dropdown-menu */ "./node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _data_notifications__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../data/notifications */ "./ReactApp/data/notifications.ts");
/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../context/AuthContext */ "./ReactApp/context/AuthContext.tsx");







const INITIAL_MSGS = [
    { id: 1, avatar: "SC", name: "Sarah Chen", preview: "Can you review the latest mockups when you get a chance?", time: "Just now", unread: true },
    { id: 2, avatar: "MJ", name: "Mike Johnson", preview: "The API docs are ready for review.", time: "10 min ago", unread: true },
    { id: 3, avatar: "AK", name: "Alex Kim", preview: "Pushed the backend fix. Let me know if it resolves it.", time: "45 min ago", unread: true },
    { id: 4, avatar: "ER", name: "Emily Rodriguez", preview: "Thanks for the feedback on the wireframes!", time: "2 hr ago", unread: false },
    { id: 5, avatar: "DT", name: "Dev Team", preview: "Standup is moved to 10 AM tomorrow.", time: "Yesterday", unread: false },
];
const AVATAR_COLORS = {
    SC: "bg-pink-200 text-pink-700",
    MJ: "bg-blue-200 text-blue-700",
    AK: "bg-green-200 text-green-700",
    ER: "bg-purple-200 text-purple-700",
    DT: "bg-orange-200 text-orange-700",
};
/* ═══════════════════════════════ */
function Header() {
    const [notifs, setNotifs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(_data_notifications__WEBPACK_IMPORTED_MODULE_11__.SEED_NOTIFICATIONS);
    const [msgs, setMsgs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(INITIAL_MSGS);
    const navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_10__.useNavigate)();
    const { user, logout } = (0,_context_AuthContext__WEBPACK_IMPORTED_MODULE_12__.useAuth)();
    const displayName = user ? `${user.firstName} ${user.lastName}` : "Demo User";
    const initials = user
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : "DU";
    const unreadNotifCount = notifs.filter(n => n.unread).length;
    const unreadMsgCount = msgs.filter(m => m.unread).length;
    const markAllNotifsRead = () => setNotifs(n => n.map(x => (Object.assign(Object.assign({}, x), { unread: false }))));
    const markAllMsgsRead = () => setMsgs(m => m.map(x => (Object.assign(Object.assign({}, x), { unread: false }))));
    const markNotifRead = (id) => setNotifs(n => n.map(x => x.id === id ? Object.assign(Object.assign({}, x), { unread: false }) : x));
    const markMsgRead = (id) => setMsgs(m => m.map(x => x.id === id ? Object.assign(Object.assign({}, x), { unread: false }) : x));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("header", { className: "bg-black h-16 flex items-center px-8 gap-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 max-w-[417px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4", style: { color: '#787486' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", placeholder: "Search for report...", "aria-label": "Search for report", style: { background: '#F5F5F5', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#787486' }, className: "w-full pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex items-center justify-end gap-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Root, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Trigger, { asChild: true, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "relative p-2 outline-none rounded-lg transition-colors hover:bg-white/10", "aria-label": "Notifications", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-6 text-white" }), unreadNotifCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#FF1267] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5", children: unreadNotifCount }))] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Portal, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Content, { className: "bg-white border border-gray-200 rounded-xl shadow-xl w-80 z-50 overflow-hidden", sideOffset: 10, align: "end", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-gray-100", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-semibold text-gray-900 text-sm", children: "Notifications" }), unreadNotifCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: markAllNotifsRead, className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "Mark all as read" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "max-h-[340px] overflow-y-auto", children: notifs.map(n => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Item, { onSelect: () => markNotifRead(n.id), className: `flex items-start gap-3 px-4 py-3 cursor-pointer outline-none border-b border-gray-50 last:border-0 transition-colors ${n.unread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `size-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.iconBg}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(n.icon, { className: `size-4 ${n.iconColor}` }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs font-semibold text-gray-900", children: n.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 mt-0.5 leading-relaxed", children: n.body }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-[11px] text-gray-400 mt-1", children: n.time })] }), n.unread && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" })] }, n.id))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-t border-gray-100 px-4 py-2.5 text-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_10__.Link, { to: "/notifications", className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "View all notifications" }) })] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Root, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Trigger, { asChild: true, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "relative p-2 outline-none rounded-lg transition-colors hover:bg-white/10", "aria-label": "Messages", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "size-6 text-white" }), unreadMsgCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#FF1267] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5", children: unreadMsgCount }))] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Portal, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Content, { className: "bg-white border border-gray-200 rounded-xl shadow-xl w-80 z-50 overflow-hidden", sideOffset: 10, align: "end", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-gray-100", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-semibold text-gray-900 text-sm", children: "Messages" }), unreadMsgCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: markAllMsgsRead, className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "Mark all as read" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "max-h-[340px] overflow-y-auto", children: msgs.map(m => {
                                                var _a;
                                                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Item, { onSelect: () => markMsgRead(m.id), className: `flex items-start gap-3 px-4 py-3 cursor-pointer outline-none border-b border-gray-50 last:border-0 transition-colors ${m.unread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `size-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${(_a = AVATAR_COLORS[m.avatar]) !== null && _a !== void 0 ? _a : "bg-gray-200 text-gray-600"}`, children: m.avatar }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs font-semibold text-gray-900 truncate", children: m.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-[11px] text-gray-400 flex-shrink-0", children: m.time })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 mt-0.5 truncate", children: m.preview })] }), m.unread && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" })] }, m.id));
                                            }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-t border-gray-100 px-4 py-2.5 text-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_10__.Link, { to: "/message", className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "Open messages" }) })] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Root, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Trigger, { className: "flex items-center gap-4 px-4 py-1.5 rounded-full cursor-pointer border-0 outline-none hover:opacity-90 transition-opacity", style: { background: '#242424' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white", style: { fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 500, letterSpacing: '0.48px' }, children: displayName }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-8 rounded-full border border-white bg-brand flex items-center justify-center flex-shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white text-xs font-bold", children: initials }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Portal, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Content, { className: "bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-56 z-50", sideOffset: 8, align: "end", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 px-3 py-3 border-b border-gray-200 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-9 bg-brand rounded-full flex items-center justify-center flex-shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white font-semibold text-sm", children: initials }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 min-w-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "font-semibold text-gray-900 text-sm truncate", children: displayName }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Item, { asChild: true, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_router__WEBPACK_IMPORTED_MODULE_10__.Link, { to: "/settings", className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm", children: "Profile" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Item, { asChild: true, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_router__WEBPACK_IMPORTED_MODULE_10__.Link, { to: "/settings", className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm", children: "Settings" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Item, { className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm", children: "Switch account" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Separator, { className: "h-px bg-gray-200 my-2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_9__.Item, { onSelect: () => {
                                                logout();
                                                navigate("/login");
                                            }, className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm", children: "Log out" })] })] }) })] })] })] }));
}


/***/ },

/***/ "./ReactApp/Components/MyWork/CalendarView.tsx"
/*!*****************************************************!*\
  !*** ./ReactApp/Components/MyWork/CalendarView.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CalendarView)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.js");

// ── CalendarView: weekly time-grid calendar embedded in MyWork ───────────
//
// Shows a dark-sidebar mini-calendar + agenda alongside a weekly time-grid
// with event cards. This is the "Calendar" view mode within My Tasks.

// ── Static data ──────────────────────────────────────────────────────────
const TODAY = 14;
const WEEK_DAYS = [
    { label: "SUN", day: 9 },
    { label: "MON", day: 10 },
    { label: "TUE", day: 11 },
    { label: "WED", day: 12 },
    { label: "THU", day: 13 },
    { label: "FRI", day: 14 },
    { label: "SAT", day: 15 },
];
const CAL_EVENTS = [
    { col: 1, startHour: 8, durationHours: 1, title: "Monthly catch-up", color: "blue", hasLink: true },
    { col: 1, startHour: 9, durationHours: 1, title: "Quarterly review", color: "blue", hasLink: true },
    { col: 1, startHour: 10, durationHours: 1.5, title: "New Employee Welcome Lunch!", color: "violet" },
    { col: 2, startHour: 9, durationHours: 1, title: "City Sales Pitch", color: "blue" },
    { col: 3, startHour: 10, durationHours: 1, title: "Design Review", color: "blue", hasLink: true },
    { col: 4, startHour: 8, durationHours: 1, title: "Follow up proposal", color: "amber", hasLink: true },
    { col: 4, startHour: 11, durationHours: 1, title: "Visit to discuss improvements", color: "blue" },
    { col: 5, startHour: 9, durationHours: 1, title: "Presentation of new products", color: "blue" },
    { col: 5, startHour: 13, durationHours: 1, title: "Design Review", color: "blue", hasLink: true },
    { col: 6, startHour: 10, durationHours: 1, title: "1:1 with Jon", color: "amber", hasLink: true },
];
const COLOR_CLASSES = {
    blue: { bg: "bg-sky-50", bar: "bg-sky-400", text: "text-sky-700", time: "text-sky-600" },
    violet: { bg: "bg-violet-50", bar: "bg-violet-500", text: "text-violet-700", time: "text-violet-600" },
    amber: { bg: "bg-amber-50", bar: "bg-amber-400", text: "text-amber-700", time: "text-amber-600" },
};
const HOUR_ROWS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const ROW_HEIGHT = 64;
const START_HOUR = 7;
function formatHour(h) {
    if (h === 12)
        return "12 PM";
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
}
// ── Mini Calendar Sub-component ──────────────────────────────────────────
function MiniCalendar({ taskDotsByDay }) {
    // March 2026 starts on Sunday
    const miniCalDays = [
        ...Array.from({ length: 31 }, (_, i) => i + 1),
    ];
    while (miniCalDays.length % 7 !== 0)
        miniCalDays.push(null);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-7 mb-0.5", children: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-center text-[9px] font-bold text-zinc-500 py-0.5", children: d }, d))) }), Array.from({ length: miniCalDays.length / 7 }, (_, week) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-7", children: miniCalDays.slice(week * 7, week * 7 + 7).map((day, cellIdx) => {
                    var _a;
                    const dots = day ? ((_a = taskDotsByDay[day]) !== null && _a !== void 0 ? _a : []) : [];
                    const isToday = day === TODAY;
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-col items-center py-0.5", children: isToday ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "size-6 rounded-full bg-blue-500 flex flex-col items-center justify-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[10px] font-bold text-white leading-none", children: day }), dots.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-1 rounded-full bg-white mt-px" }))] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `text-[10px] font-semibold leading-4 ${day === null ? "text-transparent" : day > 28 || day < 1 ? "text-zinc-600" : "text-white"}`, children: day !== null && day !== void 0 ? day : "" }), dots.length > 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex gap-0.5 mt-px", children: dots.slice(0, 3).map((dotColor, di) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-1 rounded-full", style: { background: dotColor } }, di))) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-1.5" }))] })) }, cellIdx));
                }) }, week)))] }));
}
// ── Agenda Sidebar Sub-component ─────────────────────────────────────────
function AgendaSidebar() {
    const todayEvents = [
        { time: "8:30 AM", title: "Monthly catch-up", color: "#3B82F6", link: true },
        { time: "9:00 AM", title: "Quarterly review", color: "#3B82F6", link: true },
    ];
    const upcomingSections = [
        {
            label: "TOMORROW",
            date: "3/15/2026",
            events: [{ time: "9:00 AM", title: "City Sales Pitch", color: "#EC4899", link: true }],
        },
        {
            label: "MONDAY",
            date: "3/16/2026",
            events: [
                { time: "10:00 AM", title: "Design Review", color: "#3B82F6", link: true },
                { time: "2:00 PM", title: "1:1 with Jon", color: "#FBBF24", link: true },
            ],
        },
    ];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-2.5 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs font-bold text-blue-500", children: "TODAY" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs text-blue-500", children: "3/14/2026" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs text-white/60 font-semibold", children: "55deg/40deg" })] }), todayEvents.map((ev, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-0.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-2.5 rounded-full shrink-0", style: { background: ev.color } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[10px] text-zinc-400 font-semibold", children: ev.time }), ev.link && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-3 rounded-full bg-zinc-400 inline-flex items-center justify-center text-zinc-900 text-[9px] font-bold", children: "&nearr;" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pl-4 text-[11px] text-white", children: ev.title })] }, i))), upcomingSections.map((section, si) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex justify-between", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs font-bold text-white/60", children: section.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs text-white/60", children: section.date })] }) }), section.events.map((ev, ei) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-0.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-2.5 rounded-full shrink-0", style: { background: ev.color } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[10px] text-zinc-400 font-semibold", children: ev.time })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pl-4 text-[11px] text-white", children: ev.title })] }, ei)))] }, si)))] }));
}
// ── Main CalendarView Component ──────────────────────────────────────────
function CalendarView({ visibleTasks }) {
    // Build task-dot map for mini-calendar
    const taskDotsByDay = visibleTasks.reduce((acc, task) => {
        if (!task.dueDay)
            return acc;
        if (!acc[task.dueDay])
            acc[task.dueDay] = [];
        const color = task.priority === "high" ? "#EF4444" :
            task.priority === "medium" ? "#A855F7" :
                "#2DD4BF";
        acc[task.dueDay].push(color);
        return acc;
    }, {});
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex", style: { minHeight: 700 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("aside", { className: "w-[280px] shrink-0 bg-zinc-900 flex flex-col gap-4 p-4 overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex gap-1.5 items-center", children: [
                            { bg: "#ED6B60", border: "#D05147" },
                            { bg: "#F5C250", border: "#D6A343" },
                            { bg: "#62C656", border: "#52A842" },
                        ].map((c, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-3 rounded-full inline-block", style: { background: c.bg, border: `1px solid ${c.border}` } }, i))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-1 items-baseline", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white text-[22px]", children: "March" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-red-500 text-[22px]", children: "2026" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex", children: ["\u2039", "\u203A"].map((ch, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": i === 0 ? "Previous month" : "Next month", className: "bg-transparent border-none text-white text-lg cursor-pointer px-1 leading-none opacity-70 hover:opacity-100", children: ch }, i))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MiniCalendar, { taskDotsByDay: taskDotsByDay }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-px bg-zinc-800" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AgendaSidebar, {})] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 bg-white flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-4 py-2.5 border-b border-gray-200 flex items-center justify-between gap-2 bg-white", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex gap-px", children: ["\u2039", "Today", "\u203A"].map((label, li) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": li === 0 ? "Previous week" : li === 2 ? "Next week" : undefined, className: `bg-gray-100 border-none cursor-pointer text-xs text-gray-900 ${label === "Today" ? "px-3 py-1" : "px-2 py-1"} ${li === 0 ? "rounded-l-md" : li === 2 ? "rounded-r-md" : ""}`, children: label }, li))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex gap-1", children: ["Day", "Week", "Month", "Year"].map((label) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `px-3.5 py-1 rounded-lg border-none cursor-pointer text-[13px] ${label === "Week"
                                        ? "bg-red-600 text-white font-semibold"
                                        : "bg-transparent text-zinc-500"}`, children: label }, label))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1.5 bg-gray-100 rounded-md px-2 py-1", style: { minWidth: 160 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { className: "size-3.5 text-gray-400" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs text-zinc-400", children: "Search" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 overflow-y-auto relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid border-b border-gray-200 sticky top-0 bg-white z-10", style: { gridTemplateColumns: "48px repeat(7, 1fr)" }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-1.5 text-right text-[10px] text-zinc-500 border-r border-gray-200", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "EST" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "GMT-5" })] }), WEEK_DAYS.map((wd) => {
                                        const isWeekToday = wd.day === TODAY;
                                        const isWeekend = wd.label === "SUN" || wd.label === "SAT";
                                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `px-2 py-1.5 border-l border-gray-200 ${isWeekToday ? "bg-blue-50" : isWeekend ? "bg-gray-50" : "bg-white"}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-[10px] font-bold text-zinc-500 uppercase", children: wd.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `text-[22px] leading-tight ${isWeekToday ? "text-blue-700" : "text-gray-900"}`, children: wd.day })] }, wd.day));
                                    })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid relative", style: { gridTemplateColumns: "48px repeat(7, 1fr)" }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-r border-gray-200", children: HOUR_ROWS.map((hour) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-start justify-end pr-1.5 pt-1 text-[11px] text-zinc-500 border-t border-gray-200", style: { height: ROW_HEIGHT }, children: formatHour(hour) }, hour))) }), WEEK_DAYS.map((wd, colIdx) => {
                                        const isWeekend = wd.label === "SUN" || wd.label === "SAT";
                                        const isWeekToday = wd.day === TODAY;
                                        const columnEvents = CAL_EVENTS.filter((e) => e.col === colIdx);
                                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative border-l border-gray-200 ${isWeekToday ? "bg-blue-50" : isWeekend ? "bg-gray-50" : "bg-white"}`, children: [HOUR_ROWS.map((hour) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-t border-gray-200", style: { height: ROW_HEIGHT }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-t border-dashed border-gray-100", style: { marginTop: ROW_HEIGHT / 2 - 1 } }) }, hour))), columnEvents.map((ev, ei) => {
                                                    const topPx = (ev.startHour - START_HOUR) * ROW_HEIGHT + 1;
                                                    const heightPx = ev.durationHours * ROW_HEIGHT - 4;
                                                    const cc = COLOR_CLASSES[ev.color];
                                                    const startLabel = formatHour(ev.startHour).replace(" ", ":00 ");
                                                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `absolute left-0.5 right-0.5 rounded-md overflow-hidden flex cursor-pointer ${cc.bg}`, style: { top: topPx, height: heightPx }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `w-[3px] shrink-0 ${cc.bar}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 p-1 flex flex-col gap-0.5 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `text-[10px] font-semibold ${cc.time}`, children: startLabel }), ev.hasLink && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `size-3 rounded-full inline-flex items-center justify-center text-[8px] text-white shrink-0 ${cc.bar}`, children: "&nearr;" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `text-[11px] font-semibold leading-snug overflow-hidden ${cc.text}`, style: {
                                                                            display: "-webkit-box",
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: "vertical",
                                                                        }, children: ev.title })] })] }, ei));
                                                })] }, wd.day));
                                    })] })] })] })] }));
}


/***/ },

/***/ "./ReactApp/Components/MyWork/DefaultView.tsx"
/*!****************************************************!*\
  !*** ./ReactApp/Components/MyWork/DefaultView.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DefaultView)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-alert.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/square-check-big.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-ellipsis.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/star.js");
/* harmony import */ var _TaskItem__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../TaskItem */ "./ReactApp/Components/TaskItem.tsx");

// ── DefaultView: grouped task list ──────────────────────────────────────
//
// Renders tasks grouped by due-date buckets (Overdue, Today, This Week,
// Later, Completed) using the TaskItem component.


function TaskGroup({ title, icon, tasks, tone = "neutral", }) {
    if (!tasks.length)
        return null;
    const headerTone = tone === "danger"
        ? "bg-red-50 border-red-200 text-red-900"
        : tone === "warning"
            ? "bg-amber-50 border-amber-200 text-amber-900"
            : "bg-white border-gray-200 text-gray-900";
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `border-b px-6 py-4 flex items-center justify-between ${headerTone}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [icon, (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "font-semibold", children: title })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs px-2 py-1 rounded-full bg-white/80 border border-gray-200", children: [tasks.length, " task", tasks.length > 1 ? "s" : ""] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-4 space-y-1", children: tasks.map((task) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 rounded-lg border border-transparent hover:border-gray-100", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 min-w-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_TaskItem__WEBPACK_IMPORTED_MODULE_6__["default"], { title: task.title, project: task.project, dueDate: task.dueDateLabel, assignee: task.assignee, priority: task.status === "completed" ? undefined : task.priority, completed: task.status === "completed" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": task.starred ? "Unstar task" : "Star task", className: "mr-4 p-1.5 text-gray-400 hover:text-yellow-500 transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: `size-4 ${task.starred ? "fill-yellow-400 text-yellow-500" : ""}` }) })] }, task.id))) })] }));
}
function DefaultView({ visibleTasks, grouped, activeTab }) {
    if (visibleTasks.length === 0) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-10 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-7 text-gray-400 mx-auto" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mt-3", children: "No tasks match your filters" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Try changing the search text or priority filter." })] }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-5", children: [activeTab !== "completed" && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TaskGroup, { title: "Overdue", icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { className: "size-5 text-red-600" }), tasks: grouped.overdue, tone: "danger" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TaskGroup, { title: "Today", icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-5 text-amber-600" }), tasks: grouped.today, tone: "warning" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TaskGroup, { title: "This Week", icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-5 text-blue-600" }), tasks: grouped.thisWeek }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TaskGroup, { title: "Later", icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-5 text-gray-500" }), tasks: grouped.later })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TaskGroup, { title: "Completed", icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-5 text-green-600" }), tasks: grouped.completed })] }));
}


/***/ },

/***/ "./ReactApp/Components/MyWork/GanttView.tsx"
/*!**************************************************!*\
  !*** ./ReactApp/Components/MyWork/GanttView.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GanttView)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

const CATEGORIES = {
    "Data Collection": { key: "Data Collection", color: "#2B7FFF", textColor: "#1447E6" },
    "Data Analysis": { key: "Data Analysis", color: "#AD46FF", textColor: "#8200DB" },
    "Strategy Development": { key: "Strategy Development", color: "#00BC7D", textColor: "#007A55" },
    "Final Delivery": { key: "Final Delivery", color: "#FE9A00", textColor: "#BB4D00" },
    "Milestone": { key: "Milestone", color: "#0A0A0A", textColor: "#C70036" },
};
const WEEK_LABELS = ["Jan 19", "Jan 26", "Feb 2", "Feb 9", "Feb 16", "Feb 23", "Mar 2", "Mar 9", "Mar 16", "Mar 23"];
const GANTT_ROWS = [
    { id: "g-01", title: "Extended Survey Distribution", category: "Data Collection", durationLabel: "3 weeks", barLeft: 0, barWidth: 240 },
    { id: "g-02", title: "Stakeholder Interviews", category: "Data Collection", durationLabel: "1 day", barLeft: 34.28, barWidth: 11.43 },
    { id: "g-03", title: "Competitor & Market Research", category: "Data Collection", durationLabel: "1 week", barLeft: 0, barWidth: 91.43 },
    { id: "g-04", title: "Prepare Data for Analysis", category: "Data Analysis", durationLabel: "1 week", barLeft: 240, barWidth: 80 },
    { id: "g-05", title: "Thematic & Statistical Analysis", category: "Data Analysis", durationLabel: "4 weeks", barLeft: 240, barWidth: 320 },
    { id: "g-06", title: "Midterm Presentation", category: "Milestone", durationLabel: "1 day", barLeft: 308.56, barWidth: 11.43, isMilestone: true },
    { id: "g-07", title: "Draft AI-Driven L&D Adoption Strategies", category: "Strategy Development", durationLabel: "4 days", barLeft: 548.56, barWidth: 45.71 },
    { id: "g-08", title: "Stakeholder Feedback Session", category: "Strategy Development", durationLabel: "1 day", barLeft: 571.43, barWidth: 11.43 },
    { id: "g-09", title: "Review & Final Editing", category: "Final Delivery", durationLabel: "1 week", barLeft: 628.56, barWidth: 91.43 },
    { id: "g-10", title: "Final Report Submission", category: "Milestone", durationLabel: "1 day", barLeft: 720, barWidth: 11.43, isMilestone: true },
];
const LEGEND_ITEMS = [
    "Data Collection",
    "Data Analysis",
    "Strategy Development",
    "Final Delivery",
    "Milestone",
];
function GanttView() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl p-8 shadow-sm flex flex-col gap-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-2xl font-medium text-gray-900 leading-9", children: "Capstone Project Gantt Chart" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-base text-gray-500 leading-6", children: "Summary View - January to March 2026" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-b border-gray-200 pb-3 flex items-center gap-5 flex-wrap", children: LEGEND_ITEMS.map((label) => {
                            const cat = CATEGORIES[label];
                            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [label === "Milestone" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-4 relative overflow-hidden shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute", style: {
                                                width: 11.43,
                                                height: 11.43,
                                                left: 2.28,
                                                top: 2.28,
                                                background: "#0A0A0A",
                                                outline: "1.14px #0A0A0A solid",
                                                outlineOffset: "-0.57px",
                                            } }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-4 rounded shrink-0", style: { background: cat.color } })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm text-gray-700 whitespace-nowrap", children: label })] }, label));
                        }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "overflow-x-auto", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-4", style: { minWidth: 976 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { paddingLeft: 256 }, className: "flex", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex", style: { width: 720, borderBottom: "1.6px solid #CAD5E2" }, children: WEEK_LABELS.map((wl) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 text-center text-sm font-medium text-gray-700 leading-5 pb-2", style: { borderLeft: "0.8px solid #E2E8F0" }, children: wl }, wl))) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-col gap-2", children: GANTT_ROWS.map((row) => {
                                        const cat = CATEGORIES[row.category];
                                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative h-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute left-0 top-1.5 flex flex-col pr-4", style: { width: 256 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-gray-900 leading-5 truncate", children: row.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs leading-4", style: { color: cat.textColor }, children: [row.category, " \u2022 ", row.durationLabel] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute top-0 overflow-hidden", style: { left: 256, width: 720, height: 48 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-0 flex", children: WEEK_LABELS.map((_, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 h-full", style: { borderLeft: "0.8px solid #F1F5F9" } }, i))) }), row.isMilestone && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute flex items-center justify-center shadow-md overflow-hidden", style: { left: row.barLeft, top: 8, width: 11.43, height: 24 }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: {
                                                                    width: 9.52,
                                                                    height: 9.52,
                                                                    background: "#0A0A0A",
                                                                    outline: "0.95px #0A0A0A solid",
                                                                    outlineOffset: "-0.48px",
                                                                } }) })), !row.isMilestone && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute flex items-center justify-center overflow-hidden rounded-lg shadow-md", style: {
                                                                left: row.barLeft,
                                                                top: 8,
                                                                width: row.barWidth,
                                                                height: 32,
                                                                background: cat.color,
                                                                outline: `1.6px ${cat.color} solid`,
                                                                outlineOffset: "-1.6px",
                                                            }, children: row.barWidth >= 40 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white text-xs font-medium leading-4 whitespace-nowrap", children: row.durationLabel })) }))] })] }, row.id));
                                    }) })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-center text-sm text-gray-500 leading-5", children: "Current Date: March 14, 2026" })] })] }));
}


/***/ },

/***/ "./ReactApp/Components/MyWork/KanbanView.tsx"
/*!***************************************************!*\
  !*** ./ReactApp/Components/MyWork/KanbanView.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ KanbanView)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

const COLUMNS = [
    { key: "todo", title: "To Do", borderColor: "rgba(255, 167, 38, 0.70)" },
    { key: "inProgress", title: "In Progress", borderColor: "rgba(0, 102, 204, 0.70)" },
    { key: "review", title: "In Review", borderColor: "rgba(108, 75, 153, 0.70)" },
    { key: "completed", title: "Completed", borderColor: "rgba(0, 184, 148, 0.70)" },
];
const PRIORITY_DOT = {
    high: "#EB5757",
    medium: "#F2994A",
    low: "#219653",
};
const STATUS_CHIP = {
    todo: { bg: "rgba(99, 110, 114, 0.10)", color: "#636E72", label: "To Do" },
    inProgress: { bg: "rgba(47, 128, 237, 0.10)", color: "#2F80ED", label: "Ongoing" },
    review: { bg: "rgba(108, 75, 153, 0.10)", color: "#6C4B99", label: "In Review" },
    completed: { bg: "rgba(33, 150, 83, 0.10)", color: "#219653", label: "Done" },
};
function KanbanView({ visibleTasks }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "overflow-x-auto", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-4 gap-4", style: { minWidth: 960 }, children: COLUMNS.map((col) => {
                const colTasks = visibleTasks.filter((t) => t.status === col.key);
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-4 pt-3.5 pb-3 bg-gray-50 rounded-t-2xl flex justify-between items-center", style: { borderTop: `4px solid ${col.borderColor}` }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[17px] font-bold text-gray-900", children: col.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "bg-black/10 rounded-full px-2.5 py-1 text-[13px] font-extrabold text-gray-900", children: colTasks.length })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": `Add task to ${col.title}`, className: "size-7 bg-emerald-500 rounded-md flex items-center justify-center text-white text-lg leading-none font-light", children: "+" })] }), colTasks.map((task) => {
                            const chip = STATUS_CHIP[task.status];
                            const dot = PRIORITY_DOT[task.priority];
                            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-4 bg-white rounded-2xl border border-gray-200 flex flex-col gap-2.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start justify-between gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start gap-2 flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-6 rounded-full shrink-0 flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-4 h-3.5", style: { background: dot } }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-gray-900 leading-5", children: task.title })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0", style: { background: chip.bg, color: chip.color }, children: chip.label })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-xs font-light text-gray-500 leading-[18px]", children: [task.project, " \u2014 work tracked for sprint delivery and review."] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 text-xs", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-4 relative shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute left-0.5 top-px w-3 h-3.5 bg-amber-400 rounded-sm" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-amber-400", children: "Deadline" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-500", children: ":" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-500", children: task.dueDateLabel })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-7 rounded-full border-[1.5px] border-white -mr-2 flex items-center justify-center bg-blue-300", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[10px] font-bold text-blue-800", children: "SC" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-7 rounded-full border-[1.5px] border-white -mr-2 flex items-center justify-center bg-red-300", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[10px] font-bold text-red-900", children: "MJ" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-7 rounded-full border-[1.5px] border-white flex items-center justify-center bg-gray-100", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[9px] font-extrabold text-gray-500", children: "+1" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": "Add assignee", className: "size-7 rounded-full border border-gray-400 flex items-center justify-center ml-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[15px] text-gray-400 leading-none font-light", children: "+" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-3.5 relative", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute left-0.5 top-px w-2.5 h-3.5 bg-gray-400 rounded-sm" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs font-bold text-gray-400", children: "2" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-3.5 relative", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute left-px top-[1.5px] w-3 h-[11px] bg-gray-400 rounded-sm" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs font-bold text-gray-400", children: "3" })] })] })] })] }, task.id));
                        }), colTasks.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "py-8 px-4 bg-white rounded-2xl border border-dashed border-gray-200 flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[13px] text-gray-400", children: "No tasks" }) }))] }, col.key));
            }) }) }));
}


/***/ },

/***/ "./ReactApp/Components/MyWork/TableView.tsx"
/*!**************************************************!*\
  !*** ./ReactApp/Components/MyWork/TableView.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TableView)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);

// ── TableView: spreadsheet-style task list with expandable sub-tasks ────
//
// Renders a columnar grid with expandable rows. Sub-tasks shown in a
// purple-accented nested panel.

const SUB_TASKS = {
    "t-001": [
        { id: "st-1a", title: "Create empty state illustrations", dueDate: "Mar 11", priority: "low", status: "completed" },
        { id: "st-1b", title: "Write empty state copy", dueDate: "Mar 12", priority: "medium", status: "completed" },
        { id: "st-1c", title: "Implement UI component", dueDate: "Mar 14", priority: "high", status: "inProgress" },
        { id: "st-1d", title: "QA review", dueDate: "Mar 16", priority: "medium", status: "todo" },
    ],
};
// ── Badge helpers ─────────────────────────────────────────────────────────
const STATUS_MAP = {
    inProgress: { bg: "#FFFBEB", border: "#C69F10", color: "#C9A41C", label: "In Progress" },
    review: { bg: "#EEF2FF", border: "#6366F1", color: "#4F46E5", label: "In Review" },
    todo: { bg: "#F8FAFC", border: "#94A3B8", color: "#64748B", label: "To Do" },
    completed: { bg: "#F3FFEB", border: "#47AD08", color: "#47AD08", label: "Completed" },
};
const PRIORITY_MAP = {
    high: { bg: "#FFF2F3", border: "#C61F30", color: "#C61F30" },
    medium: { bg: "#FFFBEB", border: "#C69F10", color: "#C9A41C" },
    low: { bg: "#F3FFEB", border: "#47AD08", color: "#47AD08" },
};
function StatusBadge({ status }) {
    const t = STATUS_MAP[status];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "rounded-full text-xs font-medium px-2.5 py-0.5 whitespace-nowrap", style: { background: t.bg, border: `1px solid ${t.border}`, color: t.color }, children: t.label }));
}
function PriorityBadge({ priority }) {
    const t = PRIORITY_MAP[priority];
    const label = priority.charAt(0).toUpperCase() + priority.slice(1);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "rounded-full text-xs font-medium px-2.5 py-0.5 whitespace-nowrap", style: { background: t.bg, border: `1px solid ${t.border}`, color: t.color }, children: label }));
}
// ── Shared grid constants ────────────────────────────────────────────────
const COL_GRID = "52px minmax(180px,2fr) 1fr 1fr 110px 100px 120px";
const SUB_COL_GRID = "40px 1fr 120px 110px 130px";
const DIVIDER_COLOR = "#DCDCDC";
const PURPLE_ACCENT = "#6C4B99";
const headerCellClass = "text-sm font-semibold text-gray-400";
const cellClass = "text-sm";
function TableView({ visibleTasks }) {
    const [expandedRowId, setExpandedRowId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("t-001");
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-6 pt-5 pb-3", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-lg font-semibold text-gray-900", children: "My Tasks" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid items-center gap-2 px-6 pb-2.5", style: { gridTemplateColumns: COL_GRID, borderBottom: `1px solid ${DIVIDER_COLOR}` }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: headerCellClass, children: "Task" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: headerCellClass, children: "Project" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: headerCellClass, children: "Assignee" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: headerCellClass, children: "Due Date" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: headerCellClass, children: "Priority" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: headerCellClass, children: "Status" })] }), visibleTasks.map((task, idx) => {
                const isExpanded = expandedRowId === task.id;
                const hasChildren = !!SUB_TASKS[task.id];
                const isLast = idx === visibleTasks.length - 1;
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { role: hasChildren ? "button" : undefined, tabIndex: hasChildren ? 0 : undefined, onClick: () => hasChildren && setExpandedRowId(isExpanded ? null : task.id), onKeyDown: (e) => {
                                if (hasChildren && (e.key === "Enter" || e.key === " ")) {
                                    e.preventDefault();
                                    setExpandedRowId(isExpanded ? null : task.id);
                                }
                            }, "aria-expanded": hasChildren ? isExpanded : undefined, className: "grid items-center gap-2 px-6 py-3", style: {
                                gridTemplateColumns: COL_GRID,
                                cursor: hasChildren ? "pointer" : "default",
                                borderTop: isExpanded ? `1px solid ${PURPLE_ACCENT}` : "none",
                                borderBottom: isExpanded ? "none" : !isLast ? `1px solid ${DIVIDER_COLOR}` : "none",
                            }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-6 rounded-full flex items-center justify-center shrink-0", style: { background: isExpanded ? PURPLE_ACCENT : "#D9D9D9" }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-[10.67px] h-[10.67px] rounded-sm", style: { background: isExpanded ? "#fff" : "#555555" } }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${cellClass} font-semibold text-gray-900`, children: task.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${cellClass} text-gray-600`, children: task.project }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${cellClass} text-gray-600`, children: task.assignee }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${cellClass} text-gray-600`, children: task.dueDateLabel }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PriorityBadge, { priority: task.priority }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(StatusBadge, { status: task.status }) })] }), isExpanded && hasChildren && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                                borderBottom: `1px solid ${PURPLE_ACCENT}`,
                                borderLeft: `4px solid ${PURPLE_ACCENT}`,
                                background: "#FAF6FF",
                            }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid items-center gap-2 px-5 py-2 bg-gray-100 rounded-t", style: {
                                        gridTemplateColumns: SUB_COL_GRID,
                                        border: `1px solid ${DIVIDER_COLOR}`,
                                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${headerCellClass} text-xs`, children: "Sub-Task" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${headerCellClass} text-xs`, children: "Due Date" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${headerCellClass} text-xs`, children: "Priority" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${headerCellClass} text-xs`, children: "Status" })] }), SUB_TASKS[task.id].map((sub) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid items-center gap-2 px-5 py-2.5 bg-white", style: {
                                        gridTemplateColumns: SUB_COL_GRID,
                                        border: `1px solid ${DIVIDER_COLOR}`,
                                        borderTop: "none",
                                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-5 rounded-full bg-gray-300 flex items-center justify-center shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-2 h-2 bg-gray-600 rounded-[1.5px]" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-[13px] text-gray-900", children: sub.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-[13px] text-gray-600", children: sub.dueDate }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PriorityBadge, { priority: sub.priority }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(StatusBadge, { status: sub.status }) })] }, sub.id)))] })), isExpanded && !isLast && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { borderBottom: `1px solid ${DIVIDER_COLOR}` } }))] }, task.id));
            })] }));
}


/***/ },

/***/ "./ReactApp/Components/NewTaskCard.tsx"
/*!*********************************************!*\
  !*** ./ReactApp/Components/NewTaskCard.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewTaskCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/calendar-days.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-down.js");



function validateForm(client, service, dueDate) {
    const errors = {};
    if (!client) {
        errors.client = "Client is required";
    }
    if (!service) {
        errors.service = "Service is required";
    }
    if (!dueDate) {
        errors.dueDate = "Due date is required";
    }
    return errors;
}
// ── Static data ──────────────────────────────────────────────────────────
const clients = ["Acme Corp", "Northwind", "Fabrikam", "Globex"];
const services = ["Bookkeeping", "Tax Filing", "Payroll", "Advisory"];
const users = ["Sarah Chen", "Mike Johnson", "Alex Kim", "Demo User"];
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
// ── Shared styles ────────────────────────────────────────────────────────
const inputBase = "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const inputNormal = `${inputBase} border-slate-300`;
const inputError = `${inputBase} border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-100`;
// ── Sub-components ───────────────────────────────────────────────────────
function FieldLabel({ label, required = false }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "text-sm font-medium text-slate-950", children: [label, required && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-1 text-red-500", children: "*" })] }));
}
function FieldError({ message }) {
    if (!message)
        return null;
    return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-red-600 mt-1", children: message });
}
function Toggle({ checked, onToggle, disabled, label }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: onToggle, disabled: disabled, className: `relative inline-flex h-[18px] w-8 items-center rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${checked ? "bg-blue-600 border-blue-600" : "bg-slate-300 border-slate-300"}`, "aria-pressed": checked, "aria-label": label, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-[14px]" : "translate-x-[1px]"}` }) }));
}
// ── Main component ───────────────────────────────────────────────────────
function NewTaskCard({ onCancel, onCreate }) {
    const [taskPeriod, setTaskPeriod] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("month");
    const [selectedClient, setSelectedClient] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [selectedService, setSelectedService] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [selectedMonth, setSelectedMonth] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [dueDate, setDueDate] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [targetDate, setTargetDate] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [assignedUser, setAssignedUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [description, setDescription] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [useClientSettings, setUseClientSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [isBillable, setIsBillable] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [createDocumentRequest, setCreateDocumentRequest] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [tagInput, setTagInput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [tags, setTags] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [fieldErrors, setFieldErrors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    const [isSubmitting, setIsSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const thisYear = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => new Date().getFullYear(), []);
    const [selectedYear, setSelectedYear] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(thisYear);
    const addTag = () => {
        const nextTag = tagInput.trim();
        if (!nextTag || tags.includes(nextTag)) {
            return;
        }
        setTags((prev) => [...prev, nextTag]);
        setTagInput("");
    };
    const removeTag = (tagToRemove) => {
        setTags((prev) => prev.filter((t) => t !== tagToRemove));
    };
    const handleCreate = () => {
        // Validate required fields
        const errors = validateForm(selectedClient, selectedService, dueDate);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0)
            return;
        setIsSubmitting(true);
        const taskData = {
            client: selectedClient,
            service: selectedService,
            taskPeriod,
            selectedMonth,
            selectedYear,
            dueDate,
            targetDate,
            assignedUser,
            description: description.trim(),
            tags,
            useClientSettings,
            isBillable,
            createDocumentRequest,
        };
        onCreate(taskData);
    };
    // Helper to clear a specific field error when the user interacts
    const clearFieldError = (field) => {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => (Object.assign(Object.assign({}, prev), { [field]: undefined })));
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-full max-w-3xl max-h-[92vh] rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-8 pt-8 pb-5 border-b border-slate-200", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-2xl font-semibold text-slate-950", children: "Create New Task" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-slate-500 mt-1", children: "Fill in the details to create a task for your team" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-8 py-5 space-y-5 overflow-y-auto overscroll-contain", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Client", required: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: selectedClient, onChange: (event) => {
                                            setSelectedClient(event.target.value);
                                            clearFieldError("client");
                                        }, className: `${fieldErrors.client ? inputError : inputNormal} appearance-none pr-10 text-[15px]`, disabled: isSubmitting, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "", children: "Select clients..." }), clients.map((client) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: client, children: client }, client)))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldError, { message: fieldErrors.client })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Service", required: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: selectedService, onChange: (event) => {
                                            setSelectedService(event.target.value);
                                            clearFieldError("service");
                                        }, className: `${fieldErrors.service ? inputError : inputNormal} appearance-none pr-10 text-[15px]`, disabled: isSubmitting, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "", children: "Select service..." }), services.map((service) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: service, children: service }, service)))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldError, { message: fieldErrors.service })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Task Period", required: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => setTaskPeriod("month"), disabled: isSubmitting, className: `min-w-24 rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${taskPeriod === "month" ? "bg-slate-200 text-slate-950" : "text-slate-700"}`, children: "Month" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => setTaskPeriod("year"), disabled: isSubmitting, className: `min-w-24 rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${taskPeriod === "year" ? "bg-slate-200 text-slate-950" : "text-slate-700"}`, children: "Year" })] })] }), taskPeriod === "month" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Select Month" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: selectedMonth, onChange: (event) => setSelectedMonth(event.target.value), className: `${inputNormal} appearance-none pr-10 text-[15px]`, disabled: isSubmitting, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "", children: "Pick a month..." }), months.map((month) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: month, children: month }, month)))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" })] })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Select Year" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "number", min: thisYear, value: selectedYear, onChange: (event) => setSelectedYear(Number(event.target.value)), className: inputNormal, disabled: isSubmitting })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Due Date", required: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "date", value: dueDate, onChange: (event) => {
                                    setDueDate(event.target.value);
                                    clearFieldError("dueDate");
                                }, className: fieldErrors.dueDate ? inputError : inputNormal, disabled: isSubmitting }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldError, { message: fieldErrors.dueDate })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Target Date" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "date", value: targetDate, onChange: (event) => setTargetDate(event.target.value), className: inputNormal, disabled: isSubmitting })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr", { className: "border-slate-200" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-base font-medium text-slate-950", children: "Use Client-Specific Settings" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-slate-500", children: "Automatically apply settings from client master" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Toggle, { checked: useClientSettings, onToggle: () => setUseClientSettings((prev) => !prev), disabled: isSubmitting, label: "Use client-specific settings" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr", { className: "border-slate-200" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Assign Users" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: assignedUser, onChange: (event) => setAssignedUser(event.target.value), className: `${inputNormal} appearance-none pr-10 text-[15px]`, disabled: isSubmitting, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "", children: "Select users..." }), users.map((user) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: user, children: user }, user)))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-base font-medium text-slate-950", children: "Is this task billable?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-slate-500", children: "Enable if this task should be charged to the client" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Toggle, { checked: isBillable, onToggle: () => setIsBillable((prev) => !prev), disabled: isSubmitting, label: "Is this task billable" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr", { className: "border-slate-200" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Tags" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { value: tagInput, onChange: (event) => setTagInput(event.target.value), onKeyDown: (event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                addTag();
                                            }
                                        }, className: "w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300", placeholder: "Add a tag...", disabled: isSubmitting }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: addTag, disabled: isSubmitting, className: "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Add" })] }), tags.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-wrap gap-2 pt-1", children: tags.map((tag) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700", children: [tag, (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => removeTag(tag), disabled: isSubmitting, className: "ml-0.5 text-blue-400 hover:text-blue-700 disabled:opacity-50", "aria-label": `Remove tag ${tag}`, children: "\u00D7" })] }, tag))) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr", { className: "border-slate-200" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-base font-medium text-slate-950", children: "Create Document Request" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-slate-500", children: "Request documents from the client for this task" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Toggle, { checked: createDocumentRequest, onToggle: () => setCreateDocumentRequest((prev) => !prev), disabled: isSubmitting, label: "Create document request" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr", { className: "border-slate-200" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FieldLabel, { label: "Description" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { value: description, onChange: (event) => setDescription(event.target.value), rows: 3, className: "w-full resize-none rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300", placeholder: "Add task notes or instructions...", disabled: isSubmitting })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-8 py-4 border-t border-slate-200 bg-white flex justify-end gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: onCancel, disabled: isSubmitting, className: "rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-950 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Cancel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", onClick: handleCreate, disabled: isSubmitting, className: "rounded-lg bg-slate-950 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2", children: [isSubmitting ? "Creating..." : "Create Task", isSubmitting && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" }))] })] })] }));
}


/***/ },

/***/ "./ReactApp/Components/PageState.tsx"
/*!*******************************************!*\
  !*** ./ReactApp/Components/PageState.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PageEmpty: () => (/* binding */ PageEmpty),
/* harmony export */   PageError: () => (/* binding */ PageError),
/* harmony export */   PageLoading: () => (/* binding */ PageLoading)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-alert.js");

// ── Reusable page state components ───────────────────────────────────────
//
// Provides consistent loading, error, and empty states across all pages.
// Usage:
//   <PageLoading />              — full-area spinner
//   <PageError message="..." onRetry={fn} />  — error banner with retry
//   <PageEmpty icon={Inbox} title="..." description="..." action={...} />

// ── Loading ──────────────────────────────────────────────────────────────
function PageLoading({ message = "Loading..." }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col items-center justify-center py-24 text-gray-500", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm", children: message })] }));
}
function PageError({ message = "Something went wrong. Please try again.", onRetry, }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col items-center justify-center py-24 text-gray-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-red-100 p-4 rounded-full mb-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { className: "size-8 text-red-500" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900 mb-1", children: "Error" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-4 max-w-md text-center", children: message }), onRetry && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: onRetry, className: "px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors", children: "Try again" }))] }));
}
function PageEmpty({ icon: Icon, title, description, action }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col items-center justify-center py-24 text-gray-500", children: [Icon && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-gray-100 p-4 rounded-full mb-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, { className: "size-8 text-gray-400" }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900 mb-1", children: title }), description && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mb-4 max-w-md text-center", children: description })), action && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: action.onClick, className: "px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors", children: action.label }))] }));
}


/***/ },

/***/ "./ReactApp/Components/ProtectedRoute.tsx"
/*!************************************************!*\
  !*** ./ReactApp/Components/ProtectedRoute.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProtectedRoute)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/AuthContext */ "./ReactApp/context/AuthContext.tsx");



function ProtectedRoute() {
    const { isAuthenticated, isLoading } = (0,_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.useAuth)();
    const location = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
    if (isLoading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex h-screen items-center justify-center bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500", children: "Loading..." })] }) }));
    }
    if (!isAuthenticated) {
        // Preserve the attempted URL so we can redirect back after login
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_1__.Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_1__.Outlet, {});
}


/***/ },

/***/ "./ReactApp/Components/Sidebar.tsx"
/*!*****************************************!*\
  !*** ./ReactApp/Components/Sidebar.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Sidebar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bell.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bot.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clipboard-list.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/folder-kanban.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/layout-dashboard.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/log-out.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/message-square.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/settings.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _TaskFlowLogo__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./TaskFlowLogo */ "./ReactApp/Components/TaskFlowLogo.tsx");
/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../context/AuthContext */ "./ReactApp/context/AuthContext.tsx");






function Sidebar() {
    const location = (0,react_router__WEBPACK_IMPORTED_MODULE_10__.useLocation)();
    const navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_10__.useNavigate)();
    const { logout } = (0,_context_AuthContext__WEBPACK_IMPORTED_MODULE_13__.useAuth)();
    const [isCollapsed, setIsCollapsed] = (0,react__WEBPACK_IMPORTED_MODULE_11__.useState)(true);
    const navItems = [
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "size-5 shrink-0" }), label: "Dashboard", path: "/" },
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-5 shrink-0" }), label: "Projects", path: "/projects" },
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-5 shrink-0" }), label: "My Tasks", path: "/my-work" },
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "size-5 shrink-0" }), label: "Messages", path: "/message" },
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { className: "size-5 shrink-0" }), label: "Notifications", path: "/notifications" },
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { className: "size-5 shrink-0" }), label: "Users", path: "/teams" },
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "size-5 shrink-0" }), label: "Settings", path: "/settings" },
        { icon: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-5 shrink-0" }), label: "Chatbot", path: "/plans" },
    ];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`, onMouseEnter: () => setIsCollapsed(false), onMouseLeave: () => setIsCollapsed(true), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-16 border-b border-gray-200 flex items-center justify-center overflow-hidden px-4", children: isCollapsed ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: 40, height: 48, position: 'relative', flexShrink: 0 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 4, position: 'absolute', background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 4, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 4, position: 'absolute', opacity: 0.60, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 4, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 14, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 14, position: 'absolute', opacity: 0.60, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 14, position: 'absolute', opacity: 0.45, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 14, position: 'absolute', opacity: 0.30, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 24, position: 'absolute', opacity: 0.60, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 24, position: 'absolute', opacity: 0.45, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 24, position: 'absolute', opacity: 0.30, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 24, position: 'absolute', opacity: 0.15, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 34, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 34, position: 'absolute', opacity: 0.30, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 34, position: 'absolute', opacity: 0.15, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 34, position: 'absolute', opacity: 0, background: '#155EEF' } })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_12__.TaskFlowLogo, {})) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("nav", { className: "flex-1 py-2", children: navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_router__WEBPACK_IMPORTED_MODULE_10__.Link, { to: item.path, title: isCollapsed ? item.label : undefined, style: isActive ? { background: '#E2DEFF', borderRadius: 8 } : { borderRadius: 8 }, className: `flex items-center gap-4 px-4 py-3 mx-2 transition-colors ${isActive ? "text-[#3C21F7]" : "text-[#878787] hover:bg-gray-100"}`, children: [item.icon, !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-base font-normal whitespace-nowrap", style: { fontFamily: 'Inter, sans-serif' }, children: item.label }))] }, item.path));
                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "py-2 border-t border-gray-200", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => {
                        logout();
                        navigate("/login");
                    }, title: isCollapsed ? "Log Out" : undefined, className: "flex items-center gap-4 px-4 py-3 mx-2 rounded-[8px] text-[#878787] hover:bg-gray-100 transition-colors w-[calc(100%-16px)] cursor-pointer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "size-5 shrink-0" }), !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-base font-normal whitespace-nowrap", style: { fontFamily: 'Inter, sans-serif' }, children: "Log Out" }))] }) })] }));
}


/***/ },

/***/ "./ReactApp/Components/TaskFlowLogo.tsx"
/*!**********************************************!*\
  !*** ./ReactApp/Components/TaskFlowLogo.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaskFlowLogo: () => (/* binding */ TaskFlowLogo)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

function TaskFlowLogo() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: 40, height: 48, position: 'relative' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 4, position: 'absolute', background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 4, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 4, position: 'absolute', opacity: 0.60, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 4, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 14, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 14, position: 'absolute', opacity: 0.60, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 14, position: 'absolute', opacity: 0.45, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 14, position: 'absolute', opacity: 0.30, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 24, position: 'absolute', opacity: 0.60, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 24, position: 'absolute', opacity: 0.45, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 24, position: 'absolute', opacity: 0.30, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 24, position: 'absolute', opacity: 0.15, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 0, top: 34, position: 'absolute', opacity: 0, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 10, top: 34, position: 'absolute', opacity: 0.30, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 20, top: 34, position: 'absolute', opacity: 0.15, background: '#155EEF' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: 10, height: 10, left: 30, top: 34, position: 'absolute', opacity: 0, background: '#155EEF' } })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { height: 48, display: 'flex', alignItems: 'center' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { style: { color: '#0A0D12', fontFamily: '"Press Start 2P", monospace', fontSize: 18, whiteSpace: 'nowrap', lineHeight: 2.2, letterSpacing: '0.05em' }, children: "TaskFlow" }) })] }));
}


/***/ },

/***/ "./ReactApp/Components/TaskItem.tsx"
/*!******************************************!*\
  !*** ./ReactApp/Components/TaskItem.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskItem)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-check.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.js");


function TaskItem({ title, project, dueDate, assignee, priority, completed }) {
    const priorityColors = {
        high: "bg-red-100 text-red-700 border-red-200",
        medium: "bg-orange-100 text-orange-700 border-orange-200",
        low: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "mt-0.5", "aria-label": completed ? "Mark task as incomplete" : "Mark task as complete", children: completed ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { className: "size-5 text-green-600", "aria-hidden": "true" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-5 text-gray-400 group-hover:text-blue-500", "aria-hidden": "true" })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: `font-medium ${completed ? "text-gray-500 line-through" : "text-gray-900"}`, children: title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 mt-1 text-sm text-gray-500", children: [project && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-blue-600", children: project }), dueDate && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-3", "aria-hidden": "true" }), dueDate] })), assignee && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-3", "aria-hidden": "true" }), assignee] }))] })] }), priority && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `px-2 py-1 text-xs font-medium rounded border ${priorityColors[priority]}`, children: priority }))] }));
}


/***/ },

/***/ "./ReactApp/Components/TaskLineWidget.tsx"
/*!************************************************!*\
  !*** ./ReactApp/Components/TaskLineWidget.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskLineWidget)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Height in px for each 30-minute slot */
const SLOT_HEIGHT = 50;
/** Width reserved for the time labels on the left */
const LABEL_WIDTH = 50;
/** 48 half-hour slots: 00:00, 00:30, 01:00 … 23:30 */
const SLOTS = Array.from({ length: 48 }, (_, i) => ({
    hour: Math.floor(i / 2),
    min: i % 2 === 0 ? 0 : 30,
    isFullHour: i % 2 === 0,
}));
const TOTAL_HEIGHT = SLOTS.length * SLOT_HEIGHT; // 48 × 50 = 2400 px
/** Convert a clock time to a pixel offset from the top of the timeline */
const timeToY = (hour, min = 0) => (hour * 2 + min / 30) * SLOT_HEIGHT;
function TaskLineWidget({ year, month, selectedDay }) {
    const dateLabel = `${selectedDay} ${MONTH_NAMES[month]} ${year}`;
    const scrollRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // Scroll to 7:30 AM whenever the selected date changes so the demo meetings are visible
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = timeToY(7, 30);
        }
    }, [year, month, selectedDay]);
    // Show a "now" line only when the selected date is today
    const now = new Date();
    const isToday = now.getFullYear() === year &&
        now.getMonth() === month &&
        now.getDate() === selectedDay;
    const nowY = isToday ? timeToY(now.getHours(), now.getMinutes()) : null;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-[372px] p-6 bg-[#171717] shadow-[0_0_6px_rgba(0,0,0,0.25)] rounded-[30px] flex flex-col gap-[18px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white text-2xl font-['Poppins'] font-medium tracking-[0.72px]", children: "Task Line" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-[34px] px-3.5 bg-white/[0.10] rounded-[36px] outline outline-1 outline-offset-[-1px] outline-[#616161] flex items-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white text-sm font-['Poppins'] font-normal tracking-[0.42px]", children: dateLabel }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: scrollRef, className: "max-h-[360px] overflow-y-auto", style: { scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-full relative", style: { height: TOTAL_HEIGHT }, children: [SLOTS.map((slot, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute left-0 right-0", style: { top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute left-0 top-0 flex items-center justify-end pr-2", style: { width: LABEL_WIDTH, height: SLOT_HEIGHT }, children: slot.isFullHour && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-white/50 text-xs font-['Poppins'] font-normal tracking-[0.36px]", children: [String(slot.hour).padStart(2, '0'), ":00"] })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `absolute top-1/2 right-0 h-0 ${slot.isFullHour
                                        ? 'border-t border-dashed border-white/[0.22]'
                                        : 'border-t border-dashed border-white/[0.09]'}`, style: { left: LABEL_WIDTH } })] }, i))), nowY !== null && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute left-0 right-0 flex items-center z-10 pointer-events-none", style: { top: nowY }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex justify-end pr-1", style: { width: LABEL_WIDTH }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-2 h-2 rounded-full bg-[#60B8FF] shrink-0" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 border-t-[1.5px] border-solid border-[#60B8FF]" })] }))] }) })] }));
}


/***/ },

/***/ "./ReactApp/context/AuthContext.tsx"
/*!******************************************!*\
  !*** ./ReactApp/context/AuthContext.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),
/* harmony export */   useAuth: () => (/* binding */ useAuth)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/api */ "./ReactApp/services/api.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// ── Auth Context ─────────────────────────────────────────────────────────
//
// Provides app-wide authentication state:
// - Current user object (null when logged out)
// - login / signup / logout actions
// - Loading state for initial auth check
// - isAuthenticated derived boolean
//
// Wraps the entire app so every component can access auth via useAuth().


const AuthContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    // On mount, check if we have a stored token and validate it
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const token = (0,_services_api__WEBPACK_IMPORTED_MODULE_2__.getAuthToken)();
        if (!token) {
            setIsLoading(false);
            return;
        }
        // Validate the stored token by fetching the current user
        let cancelled = false;
        _services_api__WEBPACK_IMPORTED_MODULE_2__.api
            .get("/auth/me")
            .then((userData) => {
            if (!cancelled) {
                setUser(userData);
            }
        })
            .catch(() => {
            // Token is invalid/expired -- clear it
            if (!cancelled) {
                (0,_services_api__WEBPACK_IMPORTED_MODULE_2__.clearAuthToken)();
            }
        })
            .finally(() => {
            if (!cancelled) {
                setIsLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);
    const login = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((credentials) => __awaiter(this, void 0, void 0, function* () {
        setError(null);
        try {
            const response = yield _services_api__WEBPACK_IMPORTED_MODULE_2__.api.post("/auth/login", credentials);
            (0,_services_api__WEBPACK_IMPORTED_MODULE_2__.setAuthToken)(response.token);
            setUser(response.user);
        }
        catch (err) {
            const message = err instanceof _services_api__WEBPACK_IMPORTED_MODULE_2__.ApiRequestError
                ? err.message
                : "An unexpected error occurred. Please try again.";
            setError(message);
            throw err;
        }
    }), []);
    const signup = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        setError(null);
        try {
            const response = yield _services_api__WEBPACK_IMPORTED_MODULE_2__.api.post("/auth/register", data);
            (0,_services_api__WEBPACK_IMPORTED_MODULE_2__.setAuthToken)(response.token);
            setUser(response.user);
        }
        catch (err) {
            const message = err instanceof _services_api__WEBPACK_IMPORTED_MODULE_2__.ApiRequestError
                ? err.message
                : "An unexpected error occurred. Please try again.";
            setError(message);
            throw err;
        }
    }), []);
    const logout = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
        (0,_services_api__WEBPACK_IMPORTED_MODULE_2__.clearAuthToken)();
        setUser(null);
        setError(null);
    }, []);
    const clearError = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
        setError(null);
    }, []);
    const value = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signup,
        logout,
        error,
        clearError,
    };
    return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AuthContext.Provider, { value: value, children: children });
}
function useAuth() {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}


/***/ },

/***/ "./ReactApp/data/notifications.ts"
/*!****************************************!*\
  !*** ./ReactApp/data/notifications.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SEED_NOTIFICATIONS: () => (/* binding */ SEED_NOTIFICATIONS)
/* harmony export */ });
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/square-check-big.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/at-sign.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/folder-kanban.js");

const SEED_NOTIFICATIONS = [
    { id: 1, icon: lucide_react__WEBPACK_IMPORTED_MODULE_0__["default"], iconBg: "bg-green-100", iconColor: "text-green-600", title: "Task completed", body: 'Sarah Chen completed "Design system update"', time: "2 min ago", unread: true },
    { id: 2, icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], iconBg: "bg-blue-100", iconColor: "text-blue-600", title: "You were mentioned", body: 'Mike Johnson mentioned you in "API Service"', time: "14 min ago", unread: true },
    { id: 3, icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], iconBg: "bg-purple-100", iconColor: "text-purple-600", title: "New project created", body: 'Alex Kim created project "Mobile Redesign"', time: "1 hr ago", unread: true },
    { id: 4, icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], iconBg: "bg-orange-100", iconColor: "text-orange-600", title: "Deadline tomorrow", body: 'Task "Fix checkout flow" is due tomorrow', time: "3 hr ago", unread: false },
    { id: 5, icon: lucide_react__WEBPACK_IMPORTED_MODULE_0__["default"], iconBg: "bg-green-100", iconColor: "text-green-600", title: "Task assigned", body: 'Emily Rodriguez assigned "Write unit tests" to you', time: "Yesterday", unread: false },
];


/***/ },

/***/ "./ReactApp/imports/LoginPromotion1.tsx"
/*!**********************************************!*\
  !*** ./ReactApp/imports/LoginPromotion1.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoginPromotion)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./svg-do1bc836vb */ "./ReactApp/imports/svg-do1bc836vb.ts");


function Bg() {
    return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute bottom-full contents left-0 right-full top-0", "data-name": "BG_1_" });
}
function Group3() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[5.64%_95.06%_91.46%_2.07%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-5.52%_-5.58%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 14.9441 15.0907", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", { id: "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M0.75 0.75L14.1941 14.3407", id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }) }));
}
function Group4() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[5.64%_95.06%_91.46%_2.07%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-5.52%_-5.58%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 14.9441 15.0907", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", { id: "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M14.1941 0.75L0.75 14.3407", id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }) }));
}
function Group2() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute contents inset-[5.64%_95.06%_91.46%_2.07%]", "data-name": "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group3, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group4, {})] }));
}
function Group1() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute contents inset-[5.64%_95.06%_91.46%_2.07%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group2, {}) }));
}
function Group7() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[14.85%_3.99%_82.25%_93.12%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-5.52%_-5.53%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 15.0654 15.0907", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", { id: "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M0.75 0.75L14.3154 14.3407", id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }) }));
}
function Group8() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[14.85%_3.99%_82.25%_93.12%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-5.52%_-5.53%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 15.0654 15.0907", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", { id: "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M14.3154 0.75L0.75 14.3407", id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }) }));
}
function Group6() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute contents inset-[14.85%_3.99%_82.25%_93.12%]", "data-name": "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group7, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group8, {})] }));
}
function Group5() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute contents inset-[14.85%_3.99%_82.25%_93.12%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group6, {}) }));
}
function Group() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute contents inset-[5.64%_1.97%_8.72%_1.5%]", "data-name": "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[13.56%_10.74%_23.44%_38.22%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "absolute block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 238.845 295.476", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1e2cf200, fill: "var(--fill-0, #0057FF)", id: "Vector" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[6.13%_1.97%_91.57%_77.33%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-6.94%_-0.77%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 98.3944 12.302", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pbef2780, id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[68.69%_53.13%_29%_32.14%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-6.94%_-1.09%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 70.4161 12.2997", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p16f2a480, id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[58.16%_94.49%_37.8%_1.5%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-3.96%_-4%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 20.2733 20.4299", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p65cf9f0, id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[19.12%_36.26%_76.84%_59.73%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-3.96%_-4%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 20.2733 20.4299", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1d6d6f00, id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[91.28%_5.43%_8.72%_71.38%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-0.5px_0]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 108.522 1", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M0 0.5H108.522", id: "Vector", stroke: "var(--stroke-0, black)", strokeMiterlimit: "10" }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group1, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group5, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[21.14%_44.49%_78.86%_45.52%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-0.75px_-1.6%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 48.2516 1.5", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M0.75 0.75H47.5016", id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[60.18%_72.7%_39.82%_22.13%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[-0.75px_-3.1%]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 25.7236 1.5", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M0.75 0.75H24.9736", id: "Vector", stroke: "var(--stroke-0, black)", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", strokeWidth: "1.5" }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[89.24%_74.25%_8.72%_5.98%]", "data-name": "Vector", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "absolute block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 92.5342 9.58627", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].paf69880, fill: "var(--fill-0, #0057FF)", id: "Vector" }) }) })] }));
}
function Group9() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[94.23%_9.83%_2.3%_75.83%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "absolute block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 67.0994 16.2603", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", { id: "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1dcbfc80, fill: "var(--fill-0, black)", id: "Vector" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3019800, fill: "var(--fill-0, black)", id: "Vector_2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p19ce3400, fill: "var(--fill-0, black)", id: "Vector_3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pd60ef00, fill: "var(--fill-0, black)", id: "Vector_4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pbb5ec00, fill: "var(--fill-0, black)", id: "Vector_5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1e11f600, fill: "var(--fill-0, black)", id: "Vector_6" })] }) }) }));
}
function MainLayout() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute contents inset-[5.64%_1.97%_2.3%_1.5%]", "data-name": "Main_layout", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group9, {})] }));
}
function Group11() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[94.93%_43.12%_2.48%_5.46%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "absolute block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 240.662 12.1345", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", { id: "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pa9b6b40, fill: "var(--fill-0, black)", id: "Vector" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p31218540, fill: "var(--fill-0, black)", id: "Vector_2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3d721a00, fill: "var(--fill-0, black)", id: "Vector_3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1e563500, fill: "var(--fill-0, black)", id: "Vector_4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pafde780, fill: "var(--fill-0, black)", id: "Vector_5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pdd0fa00, fill: "var(--fill-0, black)", id: "Vector_6" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3950df80, fill: "var(--fill-0, black)", id: "Vector_7" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2bb8b00, fill: "var(--fill-0, black)", id: "Vector_8" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p20f30300, fill: "var(--fill-0, black)", id: "Vector_9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pb8dde90, fill: "var(--fill-0, black)", id: "Vector_10" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3fa9ac00, fill: "var(--fill-0, black)", id: "Vector_11" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3ac53f00, fill: "var(--fill-0, black)", id: "Vector_12" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3d37b970, fill: "var(--fill-0, black)", id: "Vector_13" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3377be00, fill: "var(--fill-0, black)", id: "Vector_14" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p24c70000, fill: "var(--fill-0, black)", id: "Vector_15" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3d969300, fill: "var(--fill-0, black)", id: "Vector_16" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1c14cf60, fill: "var(--fill-0, black)", id: "Vector_17" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p19dbcd80, fill: "var(--fill-0, black)", id: "Vector_18" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p21183380, fill: "var(--fill-0, black)", id: "Vector_19" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p33046700, fill: "var(--fill-0, black)", id: "Vector_20" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pbb45300, fill: "var(--fill-0, black)", id: "Vector_21" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p34aa2c80, fill: "var(--fill-0, black)", id: "Vector_22" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1bb32100, fill: "var(--fill-0, black)", id: "Vector_23" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pc7c0600, fill: "var(--fill-0, black)", id: "Vector_24" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p16d9d280, fill: "var(--fill-0, black)", id: "Vector_25" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3b8c4600, fill: "var(--fill-0, black)", id: "Vector_26" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pe8cef00, fill: "var(--fill-0, black)", id: "Vector_27" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p5976f80, fill: "var(--fill-0, black)", id: "Vector_28" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p668b680, fill: "var(--fill-0, black)", id: "Vector_29" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3db27c80, fill: "var(--fill-0, black)", id: "Vector_30" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3fdd6e80, fill: "var(--fill-0, black)", id: "Vector_31" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p223136b0, fill: "var(--fill-0, black)", id: "Vector_32" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p98a2e00, fill: "var(--fill-0, black)", id: "Vector_33" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2830e400, fill: "var(--fill-0, black)", id: "Vector_34" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2cc57680, fill: "var(--fill-0, black)", id: "Vector_35" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p279ced80, fill: "var(--fill-0, black)", id: "Vector_36" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p252bf600, fill: "var(--fill-0, black)", id: "Vector_37" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3cf9b540, fill: "var(--fill-0, black)", id: "Vector_38" })] }) }) }));
}
function Group12() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[94.64%_5.59%_3.47%_92.68%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "absolute block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 8.11493 8.85831", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", { id: "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1e372000, fill: "var(--fill-0, black)", id: "Vector" }) }) }) }));
}
function Group10() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute contents inset-[94.64%_5.59%_2.48%_5.46%]", "data-name": "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group11, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group12, {})] }));
}
function Group13() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[2.1%_16.51%_48.59%_8.88%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "absolute block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 349.183 231.284", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", { id: "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p20c52300, fill: "var(--fill-0, black)", id: "Vector" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pc2cf300, fill: "var(--fill-0, black)", id: "Vector_2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p12930b00, fill: "var(--fill-0, black)", id: "Vector_3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p143a0b80, fill: "var(--fill-0, black)", id: "Vector_4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pe744700, fill: "var(--fill-0, black)", id: "Vector_5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3cd50900, fill: "var(--fill-0, black)", id: "Vector_6" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p39133b00, fill: "var(--fill-0, black)", id: "Vector_7" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3b352900, fill: "var(--fill-0, black)", id: "Vector_8" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p16291180, fill: "var(--fill-0, black)", id: "Vector_9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p38830080, fill: "var(--fill-0, black)", id: "Vector_10" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pb98a300, fill: "var(--fill-0, black)", id: "Vector_11" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1e689600, fill: "var(--fill-0, black)", id: "Vector_12" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p14bd7200, fill: "var(--fill-0, black)", id: "Vector_13" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pc0c0200, fill: "var(--fill-0, black)", id: "Vector_14" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2a81cf00, fill: "var(--fill-0, black)", id: "Vector_15" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p6aedd80, fill: "var(--fill-0, black)", id: "Vector_16" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3573fa00, fill: "var(--fill-0, black)", id: "Vector_17" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p353c2fb0, fill: "var(--fill-0, black)", id: "Vector_18" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p32bbb700, fill: "var(--fill-0, black)", id: "Vector_19" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2556f800, fill: "var(--fill-0, black)", id: "Vector_20" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p291f3480, fill: "var(--fill-0, black)", id: "Vector_21" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2122200, fill: "var(--fill-0, black)", id: "Vector_22" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p27496f00, fill: "var(--fill-0, black)", id: "Vector_23" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p21c9a400, fill: "var(--fill-0, black)", id: "Vector_24" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2fc39a00, fill: "var(--fill-0, black)", id: "Vector_25" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2d15280, fill: "var(--fill-0, black)", id: "Vector_26" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p9e2fe80, fill: "var(--fill-0, black)", id: "Vector_27" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p5a4adc0, fill: "var(--fill-0, black)", id: "Vector_28" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p385b3d80, fill: "var(--fill-0, black)", id: "Vector_29" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p136fcf80, fill: "var(--fill-0, black)", id: "Vector_30" })] }) }) }));
}
function Group14() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-[65.92%_13.74%_26.47%_53.13%]", "data-name": "Group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "absolute block size-full", fill: "none", preserveAspectRatio: "none", viewBox: "0 0 155.031 35.6756", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", { id: "Group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p78e2230, fill: "var(--fill-0, black)", id: "Vector" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3cc7c800, fill: "var(--fill-0, black)", id: "Vector_2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3e3e6f00, fill: "var(--fill-0, black)", id: "Vector_3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p138ee931, fill: "var(--fill-0, black)", id: "Vector_4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2a919100, fill: "var(--fill-0, black)", id: "Vector_5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p24f2b680, fill: "var(--fill-0, black)", id: "Vector_6" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p4722e80, fill: "var(--fill-0, black)", id: "Vector_7" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1908ba00, fill: "var(--fill-0, black)", id: "Vector_8" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pee613f0, fill: "var(--fill-0, black)", id: "Vector_9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p397beb00, fill: "var(--fill-0, black)", id: "Vector_10" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p13c7ca00, fill: "var(--fill-0, black)", id: "Vector_11" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p171dc100, fill: "var(--fill-0, black)", id: "Vector_12" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p17e5100, fill: "var(--fill-0, black)", id: "Vector_13" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2da48080, fill: "var(--fill-0, black)", id: "Vector_14" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p122df100, fill: "var(--fill-0, black)", id: "Vector_15" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3b221700, fill: "var(--fill-0, black)", id: "Vector_16" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2c510e80, fill: "var(--fill-0, black)", id: "Vector_17" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2666f000, fill: "var(--fill-0, black)", id: "Vector_18" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].pcb3cf00, fill: "var(--fill-0, black)", id: "Vector_19" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p24c4f580, fill: "var(--fill-0, black)", id: "Vector_20" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1d51fe80, fill: "var(--fill-0, black)", id: "Vector_21" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p23d9fa00, fill: "var(--fill-0, black)", id: "Vector_22" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1da0c600, fill: "var(--fill-0, black)", id: "Vector_23" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p88a5a00, fill: "var(--fill-0, black)", id: "Vector_24" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3c8a6400, fill: "var(--fill-0, black)", id: "Vector_25" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p2e1ade00, fill: "var(--fill-0, black)", id: "Vector_26" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p35042900, fill: "var(--fill-0, black)", id: "Vector_27" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3e09e00, fill: "var(--fill-0, black)", id: "Vector_28" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p3a813b00, fill: "var(--fill-0, black)", id: "Vector_29" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: _svg_do1bc836vb__WEBPACK_IMPORTED_MODULE_1__["default"].p1f46dc00, fill: "var(--fill-0, black)", id: "Vector_30" })] }) }) }));
}
function Text() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute contents inset-[2.1%_5.59%_2.48%_5.46%]", "data-name": "Text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group10, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group13, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Group14, {})] }));
}
function LoginPromotion() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative size-full", "data-name": "login-promotion 1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Bg, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MainLayout, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Text, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute flex inset-[49.68%_0.85%_23.45%_95.09%] items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "-rotate-90 flex-none h-[19px] w-[126px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "font-['Roboto:Medium',sans-serif] font-medium leading-[1.6] relative text-[12px] text-black tracking-[0.15px] whitespace-nowrap", style: { fontVariationSettings: "'wdth' 100" }, children: "www.socialrepeat.com" }) }) })] }));
}


/***/ },

/***/ "./ReactApp/imports/PromotionBg.tsx"
/*!******************************************!*\
  !*** ./ReactApp/imports/PromotionBg.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PromotionBg)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

function PromotionBg() {
    return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-[#fafafb] size-full", "data-name": "promotion bg" });
}


/***/ },

/***/ "./ReactApp/imports/svg-do1bc836vb.ts"
/*!********************************************!*\
  !*** ./ReactApp/imports/svg-do1bc836vb.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    p122df100: "M138.922 0.364101H140.376V12.3773H138.922V0.364101Z",
    p12930b00: "M70.0062 0H80.7857V14.1974C82.6025 11.5278 85.8727 9.46494 90.2329 9.46494C97.2578 9.46494 101.739 14.5614 101.739 22.5702V40.5294H90.9597V24.1477C90.9597 20.6287 89.0218 18.4445 85.8727 18.4445C82.7236 18.4445 80.6646 20.5074 80.6646 24.1477V40.6507H69.8851V0H70.0062Z",
    p136fcf80: "M219.224 231.284C210.624 231.284 204.932 226.673 204.447 220.485H214.863C215.106 222.547 216.801 223.64 219.103 223.64C220.919 223.64 222.009 222.79 222.009 221.698C222.009 217.208 205.658 220.849 205.658 209.563C205.658 204.224 210.14 199.734 218.497 199.734C226.854 199.734 231.335 204.467 232.062 210.534H222.373C222.009 208.593 220.677 207.501 218.376 207.501C216.559 207.501 215.711 208.229 215.711 209.321C215.711 213.689 232.183 210.17 232.183 221.941C231.941 227.159 227.096 231.284 219.224 231.284Z",
    p138ee931: "M39.2422 3.27639C40.9379 3.27639 42.0279 4.12581 42.5124 5.09658V3.5191H43.9658V12.3773H42.5124V10.6785C42.0279 11.6492 40.8168 12.4987 39.2422 12.4987C36.8199 12.4987 35.0031 10.6784 35.0031 7.88751C35.0031 5.09656 36.8199 3.27639 39.2422 3.27639ZM39.4845 4.6112C37.9099 4.6112 36.4565 5.82463 36.4565 7.88751C36.4565 9.95038 37.7888 11.2852 39.4845 11.2852C41.059 11.2852 42.5124 10.0717 42.5124 8.00886C42.5124 5.82464 41.059 4.6112 39.4845 4.6112Z",
    p13c7ca00: "M107.553 12.4987C105.009 12.4987 103.071 10.6784 103.071 7.88751C103.071 5.09656 105.009 3.27639 107.553 3.27639C110.096 3.27639 112.034 5.09656 112.034 7.88751C112.155 10.6784 110.096 12.4987 107.553 12.4987ZM107.553 11.1638C109.127 11.1638 110.581 10.0717 110.581 7.88751C110.581 5.58194 109.127 4.6112 107.553 4.6112C105.978 4.6112 104.525 5.70329 104.525 7.88751C104.646 10.1931 105.978 11.1638 107.553 11.1638Z",
    p143a0b80: "M121.602 41.0148C112.519 41.0148 105.978 35.0688 105.978 25.1185C105.978 15.2895 112.398 9.3436 121.602 9.3436C130.686 9.3436 137.106 15.2895 137.106 24.7545C137.106 25.6039 137.106 26.4533 136.984 27.3027H116.637C116.879 30.8217 118.817 32.2779 121.239 32.2779C123.298 32.2779 124.509 31.0644 125.115 29.851H136.621C135.047 36.2823 129.233 41.0148 121.602 41.0148ZM116.637 22.2062H126.084C126.084 19.4153 123.904 17.9591 121.481 17.9591C118.938 17.9591 117.121 19.4153 116.637 22.2062Z",
    p14bd7200: "M139.891 104.478C131.292 104.478 125.599 99.8673 125.115 93.6787H135.531C135.773 95.7415 137.469 96.8336 139.77 96.8336C141.587 96.8336 142.677 95.9842 142.677 94.8921C142.677 90.4023 126.326 94.0427 126.326 82.7576C126.326 77.4184 130.807 72.9286 139.165 72.9286C147.522 72.9286 152.003 77.6611 152.73 83.7283H143.04C142.677 81.7868 141.345 80.6947 139.043 80.6947C137.227 80.6947 136.379 81.4228 136.379 82.5149C136.379 86.8833 152.851 83.3643 152.851 95.1348C152.73 100.353 147.885 104.478 139.891 104.478Z",
    p16291180: "M18.6522 91.0091H13.323V104.114H2.54349V65.2838H18.6522C28.2205 65.2838 33.1864 70.7444 33.1864 78.2678C33.1864 84.9418 28.5839 91.0091 18.6522 91.0091ZM17.6832 82.3935C20.9534 82.3935 22.2857 80.6947 22.2857 78.2678C22.2857 75.7195 20.9534 74.0207 17.6832 74.0207H13.4441V82.3935H17.6832Z",
    p16d9d280: "M161.693 9.10085L161.45 8.13012C161.087 8.49415 160.845 8.85815 160.481 8.9795C160.118 9.10084 159.755 9.2222 159.27 9.2222C158.665 9.2222 158.18 9.10086 157.817 8.73683C157.453 8.3728 157.332 7.88742 157.332 7.40205C157.332 6.06727 158.422 5.46054 160.481 5.3392H161.571V4.97518C161.571 4.48981 161.45 4.12579 161.208 3.8831C160.966 3.64041 160.602 3.51905 160.118 3.51905C159.634 3.51905 159.028 3.64042 158.301 4.00445L158.059 3.27638C158.422 3.15504 158.665 2.91233 159.149 2.91233C159.512 2.79099 159.876 2.79102 160.239 2.79102C160.966 2.79102 161.571 2.91235 161.935 3.27638C162.298 3.64041 162.54 4.12577 162.54 4.85383V9.2222H161.693V9.10085ZM159.512 8.49413C160.118 8.49413 160.602 8.37279 160.966 8.00876C161.329 7.64473 161.45 7.15935 161.45 6.67398V6.06726H160.481C159.755 6.06726 159.149 6.18863 158.786 6.43132C158.422 6.674 158.301 6.91667 158.301 7.40205C158.301 7.76608 158.422 8.00878 158.665 8.25147C158.786 8.37281 159.149 8.49413 159.512 8.49413Z",
    p16f2a480: "M0.750002 11.5497C7.65373 11.4284 7.53261 1.84209 14.4363 1.72075C21.3401 1.5994 21.4612 11.1857 28.3649 11.0643C35.2686 10.943 35.1475 1.35672 42.0512 1.23538C48.955 1.11403 49.0761 10.7003 55.9798 10.579C62.8835 10.4576 62.7624 0.871348 69.6661 0.750002",
    p171dc100: "M117.848 3.27639C120.028 3.27639 121.481 4.3685 121.966 6.31002H120.391C120.028 5.21792 119.18 4.6112 117.848 4.6112C116.273 4.6112 115.062 5.82463 115.062 8.00885C115.062 10.1931 116.273 11.4065 117.848 11.4065C119.18 11.4065 120.028 10.7998 120.391 9.70767H121.966C121.481 11.5278 120.028 12.7413 117.848 12.7413C115.304 12.7413 113.488 10.9211 113.488 8.1302C113.488 5.09657 115.304 3.27639 117.848 3.27639Z",
    p17e5100: "M123.662 0.970795C123.662 0.364067 124.146 2.67029e-05 124.63 2.67029e-05C125.115 2.67029e-05 125.599 0.485413 125.599 0.970795C125.599 1.57752 125.115 1.94154 124.63 1.94154C124.146 1.94154 123.662 1.57752 123.662 0.970795ZM123.904 3.39771H125.357V12.2559H123.904V3.39771Z",
    p1908ba00: "M82.8448 0.364101H84.2981V12.3773H82.8448V0.364101Z",
    p19ce3400: "M24.1025 2.42692H27.2516L21.4379 16.2603H18.41L20.5901 11.5279L16.8354 2.54824H19.9845L22.1646 8.37286L24.1025 2.42692Z",
    p19dbcd80: "M113.73 5.94588C113.73 7.03798 113.488 7.76605 113.003 8.37277C112.519 8.97949 111.792 9.2222 110.823 9.2222C110.217 9.2222 109.733 9.10087 109.248 8.85818C108.764 8.61549 108.522 8.25146 108.279 7.64473C108.037 7.15936 107.916 6.55263 107.916 5.82457C107.916 4.73247 108.158 4.0044 108.643 3.39767C109.127 2.79095 109.854 2.54825 110.823 2.54825C111.671 2.54825 112.398 2.79095 113.003 3.39767C113.488 4.12574 113.73 4.85378 113.73 5.94588ZM108.885 5.94588C108.885 6.79529 109.006 7.40202 109.37 7.76605C109.733 8.25143 110.217 8.37277 110.823 8.37277C111.429 8.37277 111.913 8.13008 112.276 7.76605C112.64 7.28067 112.761 6.67395 112.761 5.94588C112.761 5.09647 112.64 4.48975 112.276 4.12571C111.913 3.76168 111.429 3.51899 110.823 3.51899C110.217 3.51899 109.733 3.76168 109.37 4.12571C109.006 4.48975 108.885 5.09647 108.885 5.94588Z",
    p1bb32100: "M150.55 9.10092V4.97519C150.55 4.4898 150.429 4.00442 150.186 3.76173C149.944 3.51904 149.581 3.39771 149.096 3.39771C148.37 3.39771 147.885 3.6404 147.643 4.00444C147.28 4.36847 147.158 4.9752 147.158 5.82462V9.22228H146.189V0.121368H147.158V2.9123C147.158 3.27633 147.158 3.51904 147.158 3.76173C147.401 3.39769 147.643 3.155 148.006 3.03365C148.37 2.91231 148.733 2.79098 149.217 2.79098C149.944 2.79098 150.55 3.03367 151.034 3.39771C151.398 3.76175 151.64 4.36847 151.64 5.21789V9.34363H150.55V9.10092Z",
    p1c14cf60: "M106.099 8.49412C106.22 8.49412 106.463 8.49412 106.584 8.49412C106.705 8.49412 106.826 8.49411 106.947 8.37277V9.10085C106.826 9.10085 106.705 9.2222 106.463 9.2222C106.22 9.2222 106.099 9.2222 105.857 9.2222C104.646 9.2222 104.04 8.61547 104.04 7.28067V3.51897H103.071V3.0336L104.04 2.66958L104.404 1.33478H105.009V2.79093H106.826V3.51897H105.009V7.28067C105.009 7.64471 105.13 8.00876 105.252 8.1301C105.494 8.37279 105.736 8.49412 106.099 8.49412Z",
    p1d51fe80: "M57.0466 20.1434C57.0466 19.5367 57.5311 19.1726 58.0155 19.1726C58.5 19.1726 58.9845 19.658 58.9845 20.1434C58.9845 20.7501 58.5 21.1142 58.0155 21.1142C57.4099 21.1142 57.0466 20.7501 57.0466 20.1434ZM57.2888 22.5703H58.7422V31.4285H57.2888V22.5703Z",
    p1d6d6f00: "M19.5233 10.2149L10.0761 19.6799L0.75 10.2149L10.0761 0.75L19.5233 10.2149Z",
    p1da0c600: "M79.8168 31.6712C77.2733 31.6712 75.3354 29.851 75.3354 27.0601C75.3354 24.2691 77.2733 22.4489 79.8168 22.4489C82.3603 22.4489 84.2982 24.2691 84.2982 27.0601C84.4193 29.851 82.3603 31.6712 79.8168 31.6712ZM79.8168 30.3364C81.3913 30.3364 82.8448 29.2443 82.8448 27.0601C82.8448 24.7545 81.3913 23.7837 79.8168 23.7837C78.2423 23.7837 76.7889 24.8759 76.7889 27.0601C76.91 29.2443 78.3634 30.3364 79.8168 30.3364Z",
    p1dcbfc80: "M0 0H9.08386V2.30556H5.93478V11.7705H3.02795V2.30556H0V0Z",
    p1e11f600: "M52.6863 2.42692H55.5931L56.9254 9.10094L58.4999 2.42692H61.5279L63.1025 9.10094L64.4348 2.42692H67.0994L64.5559 11.7705H61.4068L59.9534 5.70324L58.3789 11.7705H55.2298L52.6863 2.42692Z",
    p1e2cf200: "M238.845 0H0V295.476H238.845V0Z",
    p1e372000: "M0 6.7954L5.57147 4.48983L0 1.94155V0L8.11493 4.00445V5.21792L0 8.85831V6.7954Z",
    p1e563500: "M23.8603 9.2222C22.8913 9.2222 22.1646 8.97949 21.6801 8.37277C21.1957 7.76604 20.9534 7.03797 20.9534 5.94586C20.9534 4.85375 21.1957 4.00433 21.6801 3.51895C22.1646 2.91222 22.8913 2.66956 23.8603 2.66956C24.2236 2.66956 24.4658 2.66956 24.8292 2.79091C25.1926 2.91225 25.4348 2.91223 25.5559 3.03358L25.3137 3.76166C25.0714 3.64031 24.8292 3.6403 24.587 3.51895C24.3447 3.51895 24.1025 3.39764 23.8603 3.39764C22.528 3.39764 21.9224 4.24705 21.9224 5.82454C21.9224 6.55262 22.0435 7.15934 22.4068 7.64472C22.7702 8.00876 23.1335 8.25145 23.8603 8.25145C24.3447 8.25145 24.9503 8.13008 25.5559 7.88739V8.73682C25.0714 9.10086 24.587 9.2222 23.8603 9.2222Z",
    p1e689600: "M105.373 82.1508H101.618V73.1713H105.373V65.6479H116.152V73.1713H121.724V82.1508H116.152V92.4652C116.152 94.164 116.879 94.8921 118.696 94.8921H121.845V104.114H117.121C110.339 104.114 105.252 101.202 105.252 92.3438V82.1508H105.373Z",
    p1f46dc00: "M150.792 31.6712C148.248 31.6712 146.432 29.851 146.432 27.0601C146.432 24.2691 148.248 22.4489 150.792 22.4489C153.335 22.4489 155.031 24.2691 155.031 26.696C155.031 27.0601 155.031 27.3028 155.031 27.5454H147.885C148.006 29.3656 149.217 30.3364 150.792 30.3364C152.124 30.3364 152.972 29.6083 153.335 28.6375H154.91C154.425 30.3364 152.972 31.6712 150.792 31.6712ZM147.885 26.332H153.457C153.457 24.6332 152.124 23.6624 150.671 23.6624C149.339 23.6624 148.127 24.6332 147.885 26.332Z",
    p20c52300: "M17.1988 41.0147C8.59938 41.0147 1.81677 36.889 1.45342 28.6375H12.9596C13.2019 31.5498 14.8975 32.5206 16.8354 32.5206C18.7733 32.5206 20.2267 31.5498 20.2267 29.7296C20.2267 23.541 1.3323 26.4533 1.57453 12.984C1.57453 5.3392 7.87267 1.3348 16.1087 1.3348C24.9503 1.3348 30.8851 5.70324 31.2484 13.348H19.5C19.3789 10.9211 17.9255 9.82898 15.9876 9.82898C14.413 9.82898 13.0807 10.6784 13.0807 12.6199C13.0807 18.4445 31.7329 16.503 31.7329 29.0015C31.6118 35.7969 26.4037 41.0147 17.1988 41.0147Z",
    p20f30300: "M53.5342 9.2222C52.5652 9.2222 51.8385 8.97949 51.354 8.37277C50.7484 7.76605 50.5062 7.03798 50.5062 5.94588C50.5062 4.97512 50.7484 4.12571 51.2329 3.51899C51.7174 2.91227 52.4441 2.54825 53.2919 2.54825C54.1397 2.54825 54.7453 2.79095 55.2298 3.39767C55.7143 3.88305 55.9565 4.6111 55.9565 5.46051V6.06723H51.5963C51.5963 6.7953 51.8385 7.40202 52.2019 7.76605C52.5652 8.13008 53.0497 8.37277 53.7764 8.37277C54.5031 8.37277 55.1087 8.25143 55.8354 7.8874V8.73683C55.472 8.85817 55.2298 8.9795 54.8665 9.10085C54.382 9.22219 53.8975 9.2222 53.5342 9.2222ZM53.2919 3.39767C52.8074 3.39767 52.323 3.51901 52.0807 3.88305C51.7174 4.24708 51.5963 4.73247 51.5963 5.21784H54.9876C54.9876 4.61112 54.8665 4.12573 54.6242 3.76169C54.1397 3.64035 53.7764 3.39767 53.2919 3.39767Z",
    p21183380: "M123.54 9.10092V4.97521C123.54 4.48983 123.419 4.1258 123.177 3.88311C122.935 3.64042 122.571 3.51905 122.208 3.51905C121.602 3.51905 121.118 3.64043 120.876 4.00446C120.634 4.3685 120.391 4.85386 120.391 5.58193V9.10092H119.422V4.97521C119.422 4.48983 119.301 4.1258 119.059 3.88311C118.817 3.64042 118.453 3.51905 118.09 3.51905C117.484 3.51905 117 3.76174 116.758 4.12578C116.516 4.48981 116.394 5.09654 116.394 5.94595V9.34363H115.425V2.91233H116.152L116.273 3.76176C116.516 3.39772 116.758 3.15503 117 3.03368C117.363 2.91234 117.727 2.79102 118.09 2.79102C119.059 2.79102 119.786 3.15504 120.028 3.88311C120.27 3.51908 120.512 3.27637 120.876 3.03368C121.239 2.79099 121.602 2.79102 122.087 2.79102C122.814 2.79102 123.298 3.03371 123.661 3.39774C124.025 3.76177 124.146 4.3685 124.146 5.21791V9.34363H123.54V9.10092Z",
    p2122200: "M307.882 167.942C298.677 167.942 291.773 161.996 291.773 152.046C291.773 142.217 298.798 136.271 307.882 136.271C316.966 136.271 323.991 142.217 323.991 152.046C324.112 161.875 317.087 167.942 307.882 167.942ZM307.882 158.477C310.668 158.477 313.211 156.414 313.211 151.924C313.211 147.556 310.789 145.493 308.003 145.493C305.217 145.493 302.795 147.556 302.795 151.924C302.795 156.536 305.096 158.477 307.882 158.477Z",
    p21c9a400: "M17.1988 231.284C8.59938 231.284 1.81677 227.159 1.45342 218.907H12.9596C13.2019 221.819 14.8975 222.79 16.8354 222.79C18.7733 222.79 20.2267 221.819 20.2267 219.999C20.2267 213.811 1.3323 216.723 1.57453 203.254C1.57453 195.609 7.87267 191.604 16.1087 191.604C24.9503 191.604 30.8851 195.973 31.2484 203.618H19.5C19.3789 201.191 17.9255 200.099 15.9876 200.099C14.413 200.099 13.0807 200.948 13.0807 202.89C13.0807 208.714 31.7329 206.773 31.7329 219.271C31.6118 225.945 26.4037 231.284 17.1988 231.284Z",
    p223136b0: "M206.506 7.40202C206.506 8.00874 206.264 8.49413 205.901 8.73682C205.416 9.10086 204.811 9.2222 204.084 9.2222C203.236 9.2222 202.63 9.10087 202.146 8.85818V8.00874C202.509 8.13009 202.752 8.25142 203.115 8.37277C203.478 8.49411 203.842 8.49412 204.084 8.49412C204.568 8.49412 204.932 8.3728 205.295 8.25145C205.537 8.13011 205.658 7.88741 205.658 7.52337C205.658 7.28068 205.537 7.03799 205.295 6.91664C205.053 6.7953 204.689 6.55261 204.084 6.30992C203.478 6.06723 203.115 5.94588 202.873 5.70319C202.63 5.58184 202.388 5.33915 202.267 5.09646C202.146 4.85377 202.025 4.61107 202.025 4.36838C202.025 3.883 202.267 3.39762 202.63 3.15493C202.994 2.79089 203.599 2.66956 204.326 2.66956C205.053 2.66956 205.658 2.79089 206.385 3.03358L206.022 3.88301C205.416 3.64032 204.811 3.51895 204.326 3.51895C203.842 3.51895 203.478 3.64031 203.236 3.76166C202.994 3.883 202.873 4.12569 202.873 4.36838C202.873 4.48973 202.873 4.73241 202.994 4.85376C203.115 4.9751 203.236 5.09647 203.357 5.21782C203.599 5.33916 203.963 5.4605 204.447 5.70319C205.174 5.94588 205.658 6.30989 206.022 6.55259C206.385 6.55259 206.506 6.91664 206.506 7.40202Z",
    p23d9fa00: "M67.705 26.4534C67.705 24.6332 66.736 23.6624 65.1615 23.6624C63.7081 23.6624 62.618 24.6332 62.618 26.5747V31.5498H61.1646V22.6916H62.618V23.9051C63.2236 22.9343 64.3137 22.4489 65.5248 22.4489C67.5838 22.4489 69.1584 23.6624 69.1584 26.332V31.5498H67.705V26.4534V26.4534Z",
    p24c4f580: "M45.6615 22.4489C47.3572 22.4489 48.4472 23.2984 48.9317 24.2691V22.6916H50.3851V31.5498H48.9317V29.851C48.4472 30.8218 47.2361 31.6712 45.6615 31.6712C43.2392 31.6712 41.4224 29.851 41.4224 27.0601C41.4224 24.2691 43.2392 22.4489 45.6615 22.4489ZM45.9038 23.7837C44.3292 23.7837 42.8758 24.9972 42.8758 27.0601C42.8758 29.1229 44.2081 30.4577 45.9038 30.4577C47.4783 30.4577 48.9317 29.2443 48.9317 27.1814C48.9317 24.9972 47.4783 23.7837 45.9038 23.7837Z",
    p24c70000: "M91.9286 2.79095V6.91666C91.9286 7.40204 92.0497 7.88742 92.2919 8.13011C92.5342 8.37279 92.8975 8.49412 93.382 8.49412C94.1087 8.49412 94.5932 8.25143 94.8354 7.8874C95.1988 7.52337 95.3199 6.91664 95.3199 6.06723V2.6696H96.2888V9.10085H95.441L95.3199 8.25146C95.0777 8.61549 94.8354 8.85815 94.4721 8.97949C94.1087 9.10084 93.7453 9.2222 93.2609 9.2222C92.5342 9.2222 91.9286 8.97951 91.5652 8.61548C91.2019 8.25144 90.9596 7.64472 90.9596 6.79531V2.54825H91.9286V2.79095Z",
    p24f2b680: "M61.2857 12.4987C58.7422 12.4987 56.9255 10.6784 56.9255 7.88751C56.9255 5.09656 58.7422 3.27639 61.2857 3.27639C63.8292 3.27639 65.5249 5.09658 65.5249 7.52348C65.5249 7.88752 65.5249 8.13023 65.5249 8.37292H58.3789C58.5 10.1931 59.7112 11.1638 61.2857 11.1638C62.618 11.1638 63.4659 10.4358 63.8292 9.46502H65.4037C64.9193 11.2852 63.587 12.4987 61.2857 12.4987ZM58.5 7.28078H64.0715C64.0715 5.58194 62.7391 4.6112 61.2857 4.6112C59.8323 4.48986 58.6211 5.4606 58.5 7.28078Z",
    p252bf600: "M232.425 9.10095V4.97518C232.425 4.48979 232.304 4.00441 232.062 3.76171C231.82 3.51902 231.457 3.39769 230.972 3.39769C230.245 3.39769 229.761 3.64037 229.519 3.88307C229.155 4.24711 229.034 4.85384 229.034 5.70326V9.10095H228.065V2.6696H228.792L228.913 3.51901C229.155 3.15497 229.397 2.9123 229.761 2.79096C230.124 2.66961 230.488 2.54825 230.972 2.54825C231.699 2.54825 232.304 2.79094 232.668 3.15498C233.031 3.51902 233.273 4.12575 233.273 4.97518V9.10095H232.425V9.10095Z",
    p2556f800: "M252.652 128.262C252.652 125.107 255.075 122.68 258.95 122.68C262.705 122.68 265.248 125.107 265.248 128.262C265.248 131.296 262.826 133.723 258.95 133.723C255.196 133.723 252.652 131.296 252.652 128.262ZM253.5 136.635H264.28V167.457H253.5V136.635Z",
    p2666f000: "M30.6429 22.4489C32.0963 22.4489 33.3075 23.177 33.9131 24.1478V19.4153H35.3665V31.4285H33.9131V29.7297C33.4286 30.7004 32.2174 31.5498 30.6429 31.5498C28.2205 31.5498 26.4037 29.7297 26.4037 26.9387C26.4037 24.2691 28.2205 22.4489 30.6429 22.4489ZM30.8851 23.7837C29.3106 23.7837 27.8571 24.9972 27.8571 27.0601C27.8571 29.1229 29.1895 30.4577 30.8851 30.4577C32.4597 30.4577 33.9131 29.2443 33.9131 27.1814C33.9131 24.9972 32.5808 23.7837 30.8851 23.7837Z",
    p27496f00: "M339.252 167.457H328.472V136.635H339.252V142.095C341.553 138.698 345.065 136.392 349.183 136.392V147.92H346.155C341.674 147.92 339.252 149.376 339.252 154.109V167.457Z",
    p279ced80: "M224.068 9.2222C223.099 9.2222 222.373 8.97949 221.888 8.37277C221.283 7.76605 221.04 7.03798 221.04 5.94588C221.04 4.97512 221.283 4.12571 221.767 3.51899C222.252 2.91227 222.978 2.54825 223.826 2.54825C224.674 2.54825 225.28 2.79095 225.764 3.39767C226.248 3.88305 226.491 4.6111 226.491 5.46051V6.06723H222.13C222.13 6.7953 222.373 7.40202 222.736 7.76605C223.099 8.13008 223.584 8.37277 224.311 8.37277C225.037 8.37277 225.643 8.25143 226.37 7.8874V8.73683C226.006 8.85817 225.643 8.9795 225.401 9.10085C224.795 9.22219 224.432 9.2222 224.068 9.2222ZM223.826 3.39767C223.342 3.39767 222.857 3.51901 222.615 3.88305C222.252 4.24708 222.13 4.73247 222.13 5.21784H225.522C225.522 4.61112 225.401 4.12573 225.158 3.76169C224.674 3.64035 224.311 3.39767 223.826 3.39767Z",
    p2830e400: "M214.379 8.49412C214.5 8.49412 214.742 8.49412 214.863 8.49412C214.984 8.49412 215.106 8.49411 215.227 8.37277V9.10085C215.106 9.10085 214.984 9.2222 214.742 9.2222C214.5 9.2222 214.379 9.2222 214.137 9.2222C212.925 9.2222 212.32 8.61547 212.32 7.28067V3.51897H211.351V3.0336L212.32 2.66958L212.683 1.33478H213.289V2.79093H215.106V3.51897H213.289V7.28067C213.289 7.64471 213.41 8.00876 213.531 8.1301C213.773 8.37279 214.016 8.49412 214.379 8.49412Z",
    p291f3480: "M272.152 145.614H268.398V136.635H272.152V129.112H282.932V136.635H288.503V145.614H283.053V155.929C283.053 157.628 283.78 158.356 285.596 158.356H288.745V167.578H284.022C277.239 167.578 272.152 164.666 272.152 155.808V145.614V145.614Z",
    p2a81cf00: "M65.0404 150.954C65.0404 147.435 63.1025 145.25 59.9534 145.25C56.8043 145.25 54.7453 147.313 54.7453 150.954V167.578H43.9658V136.756H54.7453V141.125C56.5621 138.455 59.8323 136.392 64.1925 136.392C71.3385 136.392 75.8199 141.489 75.8199 149.498V167.457H65.0404V150.954Z",
    p2a919100: "M50.1429 3.27639C51.7174 3.27639 52.9286 4.12581 53.4131 5.09657V3.5191H54.8665V12.62C54.8665 15.0469 53.1708 16.8671 50.6274 16.8671C48.3261 16.8671 46.6305 15.6536 46.2671 13.8334H47.7205C48.0839 14.9255 49.0528 15.6536 50.5062 15.6536C52.0808 15.6536 53.292 14.6828 53.292 12.7413V10.9211C52.8075 11.8919 51.5963 12.7413 50.0218 12.7413C47.5994 12.7413 45.7826 10.9211 45.7826 8.1302C45.9038 5.09657 47.7205 3.27639 50.1429 3.27639ZM50.5062 4.6112C48.9317 4.6112 47.4783 5.82463 47.4783 7.88749C47.4783 9.95036 48.8106 11.2852 50.5062 11.2852C52.0808 11.2852 53.5342 10.0717 53.5342 8.00885C53.5342 5.82463 52.0808 4.6112 50.5062 4.6112Z",
    p2bb8b00: "M47.8416 9.10092V4.97521C47.8416 4.48983 47.7205 4.1258 47.4783 3.88311C47.236 3.64042 46.8727 3.51905 46.5093 3.51905C45.9037 3.51905 45.4193 3.64043 45.177 4.00446C44.9348 4.3685 44.6925 4.85386 44.6925 5.58193V9.10092H43.7236V4.97521C43.7236 4.48983 43.6025 4.1258 43.3603 3.88311C43.118 3.64042 42.7547 3.51905 42.3913 3.51905C41.7857 3.51905 41.3012 3.76174 41.059 4.12578C40.8168 4.48981 40.6957 5.09654 40.6957 5.94595V9.34363H39.7267V2.91233H40.4534L40.5745 3.76176C40.8168 3.39772 41.059 3.15503 41.3012 3.03368C41.6646 2.91234 42.0279 2.79102 42.3913 2.79102C43.3602 2.79102 44.087 3.15504 44.3292 3.88311C44.5714 3.51908 44.8137 3.27637 45.177 3.03368C45.5404 2.79099 45.9037 2.79102 46.3882 2.79102C47.1149 2.79102 47.5994 3.03371 47.9627 3.39774C48.3261 3.76177 48.4472 4.3685 48.4472 5.21791V9.34363H47.8416V9.10092Z",
    p2c510e80: "M20.7112 31.6712C18.1677 31.6712 16.351 29.851 16.351 27.0601C16.351 24.2691 18.1677 22.4489 20.7112 22.4489C23.2546 22.4489 24.9503 24.2691 24.9503 26.696C24.9503 27.0601 24.9503 27.3028 24.9503 27.5454H17.8044C17.9255 29.3656 19.1366 30.3364 20.7112 30.3364C22.0435 30.3364 22.8913 29.6083 23.2546 28.6375H24.8292C24.3447 30.3364 22.8913 31.6712 20.7112 31.6712ZM17.9255 26.332H23.4969C23.4969 24.6332 22.1646 23.6624 20.7112 23.6624C19.2578 23.6624 18.0466 24.6332 17.9255 26.332Z",
    p2cc57680: "M219.345 2.66956C219.587 2.66956 219.829 2.66956 220.071 2.79091L219.95 3.64032C219.708 3.64032 219.466 3.51897 219.224 3.51897C218.739 3.51897 218.255 3.76166 217.891 4.1257C217.528 4.48974 217.286 5.0965 217.286 5.70324V9.10095H216.317V2.66956H217.165L217.286 3.88303C217.528 3.51899 217.77 3.15492 218.134 2.91223C218.618 2.66953 218.981 2.66956 219.345 2.66956Z",
    p2d15280: "M88.1739 199.613C95.9255 199.613 101.739 204.103 103.193 211.869H91.8075C91.2019 210.049 89.9907 208.835 87.9317 208.835C85.2671 208.835 83.5714 211.02 83.5714 215.388C83.5714 219.878 85.3882 222.062 87.9317 222.062C89.9907 222.062 91.2019 220.97 91.8075 219.028H103.193C101.618 226.673 95.9255 231.284 88.1739 231.284C78.969 231.284 72.5497 225.338 72.5497 215.388C72.5497 205.68 78.969 199.613 88.1739 199.613Z",
    p2da48080: "M131.534 3.27639C133.23 3.27639 134.32 4.12581 134.804 5.09658V3.5191H136.258V12.3773H134.804V10.6785C134.32 11.6492 133.109 12.4987 131.534 12.4987C129.112 12.4987 127.295 10.6784 127.295 7.88751C127.295 5.09656 129.233 3.27639 131.534 3.27639ZM131.898 4.6112C130.323 4.6112 128.87 5.82463 128.87 7.88751C128.87 9.95038 130.202 11.2852 131.898 11.2852C133.472 11.2852 134.926 10.0717 134.926 8.00886C134.926 5.82464 133.472 4.6112 131.898 4.6112Z",
    p2e1ade00: "M115.91 22.4489C118.332 22.4489 120.149 24.2691 120.149 27.0601C120.149 29.851 118.332 31.6712 115.91 31.6712C114.335 31.6712 113.124 30.8218 112.64 29.851V35.6756H111.186V22.5703H112.64V24.2691C113.124 23.2984 114.335 22.4489 115.91 22.4489ZM115.668 23.7837C114.093 23.7837 112.64 24.9972 112.64 27.0601C112.64 29.123 114.093 30.3364 115.668 30.3364C117.363 30.3364 118.696 29.123 118.696 26.9387C118.696 24.8759 117.242 23.7837 115.668 23.7837Z",
    p2fc39a00: "M68.1895 230.92H57.4099V226.552C55.5932 229.221 52.4441 231.284 48.0839 231.284C40.9379 231.284 36.4565 226.188 36.4565 218.058V200.099H47.1149V216.602C47.1149 220.121 49.1739 222.305 52.2019 222.305C55.3509 222.305 57.2888 220.242 57.2888 216.602V200.099H68.0683V230.92H68.1895Z",
    p3019800: "M13.3229 11.7705H10.4161V2.42691H13.3229V4.00439C13.9285 3.03362 15.0186 2.30556 16.2298 2.30556V5.3392H15.5031C14.1708 5.3392 13.3229 5.82456 13.3229 7.40206V11.7705V11.7705Z",
    p31218540: "M12.5963 7.40202C12.5963 8.00874 12.3541 8.49413 11.9907 8.73682C11.5062 9.10086 10.9006 9.2222 10.1739 9.2222C9.3261 9.2222 8.72051 9.10087 8.23603 8.85818V8.00874C8.59939 8.13009 8.84162 8.25142 9.20498 8.37277C9.56833 8.49411 9.93169 8.49412 10.1739 8.49412C10.6584 8.49412 11.0218 8.3728 11.3851 8.25145C11.6273 8.13011 11.7485 7.88741 11.7485 7.52337C11.7485 7.28068 11.6273 7.03799 11.3851 6.91664C11.1429 6.7953 10.7795 6.55261 10.1739 6.30992C9.56833 6.06723 9.20498 5.94588 8.96274 5.70319C8.72051 5.58184 8.47827 5.33915 8.35715 5.09646C8.23603 4.85377 8.11491 4.61107 8.11491 4.36838C8.11491 3.883 8.35715 3.39762 8.7205 3.15493C9.08386 2.79089 9.68945 2.66956 10.4162 2.66956C11.1429 2.66956 11.7485 2.79089 12.4752 3.03358L12.1118 3.88301C11.5062 3.64032 10.9006 3.51895 10.4162 3.51895C9.93169 3.51895 9.56833 3.64031 9.3261 3.76166C9.08386 3.883 8.96274 4.12569 8.96274 4.36838C8.96274 4.48973 8.96274 4.73241 9.08386 4.85376C9.20498 4.9751 9.3261 5.09647 9.44721 5.21782C9.68945 5.33916 10.0528 5.4605 10.5373 5.70319C11.264 5.94588 11.7485 6.30989 12.1118 6.55259C12.4752 6.55259 12.5963 6.91664 12.5963 7.40202Z",
    p32bbb700: "M236.907 150.954C236.907 147.435 234.969 145.25 231.82 145.25C228.671 145.25 226.612 147.313 226.612 150.954V167.578H215.832V136.756H226.612V141.125C228.429 138.455 231.699 136.392 236.059 136.392C243.205 136.392 247.686 141.489 247.686 149.498V167.457H236.907V150.954Z",
    p33046700: "M130.929 9.10092V4.97519C130.929 4.4898 130.807 4.00442 130.565 3.76173C130.323 3.51904 129.96 3.39771 129.475 3.39771C128.748 3.39771 128.264 3.6404 128.022 4.00444C127.658 4.36847 127.537 4.9752 127.537 5.82462V9.22228H126.568V0.121368H127.537V2.9123C127.537 3.27633 127.537 3.51904 127.537 3.76173C127.78 3.39769 128.022 3.155 128.385 3.03365C128.748 2.91231 129.112 2.79098 129.596 2.79098C130.323 2.79098 130.929 3.03367 131.413 3.39771C131.776 3.76175 132.019 4.36847 132.019 5.21789V9.34363H130.929V9.10092Z",
    p3377be00: "M87.8106 9.2222C86.8416 9.2222 86.1149 8.97949 85.6305 8.37277C85.146 7.76604 84.9037 7.03797 84.9037 5.94586C84.9037 4.85375 85.146 4.00433 85.6305 3.51895C86.1149 2.91222 86.8416 2.66956 87.8106 2.66956C88.1739 2.66956 88.4161 2.66956 88.7795 2.79091C89.1429 2.91225 89.3851 2.91223 89.5062 3.03358L89.264 3.88301C89.0217 3.76166 88.7795 3.76165 88.5373 3.6403C88.295 3.6403 88.0528 3.51895 87.8106 3.51895C86.4783 3.51895 85.8727 4.36837 85.8727 5.94586C85.8727 6.67393 85.9938 7.28066 86.3572 7.76604C86.7205 8.13008 87.0839 8.37277 87.8106 8.37277C88.295 8.37277 88.9006 8.25144 89.5062 8.00874V8.85818C89.0217 9.10087 88.5373 9.2222 87.8106 9.2222Z",
    p34aa2c80: "M144.615 7.40202C144.615 8.00874 144.373 8.49413 144.009 8.73682C143.525 9.10086 142.919 9.2222 142.193 9.2222C141.345 9.2222 140.739 9.10087 140.255 8.85818V8.00874C140.618 8.13009 140.86 8.25142 141.224 8.37277C141.587 8.49411 141.95 8.49412 142.193 8.49412C142.677 8.49412 143.04 8.3728 143.404 8.25145C143.646 8.13011 143.767 7.88741 143.767 7.52337C143.767 7.28068 143.646 7.03799 143.404 6.91664C143.162 6.7953 142.798 6.55261 142.193 6.30992C141.587 6.06723 141.224 5.94588 140.981 5.70319C140.739 5.58184 140.497 5.33915 140.376 5.09646C140.255 4.85377 140.134 4.61107 140.134 4.36838C140.134 3.883 140.376 3.39762 140.739 3.15493C141.102 2.79089 141.708 2.66956 142.435 2.66956C143.162 2.66956 143.767 2.79089 144.494 3.03358L144.13 3.88301C143.525 3.64032 142.919 3.51895 142.435 3.51895C141.95 3.51895 141.587 3.64031 141.345 3.76166C141.102 3.883 140.981 4.12569 140.981 4.36838C140.981 4.48973 140.981 4.73241 141.102 4.85376C141.224 4.9751 141.345 5.09647 141.466 5.21782C141.708 5.33916 142.071 5.4605 142.556 5.70319C143.283 5.94588 143.767 6.30989 144.13 6.55259C144.494 6.55259 144.615 6.91664 144.615 7.40202Z",
    p35042900: "M122.087 19.4153H123.54V31.4285H122.087V19.4153Z",
    p353c2fb0: "M195.242 167.942C186.037 167.942 179.134 161.996 179.134 152.046C179.134 142.217 186.158 136.271 195.242 136.271C204.326 136.271 211.351 142.217 211.351 152.046C211.472 161.875 204.447 167.942 195.242 167.942ZM195.242 158.477C198.028 158.477 200.571 156.414 200.571 151.924C200.571 147.556 198.149 145.493 195.363 145.493C192.578 145.493 190.155 147.556 190.155 151.924C190.155 156.536 192.457 158.477 195.242 158.477Z",
    p3573fa00: "M129.596 128.747H142.556L152.245 153.987L161.693 128.747H174.652V167.578H163.873V146.221L156.606 167.578H147.643L140.255 145.979V167.578H129.475V128.747H129.596Z",
    p385b3d80: "M187.975 231.284C179.376 231.284 173.683 226.673 173.199 220.485H183.615C183.857 222.547 185.553 223.64 187.854 223.64C189.671 223.64 190.761 222.79 190.761 221.698C190.761 217.208 174.41 220.849 174.41 209.563C174.41 204.224 178.891 199.734 187.248 199.734C195.606 199.734 200.087 204.467 200.814 210.534H191.124C190.761 208.593 189.429 207.501 187.127 207.501C185.311 207.501 184.463 208.229 184.463 209.321C184.463 213.689 200.935 210.17 200.935 221.941C200.814 227.159 195.969 231.284 187.975 231.284Z",
    p38830080: "M51.8385 104.478C42.6335 104.478 35.7298 98.5325 35.7298 88.5821C35.7298 78.7532 42.7547 72.8073 51.8385 72.8073C60.9224 72.8073 67.9472 78.7532 67.9472 88.5821C68.0683 98.5325 61.0435 104.478 51.8385 104.478ZM51.8385 95.1348C54.6242 95.1348 57.1677 93.0719 57.1677 88.5821C57.1677 84.2137 54.7453 82.1509 51.9596 82.1509C49.1739 82.1509 46.7516 84.2137 46.7516 88.5821C46.7516 93.0719 49.0528 95.1348 51.8385 95.1348Z",
    p39133b00: "M216.559 0H227.339V40.772H216.559V0Z",
    p3950df80: "M37.6677 9.10095H36.6988V0H37.6677V9.10095Z",
    p397beb00: "M98.3479 12.4987C96.2889 12.4987 94.8355 11.4065 94.7143 9.70769H96.2888C96.41 10.5571 97.1367 11.1638 98.3479 11.1638C99.559 11.1638 100.165 10.5571 100.165 9.82904C100.165 7.88752 94.9566 8.97963 94.9566 5.70331C94.9566 4.36852 96.2889 3.15506 98.2267 3.15506C100.165 3.15506 101.497 4.24719 101.618 5.94602H100.165C100.044 5.0966 99.4379 4.36851 98.2267 4.36851C97.1367 4.36851 96.5311 4.85389 96.5311 5.58196C96.5311 7.64483 101.739 6.55272 101.739 9.70769C101.618 11.4065 100.286 12.4987 98.3479 12.4987Z",
    p3a813b00: "M140.86 22.4489C143.04 22.4489 144.494 23.541 144.978 25.4826H143.404C143.04 24.3905 142.193 23.7837 140.86 23.7837C139.286 23.7837 138.075 24.9972 138.075 27.0601C138.075 29.2443 139.286 30.4577 140.86 30.4577C142.193 30.4577 143.04 29.851 143.404 28.7589H144.978C144.494 30.5791 143.04 31.7925 140.86 31.7925C138.317 31.7925 136.5 29.9724 136.5 27.1814C136.5 24.2691 138.317 22.4489 140.86 22.4489Z",
    p3ac53f00: "M71.823 9.10085L71.5808 8.13012C71.2174 8.49415 70.9752 8.85815 70.6118 8.9795C70.2485 9.10084 69.8851 9.2222 69.4006 9.2222C68.795 9.2222 68.3106 9.10086 67.9472 8.73683C67.5839 8.3728 67.4628 7.88742 67.4628 7.40205C67.4628 6.06727 68.5528 5.46054 70.6118 5.3392H71.7019V4.97518C71.7019 4.48981 71.5808 4.12579 71.3385 3.8831C71.0963 3.64041 70.7329 3.51905 70.2485 3.51905C69.764 3.51905 69.1584 3.64042 68.4317 4.00445L68.1895 3.27638C68.5528 3.15504 68.7951 2.91233 69.2795 2.91233C69.6429 2.79099 70.0062 2.79102 70.3696 2.79102C71.0963 2.79102 71.7019 2.91235 72.0652 3.27638C72.4286 3.64041 72.6708 4.12577 72.6708 4.85383V9.2222H71.823V9.10085ZM69.6429 8.49413C70.2485 8.49413 70.7329 8.37279 71.0963 8.00876C71.4596 7.64473 71.5808 7.15935 71.5808 6.67398V6.06726H70.6118C69.8851 6.06726 69.2795 6.18863 68.9162 6.43132C68.5528 6.674 68.4317 6.91667 68.4317 7.40205C68.4317 7.76608 68.5528 8.00878 68.795 8.25147C68.9162 8.37281 69.2795 8.49413 69.6429 8.49413Z",
    p3b221700: "M12.9596 26.4533C12.9596 24.6332 11.9907 23.6624 10.5373 23.6624C9.08386 23.6624 7.99379 24.6332 7.99379 26.5747V31.5498H6.54037V26.4533C6.54037 24.6332 5.57142 23.6624 4.118 23.6624C2.66458 23.6624 1.57453 24.6332 1.57453 26.5747V31.5498H0.12109V22.6916H1.57453V24.0264C2.18012 23.0557 3.27017 22.5703 4.36023 22.5703C5.81366 22.5703 7.02485 23.177 7.63045 24.5118C8.11492 23.177 9.44721 22.5703 10.7795 22.5703C12.8385 22.5703 14.4131 23.7837 14.4131 26.4533V31.6712H12.9596V26.4533Z",
    p3b352900: "M247.323 41.0148C238.239 41.0148 231.699 35.0688 231.699 25.1185C231.699 15.2895 238.118 9.3436 247.323 9.3436C256.407 9.3436 262.826 15.2895 262.826 24.7545C262.826 25.6039 262.826 26.4533 262.705 27.3027H242.357C242.599 30.8217 244.537 32.2779 246.96 32.2779C249.019 32.2779 250.23 31.0644 250.835 29.851H262.342C260.767 36.2823 255.075 41.0148 247.323 41.0148ZM242.357 22.2062H251.804C251.804 19.4153 249.624 17.9591 247.202 17.9591C244.78 17.9591 242.963 19.4153 242.357 22.2062Z",
    p3b8c4600: "M169.686 2.79102V3.39774L168.475 3.51905C168.596 3.64039 168.717 3.88311 168.717 4.00446C168.839 4.24715 168.839 4.4898 168.839 4.73249C168.839 5.33921 168.596 5.8246 168.233 6.18864C167.748 6.55267 167.264 6.79536 166.416 6.79536C166.174 6.79536 166.053 6.79536 165.932 6.79536C165.568 7.03805 165.326 7.28075 165.326 7.64478C165.326 7.76612 165.447 8.0088 165.568 8.0088C165.689 8.13014 165.932 8.13015 166.295 8.13015H167.385C168.112 8.13015 168.596 8.25149 168.96 8.61552C169.323 8.85821 169.565 9.34359 169.565 9.95031C169.565 10.6784 169.323 11.1637 168.717 11.5278C168.112 11.8918 167.264 12.1345 166.174 12.1345C165.326 12.1345 164.721 12.0132 164.236 11.6491C163.752 11.2851 163.509 10.921 163.509 10.3143C163.509 9.9503 163.63 9.58628 163.873 9.34359C164.115 9.1009 164.478 8.85821 164.963 8.73687C164.842 8.61553 164.721 8.49416 164.599 8.37282C164.478 8.25147 164.478 8.00879 164.478 7.88745C164.478 7.64476 164.599 7.40207 164.721 7.28073C164.842 7.15938 165.084 6.9167 165.326 6.79536C164.963 6.67401 164.721 6.43132 164.478 6.06728C164.236 5.70325 164.115 5.33923 164.115 4.9752C164.115 4.24713 164.357 3.76177 164.721 3.39774C165.084 3.0337 165.689 2.79102 166.537 2.79102C166.901 2.79102 167.143 2.79099 167.385 2.91233H169.686V2.79102ZM164.599 10.193C164.599 10.557 164.721 10.7997 165.084 11.0424C165.326 11.1637 165.811 11.2851 166.295 11.2851C167.143 11.2851 167.748 11.1637 168.112 10.921C168.475 10.6784 168.717 10.3143 168.717 9.95031C168.717 9.58628 168.596 9.34358 168.354 9.22224C168.112 9.1009 167.748 8.97954 167.143 8.97954H165.932C165.447 8.97954 165.205 9.1009 164.963 9.34359C164.721 9.46494 164.599 9.82895 164.599 10.193ZM165.084 4.73249C165.084 5.21787 165.205 5.46058 165.447 5.70327C165.689 5.94596 166.053 6.06728 166.537 6.06728C167.506 6.06728 167.991 5.5819 167.991 4.73249C167.991 3.76174 167.506 3.27638 166.537 3.27638C166.053 3.27638 165.689 3.39771 165.447 3.6404C165.205 3.88309 165.084 4.24712 165.084 4.73249Z",
    p3c8a6400: "M100.649 31.6712C98.1056 31.6712 96.2888 29.851 96.2888 27.0601C96.2888 24.2691 98.1056 22.4489 100.649 22.4489C103.193 22.4489 104.888 24.2691 104.888 26.696C104.888 27.0601 104.888 27.3028 104.888 27.5454H97.7423C97.8634 29.3656 99.0745 30.3364 100.649 30.3364C101.981 30.3364 102.829 29.6083 103.193 28.6375H104.767C104.283 30.3364 102.829 31.6712 100.649 31.6712ZM97.7423 26.332H103.314C103.314 24.6332 101.981 23.6624 100.528 23.6624C99.0745 23.6624 97.8634 24.6332 97.7423 26.332Z",
    p3cc7c800: "M17.8044 3.27639C19.5 3.27639 20.5901 4.12581 21.0746 5.09658V3.5191H22.528V12.3773H21.0746V10.6785C20.5901 11.6492 19.3789 12.4987 17.8044 12.4987C15.382 12.4987 13.5653 10.6784 13.5653 7.88751C13.5653 5.09656 15.382 3.27639 17.8044 3.27639ZM18.1677 4.6112C16.5932 4.6112 15.1398 5.82463 15.1398 7.88751C15.1398 9.95038 16.4721 11.2852 18.1677 11.2852C19.7423 11.2852 21.1957 10.0717 21.1957 8.00886C21.0746 5.82464 19.7423 4.6112 18.1677 4.6112Z",
    p3cd50900: "M210.382 40.6507H199.602V36.2823C197.786 38.9519 194.637 41.0147 190.276 41.0147C183.13 41.0147 178.649 35.9182 178.649 27.7881V9.82898H189.307V26.332C189.307 29.851 191.366 32.0352 194.394 32.0352C197.543 32.0352 199.481 29.9723 199.481 26.332V9.82898H210.261V40.6507H210.382Z",
    p3cf9b540: "M239.693 8.25146C239.208 8.85818 238.481 9.2222 237.634 9.2222C236.786 9.2222 236.18 8.97949 235.696 8.37277C235.211 7.76605 234.969 7.03798 234.969 5.94588C234.969 4.85379 235.211 4.12572 235.696 3.519C236.18 2.91227 236.786 2.66961 237.634 2.66961C238.481 2.66961 239.208 3.03363 239.571 3.64035H239.693V3.15498V2.66961V0.121368H240.662V9.2222H239.814L239.693 8.25146ZM237.755 8.49412C238.36 8.49412 238.845 8.37279 239.208 8.00875C239.45 7.64472 239.693 7.03801 239.693 6.30994V6.06724C239.693 5.21783 239.571 4.48975 239.208 4.12572C238.845 3.76169 238.481 3.519 237.755 3.519C237.149 3.519 236.786 3.76169 236.422 4.12572C236.18 4.6111 235.938 5.21782 235.938 5.94588C235.938 6.7953 236.059 7.40202 236.422 7.76605C236.786 8.13008 237.149 8.49412 237.755 8.49412Z",
    p3d37b970: "M82.2392 3.88308L81.8758 5.82463H83.5714V6.55268H81.7547L81.2702 9.10095H80.4224L80.9069 6.55268H79.0901L78.6056 9.10095H77.7578L78.2423 6.55268H76.6677V5.82463H78.6056L78.969 3.88308H77.3944V3.155H79.0901L79.5746 0.60672H80.4224L79.9379 3.155H81.7547L82.2392 0.60672H82.9659L82.4814 3.155H84.0559V3.88308H82.2392ZM79.3323 5.82463H81.1491L81.5124 3.88308H79.6957L79.3323 5.82463Z",
    p3d721a00: "M19.6211 5.94588C19.6211 7.03798 19.3789 7.76605 18.8944 8.37277C18.4099 8.97949 17.6832 9.2222 16.7143 9.2222C16.1087 9.2222 15.6242 9.10087 15.1397 8.85818C14.6553 8.61549 14.413 8.25146 14.1708 7.64473C13.9286 7.15936 13.8074 6.55263 13.8074 5.82457C13.8074 4.73247 14.0497 4.0044 14.5342 3.39767C15.0186 2.79095 15.7453 2.54825 16.7143 2.54825C17.5621 2.54825 18.2888 2.79095 18.8944 3.39767C19.3789 4.12574 19.6211 4.85378 19.6211 5.94588ZM14.7764 5.94588C14.7764 6.79529 14.8975 7.40202 15.2609 7.76605C15.6242 8.25143 16.1087 8.37277 16.7143 8.37277C17.3199 8.37277 17.8043 8.13008 18.1677 7.76605C18.5311 7.28067 18.6522 6.67395 18.6522 5.94588C18.6522 5.09647 18.5311 4.48975 18.1677 4.12571C17.8043 3.76168 17.3199 3.51899 16.7143 3.51899C16.1087 3.51899 15.6242 3.76168 15.2609 4.12571C14.8975 4.48975 14.7764 5.09647 14.7764 5.94588Z",
    p3d969300: "M102.466 7.40202C102.466 8.00874 102.224 8.49413 101.86 8.73682C101.376 9.10086 100.77 9.2222 100.043 9.2222C99.1957 9.2222 98.5901 9.10087 98.1056 8.85818V8.00874C98.469 8.13009 98.7112 8.25142 99.0745 8.37277C99.4379 8.49411 99.8013 8.49412 100.043 8.49412C100.528 8.49412 100.891 8.3728 101.255 8.25145C101.497 8.13011 101.618 7.88741 101.618 7.52337C101.618 7.28068 101.497 7.03799 101.255 6.91664C101.012 6.7953 100.649 6.55261 100.043 6.30992C99.4379 6.06723 99.0745 5.94588 98.8323 5.70319C98.5901 5.58184 98.3478 5.33915 98.2267 5.09646C98.1056 4.85377 97.9845 4.61107 97.9845 4.36838C97.9845 3.883 98.2267 3.39762 98.5901 3.15493C98.9534 2.79089 99.559 2.66956 100.286 2.66956C101.012 2.66956 101.618 2.79089 102.345 3.03358L101.981 3.88301C101.376 3.64032 100.77 3.51895 100.286 3.51895C99.8013 3.51895 99.4379 3.64031 99.1957 3.76166C98.9534 3.883 98.8323 4.12569 98.8323 4.36838C98.8323 4.48973 98.8323 4.73241 98.9534 4.85376C99.0745 4.9751 99.1957 5.09647 99.3168 5.21782C99.559 5.33916 99.9224 5.4605 100.407 5.70319C101.134 5.94588 101.618 6.30989 101.981 6.55259C102.345 6.55259 102.466 6.91664 102.466 7.40202Z",
    p3db27c80: "M193.547 8.49412C193.668 8.49412 193.91 8.49412 194.031 8.49412C194.152 8.49412 194.273 8.49411 194.394 8.37277V9.10085C194.273 9.10085 194.152 9.2222 193.91 9.2222C193.668 9.2222 193.547 9.2222 193.304 9.2222C192.093 9.2222 191.488 8.61547 191.488 7.28067V3.51897H190.519V3.0336L191.488 2.66958L191.851 1.33478H192.457V2.79093H194.273V3.51897H192.457V7.28067C192.457 7.64471 192.578 8.00876 192.699 8.1301C192.941 8.37279 193.183 8.49412 193.547 8.49412Z",
    p3e09e00: "M129.839 22.4489C131.534 22.4489 132.624 23.2984 133.109 24.2691V22.6916H134.562V31.5498H133.109V29.851C132.624 30.8218 131.413 31.6712 129.839 31.6712C127.416 31.6712 125.599 29.851 125.599 27.0601C125.599 24.2691 127.416 22.4489 129.839 22.4489ZM130.081 23.7837C128.506 23.7837 127.053 24.9972 127.053 27.0601C127.053 29.1229 128.385 30.4577 130.081 30.4577C131.655 30.4577 133.109 29.2443 133.109 27.1814C133.109 24.9972 131.776 23.7837 130.081 23.7837Z",
    p3e3e6f00: "M31.6118 7.28077C31.6118 5.46059 30.6429 4.48985 29.0684 4.48985C27.6149 4.48985 26.5249 5.4606 26.5249 7.40212V12.3773H25.0715V3.5191H26.5249V4.73255C27.1305 3.76179 28.2205 3.27639 29.4317 3.27639C31.4907 3.27639 33.0653 4.48986 33.0653 7.15946V12.3773H31.6118V7.28077Z",
    p3fa9ac00: "M64.7981 0.970804C64.7981 0.728112 64.7981 0.606737 64.9193 0.485391C65.0404 0.364045 65.1615 0.364075 65.2826 0.364075C65.4037 0.364075 65.5249 0.364045 65.646 0.485391C65.7671 0.606737 65.7671 0.728112 65.7671 0.970804C65.7671 1.2135 65.7671 1.33483 65.646 1.45618C65.5249 1.57753 65.4037 1.57753 65.2826 1.57753C65.1615 1.57753 65.0404 1.57753 64.9193 1.45618C64.7981 1.33483 64.7981 1.2135 64.7981 0.970804ZM65.7671 9.10095H64.7981V2.66964H65.7671V9.10095Z",
    p3fdd6e80: "M198.391 9.2222C197.422 9.2222 196.696 8.97949 196.211 8.37277C195.606 7.76605 195.363 7.03798 195.363 5.94588C195.363 4.97512 195.606 4.12571 196.09 3.51899C196.575 2.91227 197.301 2.54825 198.149 2.54825C198.997 2.54825 199.603 2.79095 200.087 3.39767C200.571 4.0044 200.814 4.6111 200.814 5.46051V6.06723H196.453C196.453 6.7953 196.696 7.40202 197.059 7.76605C197.422 8.13008 197.907 8.37277 198.634 8.37277C199.36 8.37277 199.966 8.25143 200.693 7.8874V8.73683C200.329 8.85817 200.087 8.9795 199.724 9.10085C199.118 9.22219 198.755 9.2222 198.391 9.2222ZM198.028 3.39767C197.543 3.39767 197.059 3.51901 196.817 3.88305C196.453 4.24708 196.332 4.73247 196.332 5.21784H199.724C199.724 4.61112 199.602 4.12573 199.36 3.76169C198.997 3.64035 198.634 3.39767 198.028 3.39767Z",
    p4722e80: "M75.5777 3.27639C77.2733 3.27639 78.3634 4.12581 78.8479 5.09658V3.5191H80.3013V12.3773H78.8479V10.6785C78.3634 11.6492 77.1522 12.4987 75.5777 12.4987C73.1553 12.4987 71.3386 10.6784 71.3386 7.88751C71.3386 5.09656 73.1553 3.27639 75.5777 3.27639ZM75.8199 4.6112C74.2454 4.6112 72.792 5.82463 72.792 7.88751C72.792 9.95038 74.1243 11.2852 75.8199 11.2852C77.3944 11.2852 78.8479 10.0717 78.8479 8.00886C78.8479 5.82464 77.5156 4.6112 75.8199 4.6112Z",
    p5976f80: "M182.767 9.10095H181.798V0H182.767V9.10095Z",
    p5a4adc0: "M154.91 231.284C145.826 231.284 139.286 225.338 139.286 215.388C139.286 205.559 145.705 199.613 154.91 199.613C163.994 199.613 170.413 205.559 170.413 215.024C170.413 215.873 170.413 216.723 170.292 217.572H149.944C150.186 221.091 152.124 222.547 154.547 222.547C156.606 222.547 157.817 221.334 158.422 220.121H169.929C168.354 226.552 162.661 231.284 154.91 231.284ZM149.944 212.354H159.391C159.391 209.563 157.211 208.107 154.789 208.107C152.245 208.229 150.429 209.563 149.944 212.354Z",
    p65cf9f0: "M19.5233 10.2149L10.1972 19.6799L0.75 10.2149L10.0761 0.75L19.5233 10.2149Z",
    p668b680: "M188.702 9.10085L188.46 8.13012C188.096 8.49415 187.854 8.85815 187.491 8.9795C187.127 9.10084 186.764 9.2222 186.279 9.2222C185.674 9.2222 185.189 9.10086 184.826 8.73683C184.463 8.3728 184.342 7.88742 184.342 7.40205C184.342 6.06727 185.432 5.46054 187.491 5.3392H188.581V4.97518C188.581 4.48981 188.46 4.12579 188.217 3.8831C187.975 3.64041 187.612 3.51905 187.127 3.51905C186.643 3.51905 186.037 3.64042 185.311 4.00445L185.068 3.27638C185.432 3.15504 185.674 2.91233 186.158 2.91233C186.522 2.79099 186.885 2.79102 187.248 2.79102C187.975 2.79102 188.581 2.91235 188.944 3.27638C189.307 3.64041 189.55 4.12577 189.55 4.85383V9.2222H188.702V9.10085ZM186.522 8.49413C187.127 8.49413 187.612 8.37279 187.975 8.00876C188.339 7.64473 188.46 7.15935 188.46 6.67398V6.06726H187.491C186.764 6.06726 186.158 6.18863 185.795 6.43132C185.432 6.674 185.311 6.91667 185.311 7.40205C185.311 7.76608 185.432 8.00878 185.674 8.25147C185.795 8.37281 186.158 8.49413 186.522 8.49413Z",
    p6aedd80: "M93.1398 136.271C97.2578 136.271 100.407 138.091 102.102 140.882V126.806H112.882V167.578H102.102V163.331C100.528 166.122 97.3789 168.063 93.1398 168.063C85.8727 168.063 80.059 162.117 80.059 152.167C80.059 142.217 85.8727 136.271 93.1398 136.271ZM96.5311 145.614C93.5031 145.614 90.9597 147.799 90.9597 152.046C90.9597 156.172 93.5031 158.477 96.5311 158.477C99.559 158.477 102.102 156.172 102.102 152.046C102.224 147.92 99.559 145.614 96.5311 145.614Z",
    p78e2230: "M0.121119 1.09213H1.69566L5.8137 10.4357L9.93172 1.09213H11.5063V12.3773H10.0528V4.00444L6.29817 12.3773H5.20811L1.45343 4.00444V12.3773H1.14441e-05V1.09213H0.121119Z",
    p88a5a00: "M92.8975 26.4534C92.8975 24.6332 91.9286 23.6624 90.354 23.6624C88.9006 23.6624 87.8106 24.6332 87.8106 26.5747V31.5498H86.3572V22.6916H87.8106V23.9051C88.4161 22.9343 89.5062 22.4489 90.7174 22.4489C92.7764 22.4489 94.351 23.6624 94.351 26.332V31.5498H92.8975V26.4534Z",
    p98a2e00: "M210.14 8.49412C210.261 8.49412 210.503 8.49412 210.624 8.49412C210.745 8.49412 210.866 8.49411 210.988 8.37277V9.10085C210.866 9.10085 210.745 9.2222 210.503 9.2222C210.261 9.2222 210.14 9.2222 209.898 9.2222C208.686 9.2222 208.081 8.61547 208.081 7.28067V3.51897H207.112V3.0336L208.081 2.66958L208.444 1.33478H209.05V2.79093H210.866V3.51897H209.05V7.28067C209.05 7.64471 209.171 8.00876 209.292 8.1301C209.534 8.37279 209.776 8.49412 210.14 8.49412Z",
    p9e2fe80: "M121.481 199.613C129.233 199.613 135.047 204.103 136.5 211.869H125.115C124.509 210.049 123.298 208.835 121.239 208.835C118.575 208.835 116.879 211.02 116.879 215.388C116.879 219.878 118.696 222.062 121.239 222.062C123.298 222.062 124.509 220.97 125.115 219.028H136.5C134.925 226.673 129.233 231.284 121.481 231.284C112.276 231.284 105.857 225.338 105.857 215.388C105.978 205.68 112.398 199.613 121.481 199.613Z",
    pa9b6b40: "M5.45031 3.88308L5.08696 5.82463H6.78261V6.55268H4.96584L4.48137 9.10095H3.63354L4.11801 6.55268H2.30124L1.81677 9.10095H1.09006L1.57453 6.55268H0V5.82463H1.69565L2.05901 3.88308H0.484472V3.155H2.18012L2.6646 0.60672H3.51242L3.02795 3.155H4.84472L5.32919 0.60672H6.0559L5.57143 3.155H7.14597V3.88308H5.45031ZM2.42236 5.82463H4.23913L4.60249 3.88308H2.78571L2.42236 5.82463Z",
    paf69880: "M92.5342 0H0V9.58627H92.5342V0Z",
    pafde780: "M27.0093 0.970804C27.0093 0.728112 27.0093 0.606737 27.1305 0.485391C27.2516 0.364045 27.3727 0.364075 27.4938 0.364075C27.6149 0.364075 27.736 0.364045 27.8572 0.485391C27.9783 0.606737 27.9783 0.728112 27.9783 0.970804C27.9783 1.2135 27.9783 1.33483 27.8572 1.45618C27.736 1.57753 27.6149 1.57753 27.4938 1.57753C27.3727 1.57753 27.2516 1.57753 27.1305 1.45618C27.0093 1.33483 27.0093 1.2135 27.0093 0.970804ZM27.9783 9.10095H27.0093V2.66964H27.9783V9.10095Z",
    pb8dde90: "M61.8913 8.25146C61.4068 8.85818 60.6801 9.2222 59.8323 9.2222C58.9845 9.2222 58.3789 8.97949 57.8944 8.37277C57.4099 7.76605 57.1677 7.03798 57.1677 5.94588C57.1677 4.85379 57.4099 4.12572 57.8944 3.519C58.3789 2.91227 58.9845 2.66961 59.8323 2.66961C60.6801 2.66961 61.4068 3.03363 61.7702 3.64035H61.8913V3.15498V2.66961V0.121368H62.8603V9.2222H62.1335L61.8913 8.25146ZM59.9534 8.49412C60.559 8.49412 61.0435 8.37279 61.4068 8.00875C61.6491 7.64472 61.8913 7.03801 61.8913 6.30994V6.06724C61.8913 5.21783 61.7702 4.48975 61.4068 4.12572C61.1646 3.76169 60.6801 3.519 59.9534 3.519C59.3478 3.519 58.9845 3.76169 58.6211 4.12572C58.3789 4.6111 58.1366 5.21782 58.1366 5.94588C58.1366 6.7953 58.2578 7.40202 58.6211 7.76605C58.8633 8.25143 59.3478 8.49412 59.9534 8.49412Z",
    pb98a300: "M85.6304 104.478C77.0311 104.478 71.3385 99.8673 70.854 93.6787H81.2702C81.5124 95.7415 83.2081 96.8336 85.5093 96.8336C87.3261 96.8336 88.4162 95.9842 88.4162 94.8921C88.4162 90.4023 72.0652 94.0427 72.0652 82.7576C72.0652 77.4184 76.5466 72.9286 84.9037 72.9286C93.2609 72.9286 97.7422 77.6611 98.469 83.7283H88.7795C88.4162 81.7868 87.0839 80.6947 84.7826 80.6947C82.9659 80.6947 82.118 81.4228 82.118 82.5149C82.118 86.8833 98.5901 83.3643 98.5901 95.1348C98.3478 100.353 93.5031 104.478 85.6304 104.478Z",
    pbb45300: "M137.832 9.10085L137.59 8.13012C137.227 8.49415 136.984 8.85815 136.621 8.9795C136.258 9.10084 135.894 9.2222 135.41 9.2222C134.804 9.2222 134.32 9.10086 133.957 8.73683C133.593 8.3728 133.472 7.88742 133.472 7.40205C133.472 6.06727 134.562 5.46054 136.621 5.3392H137.711V4.97518C137.711 4.48981 137.59 4.12579 137.348 3.8831C137.106 3.64041 136.742 3.51905 136.258 3.51905C135.773 3.51905 135.168 3.64042 134.441 4.00445L134.199 3.27638C134.562 3.15504 134.804 2.91233 135.289 2.91233C135.652 2.79099 136.016 2.79102 136.379 2.79102C137.106 2.79102 137.711 2.91235 138.075 3.27638C138.438 3.64041 138.68 4.12577 138.68 4.85383V9.2222H137.832V9.10085ZM135.652 8.49413C136.258 8.49413 136.742 8.37279 137.106 8.00876C137.469 7.64473 137.59 7.15935 137.59 6.67398V6.06726H136.621C135.894 6.06726 135.289 6.18863 134.925 6.43132C134.562 6.674 134.441 6.91667 134.441 7.40205C134.441 7.76608 134.562 8.00878 134.804 8.25147C134.925 8.37281 135.289 8.49413 135.652 8.49413Z",
    pbb5ec00: "M47.236 11.8918C44.4503 11.8918 42.3913 10.0716 42.3913 7.03799C42.3913 4.00434 44.5714 2.18416 47.236 2.18416C50.0218 2.18416 52.0808 4.00434 52.0808 7.03799C52.0808 10.0716 50.0218 11.8918 47.236 11.8918ZM47.236 9.34356C48.205 9.34356 49.174 8.61549 49.174 7.03799C49.174 5.4605 48.205 4.73243 47.236 4.73243C46.146 4.73243 45.2981 5.4605 45.2981 7.03799C45.2981 8.61549 46.2671 9.34356 47.236 9.34356Z",
    pbef2780: "M0.750002 2.20729C7.65373 2.08594 7.77485 11.6722 14.6786 11.5509C21.5823 11.4295 21.4612 1.84325 28.3649 1.72191C35.2687 1.60056 35.3898 11.1869 42.2935 11.0655C49.1972 10.9442 49.0761 1.35787 55.9798 1.23653C62.8835 1.11518 63.0047 10.7015 69.9084 10.5801C76.8121 10.4588 76.691 0.872489 83.5948 0.751144C90.4985 0.629798 90.6196 10.2161 97.6444 10.0947",
    pc0c0200: "M27.1304 161.147H13.323L11.264 167.457H0L14.1708 128.626H26.5248L40.5745 167.457H29.1894L27.1304 161.147ZM20.2267 140.397L16.1087 152.895H24.3447L20.2267 140.397Z",
    pc2cf300: "M50.5062 9.46494C58.2578 9.46494 64.0714 13.9547 65.5248 21.7208H54.1397C53.5342 19.9006 52.323 18.6872 50.264 18.6872C47.5994 18.6872 45.9037 20.8714 45.9037 25.2398C45.9037 29.7296 47.7205 31.9138 50.264 31.9138C52.323 31.9138 53.5342 30.8217 54.1397 28.8802H65.5248C63.9503 36.525 58.2578 41.1361 50.5062 41.1361C41.3012 41.1361 34.882 35.1902 34.882 25.2398C34.882 15.4109 41.3012 9.46494 50.5062 9.46494Z",
    pc7c0600: "M155.637 8.49412C155.758 8.49412 156 8.49412 156.121 8.49412C156.242 8.49412 156.363 8.49411 156.484 8.37277V9.10085C156.363 9.10085 156.242 9.2222 156 9.2222C155.758 9.2222 155.637 9.2222 155.394 9.2222C154.183 9.2222 153.578 8.61547 153.578 7.28067V3.51897H152.609V3.0336L153.578 2.66958L153.941 1.33478H154.547V2.79093H156.363V3.51897H154.547V7.28067C154.547 7.64471 154.668 8.00876 154.789 8.1301C155.031 8.37279 155.273 8.49412 155.637 8.49412Z",
    pcb3cf00: "M37.6677 20.1434C37.6677 19.5367 38.1522 19.1726 38.6367 19.1726C39.1211 19.1726 39.6056 19.658 39.6056 20.1434C39.6056 20.7501 39.1211 21.1142 38.6367 21.1142C38.1522 21.1142 37.6677 20.7501 37.6677 20.1434ZM37.91 22.5703H39.3634V31.4285H37.91V22.5703Z",
    pd60ef00: "M38.1522 6.67402C38.1522 5.46056 37.4255 4.73247 36.3354 4.73247C35.2454 4.73247 34.5186 5.46056 34.5186 6.67402V11.7705H31.6118V2.42691H34.5186V3.64037C35.1242 2.91229 36.0932 2.30556 37.3044 2.30556C39.4845 2.30556 40.9379 3.76169 40.9379 6.30996V11.7705H38.1522V6.67402Z",
    pdd0fa00: "M34.0342 9.10085L33.7919 8.13012C33.4286 8.49415 33.1863 8.85815 32.823 8.9795C32.4596 9.10084 32.0963 9.2222 31.6118 9.2222C31.0062 9.2222 30.5218 9.10086 30.1584 8.73683C29.7951 8.3728 29.6739 7.88742 29.6739 7.40205C29.6739 6.06727 30.764 5.46054 32.823 5.3392H33.9131V4.97518C33.9131 4.48981 33.7919 4.12579 33.5497 3.8831C33.3075 3.64041 32.9441 3.51905 32.4596 3.51905C31.9752 3.51905 31.3696 3.64042 30.6429 4.00445L30.4006 3.27638C30.764 3.15504 31.0062 2.91233 31.4907 2.91233C31.854 2.79099 32.2174 2.79102 32.5808 2.79102C33.3075 2.79102 33.9131 2.91235 34.2764 3.27638C34.6398 3.64041 34.882 4.12577 34.882 4.85383V9.2222H34.0342V9.10085ZM31.8541 8.49413C32.4596 8.49413 32.9441 8.37279 33.3075 8.00876C33.6708 7.64473 33.7919 7.15935 33.7919 6.67398V6.06726H32.823C32.0963 6.06726 31.4907 6.18863 31.1273 6.43132C30.764 6.674 30.6429 6.91667 30.6429 7.40205C30.6429 7.76608 30.764 8.00878 31.0062 8.25147C31.1273 8.37281 31.3696 8.49413 31.8541 8.49413Z",
    pe744700: "M152.972 9.46494C157.09 9.46494 160.239 11.2851 161.935 14.0761V0H172.714V40.772H161.935V36.525C160.36 39.3159 157.211 41.2574 152.972 41.2574C145.705 41.2574 139.891 35.3115 139.891 25.3612C139.77 15.4109 145.584 9.46494 152.972 9.46494ZM156.363 18.8085C153.335 18.8085 150.792 20.9927 150.792 25.2398C150.792 29.3656 153.335 31.6711 156.363 31.6711C159.391 31.6711 161.935 29.3656 161.935 25.2398C161.935 21.1141 159.391 18.8085 156.363 18.8085Z",
    pe8cef00: "M178.77 3.88308L178.407 5.82463H180.102V6.55268H178.286L177.801 9.10095H176.953L177.438 6.55268H175.621L175.137 9.10095H174.289L174.773 6.55268H173.199V5.82463H174.894L175.258 3.88308H173.683V3.155H175.379L175.863 0.60672H176.711L176.227 3.155H178.044L178.528 0.60672H179.255L178.77 3.155H180.345V3.88308H178.77ZM175.742 5.82463H177.559L177.922 3.88308H176.106L175.742 5.82463Z",
    pee613f0: "M86.8416 0.364101H88.2951V12.3773H86.8416V0.364101Z",
});


/***/ },

/***/ "./ReactApp/index.tsx"
/*!****************************!*\
  !*** ./ReactApp/index.tsx ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/index.css */ "./ReactApp/styles/index.css");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App */ "./ReactApp/App.tsx");




const rootEl = document.getElementById('react-app');
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot)(rootEl);
root.render((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_App__WEBPACK_IMPORTED_MODULE_3__["default"], {}));


/***/ },

/***/ "./ReactApp/pages/Chatbot.tsx"
/*!************************************!*\
  !*** ./ReactApp/pages/Chatbot.tsx ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chatbot)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bot.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock-3.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/file-text.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/folder-kanban.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/lightbulb.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/list-checks.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/message-square.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/send.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash-2.js");
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_Footer__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../Components/Footer */ "./ReactApp/Components/Footer.tsx");
/* harmony import */ var _Components_PageState__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../Components/PageState */ "./ReactApp/Components/PageState.tsx");







function nowLabel() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
const starterPrompts = [
    "Plan my tasks for this week based on priority and due dates.",
    "Create a daily standup summary from my open tasks.",
    "Draft a message to the team about overdue items.",
    "Suggest a sprint goal using the active projects list.",
];
const seedConversations = [
    {
        id: 1,
        title: "Sprint Planning Assistant",
        updatedAt: "Just now",
        messages: [
            {
                id: 11,
                role: "assistant",
                text: "Hello Demo User. I can help you plan tasks, draft updates, and summarize project progress. What should we work on first?",
                time: nowLabel(),
            },
        ],
    },
    {
        id: 2,
        title: "Weekly Status Draft",
        updatedAt: "2h ago",
        messages: [
            {
                id: 21,
                role: "assistant",
                text: "You can ask me to generate a status report grouped by project and priority.",
                time: "10:11 AM",
            },
            {
                id: 22,
                role: "user",
                text: "Give me a clean summary for leadership in 5 bullet points.",
                time: "10:12 AM",
            },
        ],
    },
];
function Chatbot() {
    var _a;
    /* ── Loading / error simulation ── */
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [conversations, setConversations] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [activeConversationId, setActiveConversationId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const chatEndRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const timer = setTimeout(() => {
            try {
                setConversations(seedConversations);
                setActiveConversationId(1);
                setLoading(false);
            }
            catch (_a) {
                setError("Failed to load chatbot data. Please try again.");
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);
    const activeConversation = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => { var _a; return (_a = conversations.find((conversation) => conversation.id === activeConversationId)) !== null && _a !== void 0 ? _a : conversations[0]; }, [conversations, activeConversationId]);
    const activeMessages = (_a = activeConversation === null || activeConversation === void 0 ? void 0 : activeConversation.messages) !== null && _a !== void 0 ? _a : [];
    const createConversation = () => {
        const newConversation = {
            id: Date.now(),
            title: "New Chat",
            updatedAt: "Just now",
            messages: [
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    text: "Ready when you are. Tell me your goal and I will help break it into actionable tasks.",
                    time: nowLabel(),
                },
            ],
        };
        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        setInput("");
    };
    const removeConversation = (conversationId) => {
        setConversations((prev) => {
            const next = prev.filter((conversation) => conversation.id !== conversationId);
            if (!next.length) {
                const fallback = {
                    id: Date.now(),
                    title: "New Chat",
                    updatedAt: "Just now",
                    messages: [
                        {
                            id: Date.now() + 1,
                            role: "assistant",
                            text: "I am here to help with your planning and workflow questions.",
                            time: nowLabel(),
                        },
                    ],
                };
                setActiveConversationId(fallback.id);
                return [fallback];
            }
            if (activeConversationId === conversationId) {
                setActiveConversationId(next[0].id);
            }
            return next;
        });
    };
    const pushAssistantReply = (conversationId, sourceText) => {
        const response = "Here is a suggested next step: prioritize the highest-impact task first, define a clear owner, and set a concrete due date. If you want, I can convert this into a full task checklist.";
        setConversations((prev) => prev.map((conversation) => conversation.id === conversationId
            ? Object.assign(Object.assign({}, conversation), { updatedAt: "Just now", messages: [
                    ...conversation.messages,
                    {
                        id: Date.now() + 2,
                        role: "assistant",
                        text: sourceText.toLowerCase().includes("summary")
                            ? "Summary ready. I grouped updates by status: completed, in progress, and blocked items. Want a short leadership version as well?"
                            : response,
                        time: nowLabel(),
                    },
                ] }) : conversation));
        requestAnimationFrame(() => { var _a; return (_a = chatEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" }); });
    };
    const submitMessage = (event, overrideText) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        const text = (overrideText !== null && overrideText !== void 0 ? overrideText : input).trim();
        if (!text || !activeConversation) {
            return;
        }
        const conversationId = activeConversation.id;
        setConversations((prev) => prev.map((conversation) => conversation.id === conversationId
            ? Object.assign(Object.assign({}, conversation), { title: conversation.title === "New Chat" ? text.slice(0, 32) : conversation.title, updatedAt: "Just now", messages: [
                    ...conversation.messages,
                    {
                        id: Date.now(),
                        role: "user",
                        text,
                        time: nowLabel(),
                    },
                ] }) : conversation));
        setInput("");
        requestAnimationFrame(() => {
            var _a;
            (_a = chatEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => pushAssistantReply(conversationId, text), 320);
        });
    };
    const submitPrompt = (prompt) => {
        submitMessage(undefined, prompt);
    };
    /* ── Page states ── */
    if (loading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_12__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_13__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_15__.PageLoading, { message: "Loading chatbot..." })] })] }));
    }
    if (error) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_12__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_13__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_15__.PageError, { message: error, onRetry: () => window.location.reload() })] })] }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_12__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_13__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", { className: "flex-1 overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-7xl mx-auto p-6 space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Chatbot" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-1", children: "AI workspace assistant for planning, summaries, and fast execution support" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: createConversation, className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors", "aria-label": "Create new chat", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { className: "size-4" }), "New Chat"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("aside", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden h-fit", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-gray-900", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-4 text-blue-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-sm font-semibold", children: "Recent Chats" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "max-h-[560px] overflow-y-auto", children: conversations.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-4 py-8 text-center text-sm text-gray-400", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "size-8 text-gray-300 mx-auto mb-2" }), "No conversations yet."] })) : (conversations.map((conversation) => {
                                                            const isActive = activeConversationId === conversation.id;
                                                            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setActiveConversationId(conversation.id), className: `w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start justify-between gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: `text-sm font-medium truncate ${isActive ? "text-blue-700" : "text-gray-900"}`, children: conversation.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: conversation.updatedAt })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: (event) => {
                                                                                event.stopPropagation();
                                                                                removeConversation(conversation.id);
                                                                            }, className: "p-1 text-gray-400 hover:text-red-500 transition-colors", "aria-label": `Delete chat: ${conversation.title}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { className: "size-3.5" }) })] }) }, conversation.id));
                                                        })) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col min-h-[640px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-4" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-semibold text-gray-900 truncate", children: "TaskFlow AI Assistant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 truncate", children: "Context-aware support for your workspace" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100", children: "Productivity" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100", children: "Planning" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 overflow-y-auto p-5 bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-4", children: [activeMessages.map((message) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${message.role === "user"
                                                                            ? "bg-blue-600 text-white rounded-br-md"
                                                                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.text }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: `mt-2 text-[11px] ${message.role === "user" ? "text-blue-100" : "text-gray-400"}`, children: message.time })] }) }, message.id))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: chatEndRef })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-5 py-4 border-t border-gray-200 bg-white space-y-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-wrap gap-2", children: starterPrompts.map((prompt) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => submitPrompt(prompt), className: "text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors", children: prompt }, prompt))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: submitMessage, className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { value: input, onChange: (event) => setInput(event.target.value), placeholder: "Ask the assistant anything about your tasks, projects, or workflow...", className: "flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200", "aria-label": "Chat input" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", className: "size-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center", "aria-label": "Send message", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { className: "size-4" }) })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-blue-700", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-sm font-semibold", children: "Smart Suggestions" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mt-2", children: "Get recommended next actions based on deadlines and workload trends." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-violet-700", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-sm font-semibold", children: "Status Summaries" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mt-2", children: "Generate concise project updates you can send to leadership or team channels." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-emerald-700", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-sm font-semibold", children: "Action Plans" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mt-2", children: "Convert high-level goals into a practical checklist with due dates and owners." })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-gray-900", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "size-4 text-orange-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-sm font-semibold", children: "Best Results Tips" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", { className: "mt-3 text-sm text-gray-600 space-y-1 list-disc pl-5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Include project names and deadlines in your prompt for better prioritization." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Ask for outputs in a specific format, like checklist, summary, or message draft." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Use follow-up prompts to refine scope, tone, and action ownership." })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Footer__WEBPACK_IMPORTED_MODULE_14__["default"], {})] })] })] }));
}


/***/ },

/***/ "./ReactApp/pages/Dashboard.tsx"
/*!**************************************!*\
  !*** ./ReactApp/pages/Dashboard.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Dashboard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/square-check-big.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/calendar.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/file-text.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trending-up.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.js");
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_DashboardCard__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Components/DashboardCard */ "./ReactApp/Components/DashboardCard.tsx");
/* harmony import */ var _Components_TaskItem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Components/TaskItem */ "./ReactApp/Components/TaskItem.tsx");
/* harmony import */ var _Components_CalendarWidget__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../Components/CalendarWidget */ "./ReactApp/Components/CalendarWidget.tsx");
/* harmony import */ var _Components_TaskLineWidget__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../Components/TaskLineWidget */ "./ReactApp/Components/TaskLineWidget.tsx");
/* harmony import */ var _Components_Footer__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../Components/Footer */ "./ReactApp/Components/Footer.tsx");
/* harmony import */ var _Components_PageState__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../Components/PageState */ "./ReactApp/Components/PageState.tsx");
/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../context/AuthContext */ "./ReactApp/context/AuthContext.tsx");












// ── Seed data (will be replaced by API call) ─────────────────────────────
const SEED_DASHBOARD = {
    stats: {
        activeTasks: 24,
        inProgress: 8,
        projects: 12,
        teamMembers: 16,
        dueThisWeek: 3,
        activeProjects: 4,
        onlineNow: 12,
        tasksTrend: 12,
    },
    myWork: [
        { title: "Design new landing page", project: "Marketing Site", dueDate: "Today", priority: "high" },
        { title: "Review pull requests", project: "API Service", dueDate: "Tomorrow", priority: "medium" },
        { title: "Update documentation", project: "Developer Portal", dueDate: "Mar 12", priority: "low" },
        { title: "Fix bug in checkout flow", project: "E-commerce", dueDate: "Mar 15", priority: "high" },
    ],
    assignedToMe: [
        { title: "Implement authentication flow", project: "User Service", assignee: "Sarah Chen", dueDate: "Mar 11", priority: "high" },
        { title: "Create wireframes for dashboard", project: "Admin Panel", assignee: "Mike Johnson", dueDate: "Mar 13", priority: "medium" },
        { title: "Write unit tests", project: "API Service", assignee: "You", dueDate: "Mar 14", priority: "low" },
    ],
    recentActivity: [
        { id: "1", user: "Sarah Chen", action: 'completed "Design system update"', time: "2 hours ago", iconBg: "bg-green-100", iconColor: "text-green-600", icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"] },
        { id: "2", user: "Mike Johnson", action: 'created new project "Mobile App"', time: "5 hours ago", iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"] },
        { id: "3", user: "Alex Kim", action: "joined the team", time: "Yesterday", iconBg: "bg-purple-100", iconColor: "text-purple-600", icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"] },
    ],
};
function Dashboard() {
    const { user } = (0,_context_AuthContext__WEBPACK_IMPORTED_MODULE_16__.useAuth)();
    const [calYear, setCalYear] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(2022);
    const [calMonth, setCalMonth] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(5); // 0-indexed, 5 = Jun
    const [calDay, setCalDay] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10);
    // Data fetching state (ready for API integration)
    const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // TODO: Replace with actual API call: api.get<DashboardData>("/dashboard")
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        // Simulate async data fetch
        const timer = setTimeout(() => {
            if (!cancelled) {
                setData(SEED_DASHBOARD);
                setIsLoading(false);
            }
        }, 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, []);
    const currentTime = new Date().getHours();
    const greeting = currentTime < 12 ? "Good morning" : currentTime < 18 ? "Good afternoon" : "Good evening";
    const displayName = user ? user.firstName : "Demo User";
    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        // Re-trigger fetch
        setTimeout(() => {
            setData(SEED_DASHBOARD);
            setIsLoading(false);
        }, 0);
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_8__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_9__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", { className: "flex-1 overflow-y-auto", children: [isLoading && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_15__.PageLoading, { message: "Loading dashboard..." }), error && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_15__.PageError, { message: error, onRetry: handleRetry }), !isLoading && !error && data && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-6 p-6 items-start", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0 space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1", { className: "text-3xl font-bold text-gray-900", children: [greeting, ", ", displayName] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-1", children: "Here's what's happening with your projects today" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Active Tasks" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: data.stats.activeTasks })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-blue-100 p-3 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-6 text-blue-600" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 mt-4 text-sm text-green-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [data.stats.tasksTrend, "% from last week"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "In Progress" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: data.stats.inProgress })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-orange-100 p-3 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-6 text-orange-600" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center gap-1 mt-4 text-sm text-gray-600", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [data.stats.dueThisWeek, " due this week"] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Projects" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: data.stats.projects })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-purple-100 p-3 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "size-6 text-purple-600" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center gap-1 mt-4 text-sm text-gray-600", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [data.stats.activeProjects, " active projects"] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Team Members" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: data.stats.teamMembers })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-green-100 p-3 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "size-6 text-green-600" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center gap-1 mt-4 text-sm text-gray-600", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [data.stats.onlineNow, " online now"] }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_DashboardCard__WEBPACK_IMPORTED_MODULE_10__["default"], { title: "My Work", icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], action: { label: "View all", onClick: () => { } }, children: data.myWork.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 py-4 text-center", children: "No tasks assigned yet" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-1", children: data.myWork.map((task) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskItem__WEBPACK_IMPORTED_MODULE_11__["default"], { title: task.title, project: task.project, dueDate: task.dueDate, priority: task.priority }, task.title))) })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_DashboardCard__WEBPACK_IMPORTED_MODULE_10__["default"], { title: "Assigned to Me", icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], action: { label: "View all", onClick: () => { } }, children: data.assignedToMe.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 py-4 text-center", children: "Nothing assigned to you" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-1", children: data.assignedToMe.map((task) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskItem__WEBPACK_IMPORTED_MODULE_11__["default"], { title: task.title, project: task.project, assignee: task.assignee, dueDate: task.dueDate, priority: task.priority }, task.title))) })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_DashboardCard__WEBPACK_IMPORTED_MODULE_10__["default"], { title: "Agenda", icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], emptyState: {
                                                            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
                                                            message: "Your calendar events will appear here",
                                                            action: { label: "Add Event", onClick: () => { } },
                                                        } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_DashboardCard__WEBPACK_IMPORTED_MODULE_10__["default"], { title: "Recent Activity", icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], children: data.recentActivity.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 py-4 text-center", children: "No recent activity" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-4", children: data.recentActivity.map((activity) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `size-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(activity.icon, { className: `size-4 ${activity.iconColor}` }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-900", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium", children: activity.user }), " ", activity.action] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: activity.time })] })] }, activity.id))) })) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-4 flex-shrink-0 pt-16", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_CalendarWidget__WEBPACK_IMPORTED_MODULE_12__["default"], { year: calYear, month: calMonth, selectedDay: calDay, onYearChange: setCalYear, onMonthChange: setCalMonth, onDaySelect: setCalDay }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskLineWidget__WEBPACK_IMPORTED_MODULE_13__["default"], { year: calYear, month: calMonth, selectedDay: calDay })] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Footer__WEBPACK_IMPORTED_MODULE_14__["default"], {})] })] })] }));
}


/***/ },

/***/ "./ReactApp/pages/ForgotPassword.tsx"
/*!*******************************************!*\
  !*** ./ReactApp/pages/ForgotPassword.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForgotPassword)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Components/TaskFlowLogo */ "./ReactApp/Components/TaskFlowLogo.tsx");
/* harmony import */ var _Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Components/AuthFooter */ "./ReactApp/Components/AuthFooter.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





function ForgotPassword() {
    const navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
    const [email, setEmail] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = yield fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = yield res.json();
            if (!res.ok) {
                throw new Error(data.message || "Request failed. Please try again.");
            }
            navigate("/reset-password-sent", { state: { email, code: data.data } });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    });
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-h-screen bg-white flex flex-col", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pt-[54px] pl-[55px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__.TaskFlowLogo, {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 flex flex-col items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-[345px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "font-medium text-[20px] leading-[1.6] text-foreground tracking-[0.15px] mb-2", children: "Reset your password" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "font-normal text-sm leading-[1.43] text-foreground tracking-[0.15px] mb-12", children: "Type in your registered email address to receive a recovery code" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] w-full mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email Address *", "aria-label": "Email Address", className: "w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", required: true, disabled: loading }) })] }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-[13px] text-red-600 mb-4", children: error })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "submit", disabled: loading, className: "bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors mb-[80px] disabled:opacity-60 disabled:cursor-not-allowed", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: loading ? "Sending..." : "Next" }), !loading && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { "aria-hidden": "true", width: "18", height: "22", viewBox: "0 0 16 16", fill: "none", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z", fill: "white" }) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => navigate("/login"), disabled: loading, className: "w-[344px] bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: "BACK to login" }) })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pb-[20px] flex justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__.AuthFooter, {}) })] }));
}


/***/ },

/***/ "./ReactApp/pages/Login.tsx"
/*!**********************************!*\
  !*** ./ReactApp/pages/Login.tsx ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Login)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Components/TaskFlowLogo */ "./ReactApp/Components/TaskFlowLogo.tsx");
/* harmony import */ var _Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Components/AuthFooter */ "./ReactApp/Components/AuthFooter.tsx");
/* harmony import */ var _imports_LoginPromotion1__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../imports/LoginPromotion1 */ "./ReactApp/imports/LoginPromotion1.tsx");
/* harmony import */ var _imports_PromotionBg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../imports/PromotionBg */ "./ReactApp/imports/PromotionBg.tsx");
/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../context/AuthContext */ "./ReactApp/context/AuthContext.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








function validateLoginForm(email, password) {
    const errors = {};
    if (!email.trim()) {
        errors.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address";
    }
    if (!password) {
        errors.password = "Password is required";
    }
    else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }
    return errors;
}
// ── Component ────────────────────────────────────────────────────────────
function Login() {
    var _a, _b;
    const navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
    const location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
    const { login, isAuthenticated, error: authError, clearError } = (0,_context_AuthContext__WEBPACK_IMPORTED_MODULE_7__.useAuth)();
    const [email, setEmail] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [password, setPassword] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [fieldErrors, setFieldErrors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    const [isSubmitting, setIsSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Redirect if already authenticated
    if (isAuthenticated) {
        const from = ((_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.pathname) || "/";
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_2__.Navigate, { to: from, replace: true });
    }
    const handleLogin = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        clearError();
        // Client-side validation
        const errors = validateLoginForm(email, password);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0)
            return;
        setIsSubmitting(true);
        try {
            yield login({ email, password });
            const from = ((_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.pathname) || "/";
            navigate(from, { replace: true });
        }
        catch (_c) {
            // Error is already set in AuthContext
        }
        finally {
            setIsSubmitting(false);
        }
    });
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-h-screen bg-white flex", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col min-h-screen relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pt-[54px] pl-[55px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__.TaskFlowLogo, {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col justify-center px-8 mx-auto w-full max-w-[460px] mt-[-200px]", children: [authError && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-[24px] rounded-[4px] border border-red-300 bg-red-50 px-[12px] py-[10px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-[14px] text-red-700", children: authError }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleLogin, noValidate: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative rounded-[4px] w-[345px] ${fieldErrors.email ? "ring-1 ring-red-500" : ""}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: `absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${fieldErrors.email ? "border-red-500" : "border-[rgba(0,0,0,0.23)]"}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: email, onChange: (e) => {
                                                                setEmail(e.target.value);
                                                                if (fieldErrors.email)
                                                                    setFieldErrors((prev) => (Object.assign(Object.assign({}, prev), { email: undefined })));
                                                            }, placeholder: "Email Address *", "aria-label": "Email Address", className: "w-full py-[16px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", "aria-invalid": !!fieldErrors.email, "aria-describedby": fieldErrors.email ? "email-error" : undefined, disabled: isSubmitting }) })] }), fieldErrors.email && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { id: "email-error", className: "mt-1 text-xs text-red-600 pl-0.5", children: fieldErrors.email }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative rounded-[4px] w-[345px] ${fieldErrors.password ? "ring-1 ring-red-500" : ""}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: `absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${fieldErrors.password ? "border-red-500" : "border-[rgba(0,0,0,0.23)]"}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "password", value: password, onChange: (e) => {
                                                                setPassword(e.target.value);
                                                                if (fieldErrors.password)
                                                                    setFieldErrors((prev) => (Object.assign(Object.assign({}, prev), { password: undefined })));
                                                            }, placeholder: "Password *", "aria-label": "Password", className: "w-full py-[16px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", "aria-invalid": !!fieldErrors.password, "aria-describedby": fieldErrors.password ? "password-error" : undefined, disabled: isSubmitting }) })] }), fieldErrors.password && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { id: "password-error", className: "mt-1 text-xs text-red-600 pl-0.5", children: fieldErrors.password }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-[16px] mb-[32px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "submit", disabled: isSubmitting, className: "bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white/87", children: isSubmitting ? "Signing in..." : "Login" }), !isSubmitting && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { "aria-hidden": "true", width: "18", height: "22", viewBox: "0 0 16 16", fill: "none", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z", fill: "white" }) })), isSubmitting && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_2__.Link, { to: "/forgot-password", className: "font-medium text-sm leading-[1.57] text-foreground tracking-[0.1px] hover:underline", children: "Forgot your password?" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => navigate("/signup"), disabled: isSubmitting, className: "bg-black text-white rounded-[4px] px-[22px] py-[8px] w-[344px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white/87", children: "create new account" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute -top-[12px] right-[-8px] bg-[#b0407c] text-white font-medium text-xs leading-[20px] tracking-[0.14px] px-[6.5px] rounded-[64px] text-center", children: "Beta" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pb-[20px] pl-[55px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__.AuthFooter, {}) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hidden lg:block w-[58%] relative min-h-screen", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-0 overflow-hidden", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_imports_PromotionBg__WEBPACK_IMPORTED_MODULE_6__["default"], {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-0 flex items-center justify-center overflow-hidden", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "relative w-[468px] h-[469px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_imports_LoginPromotion1__WEBPACK_IMPORTED_MODULE_5__["default"], {}) }) })] })] }));
}


/***/ },

/***/ "./ReactApp/pages/Message.tsx"
/*!************************************!*\
  !*** ./ReactApp/pages/Message.tsx ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Message)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_PageState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Components/PageState */ "./ReactApp/Components/PageState.tsx");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-down.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/message-circle.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mic.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/send.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/smile.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/star.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/thumbs-up.js");






/* ── Static data ── */
const SEED_CONTACTS = [
    { id: 1, name: "Sarah Chen", initials: "SC", avatarClass: "bg-pink-200 text-pink-700", preview: "Can you review the latest mockups when you get a chance?", time: "Just now", unread: 1, starred: false },
    { id: 2, name: "Mike Johnson", initials: "MJ", avatarClass: "bg-blue-200 text-blue-700", preview: "The API docs are ready for review.", time: "10 min ago", unread: 1, starred: false },
    { id: 3, name: "Alex Kim", initials: "AK", avatarClass: "bg-green-200 text-green-700", preview: "Pushed the backend fix. Let me know if it resolves it.", time: "45 min ago", unread: 1, starred: false },
    { id: 4, name: "Emily Rodriguez", initials: "ER", avatarClass: "bg-purple-200 text-purple-700", preview: "Thanks for the feedback on the wireframes!", time: "2 hr ago", unread: 0, starred: false },
    { id: 5, name: "Dev Team", initials: "DT", avatarClass: "bg-orange-200 text-orange-700", preview: "Standup is moved to 10 AM tomorrow.", time: "Yesterday", unread: 0, starred: false },
];
const SEED_MSGS = {
    1: [
        { id: 1, side: "received", type: "text", text: "Can you review the latest mockups when you get a chance?", time: "Just now" },
        { id: 2, side: "sent", type: "text", text: "Sure! Sending you my feedback shortly.", time: "Just now" },
    ],
    2: [
        { id: 1, side: "received", type: "text", text: "The API docs are ready for review.", time: "10 min ago" },
        { id: 2, side: "received", type: "voice", duration: "00:42", time: "10 min ago" },
        { id: 3, side: "sent", type: "text", text: "Great, I'll take a look now.", time: "8 min ago" },
        { id: 4, side: "sent", type: "text", text: "Looks good so far! A few minor comments coming.", time: "5 min ago" },
    ],
    3: [
        { id: 1, side: "received", type: "text", text: "Pushed the backend fix. Let me know if it resolves it.", time: "45 min ago" },
        { id: 2, side: "sent", type: "text", text: "Testing now...", time: "40 min ago" },
        { id: 3, side: "sent", type: "text", text: "Confirmed! The issue is fixed. Thanks!", time: "38 min ago" },
    ],
    4: [
        { id: 1, side: "sent", type: "text", text: "Your wireframes look great overall. A few small tweaks on the nav section.", time: "2 hr ago" },
        { id: 2, side: "received", type: "text", text: "Thanks for the feedback on the wireframes!", time: "2 hr ago" },
    ],
    5: [
        { id: 1, side: "received", type: "text", text: "Standup is moved to 10 AM tomorrow.", time: "Yesterday" },
        { id: 2, side: "sent", type: "text", text: "Got it, thanks for the heads up!", time: "Yesterday" },
    ],
};
/* ── Waveform (SVG bars from Figma heights) ── */
const WAVE_HEIGHTS = [4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 9, 9, 9, 9, 12, 9, 9, 9, 9, 9, 18, 16, 16, 16, 16, 12, 12, 9, 9, 9, 9, 9, 12, 16, 9, 9, 9, 12, 12, 18, 16, 16, 16, 16, 12, 12, 9, 9, 9, 9, 4, 4, 9, 4, 12, 12, 4, 4, 12, 12, 12, 12, 4, 4, 18, 9, 9, 9, 4, 4, 4, 9, 9, 9, 9, 9, 9, 4, 4, 9, 9, 16, 9, 9, 9, 4, 4, 12, 4, 12, 9, 9, 9, 18, 16, 12, 12, 4, 9, 9, 9, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4];
function Waveform() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: WAVE_HEIGHTS.length * 2.5, height: 22, viewBox: `0 0 ${WAVE_HEIGHTS.length * 2.5} 22`, className: "block text-blue-600", "aria-hidden": "true", children: WAVE_HEIGHTS.map((h, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", { x: i * 2.5, y: (22 - h) / 2, width: 1.5, height: h, rx: 1, fill: "currentColor" }, i))) }));
}
/* ═══════════════════════════════ */
function Message() {
    var _a, _b;
    /* ── Loading / error simulation ── */
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [contacts, setContacts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [allMsgs, setAllMsgs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    const [activeId, setActiveId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [showContacts, setShowContacts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const bottomRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const timer = setTimeout(() => {
            try {
                setContacts(SEED_CONTACTS);
                setAllMsgs(SEED_MSGS);
                setActiveId(2);
                setLoading(false);
            }
            catch (_a) {
                setError("Failed to load messages. Please try again.");
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);
    const activeMsgs = activeId !== null ? ((_a = allMsgs[activeId]) !== null && _a !== void 0 ? _a : []) : [];
    const activeContact = (_b = contacts.find(c => c.id === activeId)) !== null && _b !== void 0 ? _b : null;
    const filteredContacts = search
        ? contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        : contacts;
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        var _a;
        (_a = bottomRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [activeId, activeMsgs.length]);
    const selectContact = (id) => {
        setActiveId(id);
        setContacts(prev => prev.map(c => c.id === id ? Object.assign(Object.assign({}, c), { unread: 0 }) : c));
        setShowContacts(false); // close mobile panel
    };
    const sendMessage = () => {
        const text = input.trim();
        if (!text || activeId === null)
            return;
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setAllMsgs(prev => {
            var _a;
            return (Object.assign(Object.assign({}, prev), { [activeId]: [...((_a = prev[activeId]) !== null && _a !== void 0 ? _a : []), { id: Date.now(), side: "sent", type: "text", text, time }] }));
        });
        setContacts(prev => prev.map(c => c.id === activeId ? Object.assign(Object.assign({}, c), { preview: text, time }) : c));
        setInput("");
    };
    const toggleStar = (id, e) => {
        e.stopPropagation();
        setContacts(prev => prev.map(c => c.id === id ? Object.assign(Object.assign({}, c), { starred: !c.starred }) : c));
    };
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    /* ── Page states ── */
    if (loading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_2__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col flex-1 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_3__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_4__.PageLoading, { message: "Loading messages..." })] })] }));
    }
    if (error) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_2__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col flex-1 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_3__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_4__.PageError, { message: error, onRetry: () => window.location.reload() })] })] }));
    }
    if (contacts.length === 0) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_2__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col flex-1 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_3__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_4__.PageEmpty, { title: "No conversations yet", description: "Start a new conversation to get going.", icon: lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"] })] })] }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_2__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col flex-1 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_3__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-shrink-0 bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-xl font-bold text-gray-900", children: "Messages" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-px h-4 bg-gray-300 hidden sm:block" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500 hidden sm:block", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-blue-600 font-semibold", children: contacts.length }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-1", children: "Conversations" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setShowContacts(!showContacts), className: "lg:hidden flex items-center gap-2 px-3 py-1.5 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors", "aria-label": "Toggle contacts", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "size-4" }), "Contacts"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { "aria-label": "New message", className: "flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "hidden sm:inline", children: "Messages" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-1 overflow-hidden relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `
            absolute inset-y-0 left-0 z-20 w-[300px] sm:w-[360px] bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-transform duration-200
            lg:relative lg:translate-x-0 lg:z-auto
            ${showContacts ? "translate-x-0" : "-translate-x-full"}
          `, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-gray-200", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-semibold text-gray-900", children: "All Messages" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-1.5 rounded-lg hover:bg-gray-100 transition-colors", "aria-label": "Filter messages", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "size-4 text-gray-500" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-1.5 rounded-lg hover:bg-gray-100 transition-colors", "aria-label": "More options", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "size-4 text-gray-500" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-4 py-3 border-b border-gray-100", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { className: "size-4 text-gray-400 flex-shrink-0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Search or start a new chat", className: "flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-400", "aria-label": "Search contacts" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 overflow-y-auto", children: filteredContacts.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-4 py-8 text-center text-sm text-gray-400", children: "No contacts match your search." })) : (filteredContacts.map(c => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => selectContact(c.id), className: `w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors ${c.id === activeId ? "bg-blue-50 border-l-2 border-l-blue-600" : "hover:bg-gray-50"}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `size-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.avatarClass}`, children: c.initials }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between mb-0.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `text-sm font-medium ${c.id === activeId ? "text-blue-700" : "text-gray-900"}`, children: c.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 flex-shrink-0", children: [c.unread > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "size-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center", children: c.unread })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: e => toggleStar(c.id, e), className: "p-1 rounded-lg hover:bg-gray-200 transition-colors", "aria-label": c.starred ? "Unstar conversation" : "Star conversation", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { className: `size-3.5 ${c.starred ? "fill-blue-600 text-blue-600" : "text-gray-400"}` }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 truncate mb-1", children: c.preview }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "size-3 text-gray-400" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs text-gray-400", children: c.time })] })] })] }, c.id)))) })] }), showContacts && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-0 z-10 bg-black/20 lg:hidden", onClick: () => setShowContacts(false), "aria-hidden": "true" })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 flex flex-col overflow-hidden", children: activeContact === null ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 flex items-center justify-center bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "size-12 text-gray-300 mx-auto mb-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-500 text-sm", children: "Select a conversation to start chatting." })] }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `size-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeContact.avatarClass}`, children: activeContact.initials }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-semibold text-gray-900", children: activeContact.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-green-500", children: "Online" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors", "aria-label": "Star conversation", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { className: "size-4 text-blue-600 fill-blue-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors", "aria-label": "Search in conversation", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { className: "size-4" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors", "aria-label": "More options", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "size-4" }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 overflow-y-auto px-6 py-6 bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 h-px bg-gray-200" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs text-gray-400 font-medium px-2", children: ["Today \u00B7 ", timeStr] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 h-px bg-gray-200" })] }), activeMsgs.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "size-10 text-gray-300 mx-auto mb-2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-400", children: "No messages yet. Say hello!" })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-col gap-4", children: activeMsgs.map(msg => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `flex ${msg.side === "sent" ? "justify-end" : "justify-start"}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `flex flex-col ${msg.side === "sent" ? "items-end" : "items-start"}`, children: [msg.type === "text" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `px-5 py-3 text-sm leading-relaxed whitespace-pre-line max-w-xs shadow-sm rounded-[20px] ${msg.side === "sent"
                                                                        ? "bg-blue-600 text-white rounded-br-[4px]"
                                                                        : "bg-white text-gray-800 rounded-bl-[4px]"}`, children: msg.text })) : (
                                                                /* Voice note */
                                                                (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 px-5 py-3 shadow-sm bg-white rounded-[20px] rounded-bl-none", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "size-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors", "aria-label": "Play voice message", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { className: "size-4 text-white" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Waveform, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm text-blue-600 font-medium", children: msg.duration })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "mt-1 text-xs text-gray-400 px-1", children: msg.time })] }) }, msg.id))) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: bottomRef })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-2 sm:gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0", "aria-label": "Add emoji", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { className: "size-5 text-blue-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { value: input, onChange: e => setInput(e.target.value), onKeyDown: e => e.key === "Enter" && sendMessage(), placeholder: "Type your message here ...", className: "flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400", "aria-label": "Type a message" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: sendMessage, className: "size-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors", "aria-label": "Send message", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { className: "size-3.5 text-white" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0 hidden sm:flex", "aria-label": "Record voice message", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { className: "size-5 text-blue-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0 hidden sm:flex", "aria-label": "Send thumbs up", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { className: "size-5 text-blue-600" }) })] })] })) })] })] })] }));
}


/***/ },

/***/ "./ReactApp/pages/MyWork.tsx"
/*!***********************************!*\
  !*** ./ReactApp/pages/MyWork.tsx ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MyWork)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clipboard-list.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js");
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Footer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Components/Footer */ "./ReactApp/Components/Footer.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_NewTaskCard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Components/NewTaskCard */ "./ReactApp/Components/NewTaskCard.tsx");
/* harmony import */ var _Components_PageState__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Components/PageState */ "./ReactApp/Components/PageState.tsx");
/* harmony import */ var _Components_MyWork_DefaultView__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Components/MyWork/DefaultView */ "./ReactApp/Components/MyWork/DefaultView.tsx");
/* harmony import */ var _Components_MyWork_KanbanView__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Components/MyWork/KanbanView */ "./ReactApp/Components/MyWork/KanbanView.tsx");
/* harmony import */ var _Components_MyWork_TableView__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../Components/MyWork/TableView */ "./ReactApp/Components/MyWork/TableView.tsx");
/* harmony import */ var _Components_MyWork_GanttView__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../Components/MyWork/GanttView */ "./ReactApp/Components/MyWork/GanttView.tsx");
/* harmony import */ var _Components_MyWork_CalendarView__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../Components/MyWork/CalendarView */ "./ReactApp/Components/MyWork/CalendarView.tsx");

// ── MyWork page: orchestrator ────────────────────────────────────────────
//
// Main "My Tasks" page. Manages state, tabs, filters, and delegates
// rendering to extracted view components:
//   - DefaultView  — grouped task list
//   - KanbanView   — status-column board
//   - TableView    — spreadsheet with sub-tasks
//   - GanttView    — timeline chart
//   - CalendarView — weekly time-grid
//
// Reduced from ~1823 lines to ~350 by extracting views into
// ReactApp/Components/MyWork/*.tsx












// ── Seed data (will be replaced by API call) ─────────────────────────────
const SEED_TASKS = [
    {
        id: "t-001",
        title: "Finalize onboarding empty states",
        project: "Marketing Site",
        assignee: "You",
        dueDateLabel: "Overdue \u00B7 Mar 10",
        dueOrder: 0,
        dueDay: 10,
        priority: "high",
        status: "inProgress",
        starred: true,
    },
    {
        id: "t-002",
        title: "Fix webhook retry edge-case",
        project: "API Service",
        assignee: "You",
        dueDateLabel: "Overdue \u00B7 Mar 11",
        dueOrder: 0,
        dueDay: 11,
        priority: "high",
        status: "review",
    },
    {
        id: "t-003",
        title: "Prepare sprint retro notes",
        project: "Team Ops",
        assignee: "You",
        dueDateLabel: "Today",
        dueOrder: 1,
        dueDay: 14,
        priority: "medium",
        status: "todo",
    },
    {
        id: "t-004",
        title: "Review auth PR #184",
        project: "User Service",
        assignee: "You",
        dueDateLabel: "Today",
        dueOrder: 1,
        dueDay: 14,
        priority: "high",
        status: "review",
        starred: true,
    },
    {
        id: "t-005",
        title: "Define task timeline animation",
        project: "Mobile App",
        assignee: "You",
        dueDateLabel: "Mar 16",
        dueOrder: 2,
        dueDay: 16,
        priority: "low",
        status: "inProgress",
    },
    {
        id: "t-006",
        title: "Clean up stale feature flags",
        project: "Admin Panel",
        assignee: "You",
        dueDateLabel: "Mar 17",
        dueOrder: 2,
        dueDay: 17,
        priority: "medium",
        status: "todo",
    },
    {
        id: "t-007",
        title: "Write release changelog",
        project: "Developer Portal",
        assignee: "You",
        dueDateLabel: "Mar 19",
        dueOrder: 3,
        dueDay: 19,
        priority: "low",
        status: "todo",
    },
    {
        id: "t-008",
        title: "QA pass for notifications drawer",
        project: "TaskFlow Web",
        assignee: "You",
        dueDateLabel: "Mar 20",
        dueOrder: 3,
        dueDay: 20,
        priority: "medium",
        status: "inProgress",
    },
    {
        id: "t-009",
        title: "Refactor dashboard card styles",
        project: "Design System",
        assignee: "You",
        dueDateLabel: "Completed \u00B7 Mar 13",
        dueOrder: 4,
        dueDay: 13,
        priority: "medium",
        status: "completed",
    },
    {
        id: "t-010",
        title: "Patch timezone parsing bug",
        project: "Calendar",
        assignee: "You",
        dueDateLabel: "Completed \u00B7 Mar 12",
        dueOrder: 4,
        dueDay: 12,
        priority: "high",
        status: "completed",
    },
];
// ── Component ────────────────────────────────────────────────────────────
function MyWork() {
    const [tasks, setTasks] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("assigned");
    const [viewMode, setViewMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("default");
    const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [priorityFilter, setPriorityFilter] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("all");
    const [showNewTaskCard, setShowNewTaskCard] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Simulate data fetch
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            if (!cancelled) {
                setTasks(SEED_TASKS);
                setIsLoading(false);
            }
        }, 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, []);
    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        setTimeout(() => {
            setTasks(SEED_TASKS);
            setIsLoading(false);
        }, 0);
    };
    // Lock body scroll when new-task modal is open
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!showNewTaskCard) {
            document.body.style.overflow = "";
            return;
        }
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showNewTaskCard]);
    // ── Derived data ────────────────────────────────────────────────────────
    const tabFilteredTasks = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
        switch (activeTab) {
            case "today":
                return tasks.filter((t) => t.dueOrder <= 1 && t.status !== "completed");
            case "upcoming":
                return tasks.filter((t) => t.dueOrder >= 2 && t.status !== "completed");
            case "completed":
                return tasks.filter((t) => t.status === "completed");
            default:
                return tasks;
        }
    }, [activeTab, tasks]);
    const visibleTasks = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
        return tabFilteredTasks.filter((t) => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.project.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });
    }, [tabFilteredTasks, searchQuery, priorityFilter]);
    const grouped = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
        const base = {
            overdue: [],
            today: [],
            thisWeek: [],
            later: [],
            completed: [],
        };
        visibleTasks.forEach((t) => {
            if (t.status === "completed") {
                base.completed.push(t);
                return;
            }
            if (t.dueOrder === 0)
                base.overdue.push(t);
            else if (t.dueOrder === 1)
                base.today.push(t);
            else if (t.dueOrder === 2)
                base.thisWeek.push(t);
            else
                base.later.push(t);
        });
        return base;
    }, [visibleTasks]);
    const allOpen = visibleTasks.filter((t) => t.status !== "completed").length;
    const highPriority = visibleTasks.filter((t) => t.priority === "high" && t.status !== "completed").length;
    const inReview = visibleTasks.filter((t) => t.status === "review").length;
    const tabs = [
        { key: "assigned", label: "Assigned to me", count: tasks.length },
        { key: "today", label: "Today", count: tasks.filter((t) => t.dueOrder <= 1 && t.status !== "completed").length },
        { key: "upcoming", label: "Upcoming", count: tasks.filter((t) => t.dueOrder >= 2 && t.status !== "completed").length },
        { key: "completed", label: "Completed", count: tasks.filter((t) => t.status === "completed").length },
    ];
    const views = [
        { key: "default", label: "Default" },
        { key: "kanban", label: "Kanban" },
        { key: "table", label: "Table" },
        { key: "gantt", label: "Gantt" },
        { key: "calendar", label: "Calendar" },
    ];
    // ── View dispatcher ─────────────────────────────────────────────────────
    const renderView = () => {
        switch (viewMode) {
            case "kanban":
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_MyWork_KanbanView__WEBPACK_IMPORTED_MODULE_11__["default"], { visibleTasks: visibleTasks });
            case "table":
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_MyWork_TableView__WEBPACK_IMPORTED_MODULE_12__["default"], { visibleTasks: visibleTasks });
            case "gantt":
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_MyWork_GanttView__WEBPACK_IMPORTED_MODULE_13__["default"], {});
            case "calendar":
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_MyWork_CalendarView__WEBPACK_IMPORTED_MODULE_14__["default"], { visibleTasks: visibleTasks });
            default:
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_MyWork_DefaultView__WEBPACK_IMPORTED_MODULE_10__["default"], { visibleTasks: visibleTasks, grouped: grouped, activeTab: activeTab });
        }
    };
    // ── Render ──────────────────────────────────────────────────────────────
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_5__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_7__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", { className: "flex-1 overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-7xl mx-auto p-6 space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "My Tasks" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-1", children: "Prioritize and track everything currently on your plate" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors", children: "Export" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setShowNewTaskCard(true), className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors", children: "New Task" })] })] }), isLoading && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_9__.PageLoading, { message: "Loading your tasks..." }), error && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_9__.PageError, { message: error, onRetry: handleRetry }), !isLoading && !error && tasks.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_9__.PageEmpty, { icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], title: "No tasks assigned", description: "You have no tasks right now. Create a new task or ask your team lead to assign work.", action: { label: "New Task", onClick: () => setShowNewTaskCard(true) } })), !isLoading && !error && tasks.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs uppercase tracking-wide text-gray-500", children: "Open Tasks" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: allOpen })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs uppercase tracking-wide text-gray-500", children: "High Priority" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-red-600 mt-2", children: highPriority })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs uppercase tracking-wide text-gray-500", children: "In Review" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-amber-600 mt-2", children: inReview })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-b border-gray-200", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("nav", { className: "flex flex-wrap gap-5", children: tabs.map((tab) => {
                                                        const active = activeTab === tab.key;
                                                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setActiveTab(tab.key), className: `pb-3 border-b-2 font-medium text-sm transition-colors ${active
                                                                ? "border-blue-600 text-blue-600"
                                                                : "border-transparent text-gray-600 hover:text-gray-900"}`, children: [tab.label, (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700", children: tab.count })] }, tab.key));
                                                    }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white border border-gray-200 rounded-xl p-3", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-wrap gap-2", children: views.map((view) => {
                                                        const active = viewMode === view.key;
                                                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setViewMode(view.key), className: `px-3 py-1.5 rounded-lg text-sm border transition-colors ${active
                                                                ? "bg-slate-900 text-white border-slate-900"
                                                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`, children: view.label }, view.key));
                                                    }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative w-full md:max-w-md", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search tasks or projects", className: "w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [["all", "high", "medium", "low"].map((p) => {
                                                                const active = priorityFilter === p;
                                                                const colorMap = {
                                                                    all: active ? "bg-blue-600 text-white border-blue-600" : "",
                                                                    high: active ? "bg-red-600 text-white border-red-600" : "",
                                                                    medium: active ? "bg-amber-600 text-white border-amber-600" : "",
                                                                    low: active ? "bg-sky-600 text-white border-sky-600" : "",
                                                                };
                                                                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setPriorityFilter(p), className: `px-3 py-1.5 rounded-lg text-sm border transition-colors ${active
                                                                        ? colorMap[p]
                                                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`, children: p.charAt(0).toUpperCase() + p.slice(1) }, p));
                                                            }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50", "aria-label": "More filters", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-4" }) })] })] }), renderView()] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Footer__WEBPACK_IMPORTED_MODULE_6__["default"], {})] })] }), showNewTaskCard && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { role: "dialog", "aria-modal": "true", "aria-label": "Create new task", className: "fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/30 backdrop-blur-sm px-4", onClick: () => setShowNewTaskCard(false), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-full max-w-3xl", onClick: (e) => e.stopPropagation(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_NewTaskCard__WEBPACK_IMPORTED_MODULE_8__["default"], { onCancel: () => setShowNewTaskCard(false), onCreate: (_data) => {
                            // TODO: Send _data to API when backend endpoint is ready
                            setShowNewTaskCard(false);
                        } }) }) }))] }));
}


/***/ },

/***/ "./ReactApp/pages/NotFound.tsx"
/*!*************************************!*\
  !*** ./ReactApp/pages/NotFound.tsx ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NotFound)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/house.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-left.js");



function NotFound() {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex h-screen flex-col items-center justify-center bg-gray-50 px-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center max-w-md", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-8xl font-bold text-gray-200 select-none", children: "404" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "mt-4 text-2xl font-semibold text-gray-900", children: "Page not found" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "mt-2 text-gray-600", children: "The page you're looking for doesn't exist or has been moved." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_router__WEBPACK_IMPORTED_MODULE_1__.Link, { to: "/", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-4" }), "Go to Dashboard"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => window.history.back(), className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-4" }), "Go Back"] })] })] }) }));
}


/***/ },

/***/ "./ReactApp/pages/Notifications.tsx"
/*!******************************************!*\
  !*** ./ReactApp/pages/Notifications.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Notifications)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bell.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-down.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/lightbulb.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.js");
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_Footer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Components/Footer */ "./ReactApp/Components/Footer.tsx");
/* harmony import */ var _data_notifications__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../data/notifications */ "./ReactApp/data/notifications.ts");
/* harmony import */ var _Components_PageState__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Components/PageState */ "./ReactApp/Components/PageState.tsx");








function Notifications() {
    const [notifs, setNotifs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [tab, setTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("all");
    const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [selected, setSelected] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(new Set());
    const groupBy = "Date";
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // TODO: Replace with actual API call: api.get<NotificationItem[]>("/notifications")
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            if (!cancelled) {
                setNotifs(_data_notifications__WEBPACK_IMPORTED_MODULE_9__.SEED_NOTIFICATIONS);
                setIsLoading(false);
            }
        }, 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, []);
    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        setTimeout(() => {
            setNotifs(_data_notifications__WEBPACK_IMPORTED_MODULE_9__.SEED_NOTIFICATIONS);
            setIsLoading(false);
        }, 0);
    };
    const visible = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
        let list = tab === "unread" ? notifs.filter((n) => n.unread) : notifs;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((n) => n.title.toLowerCase().includes(q) ||
                n.body.toLowerCase().includes(q));
        }
        return list;
    }, [notifs, tab, search]);
    const allSelected = visible.length > 0 && visible.every((n) => selected.has(n.id));
    function toggleSelectAll() {
        if (allSelected) {
            setSelected((prev) => {
                const next = new Set(prev);
                visible.forEach((n) => next.delete(n.id));
                return next;
            });
        }
        else {
            setSelected((prev) => {
                const next = new Set(prev);
                visible.forEach((n) => next.add(n.id));
                return next;
            });
        }
    }
    function toggleSelect(id) {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }
    function markRead(id) {
        setNotifs((prev) => prev.map((n) => (n.id === id ? Object.assign(Object.assign({}, n), { unread: false }) : n)));
    }
    function markUnread(id) {
        setNotifs((prev) => prev.map((n) => (n.id === id ? Object.assign(Object.assign({}, n), { unread: true }) : n)));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_6__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_7__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", { className: "flex-1 overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-6xl mx-auto p-6 space-y-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-xl font-bold text-gray-900", children: "Notifications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-sm text-gray-500", children: [notifs.filter((n) => n.unread).length, " unread"] })] }), isLoading && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_10__.PageLoading, { message: "Loading notifications..." }), error && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_10__.PageError, { message: error, onRetry: handleRetry }), !isLoading && !error && notifs.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_10__.PageEmpty, { icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], title: "No notifications", description: "You're all caught up! New notifications will appear here." })), !isLoading && !error && notifs.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex rounded-md overflow-hidden border border-[rgba(27,31,36,0.15)] shrink-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setTab("all"), className: `px-4 py-1.5 text-sm font-medium leading-5 transition-colors ${tab === "all"
                                                                    ? "bg-[#EEEFF2] text-[#24292F]"
                                                                    : "bg-[#F6F8FA] text-[#24292F] hover:bg-[#EEEFF2]"}`, children: "All" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setTab("unread"), className: `px-4 py-1.5 text-sm font-medium leading-5 border-l border-[rgba(27,31,36,0.15)] transition-colors ${tab === "unread"
                                                                    ? "bg-[#EEEFF2] text-[#24292F]"
                                                                    : "bg-[#F6F8FA] text-[#24292F] hover:bg-[#EEEFF2]"}`, children: "Unread" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-[#57606A]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", placeholder: "Filter notifications", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-8 pr-3 py-1.5 text-sm text-[#24292F] placeholder-[#6E7781] bg-[#F6F8FA] border border-[#D0D7DE] rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-[#F6F8FA] border border-[rgba(27,31,36,0.15)] rounded-md text-[rgba(36,41,47,0.75)] hover:bg-[#EEEFF2] shrink-0 transition-colors", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Group by:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-[#24292F]", children: groupBy }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 12, className: "text-[#4E5258]" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-md border border-[#D0D7DE] overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 px-4 py-3 bg-[#F6F8FA] border-b border-[#D0D7DE]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: allSelected, onChange: toggleSelectAll, "aria-label": "Select all notifications", className: "w-3.5 h-3.5 rounded accent-[#0969DA] cursor-pointer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs font-semibold text-[#24292F]", children: "Select all" }), selected.size > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "ml-auto text-xs text-[#57606A]", children: [selected.size, " selected"] }))] }), visible.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-6 py-12 text-center text-sm text-[#57606A]", children: "No notifications match your filter." })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", { children: visible.map((n, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", { className: `flex items-center gap-3 px-4 py-3 group transition-colors ${n.unread ? "bg-white" : "bg-[#F6F8FA]"} ${i < visible.length - 1 ? "border-b border-[#D8DEE4]" : ""}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 shrink-0 w-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `w-2 h-2 rounded-full shrink-0 transition-opacity ${n.unread ? "bg-[#0969DA]" : "opacity-0"}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: selected.has(n.id), onChange: () => toggleSelect(n.id), "aria-label": `Select notification: ${n.title}`, className: "w-3.5 h-3.5 rounded accent-[#0969DA] cursor-pointer" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `size-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.iconBg}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(n.icon, { className: `size-4 ${n.iconColor}` }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: `text-xs font-semibold leading-[18px] ${n.unread ? "text-[#24292F]" : "text-[#57606A]"}`, children: n.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: `text-sm leading-[21px] truncate ${n.unread ? "text-[#24292F]" : "text-[#57606A]"}`, children: n.body })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 shrink-0 text-xs text-[#24292F]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-right min-w-[70px] text-[#57606A]", children: n.time }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => (n.unread ? markRead(n.id) : markUnread(n.id)), title: n.unread ? "Mark as read" : "Mark as unread", "aria-label": n.unread ? "Mark as read" : "Mark as unread", className: "opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full border border-[rgba(27,31,36,0.15)] bg-[#F6F8FA] hover:bg-[#EEEFF2] flex items-center justify-center transition-opacity", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `w-2 h-2 rounded-full ${n.unread ? "bg-[#0969DA]" : "bg-transparent border border-[#57606A]"}` }) })] })] }, n.id))) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1.5 text-xs text-[#57606A]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 14, className: "text-[#57606A] shrink-0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-semibold", children: "ProTip!" }), " When viewing a notification, press", " "] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("kbd", { className: "px-1.5 py-0.5 text-[11px] font-mono bg-[#F6F8FA] border border-[rgba(175,184,193,0.2)] rounded text-[#24292F]", children: "shift u" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: " to mark it as Unread." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs text-[#24292F]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "font-semibold", children: ["1\u2013", visible.length] }), " of ", visible.length] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex rounded-md overflow-hidden border border-[rgba(27,31,36,0.15)]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { disabled: true, className: "px-3 py-1.5 text-sm font-medium bg-[#F6F8FA] text-[rgba(9,105,218,0.5)] hover:bg-[#EEEFF2] transition-colors", children: "Prev" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { disabled: true, className: "px-3 py-1.5 text-sm font-medium bg-[#F6F8FA] text-[rgba(9,105,218,0.5)] border-l border-[rgba(27,31,36,0.15)] hover:bg-[#EEEFF2] transition-colors", children: "Next" })] })] })] })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Footer__WEBPACK_IMPORTED_MODULE_8__["default"], {})] })] })] }));
}


/***/ },

/***/ "./ReactApp/pages/Projects.tsx"
/*!*************************************!*\
  !*** ./ReactApp/pages/Projects.tsx ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Projects)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/grid-3x3.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/folder-kanban.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/list.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/star.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.js");
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Footer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Components/Footer */ "./ReactApp/Components/Footer.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_PageState__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Components/PageState */ "./ReactApp/Components/PageState.tsx");







// ── Seed data (will be replaced by API call) ─────────────────────────────
const SEED_PROJECTS = [
    {
        id: "1",
        name: "Marketing Site",
        description: "Company website redesign and development",
        color: "bg-blue-500",
        tasks: { total: 24, completed: 18 },
        members: 5,
        starred: true,
    },
    {
        id: "2",
        name: "API Service",
        description: "Backend API development and documentation",
        color: "bg-green-500",
        tasks: { total: 36, completed: 22 },
        members: 8,
        starred: false,
    },
    {
        id: "3",
        name: "Mobile App",
        description: "iOS and Android mobile application",
        color: "bg-purple-500",
        tasks: { total: 48, completed: 12 },
        members: 6,
        starred: true,
    },
    {
        id: "4",
        name: "Admin Panel",
        description: "Internal admin dashboard for operations",
        color: "bg-orange-500",
        tasks: { total: 28, completed: 20 },
        members: 4,
        starred: false,
    },
    {
        id: "5",
        name: "E-commerce",
        description: "Online store platform development",
        color: "bg-pink-500",
        tasks: { total: 42, completed: 30 },
        members: 7,
        starred: true,
    },
    {
        id: "6",
        name: "Developer Portal",
        description: "Documentation and API reference portal",
        color: "bg-blue-400",
        tasks: { total: 16, completed: 14 },
        members: 3,
        starred: false,
    },
];
function Projects() {
    const [projects, setProjects] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // TODO: Replace with actual API call: api.get<Project[]>("/projects")
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            if (!cancelled) {
                setProjects(SEED_PROJECTS);
                setIsLoading(false);
            }
        }, 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, []);
    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        setTimeout(() => {
            setProjects(SEED_PROJECTS);
            setIsLoading(false);
        }, 0);
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_8__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_10__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", { className: "flex-1 overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-7xl mx-auto p-6 space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Projects" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-1", children: "Manage and track all your projects" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": "Grid view", className: "p-2 text-gray-600 hover:bg-white border border-gray-200 rounded-lg transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-5" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": "List view", className: "p-2 text-gray-600 hover:bg-white border border-gray-200 rounded-lg transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "size-5" }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 flex-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: "All Projects" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: "Starred" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: "Active" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: "Archived" })] }), isLoading && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_11__.PageLoading, { message: "Loading projects..." }), error && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_11__.PageError, { message: error, onRetry: handleRetry }), !isLoading && !error && projects.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_11__.PageEmpty, { icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], title: "No projects yet", description: "Create your first project to start organizing your work.", action: { label: "Create Project", onClick: () => { } } })), !isLoading && !error && projects.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: projects.map((project) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${project.color} size-12 rounded-lg flex items-center justify-center`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-6 text-white" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": project.starred ? "Unstar project" : "Star project", className: "p-1 text-gray-400 hover:text-yellow-500 transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: `size-5 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}` }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": "Project options", className: "p-1 text-gray-400 hover:text-gray-600 transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-5" }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "font-semibold text-gray-900 text-lg mb-1", children: project.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: project.description }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between text-sm mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-600", children: "Progress" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "font-medium text-gray-900", children: [project.tasks.completed, "/", project.tasks.total] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${project.color} h-2 rounded-full transition-all`, style: { width: `${(project.tasks.completed / project.tasks.total) * 100}%` } }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between pt-4 border-t border-gray-100", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 text-sm text-gray-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "size-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [project.members, " members"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs text-gray-500", children: [Math.round((project.tasks.completed / project.tasks.total) * 100), "% complete"] })] })] }) }, project.id))) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Footer__WEBPACK_IMPORTED_MODULE_9__["default"], {})] })] })] }));
}


/***/ },

/***/ "./ReactApp/pages/ResetPassword.tsx"
/*!******************************************!*\
  !*** ./ReactApp/pages/ResetPassword.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResetPassword)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Components/TaskFlowLogo */ "./ReactApp/Components/TaskFlowLogo.tsx");
/* harmony import */ var _Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Components/AuthFooter */ "./ReactApp/Components/AuthFooter.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





function ResetPassword() {
    var _a;
    const navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
    const location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
    const { email, token } = ((_a = location.state) !== null && _a !== void 0 ? _a : {});
    const [newPassword, setNewPassword] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [retryPassword, setRetryPassword] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    // Redirect if arrived here without going through the enter-code step
    if (!email || !token) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_2__.Navigate, { to: "/forgot-password", replace: true });
    }
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (newPassword !== retryPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = yield fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword,
                    confirmPassword: retryPassword,
                }),
            });
            const data = yield res.json();
            if (!res.ok) {
                throw new Error(data.message || "Reset failed. Please try again.");
            }
            navigate("/login");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    });
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-h-screen bg-white flex flex-col", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pt-[54px] pl-[55px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__.TaskFlowLogo, {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 flex flex-col items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-[345px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "font-medium text-[20px] leading-[1.6] text-foreground tracking-[0.15px] mb-2", children: "Reset your password" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "font-normal text-sm leading-[1.43] text-foreground tracking-[0.15px] mb-10", children: "Type in your new password" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] w-full mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "password", value: newPassword, onChange: (e) => { setNewPassword(e.target.value); setError(""); }, placeholder: "New password *", "aria-label": "New password", className: "w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", required: true, disabled: loading }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] w-full mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "password", value: retryPassword, onChange: (e) => { setRetryPassword(e.target.value); setError(""); }, placeholder: "Retry new password *", "aria-label": "Confirm new password", className: "w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", required: true, disabled: loading }) })] }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-[13px] text-red-600 mb-4", children: error })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "submit", disabled: loading, className: "bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors mb-[80px] disabled:opacity-60 disabled:cursor-not-allowed", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: loading ? "Resetting..." : "Reset" }), !loading && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { "aria-hidden": "true", width: "18", height: "22", viewBox: "0 0 16 16", fill: "none", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z", fill: "white" }) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => navigate("/login"), disabled: loading, className: "w-[344px] bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: "BACK to login" }) })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pb-[20px] flex justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__.AuthFooter, {}) })] }));
}


/***/ },

/***/ "./ReactApp/pages/ResetPasswordEmailMessage.tsx"
/*!******************************************************!*\
  !*** ./ReactApp/pages/ResetPasswordEmailMessage.tsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResetPasswordEmailMessage)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Components/TaskFlowLogo */ "./ReactApp/Components/TaskFlowLogo.tsx");
/* harmony import */ var _Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Components/AuthFooter */ "./ReactApp/Components/AuthFooter.tsx");





function ResetPasswordEmailMessage() {
    var _a;
    const navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
    const location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
    const { email, code: receivedCode } = ((_a = location.state) !== null && _a !== void 0 ? _a : {});
    const [part1, setPart1] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [part2, setPart2] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const ref1 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const ref2 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // Redirect if arrived here without going through forgot-password
    if (!email) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_2__.Navigate, { to: "/forgot-password", replace: true });
    }
    const handlePart1Change = (val) => {
        var _a;
        const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        setPart1(clean);
        setError("");
        if (clean.length === 4)
            (_a = ref2.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const handlePart2Change = (val) => {
        const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        setPart2(clean);
        setError("");
    };
    // Allow backspace from part2 to jump back to part1
    const handlePart2KeyDown = (e) => {
        var _a;
        if (e.key === "Backspace" && part2 === "") {
            (_a = ref1.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (part1.length < 4 || part2.length < 4) {
            setError("Please enter the complete 8-character recovery code.");
            return;
        }
        const enteredCode = `${part1}-${part2}`;
        navigate("/reset-password", { state: { email, token: enteredCode } });
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-h-screen bg-white flex flex-col", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pt-[54px] pl-[55px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__.TaskFlowLogo, {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 flex flex-col items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-[345px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "font-medium text-[20px] leading-[1.6] text-foreground tracking-[0.15px] mb-2", children: "Enter recovery code" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "font-normal text-sm leading-[1.43] text-foreground tracking-[0.15px] mb-8", children: ["Enter the 8-character code sent to", " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium", children: email })] }), receivedCode && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-[8px] bg-[#F5F5F5] border border-[rgba(0,0,0,0.12)] rounded-[4px] px-[14px] py-[10px] mb-[32px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z", fill: "rgba(0,0,0,0.38)" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-[13px] text-muted-foreground", children: ["Your code:\u00A0", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-mono font-bold tracking-[2px] text-foreground", children: receivedCode })] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-[12px] mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { ref: ref1, type: "text", inputMode: "text", autoComplete: "off", autoFocus: true, value: part1, onChange: (e) => handlePart1Change(e.target.value), maxLength: 4, placeholder: "XXXX", "aria-label": "Recovery code first half", className: "w-full py-4 bg-transparent font-mono font-bold text-xl text-center text-foreground tracking-[4px] leading-6 outline-none placeholder:text-black/25 placeholder:tracking-[4px] placeholder:font-normal" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-bold text-2xl text-black/40 select-none", children: "\u2014" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { ref: ref2, type: "text", inputMode: "text", autoComplete: "off", value: part2, onChange: (e) => handlePart2Change(e.target.value), onKeyDown: handlePart2KeyDown, maxLength: 4, placeholder: "XXXX", "aria-label": "Recovery code second half", className: "w-full py-4 bg-transparent font-mono font-bold text-xl text-center text-foreground tracking-[4px] leading-6 outline-none placeholder:text-black/25 placeholder:tracking-[4px] placeholder:font-normal" }) })] })] }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-[13px] text-red-600 mb-4", children: error })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "submit", className: "bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors mb-[80px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: "Verify" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { "aria-hidden": "true", width: "18", height: "22", viewBox: "0 0 16 16", fill: "none", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z", fill: "white" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => navigate("/login"), className: "w-[344px] bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: "BACK to login" }) })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pb-[20px] flex justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__.AuthFooter, {}) })] }));
}


/***/ },

/***/ "./ReactApp/pages/Settings.tsx"
/*!*************************************!*\
  !*** ./ReactApp/pages/Settings.tsx ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/square-check-big.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bell.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/camera.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/globe.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/key.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/message-square.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/monitor.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/moon.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/palette.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/save.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/shield.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sun.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash-2.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.js");
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_Footer__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../Components/Footer */ "./ReactApp/Components/Footer.tsx");






/* ─────── helpers ─────── */
function SectionCard({ title, children }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-b border-gray-200 px-6 py-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "font-semibold text-gray-900", children: title }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6", children: children })] }));
}
function ToggleRow({ label, description, value, onChange }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between py-3 border-b border-gray-100 last:border-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900", children: label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: description })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => onChange(!value), "aria-label": label, "aria-pressed": value, className: `relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${value ? "bg-blue-600" : "bg-gray-200"}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}` }) })] }));
}
function InputField({ label, value, onChange, type = "text", placeholder, }) {
    const id = (0,react__WEBPACK_IMPORTED_MODULE_1__.useId)();
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-1.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: id, className: "text-sm font-medium text-gray-700", children: label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: id, type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" })] }));
}
/* ─────── nav items ─────── */
const NAV_ITEMS = [
    { id: "profile", label: "Profile", icon: lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"] },
    { id: "account", label: "Account", icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"] },
    { id: "notifications", label: "Notifications", icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"] },
    { id: "appearance", label: "Appearance", icon: lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"] },
    { id: "security", label: "Security", icon: lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"] },
    { id: "privacy", label: "Privacy", icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"] },
];
/* ═══════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════ */
function Settings() {
    const [activeSection, setActiveSection] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("profile");
    /* ── Profile state ── */
    const [profile, setProfile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        firstName: "Demo",
        lastName: "User",
        email: "demo@taskflow.io",
        role: "Product Manager",
        bio: "Building great products one task at a time.",
        timezone: "Africa/Cairo",
        language: "English (US)",
        phone: "",
    });
    /* ── Notifications state ── */
    const [notifs, setNotifs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        emailTaskAssigned: true,
        emailTaskCompleted: false,
        emailWeeklyDigest: true,
        emailProjectUpdates: true,
        pushTaskAssigned: true,
        pushMentions: true,
        pushDeadlines: true,
        pushNewMessages: false,
        inAppAll: true,
        inAppSounds: false,
    });
    const toggleNotif = (key) => setNotifs((n) => (Object.assign(Object.assign({}, n), { [key]: !n[key] })));
    /* ── Appearance state ── */
    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("light");
    const [accentColor, setAccentColor] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("#155EEF");
    const [density, setDensity] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("comfortable");
    /* ── Security state ── */
    const [twoFA, setTwoFA] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [sessions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([
        { device: "Chrome on Windows", location: "Cairo, EG", lastActive: "Now", current: true },
        { device: "Safari on iPhone", location: "Cairo, EG", lastActive: "2 hours ago", current: false },
        { device: "Firefox on macOS", location: "Dubai, AE", lastActive: "3 days ago", current: false },
    ]);
    /* ── Privacy state ── */
    const [privacy, setPrivacy] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        showOnlineStatus: true,
        showProfileToTeam: true,
        allowDataAnalytics: true,
        shareActivityFeed: false,
    });
    const togglePrivacy = (key) => setPrivacy((p) => (Object.assign(Object.assign({}, p), { [key]: !p[key] })));
    /* ── Password change state ── */
    const [passwords, setPasswords] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({ current: "", next: "", confirm: "" });
    /* ════════════ render ════════════ */
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_17__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_18__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", { className: "flex-1 overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-6xl mx-auto px-6 py-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Settings" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-500 mt-1", children: "Manage your account preferences and configuration" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-6 items-start", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("nav", { className: "w-52 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-6", children: NAV_ITEMS.map(({ id, label, icon: Icon }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setActiveSection(id), className: `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-0 ${activeSection === id
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "text-gray-600 hover:bg-gray-50"}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, { className: "size-4 shrink-0" }), label] }, id))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col gap-6", children: [activeSection === "profile" && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Profile Picture", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold select-none", children: "AA" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": "Change profile picture", className: "absolute bottom-0 right-0 size-7 bg-blue-600 rounded-full flex items-center justify-center shadow hover:bg-blue-700 transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-3.5 text-white" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900", children: "Demo User" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: "JPG, PNG or GIF \u00B7 max 5 MB" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors", children: "Upload photo" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors", children: "Remove" })] })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(SectionCard, { title: "Personal Information", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "First name", value: profile.firstName, onChange: (v) => setProfile(Object.assign(Object.assign({}, profile), { firstName: v })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "Last name", value: profile.lastName, onChange: (v) => setProfile(Object.assign(Object.assign({}, profile), { lastName: v })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "Email address", value: profile.email, onChange: (v) => setProfile(Object.assign(Object.assign({}, profile), { email: v })), type: "email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "Phone number", value: profile.phone, onChange: (v) => setProfile(Object.assign(Object.assign({}, profile), { phone: v })), type: "tel", placeholder: "+20 1xx xxx xxxx" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "Job title / Role", value: profile.role, onChange: (v) => setProfile(Object.assign(Object.assign({}, profile), { role: v })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-1.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "settings-timezone", className: "text-sm font-medium text-gray-700", children: "Timezone" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("select", { id: "settings-timezone", value: profile.timezone, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { timezone: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white", children: ["Africa/Cairo", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Dubai", "Asia/Tokyo"].map(tz => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: tz, children: tz }, tz))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "col-span-2 flex flex-col gap-1.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "settings-bio", className: "text-sm font-medium text-gray-700", children: "Bio" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { id: "settings-bio", value: profile.bio, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { bio: e.target.value })), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-xs text-gray-400 text-right", children: [profile.bio.length, "/160"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mt-4 flex justify-end", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { className: "size-4" }), " Save changes"] }) })] })] })), activeSection === "account" && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Change Password", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-4 max-w-md", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "Current password", value: passwords.current, onChange: (v) => setPasswords(Object.assign(Object.assign({}, passwords), { current: v })), type: "password" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "New password", value: passwords.next, onChange: (v) => setPasswords(Object.assign(Object.assign({}, passwords), { next: v })), type: "password" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(InputField, { label: "Confirm new password", value: passwords.confirm, onChange: (v) => setPasswords(Object.assign(Object.assign({}, passwords), { confirm: v })), type: "password" }), passwords.next.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex gap-1 mb-1", children: [1, 2, 3, 4].map((i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `h-1.5 flex-1 rounded-full ${passwords.next.length >= i * 3
                                                                                            ? passwords.next.length < 8 ? "bg-red-400"
                                                                                                : passwords.next.length < 12 ? "bg-yellow-400"
                                                                                                    : "bg-green-500"
                                                                                            : "bg-gray-200"}` }, i))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-xs text-gray-500", children: [passwords.next.length < 8 ? "Weak" : passwords.next.length < 12 ? "Fair" : "Strong", " password"] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex justify-end", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "size-4" }), " Update password"] }) })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Language & Region", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-2 gap-4 max-w-md", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-1.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "settings-language", className: "text-sm font-medium text-gray-700", children: "Language" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("select", { id: "settings-language", value: profile.language, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { language: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white", children: ["English (US)", "English (UK)", "Arabic", "French", "Spanish", "German"].map(l => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: l, children: l }, l))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col gap-1.5", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "settings-dateformat", className: "text-sm font-medium text-gray-700", children: "Date format" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { id: "settings-dateformat", className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "MM/DD/YYYY" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "DD/MM/YYYY" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "YYYY-MM-DD" })] })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Danger Zone", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-semibold text-red-700", children: "Delete account" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-red-600 mt-0.5", children: "Permanently delete your account and all data. This cannot be undone." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors ml-4 shrink-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { className: "size-4" }), " Delete account"] })] }) })] })), activeSection === "notifications" && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "size-4 text-gray-500" }), "Email Notifications"] }), children: [
                                                                    { key: "emailTaskAssigned", label: "Task assigned to you", description: "Receive an email when a task is assigned to you" },
                                                                    { key: "emailTaskCompleted", label: "Task completed", description: "Receive an email when a task you own is completed" },
                                                                    { key: "emailWeeklyDigest", label: "Weekly digest", description: "A summary of your activity every Monday morning" },
                                                                    { key: "emailProjectUpdates", label: "Project updates", description: "Updates when project members make significant changes" },
                                                                ].map(({ key, label, description }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToggleRow, { label: label, description: description, value: notifs[key], onChange: () => toggleNotif(key) }, key))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-4 text-gray-500" }), "Push Notifications"] }), children: [
                                                                    { key: "pushTaskAssigned", label: "Task assigned", description: "In-browser push when a task is assigned to you" },
                                                                    { key: "pushMentions", label: "Mentions", description: "When someone @mentions you in a comment" },
                                                                    { key: "pushDeadlines", label: "Upcoming deadlines", description: "Reminder 24 hours before a task is due" },
                                                                    { key: "pushNewMessages", label: "New messages", description: "When you receive a direct message" },
                                                                ].map(({ key, label, description }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToggleRow, { label: label, description: description, value: notifs[key], onChange: () => toggleNotif(key) }, key))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "size-4 text-gray-500" }), "In-App Notifications"] }), children: [
                                                                    { key: "inAppAll", label: "All in-app notifications", description: "Show notification badge and panel entries" },
                                                                    { key: "inAppSounds", label: "Notification sounds", description: "Play a sound when a new notification arrives" },
                                                                ].map(({ key, label, description }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToggleRow, { label: label, description: description, value: notifs[key], onChange: () => toggleNotif(key) }, key))) })] })), activeSection === "appearance" && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Theme", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-3 gap-3", children: [
                                                                        { id: "light", icon: lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], label: "Light" },
                                                                        { id: "dark", icon: lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], label: "Dark" },
                                                                        { id: "system", icon: lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], label: "System" },
                                                                    ].map(({ id, icon: Icon, label }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setTheme(id), className: `flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors ${theme === id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, { className: `size-6 ${theme === id ? "text-blue-600" : "text-gray-500"}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `text-sm font-medium ${theme === id ? "text-blue-600" : "text-gray-600"}`, children: label })] }, id))) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Accent color", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-4", children: [["#155EEF", "#7C3AED", "#DC2626", "#059669", "#D97706", "#0891B2"].map((c) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setAccentColor(c), "aria-label": `Accent color ${c}`, "aria-pressed": accentColor === c, style: { background: c }, className: `size-8 rounded-full transition-transform ${accentColor === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}` }, c))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "flex items-center gap-2 text-sm text-gray-600 cursor-pointer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "color", value: accentColor, onChange: (e) => setAccentColor(e.target.value), className: "size-8 rounded border-0 cursor-pointer" }), "Custom"] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Layout density", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex gap-3", children: ["compact", "comfortable", "spacious"].map((d) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setDensity(d), className: `flex-1 py-3 border-2 rounded-xl text-sm font-medium capitalize transition-colors ${density === d ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`, children: d }, d))) }) })] })), activeSection === "security" && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Two-Factor Authentication", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900", children: "Authenticator app (TOTP)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: "Use an app like Google Authenticator or Authy" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `text-xs font-medium px-2 py-0.5 rounded-full ${twoFA ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`, children: twoFA ? "Enabled" : "Disabled" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setTwoFA(!twoFA), "aria-label": "Two-factor authentication", "aria-pressed": twoFA, className: `relative w-11 h-6 rounded-full transition-colors ${twoFA ? "bg-blue-600" : "bg-gray-200"}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform ${twoFA ? "translate-x-5" : "translate-x-0"}` }) })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(SectionCard, { title: "Active Sessions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-col gap-2", children: sessions.map((s, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between p-3 rounded-lg bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `size-2.5 rounded-full ${s.current ? "bg-green-500" : "bg-gray-300"}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900", children: s.device }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-xs text-gray-500", children: [s.location, " \u00B7 ", s.lastActive] })] })] }), s.current ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full", children: "Current" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "text-xs text-red-500 hover:text-red-600 font-medium", children: "Revoke" }))] }, i))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "mt-3 text-sm text-red-500 hover:text-red-600 font-medium", children: "Sign out of all other sessions" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Login History", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex flex-col gap-1", children: [
                                                                        { event: "Successful login", time: "Today, 09:14 AM", device: "Chrome · Cairo" },
                                                                        { event: "Successful login", time: "Yesterday, 07:52 PM", device: "Safari · iPhone" },
                                                                        { event: "Failed attempt", time: "Mar 9, 11:30 AM", device: "Unknown device" },
                                                                        { event: "Successful login", time: "Mar 8, 03:00 PM", device: "Firefox · macOS" },
                                                                    ].map((row, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between py-2 border-b border-gray-100 last:border-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: `size-4 ${row.event.startsWith("Failed") ? "text-red-400" : "text-green-500"}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm text-gray-800", children: row.event })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500", children: row.time }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-400", children: row.device })] })] }, i))) }) })] })), activeSection === "privacy" && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SectionCard, { title: "Visibility", children: [
                                                                    { key: "showOnlineStatus", label: "Show online status", description: "Let team members see when you are active" },
                                                                    { key: "showProfileToTeam", label: "Public profile within team", description: "Allow team members to view your full profile" },
                                                                    { key: "shareActivityFeed", label: "Share activity feed", description: "Show your recent activity in the team feed" },
                                                                ].map(({ key, label, description }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToggleRow, { label: label, description: description, value: privacy[key], onChange: () => togglePrivacy(key) }, key))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(SectionCard, { title: "Data & Analytics", children: [[
                                                                        { key: "allowDataAnalytics", label: "Usage analytics", description: "Help us improve TaskFlow by sharing anonymous usage data" },
                                                                    ].map(({ key, label, description }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToggleRow, { label: label, description: description, value: privacy[key], onChange: () => togglePrivacy(key) }, key))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 leading-relaxed", children: ["We never sell your personal data. See our", " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => { }, className: "text-blue-600 hover:underline", children: "Privacy Policy" }), " ", "for full details on how your information is used."] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(SectionCard, { title: "Data Export", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Download a copy of all your TaskFlow data including tasks, projects, and account information." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors", children: "Request data export" })] })] }))] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Footer__WEBPACK_IMPORTED_MODULE_19__["default"], {})] })] })] }));
}


/***/ },

/***/ "./ReactApp/pages/Signup.tsx"
/*!***********************************!*\
  !*** ./ReactApp/pages/Signup.tsx ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Signup)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Components/TaskFlowLogo */ "./ReactApp/Components/TaskFlowLogo.tsx");
/* harmony import */ var _Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Components/AuthFooter */ "./ReactApp/Components/AuthFooter.tsx");
/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../context/AuthContext */ "./ReactApp/context/AuthContext.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






function validateSignupForm(data) {
    const errors = {};
    if (!data.firstName.trim()) {
        errors.firstName = "First name is required";
    }
    if (!data.lastName.trim()) {
        errors.lastName = "Last name is required";
    }
    if (!data.email.trim()) {
        errors.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Please enter a valid email address";
    }
    if (!data.password) {
        errors.password = "Password is required";
    }
    else if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!data.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    }
    else if (data.password && data.confirmPassword !== data.password) {
        errors.confirmPassword = "Passwords do not match";
    }
    return errors;
}
// ── Component ────────────────────────────────────────────────────────────
function Signup() {
    const navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
    const { signup, isAuthenticated, error: authError, clearError } = (0,_context_AuthContext__WEBPACK_IMPORTED_MODULE_5__.useAuth)();
    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        company: "",
        country: "United States",
        phone: "+20",
        timezone: "GMT+2",
    });
    const [fieldErrors, setFieldErrors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    const [isSubmitting, setIsSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Redirect if already authenticated
    if (isAuthenticated) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router__WEBPACK_IMPORTED_MODULE_2__.Navigate, { to: "/", replace: true });
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
        // Clear field error on change
        if (name in fieldErrors) {
            setFieldErrors((prev) => (Object.assign(Object.assign({}, prev), { [name]: undefined })));
        }
    };
    const handleSignup = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        clearError();
        // Client-side validation
        const errors = validateSignupForm(formData);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0)
            return;
        setIsSubmitting(true);
        try {
            yield signup({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });
            navigate("/", { replace: true });
        }
        catch (_a) {
            // Error is already set in AuthContext
        }
        finally {
            setIsSubmitting(false);
        }
    });
    // Helper: border class based on whether a field has an error
    const borderClass = (field) => fieldErrors[field]
        ? "border-red-500"
        : "border-[rgba(0,0,0,0.23)]";
    const ringClass = (field) => fieldErrors[field] ? "ring-1 ring-red-500" : "";
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-h-screen bg-white flex", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col min-h-screen relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pt-[54px] pl-[55px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_TaskFlowLogo__WEBPACK_IMPORTED_MODULE_3__.TaskFlowLogo, {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col justify-center px-8 mx-auto w-full max-w-[462px] mt-[-100px]", children: [authError && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-[24px] max-w-[462px] rounded-[4px] border border-red-300 bg-red-50 px-[12px] py-[10px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-red-700", children: authError }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSignup, noValidate: true, className: "max-w-[462px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-[22px] mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative rounded-[4px] ${ringClass("firstName")}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: `absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("firstName")}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { name: "firstName", type: "text", value: formData.firstName, onChange: handleChange, placeholder: "First name *", "aria-label": "First name", className: "w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", "aria-invalid": !!fieldErrors.firstName, "aria-describedby": fieldErrors.firstName ? "firstName-error" : undefined, disabled: isSubmitting }) })] }), fieldErrors.firstName && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { id: "firstName-error", className: "mt-1 text-xs text-red-600 pl-0.5", children: fieldErrors.firstName }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative rounded-[4px] ${ringClass("lastName")}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: `absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("lastName")}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "px-[12px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { name: "lastName", type: "text", value: formData.lastName, onChange: handleChange, placeholder: "Last name *", "aria-label": "Last name", className: "w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", "aria-invalid": !!fieldErrors.lastName, "aria-describedby": fieldErrors.lastName ? "lastName-error" : undefined, disabled: isSubmitting }) })] }), fieldErrors.lastName && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { id: "lastName-error", className: "mt-1 text-xs text-red-600 pl-0.5", children: fieldErrors.lastName }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative rounded-[4px] w-full ${ringClass("email")}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: `absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("email")}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-[12px] relative", children: [formData.email && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3", children: "Email Address" }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { name: "email", type: "email", value: formData.email, onChange: handleChange, placeholder: "Email Address *", "aria-label": "Email Address", className: "w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", "aria-invalid": !!fieldErrors.email, "aria-describedby": fieldErrors.email ? "email-error" : undefined, disabled: isSubmitting })] })] }), fieldErrors.email && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { id: "email-error", className: "mt-1 text-xs text-red-600 pl-0.5", children: fieldErrors.email }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative rounded-[4px] w-full ${ringClass("password")}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: `absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("password")}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-[12px] relative", children: [formData.password && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3", children: "Password" }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { name: "password", type: "password", value: formData.password, onChange: handleChange, placeholder: "Password *", "aria-label": "Password", className: "w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", "aria-invalid": !!fieldErrors.password, "aria-describedby": fieldErrors.password ? "password-error" : undefined, disabled: isSubmitting })] })] }), fieldErrors.password && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { id: "password-error", className: "mt-1 text-xs text-red-600 pl-0.5", children: fieldErrors.password }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative rounded-[4px] w-full ${ringClass("confirmPassword")}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: `absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("confirmPassword")}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-[12px] relative", children: [formData.confirmPassword && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3", children: "Confirm Password" }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { name: "confirmPassword", type: "password", value: formData.confirmPassword, onChange: handleChange, placeholder: "Confirm Password *", "aria-label": "Confirm Password", className: "w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", "aria-invalid": !!fieldErrors.confirmPassword, "aria-describedby": fieldErrors.confirmPassword ? "confirmPassword-error" : undefined, disabled: isSubmitting })] })] }), fieldErrors.confirmPassword && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { id: "confirmPassword-error", className: "mt-1 text-xs text-red-600 pl-0.5", children: fieldErrors.confirmPassword }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] w-full mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[#e2e2ea] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-[12px] relative", children: [formData.company && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal text-xs text-[#92929d] tracking-[0.15px] leading-3", children: "Company name" }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { name: "company", type: "text", value: formData.company, onChange: handleChange, placeholder: "Company name", "aria-label": "Company name", className: "w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", disabled: isSubmitting })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-[22px] mb-[24px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-[12px] relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3", children: "Country" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { name: "country", value: formData.country, onChange: handleChange, "aria-label": "Country", className: "w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none appearance-none cursor-pointer", disabled: isSubmitting, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "United States" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "United Kingdom" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "Canada" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "Australia" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "Germany" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "Egypt" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { "aria-hidden": "true", width: "10", height: "5", viewBox: "0 0 10 5", fill: "none", className: "shrink-0 pointer-events-none", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M0 0L5 5L10 0H0Z", fill: "rgba(0,0,0,0.54)" }) })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[#e2e2ea] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-[12px] relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal text-xs text-[#92929d] tracking-[0.15px] leading-3", children: "Phone #" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { name: "phone", type: "tel", value: formData.phone, onChange: handleChange, placeholder: "Phone #", "aria-label": "Phone number", className: "w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground", disabled: isSubmitting })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative rounded-[4px] w-full mb-[32px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { "aria-hidden": "true", className: "absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[4px]" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "px-[12px] relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3", children: "Default timezone" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { name: "timezone", value: formData.timezone, onChange: handleChange, "aria-label": "Default timezone", className: "w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none appearance-none cursor-pointer", disabled: isSubmitting, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "GMT-5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "GMT-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "GMT+0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "GMT+1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "GMT+2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { children: "GMT+3" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { "aria-hidden": "true", width: "10", height: "5", viewBox: "0 0 10 5", fill: "none", className: "shrink-0 pointer-events-none", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M0 0L5 5L10 0H0Z", fill: "#92929D" }) })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-[16px] flex items-center justify-center gap-[8px]", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: isSubmitting ? "Creating account..." : "Sign up" }), isSubmitting && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => navigate("/login"), disabled: isSubmitting, className: "w-full bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white", children: "BACK to login" }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "pb-[20px] px-8 mx-auto", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_AuthFooter__WEBPACK_IMPORTED_MODULE_4__.AuthFooter, {}) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hidden lg:block w-[37.5%] bg-brand min-h-screen relative", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute bottom-[30px] right-[30px]", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "font-bold text-lg text-white/80 tracking-[0.15px]", children: ["TaskFlow ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-normal", children: "Pro" })] }) }) })] }));
}


/***/ },

/***/ "./ReactApp/pages/Teams.tsx"
/*!**********************************!*\
  !*** ./ReactApp/pages/Teams.tsx ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Teams)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.js");
/* harmony import */ var _Components_Sidebar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Components/Sidebar */ "./ReactApp/Components/Sidebar.tsx");
/* harmony import */ var _Components_Footer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Components/Footer */ "./ReactApp/Components/Footer.tsx");
/* harmony import */ var _Components_Header__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Components/Header */ "./ReactApp/Components/Header.tsx");
/* harmony import */ var _Components_PageState__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Components/PageState */ "./ReactApp/Components/PageState.tsx");







// ── Seed data (will be replaced by API call) ─────────────────────────────
const SEED_MEMBERS = [
    {
        id: "1",
        name: "Sarah Chen",
        role: "Product Designer",
        avatar: "SC",
        email: "sarah.chen@company.com",
        status: "online",
        tasksCompleted: 24,
        tasksInProgress: 3,
    },
    {
        id: "2",
        name: "Mike Johnson",
        role: "Frontend Developer",
        avatar: "MJ",
        email: "mike.johnson@company.com",
        status: "online",
        tasksCompleted: 18,
        tasksInProgress: 5,
    },
    {
        id: "3",
        name: "Alex Kim",
        role: "Backend Developer",
        avatar: "AK",
        email: "alex.kim@company.com",
        status: "away",
        tasksCompleted: 32,
        tasksInProgress: 2,
    },
    {
        id: "4",
        name: "Emily Rodriguez",
        role: "UX Researcher",
        avatar: "ER",
        email: "emily.rodriguez@company.com",
        status: "online",
        tasksCompleted: 15,
        tasksInProgress: 4,
    },
    {
        id: "5",
        name: "David Lee",
        role: "DevOps Engineer",
        avatar: "DL",
        email: "david.lee@company.com",
        status: "offline",
        tasksCompleted: 28,
        tasksInProgress: 1,
    },
    {
        id: "6",
        name: "Jessica Taylor",
        role: "Product Manager",
        avatar: "JT",
        email: "jessica.taylor@company.com",
        status: "online",
        tasksCompleted: 20,
        tasksInProgress: 6,
    },
];
function Teams() {
    const [teamMembers, setTeamMembers] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // TODO: Replace with actual API call: api.get<TeamMember[]>("/teams/members")
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            if (!cancelled) {
                setTeamMembers(SEED_MEMBERS);
                setIsLoading(false);
            }
        }, 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, []);
    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        setTimeout(() => {
            setTeamMembers(SEED_MEMBERS);
            setIsLoading(false);
        }, 0);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "online":
                return "bg-green-500";
            case "away":
                return "bg-yellow-500";
            case "offline":
                return "bg-gray-400";
            default:
                return "bg-gray-400";
        }
    };
    const getAvatarColor = (index) => {
        const colors = [
            "bg-blue-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-sky-500",
            "bg-green-500",
            "bg-orange-500",
        ];
        return colors[index % colors.length];
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Sidebar__WEBPACK_IMPORTED_MODULE_5__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Header__WEBPACK_IMPORTED_MODULE_7__["default"], {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", { className: "flex-1 overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-7xl mx-auto p-6 space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Teams" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-1", children: "Manage your team members and their workload" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: "Invite Members" })] }), isLoading && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_8__.PageLoading, { message: "Loading team members..." }), error && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_8__.PageError, { message: error, onRetry: handleRetry }), !isLoading && !error && teamMembers.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_PageState__WEBPACK_IMPORTED_MODULE_8__.PageEmpty, { icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], title: "No team members yet", description: "Invite your first team member to start collaborating.", action: { label: "Invite Members", onClick: () => { } } })), !isLoading && !error && teamMembers.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-blue-100 p-3 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "size-6 text-blue-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Total Members" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: teamMembers.length })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-green-100 p-3 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "size-3 bg-green-500 rounded-full" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Online Now" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: teamMembers.filter((m) => m.status === "online").length })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-purple-100 p-3 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xl font-bold text-purple-600", children: teamMembers.reduce((acc, m) => acc + m.tasksInProgress, 0) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Active Tasks" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0) })] })] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "border-b border-gray-200 px-6 py-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "font-semibold text-gray-900", children: "Team Members" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "divide-y divide-gray-200", children: teamMembers.map((member, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `${getAvatarColor(index)} size-12 rounded-full flex items-center justify-center`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-white font-semibold", children: member.avatar }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `absolute bottom-0 right-0 ${getStatusColor(member.status)} size-3 border-2 border-white rounded-full` })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "font-semibold text-gray-900", children: member.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: member.role }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 mt-1 text-sm text-gray-500", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "size-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "truncate", children: member.email })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: member.tasksCompleted }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-600", children: "Completed" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: member.tasksInProgress }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-600", children: "In Progress" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { "aria-label": "Member options", className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "size-5" }) })] }, member.id))) })] })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_Footer__WEBPACK_IMPORTED_MODULE_6__["default"], {})] })] })] }));
}


/***/ },

/***/ "./ReactApp/routes.tsx"
/*!*****************************!*\
  !*** ./ReactApp/routes.tsx ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   router: () => (/* binding */ router)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs");
/* harmony import */ var _Components_ProtectedRoute__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Components/ProtectedRoute */ "./ReactApp/Components/ProtectedRoute.tsx");
/* harmony import */ var _Components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/ErrorBoundary */ "./ReactApp/Components/ErrorBoundary.tsx");
/* harmony import */ var _pages_Login__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/Login */ "./ReactApp/pages/Login.tsx");
/* harmony import */ var _pages_Signup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/Signup */ "./ReactApp/pages/Signup.tsx");
/* harmony import */ var _pages_ForgotPassword__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/ForgotPassword */ "./ReactApp/pages/ForgotPassword.tsx");
/* harmony import */ var _pages_ResetPasswordEmailMessage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/ResetPasswordEmailMessage */ "./ReactApp/pages/ResetPasswordEmailMessage.tsx");
/* harmony import */ var _pages_ResetPassword__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/ResetPassword */ "./ReactApp/pages/ResetPassword.tsx");
/* harmony import */ var _pages_Dashboard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pages/Dashboard */ "./ReactApp/pages/Dashboard.tsx");
/* harmony import */ var _pages_Projects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pages/Projects */ "./ReactApp/pages/Projects.tsx");
/* harmony import */ var _pages_MyWork__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pages/MyWork */ "./ReactApp/pages/MyWork.tsx");
/* harmony import */ var _pages_Teams__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pages/Teams */ "./ReactApp/pages/Teams.tsx");
/* harmony import */ var _pages_Settings__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./pages/Settings */ "./ReactApp/pages/Settings.tsx");
/* harmony import */ var _pages_Message__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./pages/Message */ "./ReactApp/pages/Message.tsx");
/* harmony import */ var _pages_Notifications__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./pages/Notifications */ "./ReactApp/pages/Notifications.tsx");
/* harmony import */ var _pages_Chatbot__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./pages/Chatbot */ "./ReactApp/pages/Chatbot.tsx");
/* harmony import */ var _pages_NotFound__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./pages/NotFound */ "./ReactApp/pages/NotFound.tsx");




// ── Public (auth) pages ──────────────────────────────────────────────────





// ── Protected (app) pages ────────────────────────────────────────────────








// ── 404 ──────────────────────────────────────────────────────────────────

const router = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createBrowserRouter)([
    // ── Public routes (no auth required) ───────────────────────────────────
    {
        path: "/login",
        element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Login__WEBPACK_IMPORTED_MODULE_4__["default"], {}),
        errorElement: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {}),
    },
    {
        path: "/signup",
        element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Signup__WEBPACK_IMPORTED_MODULE_5__["default"], {}),
        errorElement: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {}),
    },
    {
        path: "/forgot-password",
        element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_ForgotPassword__WEBPACK_IMPORTED_MODULE_6__["default"], {}),
        errorElement: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {}),
    },
    {
        path: "/reset-password-sent",
        element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_ResetPasswordEmailMessage__WEBPACK_IMPORTED_MODULE_7__["default"], {}),
        errorElement: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {}),
    },
    {
        path: "/reset-password",
        element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_ResetPassword__WEBPACK_IMPORTED_MODULE_8__["default"], {}),
        errorElement: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {}),
    },
    // ── Protected routes (auth required) ───────────────────────────────────
    {
        element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_ProtectedRoute__WEBPACK_IMPORTED_MODULE_2__["default"], {}),
        errorElement: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {}),
        children: [
            { path: "/", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Dashboard__WEBPACK_IMPORTED_MODULE_9__["default"], {}) },
            { path: "/projects", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Projects__WEBPACK_IMPORTED_MODULE_10__["default"], {}) },
            { path: "/my-work", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_MyWork__WEBPACK_IMPORTED_MODULE_11__["default"], {}) },
            { path: "/teams", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Teams__WEBPACK_IMPORTED_MODULE_12__["default"], {}) },
            { path: "/settings", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Settings__WEBPACK_IMPORTED_MODULE_13__["default"], {}) },
            { path: "/message", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Message__WEBPACK_IMPORTED_MODULE_14__["default"], {}) },
            { path: "/notifications", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Notifications__WEBPACK_IMPORTED_MODULE_15__["default"], {}) },
            { path: "/plans", element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_Chatbot__WEBPACK_IMPORTED_MODULE_16__["default"], {}) },
        ],
    },
    // ── Catch-all 404 ─────────────────────────────────────────────────────
    {
        path: "*",
        element: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_pages_NotFound__WEBPACK_IMPORTED_MODULE_17__["default"], {}),
    },
]);


/***/ },

/***/ "./ReactApp/services/api.ts"
/*!**********************************!*\
  !*** ./ReactApp/services/api.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApiRequestError: () => (/* binding */ ApiRequestError),
/* harmony export */   api: () => (/* binding */ api),
/* harmony export */   clearAuthToken: () => (/* binding */ clearAuthToken),
/* harmony export */   getAuthToken: () => (/* binding */ getAuthToken),
/* harmony export */   setAuthToken: () => (/* binding */ setAuthToken)
/* harmony export */ });
// ── Centralized API Service for Task Flow ────────────────────────────────
//
// All API calls go through this module. It provides:
// - Base URL configuration
// - Automatic auth token injection
// - Consistent error handling
// - Typed request/response helpers
//
// Usage:
//   import { api } from "../services/api";
//   const user = await api.post<AuthResponse>("/auth/login", { email, password });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "/api";
// ── Token management ─────────────────────────────────────────────────────
let authToken = null;
function setAuthToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem("taskflow_token", token);
    }
    else {
        localStorage.removeItem("taskflow_token");
    }
}
function getAuthToken() {
    if (!authToken) {
        authToken = localStorage.getItem("taskflow_token");
    }
    return authToken;
}
function clearAuthToken() {
    authToken = null;
    localStorage.removeItem("taskflow_token");
}
// ── Error class ──────────────────────────────────────────────────────────
class ApiRequestError extends Error {
    constructor(apiError) {
        super(apiError.message);
        this.name = "ApiRequestError";
        this.status = apiError.status;
        this.errors = apiError.errors;
    }
}
function request(endpoint, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}${endpoint}`;
        const headers = Object.assign({ "Content-Type": "application/json" }, options.headers);
        const token = getAuthToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const config = {
            method: options.method,
            headers,
            signal: options.signal,
        };
        if (options.body !== undefined) {
            config.body = JSON.stringify(options.body);
        }
        const response = yield fetch(url, config);
        // Handle 204 No Content
        if (response.status === 204) {
            return undefined;
        }
        // Try to parse response body
        let data;
        try {
            data = yield response.json();
        }
        catch (_a) {
            throw new ApiRequestError({
                message: "Failed to parse server response",
                status: response.status,
            });
        }
        if (!response.ok) {
            const errorData = data;
            throw new ApiRequestError({
                message: errorData.message || `Request failed with status ${response.status}`,
                status: response.status,
                errors: errorData.errors,
            });
        }
        return data;
    });
}
// ── Public API methods ───────────────────────────────────────────────────
const api = {
    get(endpoint, signal) {
        return request(endpoint, { method: "GET", signal });
    },
    post(endpoint, body, signal) {
        return request(endpoint, { method: "POST", body, signal });
    },
    put(endpoint, body, signal) {
        return request(endpoint, { method: "PUT", body, signal });
    },
    patch(endpoint, body, signal) {
        return request(endpoint, { method: "PATCH", body, signal });
    },
    delete(endpoint, signal) {
        return request(endpoint, { method: "DELETE", signal });
    },
};


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktaskflow"] = self["webpackChunktaskflow"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./ReactApp/index.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map