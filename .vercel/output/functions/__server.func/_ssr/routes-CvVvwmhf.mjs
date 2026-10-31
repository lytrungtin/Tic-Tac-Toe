import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, n as Volume2, r as Undo2, t as VolumeX } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CvVvwmhf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DIRS$1 = [
	[1, 0],
	[0, 1],
	[1, 1],
	[1, -1]
];
function opponent(side) {
	return side === 1 ? 2 : 1;
}
function emptyGame() {
	return {
		board: /* @__PURE__ */ new Uint8Array(225),
		turn: 1,
		moves: [],
		winner: 0,
		line: [],
		draw: false,
		gen: 0
	};
}
function rowOf(index) {
	return Math.floor(index / 15);
}
function colOf(index) {
	return index % 15;
}
function inBounds$1(row, col) {
	return row >= 0 && col >= 0 && row < 15 && col < 15;
}
/** True when `index` is empty and placing `side` there makes five or more. */
function createsWinAt(board, index, side) {
	if (board[index] !== 0) return false;
	const row = rowOf(index);
	const col = colOf(index);
	for (const [dr, dc] of DIRS$1) {
		let count = 1;
		for (const sign of [1, -1]) {
			let r = row + dr * sign;
			let c = col + dc * sign;
			while (inBounds$1(r, c) && board[r * 15 + c] === side) {
				count += 1;
				r += dr * sign;
				c += dc * sign;
			}
		}
		if (count >= 5) return true;
	}
	return false;
}
/** Every stone in a winning line through a stone that is already placed. */
function winLine(board, index, side) {
	if (board[index] !== side) return [];
	const row = rowOf(index);
	const col = colOf(index);
	const found = /* @__PURE__ */ new Set();
	for (const [dr, dc] of DIRS$1) {
		const line = [index];
		for (const sign of [1, -1]) {
			let r = row + dr * sign;
			let c = col + dc * sign;
			while (inBounds$1(r, c) && board[r * 15 + c] === side) {
				line.push(r * 15 + c);
				r += dr * sign;
				c += dc * sign;
			}
		}
		if (line.length >= 5) for (const cell of line) found.add(cell);
	}
	return [...found];
}
function playAt(state, index) {
	if (state.winner || state.draw) return state;
	if (index < 0 || index >= 225) return state;
	if (state.board[index] !== 0) return state;
	const side = state.turn;
	const board = new Uint8Array(state.board);
	board[index] = side;
	const line = winLine(board, index, side);
	const winner = line.length >= 5 ? side : 0;
	const moves = [...state.moves, {
		index,
		side
	}];
	const draw = winner === 0 && moves.length === 225;
	return {
		board,
		turn: opponent(side),
		moves,
		winner,
		line: winner ? line : [],
		draw,
		gen: state.gen
	};
}
function undoLast(state) {
	if (state.moves.length === 0) return state;
	const moves = state.moves.slice(0, -1);
	const board = /* @__PURE__ */ new Uint8Array(225);
	for (const move of moves) board[move.index] = move.side;
	return {
		board,
		turn: moves.length % 2 === 0 ? 1 : 2,
		moves,
		winner: 0,
		line: [],
		draw: false,
		gen: state.gen + 1
	};
}
var DIRS = [
	[1, 0],
	[0, 1],
	[1, 1],
	[1, -1]
];
/** Best shape in one direction, highest first so a five is not scored as a four. */
var SHAPES = [
	{
		re: /MMMMM/,
		score: 1e9
	},
	{
		re: /\.MMMM\./,
		score: 8e7
	},
	{
		re: /MMM\.M|M\.MMM|MM\.MM/,
		score: 8e6
	},
	{
		re: /MMMM\.|\.MMMM/,
		score: 8e6
	},
	{
		re: /\.MMM\./,
		score: 8e5
	},
	{
		re: /\.MM\.M\.|\.M\.MM\./,
		score: 4e5
	},
	{
		re: /MMM\.\.|\.\.MMM/,
		score: 5e4
	},
	{
		re: /\.MM\.M|\.M\.MM/,
		score: 4e4
	},
	{
		re: /\.MM\./,
		score: 8e3
	},
	{
		re: /\.M\.M\./,
		score: 6e3
	},
	{
		re: /MM\.\.|\.\.MM/,
		score: 1500
	},
	{
		re: /\.M\./,
		score: 500
	}
];
var DEFENSE = 1.15;
function inBounds(row, col) {
	return row >= 0 && col >= 0 && row < 15 && col < 15;
}
/** Empty cells within two steps of a stone. Immediate wins always fall inside this. */
function candidates(board) {
	const seen = /* @__PURE__ */ new Uint8Array(225);
	const out = [];
	let any = false;
	for (let index = 0; index < board.length; index += 1) {
		if (board[index] === 0) continue;
		any = true;
		const row = rowOf(index);
		const col = colOf(index);
		for (let dr = -2; dr <= 2; dr += 1) for (let dc = -2; dc <= 2; dc += 1) {
			const r = row + dr;
			const c = col + dc;
			if (!inBounds(r, c)) continue;
			const j = r * 15 + c;
			if (board[j] !== 0 || seen[j]) continue;
			seen[j] = 1;
			out.push(j);
		}
	}
	if (!any) out.push(Math.floor(15 / 2) * 15 + Math.floor(15 / 2));
	return out;
}
function lineString(board, index, dr, dc, side) {
	const row = rowOf(index);
	const col = colOf(index);
	let text = "";
	for (let k = -5; k <= 5; k += 1) {
		const r = row + dr * k;
		const c = col + dc * k;
		if (!inBounds(r, c)) text += "W";
		else if (k === 0) text += "M";
		else {
			const value = board[r * 15 + c];
			text += value === 0 ? "." : value === side ? "M" : "O";
		}
	}
	return text;
}
function shapeScore(board, index, side) {
	let total = 0;
	for (const [dr, dc] of DIRS) {
		const text = lineString(board, index, dr, dc, side);
		let best = 0;
		for (const shape of SHAPES) if (shape.re.test(text)) {
			best = shape.score;
			break;
		}
		total += best;
	}
	return total;
}
function band(score) {
	if (score >= 1e9) return "năm";
	if (score >= 8e6) return "tứ";
	if (score >= 4e5) return "ba hở";
	if (score >= 4e4) return "ba";
	if (score >= 6e3) return "hai hở";
	if (score >= 500) return "mở";
	return "yếu";
}
function directionClass(text) {
	if (/MMMMM/.test(text)) return "five";
	if (/MMMM\.|\.MMMM|MMM\.M|M\.MMM|MM\.MM/.test(text)) return "four";
	if (/\.MMM\.|\.MM\.M\.|\.M\.MM\./.test(text)) return "open3";
	return "other";
}
function openThreeCount(board, index, side) {
	let count = 0;
	for (const [dr, dc] of DIRS) if (directionClass(lineString(board, index, dr, dc, side)) === "open3") count += 1;
	return count;
}
/** A move that leaves two winning squares, or two open threes. */
function forkAt(board, index, side) {
	if (board[index] !== 0) return null;
	board[index] = side;
	let wins = 0;
	try {
		for (const cell of candidates(board)) if (createsWinAt(board, cell, side)) {
			wins += 1;
			if (wins >= 2) break;
		}
		const openThrees = wins >= 2 ? 0 : openThreeCount(board, index, side);
		if (wins >= 2 || openThrees >= 2) return {
			wins,
			openThrees
		};
		return null;
	} finally {
		board[index] = 0;
	}
}
function rank(board, cells, me) {
	const opp = opponent(me);
	const mid = 7;
	let best = null;
	let bestBias = -Infinity;
	for (const index of cells) {
		const mine = shapeScore(board, index, me);
		const theirs = shapeScore(board, index, opp);
		const score = mine >= 1e9 ? mine : mine + theirs * DEFENSE;
		const bias = -((rowOf(index) - mid) ** 2 + (colOf(index) - mid) ** 2);
		if (!best || score > best.score || score === best.score && (bias > bestBias || bias === bestBias && index < best.index)) {
			best = {
				index,
				score,
				mine,
				theirs
			};
			bestBias = bias;
		}
	}
	return best ?? {
		index: cells[0] ?? -1,
		score: 0,
		mine: 0,
		theirs: 0
	};
}
function pack(kind, ranked, fork) {
	if (kind === "win") return {
		index: ranked.index,
		kind,
		title: "Nước thắng",
		note: "Còn một bước tới năm quân. Đánh dứt điểm, không giữ quân."
	};
	if (kind === "block") return {
		index: ranked.index,
		kind,
		title: "Chặn thắng",
		note: "Đối thủ còn một bước. Phải chiếm đúng ô đó, nếu không là thua ngay."
	};
	if (kind === "fork") {
		const openFour = (fork?.wins ?? 0) >= 2;
		return {
			index: ranked.index,
			kind,
			title: openFour ? "Tứ hai đầu" : "Song ba",
			note: openFour ? "Hai ô kết thúc cùng lúc. Đối thủ chỉ đi được một nước — như thắng khi hòa." : "Hai hàng ba hở. Chặn một hàng, hàng kia vẫn thành tứ."
		};
	}
	if (kind === "block-fork") return {
		index: ranked.index,
		kind,
		title: "Chặn đòn đôi",
		note: "Đối thủ sắp có hai mối đe dọa. Giữ ô này trước khi họ đánh."
	};
	return {
		index: ranked.index,
		kind: "pressure",
		title: "Áp lực tỷ lệ",
		note: `Đòn ta: ${band(ranked.mine)}. Đòn địch: ${band(ranked.theirs)}. Ưu tiên bên gần năm hơn, và nhích thêm một nhịp phòng thủ.`
	};
}
/**
* Caro translation of the bid bot:
* distance 0 → take the win; opponent distance 0 → block;
* a double threat is the tie-break (they can answer only one);
* otherwise bid their closeness plus a small defense margin,
* never chasing a weak line while a closer threat exists.
*/
function decide(source, me) {
	const board = new Uint8Array(source);
	const opp = opponent(me);
	const cells = candidates(board);
	if (cells.length === 0 || cells.every((cell) => board[cell] !== 0)) return pack("pressure", {
		index: -1,
		score: 0,
		mine: 0,
		theirs: 0
	});
	const myWins = cells.filter((cell) => createsWinAt(board, cell, me));
	if (myWins.length > 0) return pack("win", rank(board, myWins, me));
	const oppWins = cells.filter((cell) => createsWinAt(board, cell, opp));
	if (oppWins.length > 0) return pack("block", rank(board, oppWins, me));
	let bestFork = null;
	let bestForkRank = null;
	for (const cell of cells) {
		const fork = forkAt(board, cell, me);
		if (!fork) continue;
		const ranked = rank(board, [cell], me);
		if (!bestForkRank || ranked.score > bestForkRank.score) {
			bestFork = {
				index: cell,
				fork
			};
			bestForkRank = ranked;
		}
	}
	if (bestFork && bestForkRank) return pack("fork", bestForkRank, bestFork.fork);
	const blocks = [];
	for (const cell of cells) if (forkAt(board, cell, opp)) blocks.push(cell);
	if (blocks.length > 0) return pack("block-fork", rank(board, blocks, me));
	return pack("pressure", rank(board, cells, me));
}
var STORAGE_KEY = "caro-ap-luc-v1";
var PRINCIPLES = [
	{
		kinds: ["win", "block"],
		title: "Còn một bước",
		body: "Có năm thì đánh. Họ có năm thì chặn đúng ô đó."
	},
	{
		kinds: ["fork", "block-fork"],
		title: "Quyền khi hòa",
		body: "Song ba hoặc tứ hai đầu: họ chỉ đáp được một đòn."
	},
	{
		kinds: ["pressure"],
		title: "Áp lực tỷ lệ",
		body: "Ô nào gần năm hơn thì đáng đi hơn."
	},
	{
		kinds: ["pressure"],
		title: "Không all-in",
		body: "Không đuổi hàng yếu khi đối thủ đang gần thắng hơn."
	}
];
function Mark({ side, className }) {
	if (side === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 100 100",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M24 24 L76 76 M76 24 L24 76",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "12",
			strokeLinecap: "round"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 100 100",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "50",
			cy: "50",
			r: "28",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "12"
		})
	});
}
function tone(kind, ctx) {
	const now = ctx.currentTime;
	(kind === "win" ? [
		523,
		659,
		784
	] : [kind === "x" ? 620 : 440]).forEach((freq, i) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = freq;
		const start = now + i * .07;
		gain.gain.setValueAtTime(1e-4, start);
		gain.gain.exponentialRampToValueAtTime(.045, start + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, start + .16);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(start);
		osc.stop(start + .18);
	});
}
function loadRecord() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {
			win: 0,
			loss: 0,
			draw: 0
		};
		const parsed = JSON.parse(raw);
		return {
			win: Number(parsed.win) || 0,
			loss: Number(parsed.loss) || 0,
			draw: Number(parsed.draw) || 0
		};
	} catch {
		return {
			win: 0,
			loss: 0,
			draw: 0
		};
	}
}
function CaroGame() {
	const [vsBot, setVsBot] = (0, import_react.useState)(true);
	const [human, setHuman] = (0, import_react.useState)(1);
	const [game, setGame] = (0, import_react.useState)(emptyGame);
	const [decision, setDecision] = (0, import_react.useState)(null);
	const [sound, setSound] = (0, import_react.useState)(false);
	const [record, setRecord] = (0, import_react.useState)({
		win: 0,
		loss: 0,
		draw: 0
	});
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const gameRef = (0, import_react.useRef)(game);
	const audioRef = (0, import_react.useRef)(null);
	gameRef.current = game;
	(0, import_react.useEffect)(() => {
		setRecord(loadRecord());
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
	}, [record, hydrated]);
	function playSound(next) {
		if (!sound) return;
		const ctx = audioRef.current;
		if (!ctx) return;
		if (ctx.state === "suspended") ctx.resume();
		if (next.winner || next.draw) tone("win", ctx);
		else tone(next.moves[next.moves.length - 1]?.side === 1 ? "x" : "o", ctx);
	}
	function scoreFor(prev, next, delta) {
		if (!vsBot) return;
		const over = delta > 0 ? next : prev;
		if (!over.winner && !over.draw) return;
		setRecord((current) => {
			const key = over.draw ? "draw" : over.winner === human ? "win" : "loss";
			return {
				...current,
				[key]: Math.max(0, current[key] + delta)
			};
		});
	}
	function publish(prev, next) {
		if (next === prev) return;
		if (!prev.winner && !prev.draw) scoreFor(prev, next, 1);
		playSound(next);
		setGame(next);
	}
	(0, import_react.useEffect)(() => {
		if (!vsBot || game.winner || game.draw || game.turn === human) return;
		const gen = game.gen;
		const turn = game.turn;
		const timer = window.setTimeout(() => {
			const prev = gameRef.current;
			if (prev.gen !== gen || prev.turn !== turn || prev.winner || prev.draw) return;
			const choice = decide(prev.board, turn);
			if (choice.index < 0) return;
			setDecision(choice);
			publish(prev, playAt(prev, choice.index));
		}, 420);
		return () => window.clearTimeout(timer);
	}, [
		vsBot,
		human,
		sound,
		game.gen,
		game.turn,
		game.winner,
		game.draw,
		game.moves.length
	]);
	function onCell(index) {
		const prev = gameRef.current;
		if (prev.winner || prev.draw) return;
		if (vsBot && prev.turn !== human) return;
		if (prev.board[index] !== 0) return;
		publish(prev, playAt(prev, index));
	}
	function restart(nextHuman = human, nextVsBot = vsBot) {
		setHuman(nextHuman);
		setVsBot(nextVsBot);
		setDecision(null);
		setGame((prev) => ({
			...emptyGame(),
			gen: prev.gen + 1
		}));
	}
	function onUndo() {
		const prev = gameRef.current;
		if (prev.moves.length === 0) return;
		const finished = prev.winner !== 0 || prev.draw;
		let next = undoLast(prev);
		if (vsBot && prev.moves[prev.moves.length - 1]?.side !== human && next.moves.length > 0 && next.moves[next.moves.length - 1]?.side === human) next = undoLast(next);
		if (finished) scoreFor(prev, prev, -1);
		setDecision(null);
		setGame(next);
	}
	function toggleSound() {
		const ctx = audioRef.current ?? new AudioContext();
		audioRef.current = ctx;
		if (ctx.state === "suspended") ctx.resume();
		setSound((on) => !on);
	}
	const thinking = vsBot && !game.winner && !game.draw && game.turn !== human;
	const last = game.moves[game.moves.length - 1]?.index ?? -1;
	const win = new Set(game.line);
	const toMove = game.turn;
	const yourTurn = !vsBot || toMove === human;
	let status = "Tới lượt bạn";
	if (game.draw) status = "Hòa — bàn đã kín.";
	else if (game.winner === 1) status = "X thắng — năm quân liên tiếp.";
	else if (game.winner === 2) status = "O thắng — năm quân liên tiếp.";
	else if (thinking) status = "Bot đang đọc bàn.";
	else if (!yourTurn) status = "Tới lượt đối thủ.";
	else if (!vsBot) status = toMove === 1 ? "Tới lượt X." : "Tới lượt O.";
	const activeKind = decision?.kind;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid w-full max-w-6xl gap-5 px-3 py-4 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-3 flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.16em] text-paper/60 uppercase",
						children: "Bot Áp Lực"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl leading-none text-paper sm:text-5xl",
						children: "Cờ Caro"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "pb-1 text-sm text-paper/70",
						children: ["Nước ", game.moves.length]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-paper/80",
					"aria-live": "polite",
					children: status
				}),
				thinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "think-bar mb-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-3 h-0.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "caro-board",
					role: "group",
					"aria-label": "Bàn cờ caro 15 nhân 15",
					style: { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" },
					children: Array.from({ length: 225 }, (_, index) => {
						const value = game.board[index];
						const locked = Boolean(game.winner) || game.draw || vsBot && game.turn !== human;
						const row = rowOf(index) + 1;
						const col = colOf(index) + 1;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: clsx("caro-cell", win.has(index) && "is-win"),
							disabled: locked || value !== 0,
							onClick: () => onCell(index),
							"aria-label": value === 0 ? `Hàng ${row}, cột ${col}, trống` : `Hàng ${row}, cột ${col}, ${value === 1 ? "X" : "O"}`,
							children: [value !== 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
								side: value,
								className: clsx("caro-mark", value === 1 ? "text-mark-x" : "text-mark-o")
							}) : !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
								side: toMove,
								className: clsx("caro-ghost", toMove === 1 ? "text-mark-x" : "text-mark-o")
							}) : null, index === last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "caro-last" }) : null]
						}, index);
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex flex-col gap-3 lg:sticky lg:top-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-paper p-4 text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl leading-none",
							children: decision ? decision.title : "Cách bot nghĩ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: clsx("inline-flex size-9 items-center justify-center rounded-full", toMove === 1 ? "bg-mark-x text-paper" : "bg-mark-o text-paper"),
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
								side: game.winner || toMove,
								className: "size-5"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-ink/80",
						children: decision ? decision.note : "X đi trước. Bot đọc bàn như đọc ngân sách: ai gần năm quân hơn thì nước đó đáng hơn."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-paper p-4 text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								pressed: vsBot,
								onClick: () => {
									if (!vsBot) restart(human, true);
								},
								label: "Với bot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								pressed: !vsBot,
								onClick: () => {
									if (vsBot) restart(human, false);
								},
								label: "Hai người"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								pressed: vsBot && human === 1,
								disabled: !vsBot,
								onClick: () => {
									if (vsBot && human !== 1) restart(1, true);
								},
								label: "Bạn cầm X"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								pressed: human === 2 && vsBot,
								disabled: !vsBot,
								onClick: () => {
									if (vsBot && human !== 2) restart(2, true);
								},
								label: "Bạn cầm O"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => restart(),
							className: "col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-mark-x text-sm font-semibold text-paper",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Ván mới"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onUndo,
							disabled: game.moves.length === 0,
							className: "inline-flex h-11 items-center justify-center gap-1 rounded-xl bg-ink/10 text-sm font-medium text-ink disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Lại"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-paper/95 p-4 text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold tracking-wide text-ink/70 uppercase",
							children: "Tỷ số với bot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleSound,
							className: "inline-flex size-11 items-center justify-center rounded-xl bg-ink/10 text-ink",
							"aria-pressed": sound,
							"aria-label": sound ? "Tắt tiếng" : "Bật tiếng",
							children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-3 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								label: "Thắng",
								value: record.win
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								label: "Thua",
								value: record.loss
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
								label: "Hòa",
								value: record.draw
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "flex flex-col gap-2",
					children: PRINCIPLES.map((item) => {
						const on = activeKind ? item.kinds.includes(activeKind) : false;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: clsx("rounded-2xl border px-3 py-2", on ? "border-mark-x/80 bg-paper text-ink" : "border-paper/15 bg-transparent text-paper/80"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-snug",
								children: item.body
							})]
						}, item.title);
					})
				})
			]
		})]
	});
}
function Choice({ label, pressed, disabled, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": pressed,
		disabled,
		onClick,
		className: clsx("h-11 rounded-xl text-sm font-medium disabled:opacity-40", pressed ? "bg-ink text-paper" : "bg-ink/10 text-ink"),
		children: label
	});
}
function Score({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-ink/10 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-ink/60",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-display text-2xl leading-none",
			children: value
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaroGame, {});
}
//#endregion
export { Home as component };
