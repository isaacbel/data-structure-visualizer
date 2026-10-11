'use client'

import { useMemo } from 'react'
import type { CodeLanguage } from '@/types'

interface Token {
  type:
    | 'keyword' | 'type' | 'function' | 'string' | 'number' | 'comment'
    | 'operator' | 'class' | 'annotation' | 'generic' | 'plain' | 'builtin'
  text: string
}

/* ── Per-language keyword sets ─────────────────────────────────────────── */
const KEYWORDS: Record<CodeLanguage, string[]> = {
  python:     ['def','class','return','import','from','if','elif','else','while','for','in','not','and','or','is','None','True','False','pass','break','continue','try','except','finally','raise','with','as','yield','lambda','global','nonlocal','assert','del','self','super','async','await'],
  c:          ['int','char','float','double','long','short','unsigned','void','struct','typedef','enum','union','const','static','extern','auto','register','volatile','return','if','else','while','for','do','break','continue','switch','case','default','goto','sizeof','NULL'],
  cpp:        ['auto','bool','break','case','catch','char','class','const','constexpr','continue','default','delete','do','double','else','enum','explicit','extern','false','float','for','friend','goto','if','inline','int','long','mutable','namespace','new','nullptr','operator','private','protected','public','return','short','signed','sizeof','static','struct','switch','template','this','throw','true','try','typedef','typename','union','unsigned','using','virtual','void','volatile','while'],
  java:       ['abstract','assert','boolean','break','byte','case','catch','char','class','const','continue','default','do','double','else','enum','extends','final','finally','float','for','goto','if','implements','import','instanceof','int','interface','long','native','new','null','package','private','protected','public','return','short','static','strictfp','super','switch','synchronized','this','throw','throws','transient','true','false','try','void','volatile','while'],
  javascript: ['var','let','const','function','return','if','else','while','for','do','switch','case','break','continue','new','delete','typeof','instanceof','in','of','class','extends','super','this','import','export','default','async','await','try','catch','finally','throw','null','undefined','true','false','void','yield','from'],
  typescript: ['var','let','const','function','return','if','else','while','for','do','switch','case','break','continue','new','delete','typeof','instanceof','in','of','class','extends','super','this','import','export','default','async','await','try','catch','finally','throw','null','undefined','true','false','void','yield','type','interface','enum','namespace','declare','abstract','implements','readonly','private','public','protected','static','override','as','satisfies','infer','keyof','typeof'],
  csharp:     ['abstract','as','base','bool','break','byte','case','catch','char','checked','class','const','continue','decimal','default','delegate','do','double','else','enum','event','explicit','extern','false','finally','fixed','float','for','foreach','goto','if','implicit','in','int','interface','internal','is','lock','long','namespace','new','null','object','operator','out','override','params','private','protected','public','readonly','ref','return','sbyte','sealed','short','sizeof','stackalloc','static','string','struct','switch','this','throw','true','try','typeof','uint','ulong','unchecked','unsafe','ushort','using','virtual','void','volatile','while','var','async','await','yield','dynamic'],
  go:         ['break','case','chan','const','continue','default','defer','else','fallthrough','for','func','go','goto','if','import','interface','map','package','range','return','select','struct','switch','type','var','nil','true','false','make','new','len','cap','append','copy','close','delete','panic','recover','print','println'],
  rust:       ['as','break','const','continue','crate','dyn','else','enum','extern','false','fn','for','if','impl','in','let','loop','match','mod','move','mut','pub','ref','return','self','Self','static','struct','super','trait','true','type','unsafe','use','where','while','async','await','dyn','abstract','become','box','do','final','macro','override','priv','try','typeof','unsized','virtual','yield'],
  kotlin:     ['abstract','actual','annotation','as','break','by','catch','class','companion','const','constructor','continue','crossinline','data','delegate','do','dynamic','else','enum','expect','external','false','field','file','final','finally','for','fun','get','if','import','in','infix','init','inline','inner','interface','internal','is','it','lateinit','noinline','null','object','open','operator','out','override','package','param','private','property','protected','public','receiver','reified','return','sealed','set','setparam','super','suspend','tailrec','this','throw','true','try','typealias','typeof','val','var','vararg','when','where','while'],
  swift:      ['as','associatedtype','break','case','catch','class','continue','default','defer','deinit','do','else','enum','extension','fallthrough','false','fileprivate','final','for','func','get','guard','if','import','in','init','inout','internal','is','lazy','let','mutating','nil','nonmutating','open','operator','override','postfix','precedencegroup','prefix','private','protocol','public','repeat','required','rethrows','return','self','set','some','static','struct','subscript','super','switch','throw','throws','true','try','typealias','unowned','var','weak','where','while'],
  php:        ['abstract','and','array','as','break','callable','case','catch','class','clone','const','continue','declare','default','die','do','echo','else','elseif','empty','enddeclare','endfor','endforeach','endif','endswitch','endwhile','enum','eval','exit','extends','final','finally','fn','for','foreach','function','global','goto','if','implements','include','include_once','instanceof','insteadof','interface','isset','list','match','namespace','new','null','or','print','private','protected','public','readonly','require','require_once','return','static','switch','throw','trait','true','false','try','unset','use','var','while','xor','yield'],
}

const TYPES: Record<CodeLanguage, string[]> = {
  python:     ['int','str','float','bool','list','dict','set','tuple','bytes','type','object','None','Any','Optional','Union','List','Dict','Set','Tuple','Callable','Generator','Iterator'],
  c:          ['int','char','float','double','long','short','unsigned','void','size_t','uint8_t','uint16_t','uint32_t','uint64_t','int8_t','int16_t','int32_t','int64_t','bool','FILE'],
  cpp:        ['int','char','float','double','long','short','unsigned','void','bool','string','vector','map','set','unordered_map','unordered_set','list','deque','queue','stack','pair','tuple','optional','variant','any','size_t','ptrdiff_t'],
  java:       ['int','char','float','double','long','short','byte','boolean','void','String','Integer','Long','Double','Float','Boolean','Object','Class','List','Map','Set','Collection','Iterable','Comparable','Iterator','Optional','Stream'],
  javascript: ['undefined','null','NaN','Infinity','Promise','Array','Object','String','Number','Boolean','Map','Set','WeakMap','WeakSet','Symbol','BigInt','Function','RegExp','Date','Error','JSON'],
  typescript: ['string','number','boolean','void','never','any','unknown','object','symbol','bigint','null','undefined','Promise','Array','ReadonlyArray','Record','Partial','Required','Readonly','Pick','Omit','Exclude','Extract','NonNullable','ReturnType','InstanceType'],
  csharp:     ['int','string','bool','char','float','double','decimal','long','short','byte','void','object','dynamic','var','Task','List','Dictionary','HashSet','Queue','Stack','IEnumerable','IList','IDictionary','Action','Func','Predicate'],
  go:         ['int','int8','int16','int32','int64','uint','uint8','uint16','uint32','uint64','float32','float64','complex64','complex128','byte','rune','string','bool','error','uintptr'],
  rust:       ['i8','i16','i32','i64','i128','isize','u8','u16','u32','u64','u128','usize','f32','f64','bool','char','str','String','Vec','HashMap','HashSet','Option','Result','Box','Rc','Arc','Cell','RefCell'],
  kotlin:     ['Int','Long','Short','Byte','Float','Double','Boolean','Char','String','Any','Unit','Nothing','Array','List','MutableList','Map','MutableMap','Set','MutableSet'],
  swift:      ['Int','Double','Float','Bool','String','Character','Optional','Array','Dictionary','Set','Any','AnyObject','Void','Never'],
  php:        ['int','float','string','bool','array','object','null','void','mixed','callable','iterable','self','static','parent'],
}

const BUILTINS: Record<CodeLanguage, string[]> = {
  python:     ['print','len','range','enumerate','zip','map','filter','sorted','reversed','sum','min','max','abs','round','int','str','float','bool','list','dict','set','tuple','type','isinstance','issubclass','hasattr','getattr','setattr','open','input','super'],
  c:          ['printf','scanf','malloc','free','calloc','realloc','memcpy','memset','strcmp','strcpy','strlen','fprintf','fopen','fclose','fread','fwrite','exit','abort','assert'],
  cpp:        ['cout','cin','endl','printf','scanf','malloc','free','make_shared','make_unique','move','forward','swap','sort','find','begin','end','size','push_back','pop_back','insert','erase'],
  java:       ['System','Math','Arrays','Collections','Objects','String','Integer','Long','Double','StringBuilder','Scanner'],
  javascript: ['console','Math','JSON','Object','Array','String','Number','Boolean','Promise','setTimeout','setInterval','fetch','parseInt','parseFloat','isNaN','isFinite','encodeURI','decodeURI'],
  typescript: ['console','Math','JSON','Object','Array','String','Number','Boolean','Promise','setTimeout','parseInt','parseFloat'],
  csharp:     ['Console','Math','Array','List','Dictionary','Convert','Environment','GC','Activator','Enumerable'],
  go:         ['fmt','os','io','bufio','strings','strconv','sort','math','sync','runtime','errors','context','http','json'],
  rust:       ['println','print','eprintln','panic','todo','unimplemented','unreachable','assert','assert_eq','assert_ne','vec','format','write','writeln'],
  kotlin:     ['println','print','readLine','TODO','require','check','error','also','apply','let','run','with'],
  swift:      ['print','fatalError','precondition','assert','debugPrint'],
  php:        ['echo','print','var_dump','print_r','isset','empty','unset','array_push','array_pop','count','strlen','str_replace'],
}

/* ── Tokenizer ─────────────────────────────────────────────────────────── */
function tokenize(line: string, lang: CodeLanguage): Token[] {
  const tokens: Token[] = []
  let pos = 0
  const src = line
  const kws   = new Set(KEYWORDS[lang]  ?? [])
  const types = new Set(TYPES[lang]     ?? [])
  const builtins = new Set(BUILTINS[lang] ?? [])

  while (pos < src.length) {
    // Single-line comment
    if ((lang === 'python' || lang === 'php') && src[pos] === '#') {
      tokens.push({ type: 'comment', text: src.slice(pos) }); break
    }
    if (['c','cpp','java','javascript','typescript','csharp','go','rust','kotlin','swift'].includes(lang) && src.slice(pos, pos + 2) === '//') {
      tokens.push({ type: 'comment', text: src.slice(pos) }); break
    }
    // String (double quote)
    if (src[pos] === '"') {
      let end = pos + 1
      while (end < src.length && src[end] !== '"') { if (src[end] === '\\') end++; end++ }
      tokens.push({ type: 'string', text: src.slice(pos, end + 1) })
      pos = end + 1; continue
    }
    // String (single quote)
    if (src[pos] === "'") {
      let end = pos + 1
      while (end < src.length && src[end] !== "'") { if (src[end] === '\\') end++; end++ }
      tokens.push({ type: 'string', text: src.slice(pos, end + 1) })
      pos = end + 1; continue
    }
    // Backtick template literal (JS/TS)
    if (src[pos] === '`' && (lang === 'javascript' || lang === 'typescript')) {
      let end = pos + 1
      while (end < src.length && src[end] !== '`') { if (src[end] === '\\') end++; end++ }
      tokens.push({ type: 'string', text: src.slice(pos, end + 1) })
      pos = end + 1; continue
    }
    // Annotation / decorator
    if (src[pos] === '@') {
      let end = pos + 1
      while (end < src.length && /\w/.test(src[end])) end++
      tokens.push({ type: 'annotation', text: src.slice(pos, end) })
      pos = end; continue
    }
    // Number
    if (/[0-9]/.test(src[pos]) || (src[pos] === '-' && /[0-9]/.test(src[pos + 1] ?? ''))) {
      let end = pos + (src[pos] === '-' ? 1 : 0)
      while (end < src.length && /[0-9._xXbBoOeE]/.test(src[end])) end++
      tokens.push({ type: 'number', text: src.slice(pos, end) })
      pos = end; continue
    }
    // Word (keyword, type, identifier)
    if (/[a-zA-Z_$]/.test(src[pos])) {
      let end = pos + 1
      while (end < src.length && /[\w$]/.test(src[end])) end++
      const word = src.slice(pos, end)
      // Peek if next non-space is '(' → function call
      const rest = src.slice(end).trimStart()
      let tokType: Token['type'] = 'plain'
      if (kws.has(word))         tokType = 'keyword'
      else if (types.has(word))  tokType = 'type'
      else if (builtins.has(word)) tokType = 'builtin'
      else if (/^[A-Z]/.test(word)) tokType = 'class'
      else if (rest.startsWith('(')) tokType = 'function'
      tokens.push({ type: tokType, text: word })
      pos = end; continue
    }
    // Operator
    if (/[+\-*/%=<>!&|^~?:;,.()\[\]{}]/.test(src[pos])) {
      tokens.push({ type: 'operator', text: src[pos] })
      pos++; continue
    }
    // Whitespace
    let end = pos + 1
    while (end < src.length && /\s/.test(src[end])) end++
    tokens.push({ type: 'plain', text: src.slice(pos, end) })
    pos = end
  }
  return tokens
}

/* ── Token → CSS colour ─────────────────────────────────────────────────── */
const TOKEN_COLOUR: Record<Token['type'], string> = {
  keyword:    'text-[#c792ea]',   // purple  — keywords
  type:       'text-[#82aaff]',   // blue    — type names
  function:   'text-[#82aaff]',   // yellow-green — function calls
  builtin:    'text-[#80cbc4]',   // teal    — built-ins
  string:     'text-[#c3e88d]',   // green   — strings
  number:     'text-[#f78c6c]',   // orange  — numbers
  comment:    'text-[#546e7a] italic',  // grey    — comments
  operator:   'text-[#89ddff]',   // cyan    — operators
  class:      'text-[#ffcb6b]',   // yellow  — class names
  annotation: 'text-[#ff5370]',   // red     — decorators/@
  generic:    'text-[#82aaff]',   // blue    — generics
  plain:      'text-slate-100',   // default
}

/* ── Component ──────────────────────────────────────────────────────────── */
interface SyntaxHighlighterProps {
  code: string
  lang: CodeLanguage
  activeLineNumber?: number // 1-based
  fontSize?: number
  wrapLines?: boolean
}

export function SyntaxHighlighter({
  code, lang, activeLineNumber = 0, fontSize = 13, wrapLines = false,
}: SyntaxHighlighterProps) {
  const lines = useMemo(() => code.split('\n'), [code])

  return (
    <code className="block text-slate-100" style={{ fontSize }}>
      {lines.map((line, idx) => {
        const lineNum = idx + 1
        const isActive = lineNum === activeLineNumber
        const tokens = tokenize(line, lang)

        return (
          <span
            key={lineNum}
            id={`code-line-${lineNum}`}
            className={[
              'flex min-w-0 leading-6 transition-all duration-100',
              isActive
                ? 'bg-[#1a3a4a] border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(0,200,255,0.08)]'
                : 'border-l-2 border-transparent hover:bg-white/[0.025]',
              wrapLines ? 'flex-wrap' : '',
            ].join(' ')}
          >
            {/* Line number */}
            <span
              className={[
                'select-none shrink-0 w-10 pr-4 text-right text-xs leading-6 sticky left-0',
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-600',
              ].join(' ')}
              style={{ fontSize: fontSize - 1 }}
            >
              {lineNum}
            </span>

            {/* Source tokens */}
            <span className={['flex-1 min-w-0 px-2', wrapLines ? 'break-words whitespace-pre-wrap' : 'whitespace-pre'].join(' ')}>
              {tokens.map((t, i) => (
                <span key={i} className={TOKEN_COLOUR[t.type]}>
                  {t.text}
                </span>
              ))}
            </span>

            {/* Active execution badge */}
            {isActive && (
              <span className="shrink-0 self-center mr-2 rounded bg-cyan-500/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300 animate-pulse">
                ▶ exec
              </span>
            )}
          </span>
        )
      })}
    </code>
  )
}
