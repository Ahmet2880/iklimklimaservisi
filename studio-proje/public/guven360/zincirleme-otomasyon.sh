#!/bin/bash

echo "🔍 Nuclei kontrol ediliyor..."
if ! command -v nuclei &> /dev/null; then
  echo "🔧 Nuclei eksik, kuruluyor..."
  go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest
else
  echo "✅ Nuclei zaten kurulu."
fi

echo "🛡️ ZAP kontrol ediliyor..."
if ! command -v zap.sh &> /dev/null; then
  echo "🔧 ZAP eksik, kuruluyor..."
  sudo apt update && sudo apt install zaproxy -y
else
  echo "✅ ZAP zaten kurulu."
fi

echo "🚀 Vercel CLI kontrol ediliyor..."
if ! command -v vercel &> /dev/null; then
  echo "🔧 Vercel CLI eksik, kuruluyor..."
  npm install -g vercel
else
  echo "✅ Vercel CLI zaten kurulu."
fi

echo "📤 json2csv kontrol ediliyor..."
if ! command -v json2csv &> /dev/null; then
  echo "🔧 json2csv eksik, root yetkisiyle kuruluyor..."
  sudo npm install -g json2csv
else
  echo "✅ json2csv zaten kurulu."
fi

echo "🔍 Nuclei taraması başlatılıyor..."
~/go/bin/nuclei -t ~/guven360/nuclei-templates/ -u https://hedef.com -jsonl -o ~/guven360/history.json

echo "🛡️ ZAP taraması başlatılıyor..."
$(which zap.sh) -cmd -quickurl https://hedef.com -quickout ~/guven360/zap-report.html -quickprogress

echo "📤 Eğitim verisi CSV'ye dönüştürülüyor..."
json2csv -i ~/guven360/education.json -o ~/guven360/education.csv

echo "🚀 Frontend yayınlanıyor..."
vercel deploy --cwd ~/guven360/frontend --prod

echo "✅ Zincirleme otomasyon tamamlandı. Sistem hazır."
