# -*- coding: utf-8 -*-
"""통합결과.xlsx -> public/data/susi-2026.json 변환"""
import json, openpyxl, os

SRC = r"C:/Users/esfg5/Desktop/통합결과.xlsx"
OUT = r"C:/Users/esfg5/Desktop/real/my-app/public/data/susi-2026.json"

wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
ws = wb[wb.sheetnames[0]]

rows = list(ws.iter_rows(values_only=True))
header = [str(h).strip() if h is not None else "" for h in rows[0]]
print("HEADER:", header)

# 엑셀 헤더 -> 내부 키 매핑 (요청 컬럼 순서대로)
KEYMAP = {
    "대학명": "univ",
    "캠퍼스": "campus",
    # 전형명 = 표준 분류(기회균형/농어촌/특성화고 등) → 필터용
    "전형분류(표준)": "type",
    "전형명(원문)": "typeRaw",   # 원문 전형명(상세 표시용)
    "모집단위": "dept",
    "전형방법": "method",        # 학생부교과 / 학생부종합 등
    "반영 방법": "reflect",
    "반영방법": "reflect",
    "최종 모집인원": "quota",
    "최종모집인원": "quota",
    "경쟁률": "rate",
    "충원인원": "extra",
    "등급50": "g50",
    "등급 50%": "g50",
    "등급70": "g70",
    "등급 70%": "g70",
    "비고": "note",
}

idx = {}
for i, h in enumerate(header):
    key = KEYMAP.get(h)
    if key and key not in idx:
        idx[key] = i

print("MAPPED:", idx)

FIELDS = ["univ", "campus", "type", "typeRaw", "dept", "method", "reflect",
          "quota", "rate", "extra", "g50", "g70", "note"]

missing = [f for f in FIELDS if f not in idx]
if missing:
    print("!! 매핑 실패 컬럼:", missing)

def norm(v):
    if v is None:
        return ""
    if isinstance(v, float):
        # 정수형 float은 정수로
        return int(v) if v.is_integer() else round(v, 2)
    if isinstance(v, int):
        return v
    return str(v).strip()

data = []
for r in rows[1:]:
    if r is None:
        continue
    item = {}
    for f in FIELDS:
        item[f] = norm(r[idx[f]]) if f in idx and idx[f] < len(r) else ""
    # 대학명 없는 빈 행 제외
    if not item.get("univ"):
        continue
    data.append(item)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

print("ROWS:", len(data))
print("SIZE(KB):", round(os.path.getsize(OUT) / 1024, 1))
print("SAMPLE:", json.dumps(data[0], ensure_ascii=False)[:300])
univs = sorted({d["univ"] for d in data})
types = sorted({d["type"] for d in data})
print("UNIV COUNT:", len(univs))
print("TYPES:", len(types), types[:10])
