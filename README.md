# FITINN Chatbot - Navodila za namestitev

## 🚀 Hitra namestitev na Vercel (5 minut)

### Korak 1: Pripravi datoteke
Ustvari novo mapo `fitinn-chatbot` in vanjo dodaj vse datoteke iz te mape.

### Korak 2: Ustvari račun na Vercel
1. Odpri [vercel.com](https://vercel.com)
2. Registriraj se z GitHub računom (brezplačno)

### Korak 3: Pridobi Anthropic API ključ
1. Odpri [console.anthropic.com](https://console.anthropic.com)
2. Ustvari račun ali se prijavi
3. Pojdi na "API Keys" in ustvari nov ključ
4. Shrani ključ (začne se z `sk-ant-...`)

### Korak 4: Namesti na Vercel
1. V Vercel klikni "Add New" → "Project"
2. Izberi "Import Third-Party Git Repository" ali naloži mapo
3. V "Environment Variables" dodaj:
   - Name: `ANTHROPIC_API_KEY`
   - Value: tvoj API ključ (sk-ant-...)
4. Klikni "Deploy"

### Korak 5: Deli z stranko
Po nekaj minutah dobiš URL kot:
`https://fitinn-chatbot.vercel.app`

Ta URL lahko deliš s stranko! ✅

---

## 📁 Struktura projekta

```
fitinn-chatbot/
├── package.json
├── next.config.js
├── vercel.json
├── .env.local.example
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   └── api/
│       └── chat/
│           └── route.js
└── public/
    └── manifest.json
```

---

## 🔧 Lokalni razvoj

```bash
# Namesti odvisnosti
npm install

# Ustvari .env.local in dodaj API ključ
cp .env.local.example .env.local
# Uredi .env.local in dodaj svoj ANTHROPIC_API_KEY

# Zaženi razvojni strežnik
npm run dev

# Odpri http://localhost:3000
```

---

## 💰 Stroški

- **Vercel hosting:** BREZPLAČNO (hobby plan)
- **Anthropic API:** ~$0.003 na sporočilo (Claude Sonnet)
  - 1000 sporočil ≈ $3

---

## 🔒 Varnost

- API ključ je shranjen varno na strežniku (ni viden v brskalniku)
- Uporabniki ne morejo videti ali ukrasti ključa
- Lahko dodaš rate limiting za zaščito pred zlorabo

