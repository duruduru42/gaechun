'use client';

import { useEffect, useMemo, useState } from 'react';
import Footer from '@/components/Footer';

const SIZE_OPTIONS = [20, 50, 100];

// 정렬 가능한 컬럼 (표 상단 토글)
const SORT_COLS = [
  { key: 'univ', label: '대학명', type: 'text' },
  { key: 'campus', label: '캠퍼스', type: 'text' },
  { key: 'type', label: '전형명', type: 'text' },
  { key: 'dept', label: '모집단위', type: 'text' },
  { key: 'method', label: '전형방법', type: 'text' },
  { key: 'quota', label: '모집', type: 'num' },
  { key: 'rate', label: '경쟁률', type: 'num' },
  { key: 'extra', label: '충원', type: 'num' },
  { key: 'g50', label: '50%', type: 'num' },
  { key: 'g70', label: '70%', type: 'num' },
];

export default function DataPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [univ, setUniv] = useState('전체');
  const [type, setType] = useState('전체');
  const [method, setMethod] = useState('전체');

  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    fetch('/data/susi-2026.json')
      .then((r) => r.json())
      .then(setRows)
      .catch((e) => console.error('데이터 로드 실패:', e))
      .finally(() => setLoading(false));
  }, []);

  const uniqueSorted = (key) =>
    Array.from(new Set(rows.map((r) => r[key]).filter(Boolean))).sort((a, b) =>
      String(a).localeCompare(String(b), 'ko')
    );

  const univs = useMemo(() => ['전체', ...uniqueSorted('univ')], [rows]);
  const types = useMemo(() => ['전체', ...uniqueSorted('type')], [rows]);
  const methods = useMemo(() => ['전체', ...uniqueSorted('method')], [rows]);

  // 검색 + 상세 필터
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (univ !== '전체' && r.univ !== univ) return false;
      if (type !== '전체' && r.type !== type) return false;
      if (method !== '전체' && r.method !== method) return false;
      if (!kw) return true;
      return (
        String(r.univ).toLowerCase().includes(kw) ||
        String(r.dept).toLowerCase().includes(kw) ||
        String(r.typeRaw).toLowerCase().includes(kw) ||
        String(r.type).toLowerCase().includes(kw)
      );
    });
  }, [rows, q, univ, type, method]);

  // 정렬
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = SORT_COLS.find((c) => c.key === sortKey);
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const aEmpty = av === '' || av === null || av === undefined;
      const bEmpty = bv === '' || bv === null || bv === undefined;
      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1;  // 빈 값은 항상 뒤로
      if (bEmpty) return -1;
      if (col?.type === 'num') return (Number(av) - Number(bv)) * dir;
      return String(av).localeCompare(String(bv), 'ko') * dir;
    });
  }, [filtered, sortKey, sortDir]);

  useEffect(() => setPage(1), [q, univ, type, method, pageSize, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const shown = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const reset = () => { setQ(''); setUniv('전체'); setType('전체'); setMethod('전체'); };
  const activeFilters = [univ, type, method].filter((v) => v !== '전체').length;
  const isFiltered = q || activeFilters > 0;

  const toggleSort = (key) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else { setSortKey(''); setSortDir('asc'); }  // 3번째 클릭 시 정렬 해제
    } else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <section className="bg-black text-white">
        <div className="max-w-screen-xl mx-auto px-4 py-14 md:py-20">
          <p className="text-orange-400 font-bold text-sm md:text-base mb-3">입시 자료</p>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-snug break-keep">
            2026 수시 입시결과 공개 자료
          </h1>
          <p className="mt-4 text-gray-400 text-sm md:text-base break-keep leading-relaxed">
            본 자료는 <b className="text-gray-200">대학어디가 공개 자료</b>를 정리한 것으로,
            <b className="text-gray-200"> 발표되지 않은 모집단위는 포함되어 있지 않습니다.</b>
          </p>
        </div>
      </section>

      {/* 검색 / 상세 검색 */}
      <section className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="대학명 · 모집단위 · 전형명 검색"
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className={`shrink-0 px-4 py-3 rounded-xl text-sm font-bold border transition whitespace-nowrap ${
                showAdvanced || activeFilters > 0
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
              }`}
            >
              상세 검색{activeFilters > 0 ? ` ${activeFilters}` : ''} {showAdvanced ? '▲' : '▼'}
            </button>
          </div>

          {/* 상세 검색 패널 */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <Select label="대학명" value={univ} onChange={setUniv} options={univs} />
              <Select label="전형명" value={type} onChange={setType} options={types} />
              <Select label="전형방법" value={method} onChange={setMethod} options={methods} />
            </div>
          )}

          {/* 결과 수 / 개수 설정 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs md:text-sm text-gray-500">
              총 <b className="text-orange-600">{sorted.length.toLocaleString()}</b>건
              {sorted.length > 0 && ` · ${safePage}/${totalPages} 페이지`}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {SIZE_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPageSize(n)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                      pageSize === n
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {n}개
                  </button>
                ))}
              </div>
              {isFiltered && (
                <button onClick={reset} className="text-xs md:text-sm font-semibold text-gray-500 hover:text-orange-600 underline">
                  초기화
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className="max-w-screen-xl mx-auto px-4 py-6 md:py-10">
        {loading ? (
          <p className="py-20 text-center text-gray-500 font-semibold">자료를 불러오는 중...</p>
        ) : sorted.length === 0 ? (
          <p className="py-20 text-center text-gray-500 font-semibold">검색 결과가 없습니다.</p>
        ) : (
          <>
            {/* 모바일 정렬 토글 */}
            <div className="md:hidden mb-3 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-gray-500 shrink-0">정렬</span>
              {SORT_COLS.filter((c) => ['univ', 'quota', 'rate', 'extra', 'g50', 'g70'].includes(c.key)).map((c) => (
                <button
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                    sortKey === c.key
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {c.label} {sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </button>
              ))}
            </div>

            {/* 데스크탑: 표 */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      {SORT_COLS.map((c) => (
                        <th key={c.key} className="px-3 py-3 text-left whitespace-nowrap">
                          <button
                            onClick={() => toggleSort(c.key)}
                            className={`flex items-center gap-1 font-bold transition ${
                              sortKey === c.key ? 'text-orange-600' : 'hover:text-gray-800'
                            }`}
                            title="클릭하여 정렬 (오름차순 → 내림차순 → 해제)"
                          >
                            {c.label}
                            <span className="text-[10px]">
                              {sortKey === c.key ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                            </span>
                          </button>
                        </th>
                      ))}
                      <th className="px-3 py-3 text-center font-bold">상세</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shown.map((r, i) => (
                      <RowDesktop key={i} r={r} open={openRow === i} onToggle={() => setOpenRow(openRow === i ? null : i)} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 모바일: 카드 */}
            <div className="md:hidden space-y-3">
              {shown.map((r, i) => (
                <CardMobile key={i} r={r} open={openRow === i} onToggle={() => setOpenRow(openRow === i ? null : i)} />
              ))}
            </div>

            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}

/* 번호 페이지네이션 */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const nums = [];
  const WINDOW = 2;
  const push = (n) => { if (!nums.includes(n)) nums.push(n); };
  push(1);
  for (let i = page - WINDOW; i <= page + WINDOW; i++) if (i > 1 && i < totalPages) push(i);
  push(totalPages);
  nums.sort((a, b) => a - b);

  const btn = 'min-w-[36px] h-9 px-2 rounded-lg text-sm font-bold border transition';

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5 flex-wrap" aria-label="페이지 이동">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btn} bg-white text-gray-600 border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400`}
      >
        ‹
      </button>
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - nums[i - 1] > 1 && <span className="text-gray-400 text-sm px-0.5">…</span>}
          <button
            onClick={() => onChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`${btn} ${
              n === page
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
            }`}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${btn} bg-white text-gray-600 border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400`}
      >
        ›
      </button>
    </nav>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-gray-500 mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          value !== '전체' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-300 text-gray-700 bg-white'
        }`}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === '전체' ? `${label} 전체` : o}</option>
        ))}
      </select>
    </label>
  );
}

const val = (v) => (v === '' || v === null || v === undefined ? '-' : v);

function RowDesktop({ r, open, onToggle }) {
  return (
    <>
      <tr className="hover:bg-orange-50/40 transition-colors">
        <td className="px-3 py-3 font-bold text-gray-900 whitespace-nowrap">{r.univ}</td>
        <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{val(r.campus)}</td>
        <td className="px-3 py-3 whitespace-nowrap">
          <span className="inline-block px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">{val(r.type)}</span>
        </td>
        <td className="px-3 py-3 text-gray-800 font-medium">{val(r.dept)}</td>
        <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{val(r.method)}</td>
        <td className="px-3 py-3 text-gray-800 tabular-nums">{val(r.quota)}</td>
        <td className="px-3 py-3 text-gray-800 tabular-nums font-semibold">{val(r.rate)}</td>
        <td className="px-3 py-3 text-gray-800 tabular-nums">{val(r.extra)}</td>
        <td className="px-3 py-3 tabular-nums font-bold text-blue-600">{val(r.g50)}</td>
        <td className="px-3 py-3 tabular-nums font-bold text-blue-600">{val(r.g70)}</td>
        <td className="px-3 py-3 text-center">
          <button onClick={onToggle} className="text-xs font-bold text-gray-400 hover:text-orange-600">
            {open ? '▲' : '▼'}
          </button>
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50">
          <td colSpan={11} className="px-5 py-5"><Detail r={r} /></td>
        </tr>
      )}
    </>
  );
}

function CardMobile({ r, open, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-extrabold text-gray-900 break-keep">
            {r.univ} <span className="text-gray-400 font-medium text-sm">{val(r.campus)}</span>
          </p>
          <p className="text-sm text-gray-700 font-medium break-keep mt-0.5">{val(r.dept)}</p>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold">{val(r.type)}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3 text-center">
        <Stat label="모집" value={val(r.quota)} />
        <Stat label="경쟁률" value={val(r.rate)} />
        <Stat label="50%" value={val(r.g50)} highlight />
        <Stat label="70%" value={val(r.g70)} highlight />
      </div>

      <button onClick={onToggle} className="mt-3 w-full text-xs font-bold text-gray-500 hover:text-orange-600 py-1.5 border-t border-gray-100">
        {open ? '접기 ▲' : '상세 보기 ▼'}
      </button>
      {open && <div className="mt-3 pt-3 border-t border-gray-100"><Detail r={r} /></div>}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="rounded-lg bg-gray-50 py-2">
      <p className="text-[10px] text-gray-500 font-semibold">{label}</p>
      <p className={`text-sm font-extrabold tabular-nums ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function Detail({ r }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <Field label="전형명(원문)" value={val(r.typeRaw)} />
      <Field label="전형방법" value={val(r.method)} />
      <Field label="충원인원" value={val(r.extra)} />
      <Field label="반영 방법" value={val(r.reflect)} />
      <Field label="비고" value={val(r.note)} />
    </dl>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col md:flex-row md:gap-4">
      <dt className="shrink-0 md:w-28 text-gray-500 font-bold text-xs md:text-sm">{label}</dt>
      <dd className="text-gray-800 break-keep leading-relaxed">{value}</dd>
    </div>
  );
}
