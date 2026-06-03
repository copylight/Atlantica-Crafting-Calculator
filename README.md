# Atlantica Online — Craft EXP Calculator

SPA คำนวณจำนวนครั้งที่ต้องคราฟไอเทมเพื่อเลเวลสกิลคราฟ สำหรับ Atlantica Online

## Tech stack

- React 19 + Vite 6
- Tailwind CSS 4

<<<<<<< HEAD
## เปิดเว็บออนไลน์ (บัญชี GitHub ฟรี)

**สำคัญ:** แพ็กเกจฟรีใช้ GitHub Pages ได้เฉพาะ repo **Public** — ถ้า repo เป็น **Private** ต้องเปลี่ยนเป็น Public หรือใช้ [Vercel](https://vercel.com) / [Netlify](https://www.netlify.com) แทน (ฟรี, รองรับ Private)

คู่มือละเอียดภาษาไทย: **[docs/DEPLOY-TH.md](docs/DEPLOY-TH.md)**

### GitHub Pages (repo ต้อง Public)

1. **Settings** → **Pages** → **Source** = **GitHub Actions**
2. push ขึ้น `main` → รอ Actions เขียว
3. เปิด **https://copylight.github.io/Atlantica-Crafting-Calculator/**

### Vercel / Netlify (repo Private ได้)

เชื่อม GitHub repo แล้ว deploy — มีไฟล์ `vercel.json` และ `netlify.toml` ในโปรเจกตแล้ว

## รันบนเครื่องตัวเอง
=======
## เริ่มใช้งาน
>>>>>>> parent of d716c46 (Add GitHub Pages deploy and SPA support)

```bash
cd Projects/atlantica-craft-calculator
npm install
npm run dev
```

## สูตรคำนวณ

1. `EXP ที่ขาด = EXP สะสมที่เลเวลเป้าหมาย − (EXP สะสมที่เลเวลปัจจุบัน + EXP ในเลเวลปัจจุบัน)`
2. `จำนวนครั้ง = ceil(EXP ที่ขาด / EXP ต่อครั้งของไอเทม)`

ตาราง EXP สะสม: [experience-table](https://craftcalculator.jana4u.net/experience-table) (เก็บใน `src/data/expTable.js`)

## ข้อมูลคราฟ

โหลดอัตโนมัติจากชุดข้อมูลบนเว็บไซต์ [craftcalculator.jana4u.net](https://craftcalculator.jana4u.net/) (ไฟล์รายการไอเทมและข้อมูลคราฟภายในเว็บไซต์) ครอบคลุมทุกสายสกิลและไอเทมคราฟได้ พร้อมวัตถุดิบ · แคชใน LocalStorage

สูตร EXP ต่อชิ้น (ตามต้นฉบับ): `floor(workload / 50) / batch_size`

## โครงสร้าง

- `src/data/expTable.js` — ตาราง EXP สกิล Lv.1–180
- `src/data/loadCraftCatalog.js` — โหลด/แปลง items.yml
- `src/data/parseItemsYaml.js` — ตัวแปลง YAML แบบเบา
- `src/utils/calculate.js` — Logic + validation
- `src/components/` — UI แยกส่วน
- `src/App.jsx` — State, LocalStorage, ประสานผลลัพธ์

### สร้าง JSON ออฟไลน์ (ถ้าต้องการ)

```bash
# ดาวน์โหลด items.yml ไว้ที่ scripts/cache/items.yml ก่อน
node scripts/generate-catalog.mjs
```
