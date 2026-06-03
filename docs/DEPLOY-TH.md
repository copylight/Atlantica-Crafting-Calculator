# วิธีเปิดเว็บออนไลน์ (บัญชี GitHub ฟรี)

## ทำไม GitHub Pages อาจใช้ไม่ได้

บัญชี **GitHub Free (ส่วนตัว)** ใช้ GitHub Pages ได้ **เฉพาะ repository แบบ Public (สาธารณะ)** เท่านั้น

ถ้า repo เป็น **Private** จะไม่มีเมนู Pages หรือ deploy ไม่สำเร็จ — นี่ไม่ใช่บั๊ก แต่เป็นข้อจำกัดของแพ็กเกจฟรี

---

## วิธีที่ 1: GitHub Pages (ฟรี — แนะนำถ้ายอมให้โค้ดเป็นสาธารณะ)

### ก. ตั้ง repo เป็น Public

1. เปิด https://github.com/copylight/Atlantica-Crafting-Calculator  
2. **Settings** → เลื่อนลง **Danger Zone**  
3. **Change repository visibility** → **Make public**  
4. พิมพ์ชื่อ repo เพื่อยืนยัน  

โค้ดจะมองเห็นได้จากใครก็ได้บนอินเทอร์เน็ต (ไม่มีรหัสผ่านในโปรเจกตนี้)

### ข. เปิด GitHub Pages

1. **Settings** → **Pages**  
2. **Build and deployment** → **Source** = **GitHub Actions** (ไม่เลือก Deploy from branch)  
3. บันทึก  

### ค. Push โค้ด workflow

```powershell
cd "E:\backup\github\Atlantica Crafting Calculator"
git add .
git commit -m "Setup GitHub Pages"
git push origin main
```

### ง. อนุมัติ deploy ครั้งแรก (ถ้ามี)

1. **Actions** → workflow **Deploy to GitHub Pages**  
2. ถ้าขึ้นให้ approve environment **github-pages** ให้กด **Review deployments** → **Approve**  
3. รอจนเขียว  

### จ. เปิดเว็บ

**https://copylight.github.io/Atlantica-Crafting-Calculator/**

(อาจรอ 2–5 นาทีหลัง deploy สำเร็จ)

---

## วิธีที่ 2: Vercel (ฟรี — ใช้กับ repo Private ได้)

1. สมัคร https://vercel.com (ล็อกอินด้วย GitHub)  
2. **Add New** → **Project** → เลือก repo `Atlantica-Crafting-Calculator`  
3. ค่า default ใช้ได้: Build = `npm run build`, Output = `dist`  
4. **Deploy**  

ได้ลิงก์แบบ `https://ชื่อโปรเจกต.vercel.app` ฟรี

---

## วิธีที่ 3: Netlify (ฟรี — ใช้กับ repo Private ได้)

1. สมัคร https://www.netlify.com (ล็อกอินด้วย GitHub)  
2. **Add new site** → **Import an existing project** → เลือก repo  
3. Build command: `npm run build`  
4. Publish directory: `dist`  
5. **Deploy**  

---

## เช็กเมื่อ Actions ล้มเหลว

| อาการ | แก้ |
|--------|-----|
| ไม่มีเมนู Pages | repo ยังเป็น Private → เปลี่ยนเป็น Public หรือใช้ Vercel/Netlify |
| Workflow แดงที่ `npm ci` | รัน `npm install` แล้ว commit `package-lock.json` |
| หน้าเว็บขาว / 404 | เปิด URL ให้มี `/Atlantica-Crafting-Calculator/` ตามท้าย |
| โหลดข้อมูลคราฟไม่ได้ | ต้องมีเน็ต (ดึงจาก craftcalculator.jana4u.net) — ปกติใช้ได้บน Pages |

---

## สรุป

| วิธี | ฟรี | Repo Private ได้ | ความยาก |
|-----|-----|------------------|---------|
| GitHub Pages | ใช่ | ไม่ได้ (ต้อง Public) | ปานกลาง |
| Vercel | ใช่ | ได้ | ง่าย |
| Netlify | ใช่ | ได้ | ง่าย |

ถ้าไม่อยากเปิดโค้ดสาธารณะ → ใช้ **Vercel** หรือ **Netlify** จะเร็วที่สุด
