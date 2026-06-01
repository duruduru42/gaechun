# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

# ---- 설정 ----
W = 1080
PAD = 56
BG = (13, 13, 13)
CARD = (20, 20, 20)
LINE = (42, 42, 42)
ORANGE = (249, 115, 22)
WHITE = (245, 245, 245)
GRAY = (156, 163, 175)
LABEL_BG = (26, 26, 26)

F = "C:/Windows/Fonts/malgun.ttf"
FB = "C:/Windows/Fonts/malgunbd.ttf"
def font(sz, bold=True):
    return ImageFont.truetype(FB if bold else F, sz)

f_title = font(48)
f_sub = font(22, False)
f_head = font(26)
f_label = font(24)
f_val = font(24, False)
f_price = font(34)
f_foot = font(20, False)

# ---- 데이터 ----
rows = [
    ("대상",  ["고3학생"], ["고3학생"], False),
    ("시기",  ["8월 ~ 9월"], ["6 ~ 7월"], False),
    ("목적",  ["6개 지원 대학 선정"], ["마지막 생기부 관리", "(+수시원서 포함)"], False),
    ("방식",  ["상담 1회, 후속관리"], ["생기부 관리는 카톡,", "상담 1회, 후속관리"], False),
    ("가격",  ["450,000원"], ["950,000원"], True),
]
col1_title = "수시원서 컨설팅"
col2_title = "파이널 점검 컨설팅"

# ---- 레이아웃 계산 ----
title_h = 150
head_h = 64
line_h = 34
row_pad = 26

def row_height(c1, c2):
    n = max(len(c1), len(c2))
    return n * line_h + row_pad * 2

inner_w = W - PAD * 2
label_w = 150
col_w = (inner_w - label_w) // 2

body_h = head_h + sum(row_height(r[1], r[2]) for r in rows)
H = title_h + body_h + 90  # footer

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

def text_center(x0, x1, y, txt, fnt, fill):
    bb = d.textbbox((0, 0), txt, font=fnt)
    tw = bb[2] - bb[0]
    d.text(((x0 + x1) / 2 - tw / 2, y), txt, font=fnt, fill=fill)

# ---- 타이틀 ----
d.text((PAD, 44), "수시 컨설팅 상세 정보", font=f_title, fill=WHITE)
# 오렌지 언더라인 악센트
d.rounded_rectangle([PAD, 110, PAD + 92, 118], radius=4, fill=ORANGE)
d.text((PAD + 110, 96), "개천용 입시 컨설팅", font=f_sub, fill=GRAY)

# ---- 표 영역 ----
tx = PAD
ty = title_h
x_label = tx
x_c1 = tx + label_w
x_c2 = tx + label_w + col_w
x_end = tx + label_w + col_w * 2

# 카드 배경
d.rounded_rectangle([tx, ty, x_end, ty + body_h], radius=20, fill=CARD)

# 헤더
d.rounded_rectangle([tx, ty, x_end, ty + head_h], radius=20, fill=ORANGE)
d.rectangle([tx, ty + head_h - 20, x_end, ty + head_h], fill=ORANGE)  # 아래 모서리 평평하게
text_center(x_c1, x_c2, ty + head_h/2 - 16, col1_title, f_head, (255, 255, 255))
text_center(x_c2, x_end, ty + head_h/2 - 16, col2_title, f_head, (255, 255, 255))

# 본문 행
cy = ty + head_h
for i, (label, c1, c2, is_price) in enumerate(rows):
    rh = row_height(c1, c2)
    # 라벨 셀 배경
    d.rectangle([x_label, cy, x_c1, cy + rh], fill=LABEL_BG)
    # 라벨 텍스트 (세로 중앙)
    lb_y = cy + rh/2 - 14
    d.text((x_label + 28, lb_y), label, font=f_label, fill=ORANGE if is_price else GRAY)

    # 값 텍스트
    vf = f_price if is_price else f_val
    v_fill1 = ORANGE if is_price else WHITE
    v_fill2 = ORANGE if is_price else WHITE
    lh = (line_h + 6) if is_price else line_h

    def draw_lines(lines, x0, x1, fill):
        total = len(lines) * lh
        y0 = cy + rh/2 - total/2
        for j, ln in enumerate(lines):
            text_center(x0, x1, y0 + j * lh, ln, vf, fill)

    draw_lines(c1, x_c1, x_c2, v_fill1)
    draw_lines(c2, x_c2, x_end, v_fill2)

    # 행 구분선
    if i < len(rows) - 1:
        d.line([x_label, cy + rh, x_end, cy + rh], fill=LINE, width=1)
    cy += rh

# 세로 구분선
d.line([x_c1, ty + head_h, x_c1, ty + body_h], fill=LINE, width=1)
d.line([x_c2, ty + head_h, x_c2, ty + body_h], fill=LINE, width=1)

# ---- 푸터 ----
foot = "신청 기간 6/1 ~ 8/31  ·  문의 010-5493-3794"
bb = d.textbbox((0, 0), foot, font=f_foot)
d.text((W/2 - (bb[2]-bb[0])/2, ty + body_h + 36), foot, font=f_foot, fill=GRAY)

out = "C:/Users/esfg5/Desktop/수시컨설팅_상세정보.jpg"
img.save(out, "JPEG", quality=95)
print("SAVED", out, img.size)
